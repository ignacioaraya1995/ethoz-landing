# Ethoz Landing

Marketing site and lead funnel for [Ethoz](https://ethoz.cl) -- student data protection and school management platform for Chilean schools.

## Tech Stack

- **Framework:** SvelteKit 2 + Svelte 5 (runes)
- **Styling:** Tailwind CSS 4 + tailwind-variants
- **Components:** bits-ui, Lucide icons
- **Hosting:** Firebase Hosting (static via `@sveltejs/adapter-static`)
- **Database:** Supabase (leads table)
- **Analytics:** Google Tag Manager, Microsoft Clarity
- **Error Monitoring:** Sentry (client-side)
- **Scheduling:** Cal.com integration
- **Maps:** Leaflet (school location on demo page)
- **i18n:** Custom ES/EN translations

## Getting Started

```bash
npm install
npm run dev -- --port 5177
```

Requires `.env.local` with:

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
PUBLIC_CAL_API_KEY=
PUBLIC_CLARITY_PROJECT_ID=
PUBLIC_RECAPTCHA_SITE_KEY=
PUBLIC_APP_URL=
PUBLIC_SENTRY_DSN=
```

## Pages

| Route | Purpose |
|---|---|
| `/` | Homepage -- hero, features, FAQ, social proof |
| `/demo` | School search (12k+ schools) |
| `/demo/[rbd]` | Contact form for selected school |
| `/schedule` | Cal.com booking after form submit |
| `/about` | Company story |
| `/contact` | General contact form |
| `/get-started` | Pricing plans |
| `/compliance` | Ley 21.719 compliance details |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post detail |
| `/pitch` | Audio-synced slide presentation |
| `/features/*` | Feature detail pages (5) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Lead Funnel

1. User searches school on `/demo`
2. Selects school -> `/demo/[rbd]` with school card + contact form
3. Submits form -> lead saved to Supabase, redirects to `/schedule`
4. Books demo via Cal.com -> lead status updated to `demo_scheduled`
5. Cal.com webhook updates Supabase + sends notification email

## Testing

```bash
# Unit tests (vitest -- 43 tests)
npm run test:unit

# Unit tests in watch mode
npm run test:unit:watch

# E2E tests (Playwright -- 152 tests)
npx playwright test

# E2E with UI
npx playwright test --ui
```

### Test Coverage

- **Unit:** Supabase functions (saveLead, updateLeadStatus), device detection, visitor tracking, internal traffic detection
- **E2E:** All pages load, navigation (desktop + mobile), demo funnel (search -> select -> form), tracking/GTM, SEO meta tags, cookie consent, responsive layout, pitch player, zero-error assertions on critical pages
- **DB Integration:** Verifies form submission persists to Supabase and cleans up

## Observability

### Console Logs (local dev)

- `[Supabase] ✔ Client initialized` -- DB connected
- `[Leads] ✔ Lead saved: {...}` -- successful save
- `[Leads] ✘ Failed to save: ...` -- save error with context
- `[Sentry] ✔ Error monitoring active` -- Sentry connected

### Sentry (production)

Captures unhandled errors and Supabase failures. Internal users (`?_internal=1`) are excluded. Dashboard at [sentry.io](https://sentry.io).

## Deploy

### Manual (local)

```bash
npm run build && firebase deploy
```

### CI/CD (GitHub Actions)

Triggered manually via `workflow_dispatch` on the `main` branch:

```bash
gh workflow run deploy.yml
```

Secrets are stored in **GitHub Secrets** (Settings -> Secrets and variables -> Actions). The workflow builds with all `PUBLIC_*` env vars injected at build time, then deploys to Firebase Hosting.

## Project Structure

```
src/
  lib/
    components/    # Reusable UI (NavBar, Footer, Button, etc.)
    data/          # Blog posts, school data types
    i18n/          # ES/EN translations
    stores/        # School search store (Svelte 5 runes)
    utils/         # Analytics, device, visitor, internal, recaptcha
    supabase.ts    # DB client + saveLead/updateLeadStatus
    sentry.ts      # Error monitoring init
  routes/          # SvelteKit pages
  hooks.client.ts  # Client error handler (Sentry)
static/            # Favicon, school data JSON
tests/             # Playwright E2E + DB integration tests
supabase/          # Edge functions (cal-webhook)
```
