# Slice 1 — Consent Layer + Tracker Gating — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "load GTM unconditionally + show banner after" pattern with a real consent-gated tracker system: Sentry loads always (legitimate interest) with PII scrubbed; GTM, Clarity, and Sentry Replay load only after `consent.analytics === true`; events fired pre-consent are buffered and flushed on accept.

**Architecture:** Single Svelte 5 `$state` consent store backed by `localStorage['ethoz_consent_v1']` is the only source of truth. A `trackEvent` facade reads the store, scrubs PII, and either pushes to `dataLayer` (if consent) or buffers in `sessionStorage` (if not). The layout mounts a banner + shadcn `Sheet` for per-category toggles; an `$effect` dynamically imports tracker modules when toggles flip on.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, Vitest (unit), Playwright (e2e), Tailwind v4, shadcn-svelte (`Sheet`, `Switch`, `Button`).

**Parent spec:** `docs/superpowers/specs/2026-04-16-compliance-and-funnel-hardening-design.md` (Slice 1 section).

---

## File Structure

**Created:**
- `src/lib/stores/consent.svelte.ts` — consent state + persistence
- `src/lib/stores/consent.test.ts` — unit tests
- `src/lib/utils/events.ts` — PII scrubber (shared by analytics + sentry)
- `src/lib/utils/events.test.ts` — unit tests
- `src/lib/trackers/gtm.ts` — dynamic GTM loader
- `src/lib/trackers/clarity.ts` — dynamic Clarity loader (extracted from layout)
- `src/lib/components/ConsentBanner.svelte` — 3-button banner + Personalizar trigger
- `src/lib/components/ConsentSheet.svelte` — per-category toggles

**Modified:**
- `src/app.html` — remove inline GTM loader, keep only the `dataLayer = []` stub
- `src/routes/+layout.svelte` — replace ad-hoc logic with store subscription + gated loaders
- `src/lib/sentry.ts` — always-init, PII scrub in `beforeSend`, replay masking, gated sample rate
- `src/lib/utils/analytics.ts` — consent-gated + scrubbed + buffered
- `tests/analytics.spec.ts` — extend with reject + accept flows

---

## Shared types (defined once, referenced throughout)

Put this in `src/lib/stores/consent.svelte.ts`:

```typescript
export type ConsentState = {
  essential: true; // always true, immutable
  analytics: boolean;
  marketing: boolean;
  updatedAt: number | null; // epoch ms, null until first decision
};
```

Put this in `src/lib/utils/events.ts`:

```typescript
export type EventPayload = Record<string, string | number | boolean | null | undefined>;
```

---

### Task 1: Consent store — tests first

**Files:**
- Create: `src/lib/stores/consent.test.ts`
- Create: `src/lib/stores/consent.svelte.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/stores/consent.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('consent store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('defaults to essential-only when no stored value', async () => {
    const { getConsent } = await import('./consent.svelte');
    const c = getConsent();
    expect(c.essential).toBe(true);
    expect(c.analytics).toBe(false);
    expect(c.marketing).toBe(false);
    expect(c.updatedAt).toBeNull();
  });

  it('persists a decision to localStorage', async () => {
    const { setConsent, getConsent } = await import('./consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const c = getConsent();
    expect(c.analytics).toBe(true);
    expect(c.marketing).toBe(false);
    expect(c.updatedAt).toBeGreaterThan(0);
    const raw = localStorage.getItem('ethoz_consent_v1');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.analytics).toBe(true);
  });

  it('rehydrates from localStorage on import', async () => {
    localStorage.setItem(
      'ethoz_consent_v1',
      JSON.stringify({ essential: true, analytics: true, marketing: false, updatedAt: 1700000000000 })
    );
    const { getConsent } = await import('./consent.svelte');
    const c = getConsent();
    expect(c.analytics).toBe(true);
    expect(c.updatedAt).toBe(1700000000000);
  });

  it('ignores a malformed localStorage entry and falls back to defaults', async () => {
    localStorage.setItem('ethoz_consent_v1', 'not-json');
    const { getConsent } = await import('./consent.svelte');
    const c = getConsent();
    expect(c.analytics).toBe(false);
    expect(c.updatedAt).toBeNull();
  });

  it('hasDecided() is false before first decision, true after', async () => {
    const { hasDecided, setConsent } = await import('./consent.svelte');
    expect(hasDecided()).toBe(false);
    setConsent({ analytics: false, marketing: false });
    expect(hasDecided()).toBe(true);
  });

  it('essential is always true and cannot be disabled', async () => {
    const { setConsent, getConsent } = await import('./consent.svelte');
    // @ts-expect-error — type enforces this, runtime check for defensive behavior
    setConsent({ essential: false, analytics: true, marketing: false });
    expect(getConsent().essential).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/stores/consent.test.ts`
