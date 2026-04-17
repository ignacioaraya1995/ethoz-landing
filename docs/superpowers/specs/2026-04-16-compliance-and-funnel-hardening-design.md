# Compliance + Lead Funnel Hardening — Design Spec

**Date:** 2026-04-16
**Owner:** Ignacio Araya
**Status:** Approved — ready for implementation planning
**Source audits:** 8-agent parallel audit run on 2026-04-16 (messaging, polish, resources, tracking, testing, resilience, speed, responsiveness)

---

## 1. Problem

The Ethoz landing site (ethoz.cl) is simultaneously:

1. **Leaking PII** — raw email addresses are pushed to `dataLayer`/GTM from contact and demo forms; Sentry session replay is not masked; GTM loads unconditionally before consent. Ley 21.719 enters full enforcement in December 2026 and these are clear violations under Art. 9 (lawful basis) and Art. 16 (PII minimization).
2. **Losing conversions** — reCAPTCHA failures leave users stuck with no fallback; Cal.com `calLoaded` state bug means the embed's timeout never fires; no UTM/attribution is captured on leads; no server-side conversion backup when GTM is consent-blocked; PDFs download ungated with no lead capture; contact form has no double-submit guard.

These two problems share the same files (forms, tracking, edge functions), so they are scoped into a single design and shipped as six vertical slices.

## 2. Decisions (locked)

| # | Decision | Choice |
|---|----------|--------|
| Q1 | Consent model | **Essential-only default; explicit opt-in for analytics**. Sentry error tracking loads under legitimate-interest basis (with PII scrubbing on); GTM + Clarity + Sentry Replay gated behind consent. |
| Q2 | Lead attribution | **Full columnar attribution** on `leads` table (not JSONB). New columns + index. |
| Q3 | Server-side conversion backup | **GA4 Measurement Protocol** from `cal-webhook` + `new-lead-notify` + `request-resource` edge functions. |
| Q4 | PDF gating | **Soft-gate** — modal asks for email with visible "No gracias, descargar igual" escape. |
| Q5 | CSP rollout | **Report-only first** via `firebase.json` headers → Sentry CSP endpoint → flip to enforcing in a later spec. |

## 3. Out of scope (for this spec)

These were identified in the audit but belong in their own specs:

- Theme C — home page messaging rewrite
- Theme D — design system drift (hardcoded colors, icon-in-box, raw HTML controls)
- Theme E — resources discoverability (nav, homepage links, glossary gaps, blog filters)
- Theme F — admin-side resilience (SIGNED_OUT re-gating, admin RLS tests)
- Theme G — hero LCP optimization
- Theme H — broader test coverage (ROI calc, OAuth state, mobile browser matrix)

Hoisted into this spec because they live on the hot path: **phone input `type="tel"`** (responsiveness P1 on `/contact` and `/demo/[rbd]`) and **Leaflet try/catch fallback** (resilience P2 on `/demo/[rbd]`). Nothing else.

## 4. Architecture boundaries

