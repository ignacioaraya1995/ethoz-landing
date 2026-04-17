# Slice 2 — Attribution Capture + Leads Migration — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Every `leads` row captures the visitor's traffic source. First-touch UTMs persist in `localStorage`; last-touch + landing page persist in `sessionStorage`. Both merge into the Supabase insert payload. Tables gain indexed columns so SQL reports can slice by campaign.

**Architecture:** `src/lib/utils/attribution.ts` is pure — `captureAttribution()` reads `location.search` + `document.referrer` on first layout mount and writes both storage keys; `readAttribution()` is a pure read + merge. `saveLead()` calls `readAttribution()` inline and merges into the `leads` insert payload. No consent dependency — attribution is first-party, legitimate-interest.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, Vitest, Supabase (pg).

**Parent spec:** `docs/superpowers/specs/2026-04-16-compliance-and-funnel-hardening-design.md` (Slice 2 section).

---

## File Structure

**Created:**
- `supabase/migrations/003_leads_attribution.sql`
- `src/lib/utils/attribution.ts`
- `src/lib/utils/attribution.test.ts`

**Modified:**
- `src/routes/+layout.svelte` — call `captureAttribution()` in the existing effect
- `src/lib/supabase.ts` — merge `readAttribution()` into `saveLead()` payload (both verify-lead and direct-insert paths)
- `supabase/functions/verify-lead/index.ts` — pass through attribution fields from body to DB insert

---

## Shared types

`src/lib/utils/attribution.ts`:
```typescript
export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  li_fat_id?: string;
  msclkid?: string;
  referrer?: string;
  landing_page?: string;
  first_touch_at?: string;
  last_touch_at?: string;
};
```

---

### Task 1: Supabase migration

**Files:** Create `supabase/migrations/003_leads_attribution.sql`

- [ ] **Step 1: Write migration**

```sql
-- 003_leads_attribution.sql
-- Adds attribution columns + index to leads table.
-- Nullable to preserve existing rows.

alter table public.leads
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists gclid text,
  add column if not exists fbclid text,
  add column if not exists li_fat_id text,
  add column if not exists msclkid text,
  add column if not exists referrer text,
  add column if not exists landing_page text,
  add column if not exists first_touch_at timestamptz,
  add column if not exists last_touch_at timestamptz;

-- Composite index for "leads by campaign, newest first" reports
create index if not exists leads_utm_source_medium_created_at_idx
  on public.leads (utm_source, utm_medium, created_at desc);

-- Single-column index on visitor_id already exists elsewhere; no-op if present
create index if not exists leads_visitor_id_idx on public.leads (visitor_id);
```

- [ ] **Step 2: Commit (do not run yet — migration runs via supabase CLI by Ignacio)**

```bash
git add supabase/migrations/003_leads_attribution.sql
git commit -m "feat(db): add attribution columns + utm index to leads"
```

Migration is applied out-of-band by Ignacio via `supabase db push` or Studio — this plan just ships the SQL.

---

### Task 2: Attribution module — TDD

**Files:**
- Create: `src/lib/utils/attribution.test.ts`
- Create: `src/lib/utils/attribution.ts`

- [ ] **Step 1: Write failing tests**

