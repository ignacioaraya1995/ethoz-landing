# Ethoz — Complete Project Documentation

**Ethoz** (ethoz.cl) is a school protection and compliance platform for Chilean K-12 schools. It helps schools manage student data safely, comply with Ley 21.719 (Data Protection Law), and implement secure workflows for pickups, attendance, and emergency response.

This directory centralizes all technical documentation for developers, AI agents, and operations teams.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server on port 5177
npm run dev -- --port 5177

# Build for production
npm run build

# Deploy to Firebase Hosting (both sites)
npm run build && firebase deploy --only hosting

# Run security audit
npm run audit:security

# Run tests
npx vitest run
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS (Web Browser)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend: SvelteKit 2 + Svelte 5 (runes) + Tailwind v4    │
│  - Public landing: / /about /features/* /para-* /ley-21719 │
│  - Admin panel: /admin/leads /admin/content /admin/settings│
│  - Demo & prospecting: /demo /demo/[rbd] /roi-calculator   │
│  - Dynamic blog: /blog /blog/[slug]                        │
│  - Components: shadcn-svelte UI library (15 components)    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│      Supabase (PostgreSQL + Auth + Edge Functions)         │
│  - Auth: Email/password, Supabase Auth provider            │
│  - Tables: leads, prospects, content_posts, social_tokens  │
│  - RLS: Locked to admin UUID 169e6037-fcc2-4201-b2af-...   │
│  - Edge Functions: 7 serverless functions (text below)     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│        External APIs & Services                             │
│  - reCAPTCHA v3 (server-side verification on verify-lead)  │
│  - Kimi CLI (text generation via Moonshot AI)              │
│  - Gemini (image generation)                               │
│  - Cal.com (scheduling calendars)                          │
│  - OAuth: LinkedIn, Meta (Facebook/Instagram), Google/YT   │
│  - Sentry (error monitoring)                               │
│  - Microsoft Clarity (user behavior analytics)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│     Firebase Hosting (2 sites) + Cloudflare DNS            │
│  - hosting:ethoz → ethoz.web.app (backup)                  │
│  - hosting:gestion-estudiantil-dev → ethoz.cl (primary)    │
│  - DNS TXT: hosting-site=gestion-estudiantil-dev            │
│  - Cache: Cache-Control: max-age=0 on extensionless routes│
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Tech | Notes |
|-------|------|-------|
| **Frontend** | SvelteKit 2, Svelte 5 runes | `$state`, `$derived`, `$effect` — no legacy syntax |
| **Styling** | Tailwind CSS v4 | Design tokens only, no hardcoded colors |
| **UI Components** | shadcn-svelte | 15 components: Button, Dialog, Table, Select, etc. |
| **Localization** | Custom i18n (`src/lib/i18n/`) | Spanish (ES) primary, English partial |
| **Database** | Supabase (PostgreSQL) | Auth + RLS policies + Edge Functions |
| **Serverless** | Supabase Edge Functions | 7 functions for auth, publishing, webhooks |
| **CDN** | Firebase Hosting + Cloudflare | 2 sites, Cache-Control headers tuned |
| **Auth** | Supabase Auth | Email/password, Supabase session in localStorage |
| **Verification** | reCAPTCHA v3 | Server-side verification via `verify-lead` function |
| **Analytics** | Sentry, Microsoft Clarity | Error tracking + user behavior heatmaps |
| **Content Gen** | Kimi (text), Gemini (images), Edge TTS | Python scripts + Node.js edge functions |
| **Social** | LinkedIn, Meta, Google APIs | OAuth flow via Edge Functions |

## Repository Structure

```
startUpColegio-landing/
├── src/
│   ├── routes/                 — SvelteKit pages (40+ routes)
│   │   ├── +layout.svelte      — Global layout (NavBar, Footer, Sentry init)
│   │   ├── +page.svelte        — Home page (school search, hero, features)
│   │   ├── admin/              — Auth-gated admin panel
│   │   │   ├── leads/          — Captured leads from forms
│   │   │   ├── prospecting/    — Mineduc CRM + scoring
│   │   │   ├── content/        — Draft posts, publish workflow
│   │   │   └── settings/       — OAuth token management
│   │   ├── features/           — 9 feature pages (/features/*)
│   │   ├── para-*/             — Audience pages (sostenedores, directores, porteros)
│   │   ├── ley-21719/          — Compliance authority page
│   │   ├── comparativa/        — Competitive comparison
│   │   ├── roi-calculator/     — ROI calculator
│   │   ├── demo/               — School search + demo display
│   │   ├── blog/               — Blog index + [slug] pages
│   │   ├── pitch/              — Audio-synced slide presentation
│   │   └── [...more]           — resources, webinar, schedule, etc.
│   ├── lib/
│   │   ├── components/         — Reusable UI components
│   │   │   ├── ui/             — shadcn-svelte (button, dialog, table, etc.)
│   │   │   ├── NavBar.svelte   — Global navigation
│   │   │   ├── Footer.svelte   — Global footer (RRSS, company info)
│   │   │   └── [more]          — PitchModal, FeedbackModal, etc.
│   │   ├── stores/             — Svelte 5 runes stores
│   │   │   ├── admin.svelte.ts — Auth state
│   │   │   ├── schools.svelte.ts — Schools search cache
│   │   │   └── feedback.svelte.ts — Feedback modal visibility
│   │   ├── data/               — Static content
│   │   │   ├── posts/          — Blog posts as TS modules (auto-discovered)
│   │   │   ├── pitch-slides.ts — Pitch presentation data
│   │   │   └── [more]          — Pitch, strategy, etc.
│   │   ├── utils/              — Helpers
│   │   │   ├── supabase.ts     — Supabase client + RLS helpers
│   │   │   ├── recaptcha.ts    — reCAPTCHA token validation
│   │   │   ├── prospecting.ts  — Scoring algorithm
│   │   │   └── [more]          — analytics, text, device detection
│   │   ├── i18n/               — Localization
│   │   │   ├── index.svelte.ts — Language store
│   │   │   └── translations/   — es.ts, en.ts
│   │   ├── config.ts           — Global constants (company, URLs)
│   │   └── sentry.ts           — Sentry initialization
├── scripts/
│   ├── generate-content.mjs    — Text generation (Kimi)
│   ├── generate-images.mjs     — Image generation (Gemini)
│   ├── generate-covers.mjs     — Blog covers (Playwright + Gemini)
│   ├── generate-narrated-video.mjs — Reel with narration (Edge TTS + FFmpeg)
│   ├── publish-reels-batch.mjs — Batch publish reels
│   ├── process-schools.mjs     — CSV → schools.json
│   └── [more]                  — Batch, logos, pitch video, etc.
├── supabase/
│   ├── functions/              — Edge Functions (7 total)
│   │   ├── verify-lead/        — reCAPTCHA check + lead insert
│   │   ├── new-lead-notify/    — Trigger on new lead
│   │   ├── social-publish/     — Publish to LinkedIn/Instagram/Facebook/YouTube
│   │   ├── social-auth-google/ — OAuth token exchange
│   │   ├── social-auth-linkedin/
│   │   ├── social-auth-meta/
│   │   └── cal-webhook/        — Cal.com webhook handler
│   ├── migrations/             — SQL migrations (RLS policies, tables)
│   └── config.toml             — Supabase local config
├── static/
│   ├── data/schools.json       — Processed Mineduc directory (auto-generated)
│   ├── covers/                 — Blog post covers (auto-generated)
│   ├── generated/              — Generated images, videos (auto-generated)
│   └── [assets]                — Favicon, logo, etc.
├── docs/                       — This documentation
│   ├── README.md               — Overview (this file)
│   ├── 1-landing/README.md     — All 40+ public pages documented
│   ├── 2-admin/README.md       — Admin panel (leads, CRM, content)
│   ├── 3-prospecting/README.md — Mineduc data + scoring
│   ├── 4-content-generation/README.md — Pipeline (text, images, video)
│   ├── 5-knowledge-base/       — Content strategy, laws, competitors
│   ├── AGENTS.md               — Critical rules for AI agents (NEW)
│   ├── RUNBOOK.md              — Operational tasks (NEW)
│   └── content-bank/           — 70+ social posts + calendar
├── .impeccable.md              — Design system spec (colors, typography, components)
├── CLAUDE.md                   — Project context (this repo's copy)
├── firebase.json               — Firebase config (2 sites)
├── svelte.config.js            — SvelteKit config
├── tailwind.config.ts          — Tailwind v4 + shadcn config
├── tsconfig.json               — TypeScript strict mode
├── vitest.config.ts            — Test config
├── .env.local                  — Secrets (NOT in git)
└── [more]
```

## File Structure — Key Insights

### Frontend (40+ Routes)

Routes are organized by purpose:

1. **Public Landing** (9 pages)
   - `/` — Home with school search
   - `/about` — Company story
   - `/contact` — Contact form
   - `/privacy`, `/terms` — Legal

2. **Features** (9 pages)
   - `/features/alerts`, `/features/analytics`, `/features/emergency`, etc.

3. **Audience-Specific** (3 pages)
   - `/para-sostenedores` — For network operators
   - `/para-directores` — For school directors
   - `/para-porteros` — For security staff

4. **Conversion & Authority** (8 pages)
   - `/comparativa` — vs competitors
   - `/roi-calculator` — ROI model
   - `/proyecciones` — Projections
   - `/ley-21719` — Law compliance
   - `/circular-30` — Circular info
   - `/glosario` — Glossary
   - `/seguridad-datos` — Data security
   - `/compliance` — Compliance overview

5. **Resources & Engagement** (3 pages)
   - `/recursos` — 6 downloadable templates
   - `/webinar` — Webinar registration
   - `/get-started` — Onboarding steps

6. **Demo & Booking** (4 pages)
   - `/demo` — School search
   - `/demo/[rbd]` — Personalized demo
   - `/schedule` — Cal.com booking
   - `/pitch` — Audio-synced presentation

7. **Blog & Misc** (4 pages)
   - `/blog` — Post index
   - `/blog/[slug]` — Individual posts
   - `/productos` — Product catalog
   - `/suggestions` — User feedback

8. **Admin** (5 pages, auth-gated)
   - `/admin` — Login
   - `/admin/leads` — Captured leads
   - `/admin/prospecting` — Mineduc CRM
   - `/admin/content` — Draft/publish posts
   - `/admin/settings` — OAuth management

### Backend (Supabase Edge Functions)

7 serverless functions handle:
- `verify-lead` — reCAPTCHA + lead insert
- `new-lead-notify` — Trigger notification
- `social-publish` — Multi-platform publishing
- `social-auth-google`, `social-auth-linkedin`, `social-auth-meta` — OAuth flows
- `cal-webhook` — Cal.com integration

### Content & Data

- **Blog posts:** 13 posts in `src/lib/data/posts/` (auto-discovered via glob)
- **Pitch slides:** `src/lib/data/pitch-slides.ts` (29 slides)
- **Schools data:** `static/data/schools.json` (Mineduc CSV processed)
- **Strategy:** `src/lib/content/strategy.ts` (pillars, platforms, formats)

## Key Technologies Explained

### SvelteKit 2 + Svelte 5 Runes

All state uses Svelte 5 runes API (`$state`, `$derived`, `$effect`). No legacy `reactive()` or `setContext()`.

```typescript
// Example: Svelte 5 store
let count = $state(0);
let doubled = $derived(count * 2);

$effect(() => {
  console.log('Count changed:', count);
});
```

### Tailwind v4 + Design Tokens

ZERO hardcoded colors. All interactive elements use brand blue `#2563EB`. All spacing via Tailwind scale.

```svelte
<!-- Good: Uses design tokens -->
<button class="bg-primary hover:shadow-md">Click me</button>
<div class="text-muted-foreground">Secondary text</div>

<!-- BAD: Hardcoded color (will fail audit) -->
<button class="bg-blue-500">Click me</button>
```

### shadcn-svelte Component Library

All admin pages + many landing pages use shadcn-svelte components:

| Component | Path | Purpose |
|-----------|------|---------|
| Button | `$lib/components/ui/button` | All buttons |
| Dialog | `$lib/components/ui/dialog` | Modals, confirmations |
| Table | `$lib/components/ui/table` | Data tables (admin only) |
| Select | `$lib/components/ui/select` | Dropdowns |
| Input | `$lib/components/ui/input` | Text inputs |
| Badge | `$lib/components/ui/badge` | Status labels |
| Tabs | `$lib/components/ui/tabs` | Tab navigation |
| Tooltip | `$lib/components/ui/tooltip` | Hover info |
| Skeleton | `$lib/components/ui/skeleton` | Loading states |
| Separator | `$lib/components/ui/separator` | Visual dividers |
| DropdownMenu | `$lib/components/ui/dropdown-menu` | Action menus |
| Sheet | `$lib/components/ui/sheet` | Slide-over panels |
| Label | `$lib/components/ui/label` | Form labels |
| Sonner | `svelte-sonner` | Toast notifications |

### Supabase RLS (Row-Level Security)

All data tables are locked to admin UUID `169e6037-fcc2-4201-b2af-92547e1d6739`. Only service role can write.

```sql
-- Example RLS policy
CREATE POLICY "Admin only" ON leads
  FOR ALL
  USING (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739'::uuid);
```

### reCAPTCHA v3

Form submissions (leads, contact, schedule) are verified server-side via the `verify-lead` Edge Function. Score > 0.5 required.

### Localization (i18n)

All user-facing text uses the `t()` function:

```svelte
<script>
  import { t } from '$lib/i18n';
</script>

<h1>{t('home.title')}</h1>
```

## Common Commands

### Development

```bash
# Start dev server (port 5177 mandatory)
npm run dev -- --port 5177

# Type check
npx tsc --noEmit

# Lint (ESLint + Biome)
npm run lint

# Format code
npm run format

# Run tests
npx vitest run
```

### Build & Deploy

```bash
# Build for production
npm run build

# Verify no hardcoded colors, dark: prefixes, svelte:component, size="sm"
npm run audit:security

# Deploy to Firebase Hosting (BOTH sites)
npm run build && firebase deploy --only hosting

# Verify deploy
curl -sI https://ethoz.cl/ | grep cache-control

# View Firebase deployment status
firebase deploy:list
```

### Content Generation

```bash
# Generate LinkedIn posts
node scripts/generate-content.mjs --platform linkedin --pillar compliance --count 3

# Generate images for posts
node scripts/generate-images.mjs --batch --platform instagram --count 5

# Generate blog covers
node scripts/generate-covers.mjs --all-posts

# Generate narrated reel
node scripts/generate-narrated-video.mjs --script input/guion.txt --output output/reel.mp4

# Publish reels batch
node scripts/publish-reels-batch.mjs --dir output --platforms instagram,facebook
```

### Supabase & Edge Functions

```bash
# Start Supabase locally
supabase start
supabase studio

# View Edge Function logs
supabase functions logs social-publish --project-ref [ref]

# Deploy a function
supabase functions deploy social-publish --project-ref [ref]

# Apply migrations
supabase db push --project-ref [ref]
```

## Links to Deep-Dive Documentation

- **[1-landing/README.md](1-landing/README.md)** — All 40+ public pages: routes, components, CTAs, SEO
- **[2-admin/README.md](2-admin/README.md)** — Admin panel: auth flow, leads CRM, content manager, OAuth
- **[3-prospecting/README.md](3-prospecting/README.md)** — Mineduc data, scoring algorithm, prospect pipeline
- **[4-content-generation/README.md](4-content-generation/README.md)** — Content pipeline: text, images, video, publishing
- **[5-knowledge-base/README.md](5-knowledge-base/README.md)** — Knowledge base: laws, competitors, messaging
- **[AGENTS.md](AGENTS.md)** — Critical rules for AI agents working on this repo
- **[RUNBOOK.md](RUNBOOK.md)** — Operational procedures: deploying, debugging, adding users
- **[../.impeccable.md](../.impeccable.md)** — Design system: colors, typography, components, accessibility

## Environment Variables

All in `.env.local` (never commit):

```bash
# Supabase
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Content generation
KIMI_API_KEY=
GEMINI_API_KEY=

# Verification
PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Booking
PUBLIC_CAL_USERNAME=

# Monitoring
PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Firebase (for deploy)
FIREBASE_TOKEN=   # Set via: firebase login:ci

# Social OAuth (in Edge Function secrets, not local)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
META_APP_ID=
META_APP_SECRET=
```

## Company Info

- **Name:** ETHOZ SpA
- **RUT:** 78.394.522-3
- **Founded:** 2026-04-06
- **Tagline:** "Protección escolar inteligente"
- **Key deadline:** Ley 21.719 full enforcement December 2026
- **Max fine:** 20,000 UTM (~$1,300M CLP) or 4% annual revenue
- **TAM:** 12,038 schools, 5,777 school networks (sostenedores)

## Next Steps for AI Agents

1. **Read AGENTS.md** — Critical rules (hardcoded colors, alert(), svelte:component, etc.)
2. **Read RUNBOOK.md** — How to deploy, debug, add users
3. **Check .impeccable.md** — Design system before touching CSS
4. **Explore 1-landing/README.md** — Map of all 40+ routes
5. **Run audit** — `npm run audit:security` before commit
6. **Test locally** — `npm run dev -- --port 5177` on your machine

---

Generated: 2026-04-07 | Maintained by: Ethoz team | Last updated: [deployment date]