- **Consent store** (`src/lib/stores/consent.svelte.ts`) is the single source of truth for "can we load non-essential trackers?". Svelte 5 `$state` rune + localStorage persistence. Everything reads from it; only the banner and the settings sheet write to it.
- **Attribution module** (`src/lib/utils/attribution.ts`) is pure functions. Captures on first page load (layout onMount), persists first-touch to `localStorage`, last-touch to `sessionStorage`, merges on read. No network calls. Safe to run pre-consent because it is first-party only.
- **`trackEvent` facade** (`src/lib/utils/analytics.ts`) stays the only caller surface. Callers pass a flat payload; the facade enforces (a) consent check, (b) PII scrub via `scrubEvent()`, (c) attribution merge, (d) `dataLayer.push`. Events pre-consent are buffered in `sessionStorage` and flushed on accept.
- **Edge functions** are the only surface that talks to GA4 Measurement Protocol. No client-side GA4 calls. Server events use `client_id = visitor_id` where available, else a hashed IP.
- **CSP** is delivered via `firebase.json` headers. No meta-tag CSP (weaker, can't use `report-uri`). Reports go to a dedicated Sentry CSP project.

Every new file has one reason to change. Every modified file gets a smaller blast radius, not a larger one.

## 5. The six slices

Each slice = one PR, one reviewer, one rollback path. Merge order 1 → 6.

### Slice 1 — Consent layer + tracker gating

**Goal:** stop loading non-essential trackers before consent. Stop leaking raw text to Sentry Replay.

**Changes:**
- Create `src/lib/stores/consent.svelte.ts` exposing `{ essential, analytics, marketing }` backed by `localStorage['ethoz_consent_v1']`.
- Rewrite current cookie banner in `+layout.svelte`: three buttons — "Aceptar todo" / "Solo esenciales" / "Personalizar". Personalizar opens a shadcn `Sheet` with per-category toggles.
- Move the GTM loader snippet **out of `src/app.html`** into a `$effect` in `+layout.svelte` that runs only when `consent.analytics === true`.
- Same treatment for Microsoft Clarity init.
- `src/lib/sentry.ts`: always initialize (error tracking is legitimate interest), but force `replayIntegration({ maskAllText: true, blockAllMedia: true })` and set `replaysOnErrorSampleRate: 0` until `consent.analytics === true`. Scrub `request.data`, `breadcrumbs.form`, and `contexts.state` PII in `beforeSend`.
- Emit `consent_granted` / `consent_rejected` events on change (these are gated by their own result — no event if rejected).

**Data flow:** banner click → `consent.analytics = true` → localStorage write → effect re-runs → dynamic `import('gtm-loader')` → flush `sessionStorage['pending_events']` to `dataLayer`.

**Error handling:** if GTM script 404s, `captureError` to Sentry; banner stays "accepted" (user shouldn't be re-prompted for our infra problem).

### Slice 2 — Attribution capture + leads migration

**Goal:** every lead row knows where it came from.

**Changes:**
- Supabase migration `<ts>_leads_attribution.sql`: add nullable columns `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `li_fat_id`, `msclkid` (all `TEXT`), `referrer` and `landing_page` (`TEXT`), `visitor_id` (`TEXT`, indexed), `first_touch_at` and `last_touch_at` (`TIMESTAMPTZ`). Composite index on `(utm_source, utm_medium, created_at DESC)`.
- Create `src/lib/utils/attribution.ts` exporting `captureAttribution()` (run on first page load) and `readAttribution()` (called by `saveLead`). First-touch in `localStorage['ethoz_attribution_first']`; last-touch in `sessionStorage['ethoz_attribution_last']`. Merge rule: first-touch wins for `utm_*` and `referrer`; last-touch wins for `landing_page`.
- Call `captureAttribution()` from `+layout.svelte` onMount — safe pre-consent because it is purely first-party.
- Modify `saveLead()` in `src/lib/supabase.ts` to merge `readAttribution()` into the insert payload.

**Error handling:** if localStorage is disabled (Safari private mode), attribution becomes session-scoped only. Never block lead save on attribution read failure.

### Slice 3 — Contact form hardening

**Goal:** `/contact` submits cleanly, even under failure.

**Changes in `src/routes/contact/+page.svelte`:**
- Replace `trackEvent('contact_form_submitted', { email })` with `trackEvent('contact_form_submitted', { source: 'contact_page' })`. PII never reaches `dataLayer`.
- Add `if (submitting) return` as the first line of the submit handler. Double-submit guard in code, not just `disabled`.
- Wrap `executeRecaptcha()` in try/catch. On failure: set `recaptchaFailed = true`, render inline error + mailto fallback (`mailto:${CONTACT.email.address}?subject=Contacto desde ethoz.cl&body=...`), `captureError` to Sentry.
- Phone input gets `type="tel" inputmode="tel" autocomplete="tel"` (hoisted from responsiveness audit).
- `saveLead()` already receives attribution after Slice 2 — no extra wiring here.

### Slice 4 — Demo + schedule form hardening

**Goal:** `/demo/[rbd]` and `/schedule` hold up when Cal.com, Leaflet, or reCAPTCHA fail.

**Changes:**
- `src/routes/schedule/+page.svelte`: replace the broken `calLoaded = true` set immediately after `Cal('inline', ...)` with a `Cal('on', { action: 'linkReady', callback: () => calLoaded = true })` listener. The 10-second `calError` timeout fires against a distinct `embedRendered` flag and now actually triggers when Cal.com is blocked. On error, show support email + WhatsApp link.
- On Cal `bookingSuccessful`: `updateLeadStatus(...).catch(captureError)` instead of silent catch.
- `src/routes/demo/[rbd]/+page.svelte`: Leaflet dynamic import wrapped in `.catch(err => { mapFailed = true; captureError(err); })`. On failure, render the school address + Google Maps link as text fallback.
- Same PII scrub and double-submit guard as Slice 3 applied to the demo form.
- Phone input gets `type="tel"` here too.

### Slice 5 — Edge function hardening + PDF soft-gate

**Goal:** server-side backup of conversions; stop leaking internal errors; start capturing warm PDF leads.

**Changes:**
- `supabase/functions/cal-webhook/index.ts` + `new-lead-notify/index.ts`: after verifying the lead event, POST to GA4 Measurement Protocol (`https://www.google-analytics.com/mp/collect?measurement_id=${GA4_ID}&api_secret=${GA4_SECRET}`) with `client_id = visitor_id || hashedIp`, event `demo_booked` or `lead_submitted`. Secrets in Supabase env.
- `new-lead-notify` currently returns `error: String(err)` in its catch — replace with `console.error(err); return resp({ error: 'Notification failed' }, 500);`. Apply the same rule to any other catch-all in `supabase/functions/**`.
- Create `supabase/functions/request-resource/index.ts`: accepts `{ email, rbd?, resource_slug, recaptcha_token }`. Verifies reCAPTCHA, inserts a `leads` row with `source = 'resource_download'` and the `resource_slug`, returns `{ url, delivered_to: maskEmail(email) }`. Fires server-side GA4 `resource_downloaded` event.
- Create `src/lib/components/ResourceGate.svelte`: shadcn `Dialog` with email input + primary "Enviar y descargar" + visible text link "No gracias, descargar igual" that triggers direct download and fires `pdf_downloaded_anonymous` (consent-gated). PDFs remain indexable by Googlebot (direct download URL still accessible).
- Wire `ResourceGate` into `src/routes/resources/+page.svelte` and each per-resource page.

### Slice 6 — CSP report-only

**Goal:** observe CSP violations for 2 weeks, then enforce (in a later spec).

**Changes:**
- `firebase.json` — add `Content-Security-Policy-Report-Only` header on `**/*.html` matching:
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline' https://app.cal.com https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://www.clarity.ms https://*.sentry.io`
  - `connect-src 'self' https://*.supabase.co https://*.sentry.io https://www.clarity.ms https://www.google-analytics.com https://api.cal.com`
  - `img-src 'self' data: https:`
  - `style-src 'self' 'unsafe-inline'`
  - `font-src 'self' data:`
  - `frame-src https://app.cal.com https://www.google.com`
  - `report-uri https://o<orgId>.ingest.sentry.io/api/<projectId>/security/?sentry_key=<key>`
- Sentry already supports the CSP endpoint; create a dedicated Sentry project `ethoz-csp` so violations don't drown the error stream.

**Rollout:** ship in report-only mode. Review violations weekly for 2 weeks. A follow-up spec will flip to enforcing.

## 6. Cross-cutting concerns

### Error handling
- Every new `try/catch` calls `captureError()` from `src/lib/sentry.ts`. No silent catches.
- Edge functions return generic messages; internal error details only go to `console.error` (Supabase logs).
- Consent-related failures never re-prompt the user — we assume "accepted" sticks even if our infra misbehaves.

### Testing (for this spec; broader test coverage is Theme H)
- Unit: `attribution.test.ts` (URL parse, first-touch/last-touch merge, localStorage disabled), `consent.test.ts` (state transitions, persistence), `events.test.ts` (PII scrub fixtures).
- E2E: extend `tests/analytics.spec.ts` with consent accept/reject flows and assert no `dataLayer.push` before consent; extend `tests/e2e.spec.ts` with contact happy-path via mocked `verify-lead`; new `tests/resource-gate.spec.ts` for soft-gate accept + skip paths.
- Edge function: new Deno tests for `request-resource` (valid submit, low recaptcha score, missing slug). Existing `verify-lead` gains a test per the testing audit.

### Observability
- New events (all consent-gated): `consent_granted`, `consent_rejected`, `attribution_captured`, `recaptcha_failed`, `cal_embed_failed`, `pdf_downloaded`, `pdf_downloaded_anonymous`, `resource_gate_skipped`.
- Sentry breadcrumbs added on reCAPTCHA failure, Cal embed failure, Leaflet load failure.

### Rollout
- One PR per slice. Slices merge in order 1 → 6; each has its own rollback via `git revert`.
- After Slice 1 ships, monitor GTM load-rate for 48 h before Slice 2.
- After Slice 6 ships, 2-week CSP observation window begins; follow-up spec to enforce.

## 7. File inventory

**Created:**
- `src/lib/stores/consent.svelte.ts`
- `src/lib/utils/attribution.ts`
- `src/lib/utils/events.ts` (PII scrubber)
- `src/lib/components/ResourceGate.svelte`
- `supabase/functions/request-resource/index.ts`
- `supabase/migrations/<ts>_leads_attribution.sql`
- `tests/resource-gate.spec.ts`
- `src/lib/utils/attribution.test.ts`
- `src/lib/stores/consent.test.ts`
- `src/lib/utils/events.test.ts`

**Modified:**
- `src/app.html` (remove inline GTM loader)
- `src/routes/+layout.svelte` (consent banner, tracker gating, attribution capture)
- `src/lib/sentry.ts` (replay masking, PII scrub in beforeSend)
- `src/lib/utils/analytics.ts` (consent check, PII scrub, event buffer)
- `src/lib/utils/visitor.ts` (visitor_id persistence into leads)
- `src/lib/supabase.ts` (saveLead merges attribution)
- `src/routes/contact/+page.svelte` (PII scrub, recaptcha fallback, double-submit guard, type=tel)
- `src/routes/demo/[rbd]/+page.svelte` (same + Leaflet fallback)
- `src/routes/schedule/+page.svelte` (Cal embed state fix, error-path recovery)
- `src/routes/resources/+page.svelte` (ResourceGate integration) + per-resource pages
- `supabase/functions/cal-webhook/index.ts` (GA4 MP send, sanitized errors)
- `supabase/functions/new-lead-notify/index.ts` (GA4 MP send, sanitized errors)
- `supabase/functions/verify-lead/index.ts` (sanitized errors; tests from audit)
- `firebase.json` (CSP report-only header)
- `tests/analytics.spec.ts` (consent flows, new events)
- `tests/e2e.spec.ts` (contact happy-path with mocked verify-lead)

**~20 files. 6 PRs. 5-8 working days.**

## 8. Explicit non-goals

- **Does not** enforce CSP — only reports. Enforcement follows in a later spec after the observation window.
- **Does not** rewrite copy or messaging (Theme C).
- **Does not** touch admin-side resilience (Theme F) — the `SIGNED_OUT` re-gating bug stays.
- **Does not** add AVIF images, preload the hero LCP, or remove Sentry from the main bundle (Theme G).
- **Does not** migrate raw HTML controls to shadcn (Theme D).

## 9. Success criteria

- No raw email, phone, or free-text form content appears in `dataLayer`, Sentry Replay, or GTM preview mode.
- No non-essential tracker loads before `consent.analytics === true`.
- Every new lead in the `leads` table has `visitor_id` populated and, when any UTM is present on the URL, has `utm_source` populated.
- Contact form cannot be double-submitted; reCAPTCHA failure renders a visible mailto fallback.
- `/schedule` shows a support fallback within 10 s when Cal.com is blocked.
- `/demo/[rbd]` shows a text address fallback when Leaflet fails to load.
- Every one of the 6 gated PDFs routes through `ResourceGate`; "No gracias" path still delivers the file.
- `firebase.json` serves a `Content-Security-Policy-Report-Only` header; Sentry CSP project receives reports.
- All new edge function catch-alls return `'Request failed'` (or similar) — no `String(err)` in responses.