`src/lib/utils/attribution.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

function mockLocation(url: string) {
  const u = new URL(url);
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: u.href, search: u.search, pathname: u.pathname, hostname: u.hostname, origin: u.origin },
  });
}

function mockReferrer(ref: string) {
  Object.defineProperty(document, 'referrer', { configurable: true, get: () => ref });
}

describe('attribution', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.resetModules();
  });

  it('captureAttribution parses UTMs from the URL and persists to both storages', async () => {
    mockLocation('https://ethoz.cl/?utm_source=linkedin&utm_medium=cpc&utm_campaign=q2');
    mockReferrer('');
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();
    const a = readAttribution();
    expect(a.utm_source).toBe('linkedin');
    expect(a.utm_medium).toBe('cpc');
    expect(a.utm_campaign).toBe('q2');
    expect(a.landing_page).toBe('/');
    expect(a.first_touch_at).toBeTruthy();
    expect(a.last_touch_at).toBeTruthy();
  });

  it('captures ad click ids (gclid, fbclid, li_fat_id, msclkid)', async () => {
    mockLocation('https://ethoz.cl/demo?gclid=abc&fbclid=def&li_fat_id=ghi&msclkid=jkl');
    mockReferrer('');
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();
    const a = readAttribution();
    expect(a.gclid).toBe('abc');
    expect(a.fbclid).toBe('def');
    expect(a.li_fat_id).toBe('ghi');
    expect(a.msclkid).toBe('jkl');
  });

  it('first-touch wins for utm_* across multiple captures; last-touch wins for landing_page', async () => {
    mockLocation('https://ethoz.cl/?utm_source=google');
    mockReferrer('https://google.com/');
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();

    // Simulate a later navigation to a different landing page with different UTMs
    mockLocation('https://ethoz.cl/contact?utm_source=linkedin');
    captureAttribution();

    const a = readAttribution();
    expect(a.utm_source).toBe('google'); // first-touch wins
    expect(a.referrer).toBe('https://google.com/'); // first-touch wins
    expect(a.landing_page).toBe('/contact'); // last-touch wins
  });

  it('returns empty object when URL has no UTMs and referrer is empty', async () => {
    mockLocation('https://ethoz.cl/blog');
    mockReferrer('');
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();
    const a = readAttribution();
    expect(a.utm_source).toBeUndefined();
    expect(a.landing_page).toBe('/blog'); // landing page still captured
    expect(a.first_touch_at).toBeTruthy(); // timestamp still set
  });

  it('captures referrer only when cross-origin', async () => {
    mockLocation('https://ethoz.cl/');
    mockReferrer('https://ethoz.cl/blog/foo'); // same origin → should NOT be captured
    const { captureAttribution, readAttribution } = await import('./attribution');
    captureAttribution();
    expect(readAttribution().referrer).toBeUndefined();
  });

  it('never throws if localStorage is disabled', async () => {
    mockLocation('https://ethoz.cl/?utm_source=linkedin');
    mockReferrer('');
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('quota');
    };
    try {
      const { captureAttribution, readAttribution } = await import('./attribution');
      expect(() => captureAttribution()).not.toThrow();
      expect(() => readAttribution()).not.toThrow();
    } finally {
      Storage.prototype.setItem = orig;
    }
  });
});
```

- [ ] **Step 2: Run test to verify failure**

`npx vitest run src/lib/utils/attribution.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/utils/attribution.ts`**