Expected: FAIL — module `./consent.svelte` not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/stores/consent.svelte.ts`:

```typescript
import { browser } from '$app/environment';

const STORAGE_KEY = 'ethoz_consent_v1';

export type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: number | null;
};

const DEFAULT: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: null,
};

function load(): ConsentState {
  if (!browser) return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw);
    return {
      essential: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : null,
    };
  } catch {
    return { ...DEFAULT };
  }
}

const state = $state<ConsentState>(load());

export function getConsent(): ConsentState {
  return state;
}

export function hasDecided(): boolean {
  return state.updatedAt !== null;
}

export function setConsent(next: { analytics: boolean; marketing: boolean }): void {
  state.analytics = next.analytics === true;
  state.marketing = next.marketing === true;
  state.updatedAt = Date.now();
  if (browser) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          essential: true,
          analytics: state.analytics,
          marketing: state.marketing,
          updatedAt: state.updatedAt,
        })
      );
    } catch {
      // localStorage disabled (Safari private) — state stays in memory
    }
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/stores/consent.test.ts`
Expected: 6 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/stores/consent.svelte.ts src/lib/stores/consent.test.ts
git commit -m "feat(consent): add consent store with localStorage persistence"
```

---

### Task 2: PII scrubber — tests first

**Files:**
- Create: `src/lib/utils/events.test.ts`
- Create: `src/lib/utils/events.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/utils/events.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { scrubEvent } from './events';

describe('scrubEvent', () => {
  it('removes email-shaped values', () => {
    const out = scrubEvent({ email: 'a@b.com', source: 'home' });
    expect(out).not.toHaveProperty('email');
    expect(out.source).toBe('home');
  });

  it('removes phone-shaped values (chilean +56 9 ####)', () => {
    const out = scrubEvent({ phone: '+56912345678', name: 'Ana' });
    expect(out).not.toHaveProperty('phone');
    expect(out).not.toHaveProperty('name');
  });

  it('removes common PII keys by name even if the value is safe', () => {
    const out = scrubEvent({ email: 'n/a', first_name: 'Ana', rut: '12345678-9', source: 'x' });
    expect(out).not.toHaveProperty('email');
    expect(out).not.toHaveProperty('first_name');
    expect(out).not.toHaveProperty('rut');
    expect(out.source).toBe('x');
  });

  it('keeps primitives that look safe', () => {
    const out = scrubEvent({ source: 'contact_page', count: 3, ok: true });
    expect(out).toEqual({ source: 'contact_page', count: 3, ok: true });
  });

  it('drops values that embed an email substring', () => {
    const out = scrubEvent({ message: 'contact me at foo@bar.com please' });
    expect(out).not.toHaveProperty('message');
  });

  it('returns a new object, not the input', () => {
    const input = { source: 'home' };
    const out = scrubEvent(input);
    expect(out).not.toBe(input);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/utils/events.test.ts`
Expected: FAIL — module `./events` not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/utils/events.ts`:

```typescript
export type EventPayload = Record<string, string | number | boolean | null | undefined>;

const PII_KEYS = new Set([
  'email',
  'phone',
  'telefono',
  'name',
  'first_name',
  'last_name',
  'nombre',
  'apellido',
  'rut',
  'address',
  'direccion',
  'message',
  'mensaje',
  'notes',
]);

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(\+?56\s?9\s?\d{4}\s?\d{4})|(\+?\d[\d\s-]{7,})/;

function looksLikePii(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  if (EMAIL_RE.test(value)) return true;
  if (PHONE_RE.test(value)) return true;
  return false;
}

export function scrubEvent(payload: EventPayload): EventPayload {
  const out: EventPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (PII_KEYS.has(key.toLowerCase())) continue;
    if (looksLikePii(value)) continue;
    out[key] = value;
  }
  return out;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/utils/events.test.ts`
Expected: 6 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/events.ts src/lib/utils/events.test.ts
git commit -m "feat(events): add PII scrubber for outbound tracking events"
```

---

### Task 3: Consent-gated `trackEvent` with event buffer

**Files:**
- Modify: `src/lib/utils/analytics.ts`
- Create: `src/lib/utils/analytics.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/utils/analytics.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('trackEvent', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    (window as any).dataLayer = [];
    vi.resetModules();
  });

  it('does not push to dataLayer when consent.analytics is false', async () => {
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    expect((window as any).dataLayer).toHaveLength(0);
  });

  it('buffers events in sessionStorage when consent.analytics is false', async () => {
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    const buffered = JSON.parse(sessionStorage.getItem('ethoz_pending_events') ?? '[]');
    expect(buffered).toHaveLength(1);
    expect(buffered[0].event).toBe('demo_booked');
  });

  it('pushes to dataLayer when consent.analytics is true', async () => {
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    expect((window as any).dataLayer).toHaveLength(1);
    expect((window as any).dataLayer[0]).toMatchObject({ event: 'demo_booked', source: 'home' });
  });

  it('scrubs PII before sending', async () => {
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { trackEvent } = await import('./analytics');
    trackEvent('contact_submit', { email: 'a@b.com', source: 'x' });
    const pushed = (window as any).dataLayer[0];
    expect(pushed).not.toHaveProperty('email');
    expect(pushed.source).toBe('x');
  });

  it('flushes the buffer when flushPendingEvents() runs', async () => {
    const { trackEvent, flushPendingEvents } = await import('./analytics');
    trackEvent('a', { source: 'x' });
    trackEvent('b', { source: 'y' });
    expect((window as any).dataLayer).toHaveLength(0);
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    flushPendingEvents();
    expect((window as any).dataLayer).toHaveLength(2);
    expect(sessionStorage.getItem('ethoz_pending_events')).toBeNull();
  });

  it('internal users are still skipped', async () => {
    localStorage.setItem('ethoz_internal', '1');
    const { setConsent } = await import('$lib/stores/consent.svelte');
    setConsent({ analytics: true, marketing: false });
    const { trackEvent } = await import('./analytics');
    trackEvent('demo_booked', { source: 'home' });
    expect((window as any).dataLayer).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/utils/analytics.test.ts`
Expected: FAIL — `flushPendingEvents` not exported.

- [ ] **Step 3: Rewrite the implementation**

Replace `src/lib/utils/analytics.ts` entirely:

```typescript
import { isInternal } from './internal';
import { getConsent } from '$lib/stores/consent.svelte';
import { scrubEvent, type EventPayload } from './events';

const BUFFER_KEY = 'ethoz_pending_events';
const MAX_BUFFER = 50;

type QueuedEvent = { event: string; payload: EventPayload; at: number };

function readBuffer(): QueuedEvent[] {
  if (typeof sessionStorage === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(BUFFER_KEY);
    return raw ? (JSON.parse(raw) as QueuedEvent[]) : [];
  } catch {
    return [];
  }
}

function writeBuffer(queue: QueuedEvent[]): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(BUFFER_KEY, JSON.stringify(queue.slice(-MAX_BUFFER)));
  } catch {
    // storage quota or disabled — drop
  }
}

function pushToDataLayer(event: string, payload: EventPayload): void {
  if (typeof window === 'undefined') return;
  const dl = (window as any).dataLayer;
  if (!Array.isArray(dl)) return;
  dl.push({ event, ...payload });
}

export function trackEvent(event: string, payload: EventPayload = {}): void {
  if (typeof window === 'undefined') return;
  if (isInternal()) return;
  const scrubbed = scrubEvent(payload);
  if (!getConsent().analytics) {
    const queue = readBuffer();
    queue.push({ event, payload: scrubbed, at: Date.now() });
    writeBuffer(queue);
    return;
  }
  pushToDataLayer(event, scrubbed);
}

export function flushPendingEvents(): void {
  if (typeof window === 'undefined') return;
  if (!getConsent().analytics) return;
  if (isInternal()) return;
  const queue = readBuffer();
  for (const q of queue) pushToDataLayer(q.event, q.payload);
  try {
    sessionStorage.removeItem(BUFFER_KEY);
  } catch {
    // ignore
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/utils/analytics.test.ts`
Expected: 6 passing.