```typescript
import { browser } from '$app/environment';

const FIRST_KEY = 'ethoz_attribution_first';
const LAST_KEY = 'ethoz_attribution_last';

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  li_fat_id?: string;
  msclkid?: string;
  referrer?: string;
  landing_page?: string;
  first_touch_at?: string;
  last_touch_at?: string;
};

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
  'li_fat_id',
  'msclkid',
] as const;

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage, key: string, value: unknown): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // quota, disabled storage — in-memory only
  }
}

function parseUrl(): Partial<Attribution> {
  const params = new URLSearchParams(window.location.search);
  const out: Partial<Attribution> = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) (out as Record<string, string>)[k] = v;
  }
  out.landing_page = window.location.pathname || '/';
  return out;
}

function parseReferrer(): string | undefined {
  const ref = document.referrer;
  if (!ref) return undefined;
  try {
    const refHost = new URL(ref).hostname;
    if (refHost === window.location.hostname) return undefined;
    return ref;
  } catch {
    return undefined;
  }
}

/** Write first-touch (if missing) + always-fresh last-touch. Safe to call repeatedly. */
export function captureAttribution(): void {
  if (!browser) return;
  const now = new Date().toISOString();
  const fromUrl = parseUrl();
  const ref = parseReferrer();
  const last: Attribution = { ...fromUrl, last_touch_at: now };
  if (ref) last.referrer = ref;
  writeJson(sessionStorage, LAST_KEY, last);

  const existingFirst = readJson<Attribution>(localStorage, FIRST_KEY);
  if (!existingFirst) {
    const first: Attribution = { ...fromUrl, first_touch_at: now };
    if (ref) first.referrer = ref;
    writeJson(localStorage, FIRST_KEY, first);
  }
}

/** Merge: first-touch wins for utm_*/referrer/first_touch_at; last-touch wins for landing_page/last_touch_at. */
export function readAttribution(): Attribution {
  if (!browser) return {};
  const first = readJson<Attribution>(localStorage, FIRST_KEY) ?? {};
  const last = readJson<Attribution>(sessionStorage, LAST_KEY) ?? {};
  const out: Attribution = {};
  for (const k of UTM_KEYS) {
    const v = (first as Record<string, string>)[k] ?? (last as Record<string, string>)[k];
    if (v) (out as Record<string, string>)[k] = v;
  }
  if (first.referrer) out.referrer = first.referrer;
  else if (last.referrer) out.referrer = last.referrer;
  out.landing_page = last.landing_page ?? first.landing_page;
  out.first_touch_at = first.first_touch_at;
  out.last_touch_at = last.last_touch_at;
  // Strip undefined keys
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined)) as Attribution;
}
```

- [ ] **Step 4: Run tests**

`npx vitest run src/lib/utils/attribution.test.ts`
Expected: 6 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/attribution.ts src/lib/utils/attribution.test.ts
git commit -m "feat(attribution): capture + merge first-touch and last-touch traffic sources"
```

---

### Task 3: Wire into layout

**Files:** Modify `src/routes/+layout.svelte`

- [ ] **Step 1: Add captureAttribution call to the existing first effect**

Locate the `$effect(() => { ... checkInternalFlag(); checkInternalIP(); initSentry(); })` block in `src/routes/+layout.svelte` (post-Slice-1 layout). Add a `captureAttribution()` call inside the same effect:

```svelte
<script lang="ts">
  import '../app.css';
  import { env } from '$env/dynamic/public';
  import { checkInternalFlag, checkInternalIP, isInternal } from '$lib/utils/internal';
  import { identifyVisitor } from '$lib/utils/visitor';
  import { getConsent } from '$lib/stores/consent.svelte';
  import { flushPendingEvents } from '$lib/utils/analytics';
  import { loadGtm } from '$lib/trackers/gtm';
  import { loadClarity } from '$lib/trackers/clarity';
  import { initSentry } from '$lib/sentry';
  import { captureAttribution } from '$lib/utils/attribution';
  import ConsentBanner from '$lib/components/ConsentBanner.svelte';

  let { children } = $props();
  const feedbackEnabled = env.PUBLIC_FEEDBACK_MODE === 'true';

  $effect(() => {
    if (typeof window === 'undefined') return;
    checkInternalFlag();
    checkInternalIP();
    captureAttribution();
    initSentry();
  });

  $effect(() => {
    const c = getConsent();
    if (typeof window === 'undefined') return;
    if (isInternal()) return;
    if (c.analytics) {
      loadGtm();
      loadClarity();
      flushPendingEvents();
      setTimeout(() => identifyVisitor(), 1000);
    }
  });
</script>
```

- [ ] **Step 2: Type-check**

`npm run check`
Expected: zero new errors in layout.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat(layout): capture attribution on first mount"
```

---

### Task 4: Merge attribution into `saveLead`

**Files:** Modify `src/lib/supabase.ts`

- [ ] **Step 1: Import `readAttribution`**

At the top of `src/lib/supabase.ts`, add next to the other `$lib/utils/...` imports:

```typescript
import { readAttribution } from '$lib/utils/attribution';
```

- [ ] **Step 2: Merge into the `payload` object inside `saveLead`**

Replace the existing `payload` construction:

```typescript
const payload = {
  ...lead,
  status: lead.status ?? 'new',
  notes,
  visitor_id,
  metadata,
  recaptcha_token: recaptchaToken || undefined,
};
```

with:

```typescript
const attribution = readAttribution();
const payload = {
  ...lead,
  ...attribution,
  status: lead.status ?? 'new',
  notes,
  visitor_id,
  metadata,
  recaptcha_token: recaptchaToken || undefined,
};
```

Order matters: `...lead` first (anything the form already set wins nothing here — attribution keys don't overlap with Lead fields), then `...attribution`, then the explicit overrides. Lead-shaped fields (status, notes, etc.) stay authoritative via the explicit overrides. Never overwrite an attribution key that the form explicitly set.

- [ ] **Step 3: Type-check**

`npm run check`
Expected: zero new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase.ts
git commit -m "feat(leads): merge attribution into saveLead payload"
```

---

### Task 5: Pass-through in verify-lead edge function

**Files:** Modify `supabase/functions/verify-lead/index.ts`

- [ ] **Step 1: Inspect**

Read `supabase/functions/verify-lead/index.ts`. Identify the spot where the lead is inserted into Supabase. The attribution fields should pass through untouched — if the function explicitly whitelists fields, add the new columns. If it uses `...body`-style spread into the insert, it will already pass them; confirm.

- [ ] **Step 2: Patch if needed**

If there is a whitelist or explicit field list, extend it to include:
`utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid, li_fat_id, msclkid, referrer, landing_page, first_touch_at, last_touch_at`.

Do not log or echo attribution values (no PII risk, but keeps surface small).

- [ ] **Step 3: Commit**

```bash
git add supabase/functions/verify-lead/index.ts
git commit -m "feat(verify-lead): pass attribution fields through to leads insert"
```

(If no changes were needed, skip this task and note it in the final CI sweep.)

---

### Task 6: Full CI sweep

**Files:** none — verification only.

- [ ] **Step 1: Unit tests**

`npm run test:unit`
Expected: all green, including new `attribution.test.ts`.

- [ ] **Step 2: Build**

`npm run build`
Expected: clean.

- [ ] **Step 3: E2E smoke**

`npx playwright test --grep-invert 'DB Integration' --grep "consent|Tracking|Analytics"`
Expected: green. No new failures caused by attribution capture.

- [ ] **Step 4: Manual verification (optional but recommended)**

Open preview with a UTM: `?utm_source=test&utm_medium=e2e&utm_campaign=slice2` on `/contact`. Submit a form (with real reCAPTCHA or dev fallback). In Supabase Studio, confirm the new row has the utm_* columns populated.

---

## Success criteria

- `attribution.ts` module is pure, covered by 6 tests.
- `localStorage['ethoz_attribution_first']` is written once per visitor; overwriting it requires clearing storage.
- `sessionStorage['ethoz_attribution_last']` updates on every `captureAttribution` call.
- `saveLead()` merges attribution into both edge-function and direct-insert paths.
- New migration `003_leads_attribution.sql` is committed (and staged for Ignacio to apply).
- Build + unit tests green; no e2e regressions.

## Explicit non-goals

- Does not ship GA4 Measurement Protocol from edge functions (Slice 5).
- Does not add attribution to the ROI calculator or non-lead forms.
- Does not build a dashboard to read attribution — reports happen downstream in Supabase/Metabase.
- Does not touch the `suggestions` or `feedback` tables.

---

## Self-review notes

- Spec coverage: migration (T1), attribution module (T2), layout wiring (T3), saveLead merge (T4), edge function pass-through (T5), verification (T6). All Slice-2 spec requirements mapped.
- Placeholder scan: no TBD, all code blocks complete.
- Type consistency: `Attribution` type and `captureAttribution`/`readAttribution` names consistent throughout. `UTM_KEYS` single source of truth.
- Dependency order: T1 standalone → T2 standalone → T3 depends on T2 → T4 depends on T2 → T5 depends on T1 → T6 verifies all.