- [ ] **Step 5: Verify existing call sites still compile**

Run: `npm run check`
Expected: zero errors related to `trackEvent`. Existing callers (pass `email` etc.) are not broken — their PII is now dropped at runtime by the scrubber, which is the intent. Call sites are cleaned up in later slices (3 and 4).

- [ ] **Step 6: Commit**

```bash
git add src/lib/utils/analytics.ts src/lib/utils/analytics.test.ts
git commit -m "feat(analytics): gate trackEvent on consent + buffer pre-consent events"
```

---

### Task 4: Sentry — always-init + PII scrub + gated replay

**Files:**
- Modify: `src/lib/sentry.ts`

- [ ] **Step 1: Update the implementation**

Replace `src/lib/sentry.ts` entirely:

```typescript
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { getConsent } from '$lib/stores/consent.svelte';

let initialized = false;

function scrubFromSentry(event: any): any {
  // Strip request body + form breadcrumbs (may contain PII)
  if (event?.request?.data) delete event.request.data;
  if (Array.isArray(event?.breadcrumbs)) {
    event.breadcrumbs = event.breadcrumbs.map((b: any) => {
      if (b?.category === 'ui.input') {
        return { ...b, message: '[redacted]', data: undefined };
      }
      return b;
    });
  }
  return event;
}

export async function initSentry(): Promise<void> {
  if (!browser || initialized) return;

  const dsn = env.PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.info('[Sentry] No DSN configured — error monitoring disabled');
    return;
  }

  try {
    const Sentry = await import('@sentry/browser');
    const replayAllowed = getConsent().analytics === true;
    Sentry.init({
      dsn,
      environment: window.location.hostname === 'ethoz.cl' ? 'production' : 'development',
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: replayAllowed ? 0.5 : 0,
      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          maskAllInputs: true,
          blockAllMedia: true,
        }),
      ],
      beforeSend(event) {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('ethoz_internal') === '1') return null;
        const ua = (event.request?.headers?.['User-Agent'] as string | undefined) ?? '';
        const url = event.request?.url ?? '';
        if (ua.includes('HeadlessChrome') || ua.includes('Playwright')) return null;
        if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) return null;
        return scrubFromSentry(event);
      },
    });
    initialized = true;
    console.info('[Sentry] ✔ Error monitoring active (replay=' + (replayAllowed ? 'on' : 'off') + ')');
  } catch (err) {
    console.warn('[Sentry] Failed to initialize:', err);
  }
}
```

- [ ] **Step 2: Verify the project still type-checks**

Run: `npm run check`
Expected: zero errors in `src/lib/sentry.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/sentry.ts
git commit -m "feat(sentry): mask replay text/inputs, scrub PII in beforeSend, gate replay on consent"
```

---

### Task 5: Extract GTM + Clarity loaders

**Files:**
- Create: `src/lib/trackers/gtm.ts`
- Create: `src/lib/trackers/clarity.ts`
- Modify: `src/app.html`

- [ ] **Step 1: Create the GTM loader**

Create `src/lib/trackers/gtm.ts`:

```typescript
const GTM_ID = 'GTM-WX6ZCXLZ';

let loaded = false;

export function loadGtm(): void {
  if (typeof window === 'undefined' || loaded) return;
  if (document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${GTM_ID}"]`)) {
    loaded = true;
    return;
  }
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  s.onerror = () => console.warn('[GTM] failed to load');
  document.head.appendChild(s);
  loaded = true;
}
```

- [ ] **Step 2: Create the Clarity loader**

Create `src/lib/trackers/clarity.ts`:

```typescript
import { env } from '$env/dynamic/public';

let loaded = false;

export function loadClarity(): void {
  if (typeof window === 'undefined' || loaded) return;
  const id = env.PUBLIC_CLARITY_PROJECT_ID;
  if (!id) return;
  if ((window as any).clarity) {
    loaded = true;
    return;
  }
  (function (c: any, l: any, a: string, r: string, i: string) {
    c[a] = c[a] || function (...args: any[]) { (c[a].q = c[a].q || []).push(args); };
    const t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    t.onerror = () => console.warn('[Clarity] failed to load');
    const y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', id);
  loaded = true;
}
```

- [ ] **Step 3: Trim `src/app.html`**

Replace the GTM block (lines 5-27 of the current file — the `<script>` that inits `dataLayer`, the deferred loader, and the `<!-- End Google Tag Manager -->` comment) with ONLY the `dataLayer` stub:

```html
<!-- dataLayer stub (GTM loader runs after consent from +layout.svelte) -->
<script>
  window.dataLayer = window.dataLayer || [];
</script>
```

Remove the `<noscript>` iframe block (lines 47-50) as well — it loads GTM without consent.

- [ ] **Step 4: Type-check**

Run: `npm run check`
Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/trackers/gtm.ts src/lib/trackers/clarity.ts src/app.html
git commit -m "refactor(trackers): extract GTM/Clarity loaders, remove unconditional GTM from app.html"
```

---

### Task 6: Consent banner + personalizar sheet

**Files:**
- Create: `src/lib/components/ConsentBanner.svelte`
- Create: `src/lib/components/ConsentSheet.svelte`

Prerequisite: check that shadcn-svelte `Sheet`, `Switch`, and `Button` are installed. If `src/lib/components/ui/switch` does not exist, run `npx shadcn-svelte@latest add switch --overwrite` before writing the component.

- [ ] **Step 1: Check shadcn primitives**

Run: `ls src/lib/components/ui/sheet src/lib/components/ui/switch src/lib/components/ui/button 2>&1`
Expected: all three directories exist. If `switch` is missing, run `npx shadcn-svelte@latest add switch` and commit the generated files in a separate commit before continuing.

- [ ] **Step 2: Create the banner**

Create `src/lib/components/ConsentBanner.svelte`:

```svelte
<script lang="ts">
  import { slide } from 'svelte/transition';
  import { setConsent, hasDecided } from '$lib/stores/consent.svelte';
  import { Button } from '$lib/components/ui/button';
  import ConsentSheet from './ConsentSheet.svelte';

  let sheetOpen = $state(false);
  let dismissed = $state(hasDecided());

  function acceptAll() {
    setConsent({ analytics: true, marketing: true });
    dismissed = true;
  }

  function acceptEssential() {
    setConsent({ analytics: false, marketing: false });
    dismissed = true;
  }

  function openSheet() {
    sheetOpen = true;
  }
</script>

{#if !dismissed}
  <div
    role="region"
    aria-label="Preferencias de cookies"
    transition:slide={{ duration: 300 }}
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md"
  >
    <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p class="text-xs text-muted-foreground sm:flex-1">
        Usamos cookies para mejorar tu experiencia y medir el rendimiento del sitio. Puedes aceptar todo, mantener solo las esenciales o personalizar tus preferencias. Revisa nuestra
        <a href="/privacy" class="underline underline-offset-2 hover:text-foreground">política de privacidad</a>.
      </p>
      <div class="flex shrink-0 flex-wrap gap-2">
        <Button variant="ghost" size="sm" onclick={openSheet}>Personalizar</Button>
        <Button variant="outline" size="sm" onclick={acceptEssential}>Solo esenciales</Button>
        <Button size="sm" onclick={acceptAll}>Aceptar todo</Button>
      </div>
    </div>
  </div>
{/if}

<ConsentSheet bind:open={sheetOpen} onsaved={() => (dismissed = true)} />
```

- [ ] **Step 3: Create the sheet**

Create `src/lib/components/ConsentSheet.svelte`:

```svelte
<script lang="ts">
  import * as Sheet from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';
  import { Switch } from '$lib/components/ui/switch';
  import { getConsent, setConsent } from '$lib/stores/consent.svelte';

  let { open = $bindable(false), onsaved }: { open?: boolean; onsaved?: () => void } = $props();

  const current = getConsent();
  let analytics = $state(current.analytics);
  let marketing = $state(current.marketing);

  function save() {
    setConsent({ analytics, marketing });
    open = false;
    onsaved?.();
  }
</script>

<Sheet.Root bind:open>
  <Sheet.Content side="right" class="w-full sm:max-w-md">
    <Sheet.Header>
      <Sheet.Title>Preferencias de cookies</Sheet.Title>
      <Sheet.Description>
        Elige qué categorías de cookies aceptas. Las cookies esenciales son necesarias para el funcionamiento del sitio y no pueden desactivarse.
      </Sheet.Description>
    </Sheet.Header>

    <div class="mt-6 space-y-5">
      <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div>
          <p class="text-sm font-medium text-foreground">Esenciales</p>
          <p class="mt-1 text-xs text-muted-foreground">
            Necesarias para el funcionamiento del sitio, incluido el monitoreo básico de errores.
          </p>
        </div>
        <Switch checked={true} disabled aria-label="Cookies esenciales (siempre activas)" />
      </div>

      <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div>
          <p class="text-sm font-medium text-foreground">Análisis</p>
          <p class="mt-1 text-xs text-muted-foreground">
            Nos ayudan a entender cómo se usa el sitio. Incluye Google Analytics y Microsoft Clarity.
          </p>
        </div>
        <Switch bind:checked={analytics} aria-label="Cookies de análisis" />
      </div>

      <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div>
          <p class="text-sm font-medium text-foreground">Marketing</p>
          <p class="mt-1 text-xs text-muted-foreground">
            Permiten medir la efectividad de campañas y personalizar el contenido.
          </p>
        </div>
        <Switch bind:checked={marketing} aria-label="Cookies de marketing" />
      </div>
    </div>

    <Sheet.Footer class="mt-6">
      <Button onclick={save} class="w-full">Guardar preferencias</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

- [ ] **Step 4: Type-check**

Run: `npm run check`
Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/ConsentBanner.svelte src/lib/components/ConsentSheet.svelte
git commit -m "feat(consent): add banner + personalizar sheet with per-category toggles"
```

---

### Task 7: Rewire `+layout.svelte`

**Files:**
- Modify: `src/routes/+layout.svelte`

- [ ] **Step 1: Replace the layout script + consent markup**

Replace the entire file content with:

```svelte
<svelte:head>
  <meta property="og:site_name" content="Ethoz" />
  <meta property="og:locale" content="es_CL" />
  <meta name="application-name" content="Ethoz" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
</svelte:head>

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
  import ConsentBanner from '$lib/components/ConsentBanner.svelte';

  let { children } = $props();
  const feedbackEnabled = env.PUBLIC_FEEDBACK_MODE === 'true';

  $effect(() => {
    if (typeof window === 'undefined') return;
    checkInternalFlag();
    checkInternalIP();
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

<div class="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
  {@render children()}
  {#if feedbackEnabled}
    {#await import('$lib/components/FeedbackOverlay.svelte') then { default: FeedbackOverlay }}
      <FeedbackOverlay />
    {/await}
  {/if}
  <ConsentBanner />
</div>
```

- [ ] **Step 2: Type-check**

Run: `npm run check`
Expected: zero errors.

- [ ] **Step 3: Dev-server smoke**

Run (background): `npm run dev -- --port 5177`
Manually open `http://localhost:5177`:
1. Banner visible at bottom with three buttons.
2. Open DevTools → Network → filter `gtm.js`: **no request** before clicking any button.
3. Click "Solo esenciales" → banner disappears. Reload page. Banner stays gone (persisted). GTM still not loaded.
4. Open DevTools → Application → Local Storage → `ethoz_consent_v1` should show `analytics: false`.
5. Clear localStorage, reload. Click "Aceptar todo" → GTM request appears in Network. Clarity request appears.
6. Click "Personalizar" on a fresh session → sheet opens with toggles. Switch analytics on → save → GTM loads.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat(layout): replace ad-hoc cookie banner with consent-store-driven banner + gated loaders"
```

---

### Task 8: E2E — reject flow

**Files:**
- Modify: `tests/analytics.spec.ts`

- [ ] **Step 1: Read the existing test file to find the right insertion point**

Run: `cat tests/analytics.spec.ts`
Note the file's current structure (imports, describe blocks). Append new tests; don't rewrite.

- [ ] **Step 2: Add the reject-flow test**

Append to `tests/analytics.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Consent — reject flow', () => {
  test('no GTM/Clarity requests load when user picks "Solo esenciales"', async ({ page }) => {
    const gtmRequests: string[] = [];
    const clarityRequests: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('googletagmanager.com/gtm.js')) gtmRequests.push(url);
      if (url.includes('clarity.ms/tag')) clarityRequests.push(url);
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Solo esenciales' }).click();

    // Navigate a couple of routes to let any lazy loader fire.
    await page.goto('/comparativa');
    await page.goto('/ley-21719');
    await page.waitForTimeout(2000);

    expect(gtmRequests).toHaveLength(0);
    expect(clarityRequests).toHaveLength(0);
  });

  test('trackEvent calls do not touch dataLayer pre-consent', async ({ page }) => {
    await page.goto('/');
    const dlBefore = await page.evaluate(() => (window as any).dataLayer?.length ?? 0);
    // Fire a tracked CTA click (hero has one).
    const cta = page.getByRole('link', { name: /Agendar demo/i }).first();
    if (await cta.count()) {
      await cta.click({ trial: true }); // hover/focus without navigating
    }
    await page.waitForTimeout(500);
    const dlAfter = await page.evaluate(() => (window as any).dataLayer?.length ?? 0);
    expect(dlAfter).toBe(dlBefore);
  });
});
```

- [ ] **Step 3: Run test**

Run: `npx playwright test tests/analytics.spec.ts --grep 'Consent — reject flow'`
Expected: 2 passing.

- [ ] **Step 4: Commit**

```bash
git add tests/analytics.spec.ts
git commit -m "test(analytics): assert no GTM/Clarity loads when consent is rejected"
```

---

### Task 9: E2E — accept flow flushes buffer

**Files:**
- Modify: `tests/analytics.spec.ts`

- [ ] **Step 1: Append the accept-flow test**

Append to `tests/analytics.spec.ts`:

```typescript
test.describe('Consent — accept flow', () => {
  test('buffered events flush to dataLayer after consent is granted', async ({ page }) => {
    await page.goto('/');

    // Fire a synthetic event pre-consent — should be buffered, not pushed.
    await page.evaluate(async () => {
      const mod = await import('/src/lib/utils/analytics.ts');
      mod.trackEvent('test_event_buffered', { source: 'e2e' });
    });

    const bufferedRaw = await page.evaluate(() => sessionStorage.getItem('ethoz_pending_events'));
    expect(bufferedRaw).not.toBeNull();
    expect(JSON.parse(bufferedRaw!)).toHaveLength(1);

    const dlLenBefore = await page.evaluate(() => (window as any).dataLayer?.length ?? 0);

    // Accept all → GTM loads + buffer flushes.
    await page.getByRole('button', { name: 'Aceptar todo' }).click();
    await page.waitForTimeout(1500);

    const dlLenAfter = await page.evaluate(() => (window as any).dataLayer?.length ?? 0);
    expect(dlLenAfter).toBeGreaterThan(dlLenBefore);

    const flushed = await page.evaluate(() =>
      ((window as any).dataLayer ?? []).some((e: any) => e.event === 'test_event_buffered')
    );
    expect(flushed).toBe(true);

    const bufferedAfter = await page.evaluate(() => sessionStorage.getItem('ethoz_pending_events'));
    expect(bufferedAfter).toBeNull();
  });
});
```

- [ ] **Step 2: Run test**

Run: `npx playwright test tests/analytics.spec.ts --grep 'Consent — accept flow'`
Expected: 1 passing.

- [ ] **Step 3: Run the full e2e suite to catch regressions from earlier tasks**

Run: `npm run test:e2e`
Expected: all green. If any pre-existing test relied on GTM being available without consent, update it to click "Aceptar todo" at the start of the test — not the other way around.

- [ ] **Step 4: Commit**

```bash
git add tests/analytics.spec.ts
git commit -m "test(analytics): buffered events flush when consent is granted"
```

---

### Task 10: Full CI sweep

**Files:** (none — verification only)

- [ ] **Step 1: Run the full pipeline**

Run: `npm run test:ci`
Expected: lint, svelte-check, audit, unit, e2e all pass.

- [ ] **Step 2: Fix any leftover call sites**

If lint fails on `src/routes/contact/+page.svelte` or `src/routes/demo/[rbd]/+page.svelte` because they still call `trackEvent('...', { email })`, **do not fix them here** — that is Slice 3 / Slice 4 work. The scrubber drops the email at runtime, so it is safe to ship. Confirm lint is complaining about something else.

- [ ] **Step 3: Manual regression walkthrough (5 minutes)**

Run: `npm run build && npm run preview -- --port 5177`
In a fresh incognito window:
1. Land on `/`. Banner is present.
2. Network tab: no GTM/Clarity yet.
3. Click "Personalizar". Sheet opens with two toggles (both off).
4. Toggle analytics on → Guardar. Banner closes. GTM + Clarity requests appear in Network.
5. Reload. Banner stays closed. `localStorage.ethoz_consent_v1` has `analytics: true`.
6. Clear storage. Reload. Click "Solo esenciales". Banner closes. Reload — no banner. No GTM.

Stop preview server.

- [ ] **Step 4: Final commit (no-op or any cleanup)**

```bash
git status
# If clean, nothing to commit — slice is done.
```

---

## Success criteria (this slice)

- `localStorage['ethoz_consent_v1']` is the only source of truth for tracker gating.
- GTM + Clarity do not load before `consent.analytics === true`.
- Sentry loads always, but `replayIntegration` masks text and inputs, and `replaysOnErrorSampleRate` is 0 until consent is granted.
- `trackEvent()` calls pre-consent are buffered in `sessionStorage['ethoz_pending_events']` and flushed to `dataLayer` on accept.
- PII-shaped keys and values are stripped from event payloads before `dataLayer.push`.
- All existing e2e tests pass; two new e2e tests cover reject + accept flows.
- `npm run test:ci` is green.

## What this slice deliberately does NOT do

- Does not change copy on contact or demo forms (Slice 3 / 4).
- Does not add attribution columns to the `leads` table (Slice 2).
- Does not add GA4 Measurement Protocol backup (Slice 5).
- Does not add CSP headers (Slice 6).
- Does not remove the `email` parameter from existing `trackEvent` call sites — the scrubber handles it at runtime, and Slices 3 + 4 clean up the call sites. This avoids a merge conflict between slices.

---

## Self-review notes (done inline by author)

- **Spec coverage:** every Slice-1 requirement in the parent spec maps to a task. Consent store → T1. PII scrub → T2. Event buffer + gated dataLayer → T3. Sentry replay mask + gated rate → T4. GTM/Clarity loaders + app.html cleanup → T5. Banner + sheet → T6. Layout rewire → T7. E2E coverage → T8 + T9. Verification → T10.
- **Placeholder scan:** no TBD, no "implement later", every code block is complete.
- **Type consistency:** `ConsentState`, `EventPayload`, `getConsent`, `setConsent`, `hasDecided`, `trackEvent`, `flushPendingEvents`, `loadGtm`, `loadClarity` names are consistent across all tasks.
- **Dependency order:** T1 → T2 → T3 (analytics consumes consent + scrubber) → T4 (sentry consumes consent) → T5 (loaders are standalone) → T6 (banner consumes store) → T7 (layout consumes everything) → T8/T9/T10 (verification). No forward references.

