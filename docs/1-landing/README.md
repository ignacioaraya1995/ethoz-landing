# Landing — 40+ Public Pages

All public-facing pages on ethoz.cl. Implemented in SvelteKit 2 with Svelte 5 runes. Root path: `src/routes/`.

**Total routes:** 40+ pages organized by purpose (landing, features, audience, conversion, authority, resources, demo, blog).

## Global Components & Layout

| File | Purpose |
|------|---------|
| `src/routes/+layout.svelte` | Global layout: NavBar, Footer, Sentry init, pitch modal |
| `src/routes/+error.svelte` | Error page (404, 500, etc.) |
| `src/lib/components/NavBar.svelte` | Fixed navbar: logo, "Productos" dropdown, locale toggle, CTA |
| `src/lib/components/Footer.svelte` | Footer: 6 columns (brand, product, resources, company, for-you), RRSS links |
| `src/lib/components/PitchModal.svelte` | Modal for pitch presentation (slides + audio navigation) |
| `src/lib/components/FeedbackModal.svelte` | Quick feedback form modal |

## 1. Public Landing Pages (4 pages)

Core pages for brand, legal, and contact.

### Home — `/`
- **File:** `src/routes/+page.svelte` (780 lines)
- **Purpose:** Main conversion page. Hero with school search (RBD/name), value prop, 9 feature cards, testimonials, CTA to demo/pitch
- **Key sections:** School search integration, features grid, social proof, schedule CTA, pitch modal trigger
- **CTA:** "Agendar demo" → `/schedule`, "Ver presentación" → pitch modal
- **SEO keywords:** Protección escolar, seguridad datos estudiantes, Ley 21.719, control acceso

### About — `/about`
- **File:** `src/routes/about/+page.svelte` (222 lines)
- **Purpose:** Company story, founding 2026-04-06, mission statement, team culture
- **CTA:** Link to `/schedule`
- **SEO keywords:** ETHOZ SpA, historia, equipo, mission

### Contact — `/contact`
- **File:** `src/routes/contact/+page.svelte` (224 lines)
- **Purpose:** Contact form (name, email, message, school). Server-side reCAPTCHA v3 verification via `verify-lead` Edge Function.
- **Database:** Inserts into Supabase `leads` table with source='contact'
- **Triggers:** `new-lead-notify` function sends internal alert
- **CTA:** "Enviar" submits form; success shows toast (svelte-sonner)
- **SEO keywords:** Contacto, soporte, consultas

### Privacy Policy — `/privacy`
- **File:** `src/routes/privacy/+page.svelte` (120 lines)
- **Purpose:** GDPR + Chilean data protection policy. Legal compliance.
- **Meta:** `<meta name="robots" content="noindex, nofollow">`
- **CTA:** None (legal page)

### Terms of Service — `/terms`
- **File:** `src/routes/terms/+page.svelte` (109 lines)
- **Purpose:** Terms of use for ETHOZ SpA. Legal compliance.
- **Meta:** `<meta name="robots" content="noindex, nofollow">`
- **CTA:** None (legal page)

## 2. Features (9 pages)

Deep-dive pages for each core feature. Each page has title, description, benefit cards, comparison, and demo CTA.

All share pattern:
- Path: `/features/[slug]`
- File: `src/routes/features/[slug]/+page.svelte`
- Primary CTA: "Ver demo" → `/demo`, "Agendar" → `/schedule`

| Route | Purpose | Keywords |
|-------|---------|----------|
| `/features/alerts` | Real-time alerts for emergencies, incidents, notifications | Alertas, emergencias, notificaciones |
| `/features/analytics` | Dashboard with student metrics, attendance trends, anomaly detection | Analytics, métricas, dashboard |
| `/features/emergency` | Emergency response workflow, lockdown, evacuation procedures | Emergencia, evacuación, seguridad |
| `/features/access-control` | Role-based access (admin, teacher, porter, parent), identity verification | Control acceso, roles, permisos |
| `/features/safe-pickups` | QR-based pickups with identity verification, authorized contacts | Retiros seguros, QR, identidad |
| `/features/smart-search` | Full-text search for students, parents, authorized persons | Búsqueda, estudiantes, apoderados |
| `/features/student-profile` | Unified student record: bio, contacts, health, behavior, history | Perfil estudiante, historial |
| `/features/attendance` | Digital attendance tracking with real-time sync to ERPs (Napsis, Syscol) | Asistencia, registro digital |
| `/features/privacy-compliance` | Ley 21.719 compliance, GDPR, data minimization, consent | Privacidad, GDPR, Ley 21.719 |

**Files location:** `src/routes/features/[route]/+page.svelte`

## 3. Audience-Specific Pages (3 pages)

Role-specific value propositions and CTAs.

### Para Sostenedores (School Network Operators) — `/para-sostenedores`
- **File:** `src/routes/para-sostenedores/+page.svelte`
- **Audience:** School network directors, multi-school operators
- **Pain points:** Managing 10+ schools, unified data governance, compliance across network
- **CTA:** "Hablar con especialista" → WhatsApp or `/schedule`
- **Keywords:** Sostenedores, redes educacionales, gestión múltiples colegios

### Para Directores (School Directors) — `/para-directores`
- **File:** `src/routes/para-directores/+page.svelte`
- **Audience:** Individual school principals, decision-makers
- **Pain points:** Staff workload, student safety, liability, data security
- **CTA:** "Ver demo personalizado" → `/demo`
- **Keywords:** Directores, gestión escolar, seguridad

### Para Porteros (Security/Reception Staff) — `/para-porteros`
- **File:** `src/routes/para-porteros/+page.svelte`
- **Audience:** Receptionist and security personnel (end users)
- **Pain points:** Manual entry, identity verification, pickup delays
- **CTA:** "Ver cómo funciona" → feature pages or `/demo`
- **Keywords:** Portería, recepción, seguridad entrada

## 4. Conversion & Decision Pages (8 pages)

Help prospects make buying decisions and understand value.

### Comparativa (Feature Comparison) — `/comparativa`
- **File:** `src/routes/comparativa/+page.svelte`
- **Purpose:** Feature-by-feature vs Excel, manual systems, generic SaaS ERPs
- **Table:** Feature grid (Ethoz, Excel, Generic ERP, Manual)
- **CTA:** "Empezar ahora" → `/schedule`
- **Keywords:** Comparación, vs Excel, vs sistemas genéricos

### ROI Calculator — `/roi-calculator`
- **File:** `src/routes/roi-calculator/+page.svelte`
- **Purpose:** Interactive calculator. Input: school size, current cost, time saved → outputs ROI, savings
- **Formula:** `(time_saved * hourly_cost) + (fine_avoided) - subscription = ROI`
- **CTA:** "Ver presupuesto personalizado" → `/schedule`
- **Keywords:** ROI, calculadora, presupuesto

### Proyecciones (Financial Projections) — `/proyecciones`
- **File:** `src/routes/proyecciones/+page.svelte`
- **Purpose:** 3-5 year cost-benefit projection, compliance cost vs fine risk
- **Chart:** Year-by-year savings, cumulative TCO
- **CTA:** "Obtener proyección completa" → `/schedule`
- **Keywords:** Proyecciones financieras, TCO, presupuesto

### Integraciones (Integrations) — `/integrations`
- **File:** `src/routes/integrations/+page.svelte`
- **Purpose:** How Ethoz integrates with Napsis, Syscol, Lirmi, Google Classroom, etc. Position as complement, not replacement.
- **CTA:** "Ver integraciones disponibles" → `/contact`
- **Keywords:** Integraciones, Napsis, Syscol, Lirmi, API

### Productos (Product Catalog) — `/productos`
- **File:** `src/routes/productos/+page.svelte`
- **Purpose:** Product modules, pricing tiers, feature matrix
- **CTA:** "Contratación" → `/schedule` or WhatsApp
- **Keywords:** Productos, planes, precios

### Get Started — `/get-started`
- **File:** `src/routes/get-started/+page.svelte` (252 lines)
- **Purpose:** Onboarding guide. First steps, timeline, implementation roadmap
- **CTA:** "Agendar onboarding" → `/schedule`
- **Keywords:** Inicio, onboarding, implementación

### Compliance (Full Page) — `/compliance`
- **File:** `src/routes/compliance/+page.svelte` (443 lines)
- **Purpose:** Deep-dive on Ley 21.719, GDPR, data protection requirements. Heavy SEO focus.
- **Sections:** Law timeline, penalties, requirements, Ethoz solutions
- **CTA:** "Descargar guía de cumplimiento" → PDF or `/contact`
- **Keywords:** Cumplimiento, Ley 21.719, GDPR, multas, protección datos

## 5. Authority & SEO Pages (4 pages)

Educational content + link bait for organic SEO.

### Ley 21.719 (Law Explainer) — `/ley-21719`
- **File:** `src/routes/ley-21719/+page.svelte`
- **Purpose:** Accessible explanation of Chilean data protection law. Deadline December 2026. Max fine: 20,000 UTM.
- **Sections:** What it is, who applies, key articles, deadlines, penalties, how Ethoz helps
- **CTA:** "Descargable: Guía de cumplimiento" → `/contact`
- **Keywords:** Ley 21.719, protección datos, multas, cumplimiento

### Circular Nº30 (Mineduc Guidance) — `/circular-30`
- **File:** `src/routes/circular-30/+page.svelte`
- **Purpose:** Explanation of Mineduc Circular Nº30 (digital class books, student records)
- **CTA:** "Ver cómo se implementa en Ethoz" → feature page or `/demo`
- **Keywords:** Circular 30, libro de clases digital, Mineduc

### Glosario (Glossary) — `/glosario`
- **File:** `src/routes/glosario/+page.svelte`
- **Purpose:** Dictionary of educational + compliance terms (sostenedor, RBD, alumno, apoderado, etc.)
- **Format:** Alphabetical list of terms with definitions
- **CTA:** None (reference page)
- **Keywords:** Glosario, términos educacionales, definiciones

### Seguridad de Datos (Data Security) — `/seguridad-datos`
- **File:** `src/routes/seguridad-datos/+page.svelte`
- **Purpose:** Technical deep-dive on encryption, backups, RLS, audit logs, compliance infrastructure
- **Sections:** Authentication, encryption at rest/transit, access controls, disaster recovery
- **CTA:** "Hablar con equipo de seguridad" → `/contact`
- **Keywords:** Seguridad datos, encriptación, RLS, GDPR, compliance

## 6. Resources & Engagement (3 pages)

Lead magnets and webinar signup.

### Recursos (Resource Hub) — `/recursos`
- **File:** `src/routes/recursos/+page.svelte`
- **Purpose:** 6 downloadable templates/guides (Ley 21.719 checklist, data audit, incident response, etc.)
- **Format:** Card grid with preview + download CTA
- **CTA:** "Descargar" → PDF or `/contact` (email gating)
- **Keywords:** Recursos, descargas, plantillas, guías

**Template pages** (6 sub-routes, e.g., `/recursos/template-1`):
- Ley 21.719 implementation checklist
- Data audit template
- Incident response plan
- Access control matrix
- Consent form template
- Audit log review guide

### Webinar — `/webinar`
- **File:** `src/routes/webinar/+page.svelte`
- **Purpose:** Webinar signup. Input: name, email, institution → Supabase `leads` (source='webinar')
- **CTA:** "Reservar lugar" → form submission
- **Keywords:** Webinar, capacitación, evento

## 7. Demo & Booking Flow (4 pages)

Personalized demo and scheduling.

### Demo Search — `/demo`
- **File:** `src/routes/demo/+page.svelte` (251 lines)
- **Purpose:** School search form (RBD or school name). Submits to `/demo/[rbd]`
- **Data source:** `static/data/schools.json` (Mineduc directory, auto-processed)
- **CTA:** "Ver demo" → `/demo/[rbd]`
- **Keywords:** Demo, búsqueda colegio, RBD

### Personalized Demo — `/demo/[rbd]`
- **File:** `src/routes/demo/[rbd]/+page.svelte` (476 lines)
- **Purpose:** Interactive mockup of Ethoz UI with real school data (name, location, student count)
- **Loader:** `src/routes/demo/[rbd]/+page.ts` — Fetches school from `schools.json` by RBD
- **Data:** Real Mineduc data (enrollment, region, school type)
- **CTA:** "Agendar demo completo" → `/schedule`
- **Keywords:** Demo, [school name], RBD [number]

### Schedule / Booking — `/schedule`
- **File:** `src/routes/schedule/+page.svelte` (210 lines)
- **Purpose:** Booking form (name, email, school, preferred time) → Cal.com integration
- **Flow:** Form submission → `/schedule?name=X&email=Y` → redirects to Cal.com
- **Data:** Leads captured in Supabase before redirect
- **Integrations:** Cal.com (PUBLIC_CAL_USERNAME in env)
- **CTA:** "Agendar" → Cal.com calendar
- **Keywords:** Agendar, reserva, demostración

## 8. Blog (2 pages)

Blog index and individual post pages.

### Blog Index — `/blog`
- **File:** `src/routes/blog/+page.svelte` (86 lines)
- **Purpose:** List all blog posts with title, excerpt, date, read time
- **Data:** Posts auto-discovered from `src/lib/data/posts/index.ts`
- **CTA:** Click post → `/blog/[slug]`
- **Keywords:** Blog, artículos, recursos

### Blog Post — `/blog/[slug]`
- **File:** `src/routes/blog/[slug]/+page.svelte` (250 lines)
- **Loader:** `src/routes/blog/[slug]/+page.ts` — Finds post by slug in array
- **Purpose:** Render markdown blog post with title, date, content, author
- **Data:** Blog posts stored as TypeScript modules in `src/lib/data/posts/`
- **Post count:** 13 posts (compliance, safety, convivencia, digital transformation, product)
- **CTA:** "Agendar demo" at bottom, related posts
- **Keywords:** [Post-specific keywords]

**Blog posts** (in `src/lib/data/posts/`):
1. `ley-21719-que-deben-saber-los-colegios.ts` — Law explanation
2. `circular-n30-libro-clases-digital.ts` — Digital class books
3. `multas-proteccion-datos-sostenedores.ts` — Penalties overview
4. `privacidad-por-diseno-art-16-bis.ts` — Privacy by design
5. `gestion-escolar-vs-proteccion-escolar.ts` — Positioning
6. `retiros-escolares-seguros-tecnologia.ts` — Safe pickups
7. `control-acceso-roles-seguridad-escolar.ts` — Access control
8. `crisis-convivencia-escolar-2025.ts` — School climate
9. `ninguna-plataforma-cumple-ley-21719.ts` — Market opportunity
10. `inteligencia-artificial-desercion-escolar.ts` — AI + education
11. `excel-no-cumple-normativa-datos.ts` — Excel vs platform
12. `reinicio-de-marzo-seguridad-escolar.ts` — Back-to-school
13. `roadmap-ethoz-2026.ts` — Product roadmap

**Post structure** (`src/lib/data/posts/types.ts`):
```typescript
export type Post = {
  slug: string;
  title: string;
  date: string; // ISO 8601
  excerpt: string;
  content: string; // Markdown or HTML
  tags: string[];
  author?: string;
  image?: string;
};
```

## 9. Pitch Presentation — `/pitch`

Audio-synced slide presentation (not a video file).

### Pitch — `/pitch`
- **File:** `src/routes/pitch/+page.svelte` (1,418 lines)
- **Purpose:** Interactive pitch deck with audio narration, navigable slides
- **Data:** Slides from `src/lib/data/pitch-slides.ts`
- **Tech:** Audio player (plays per-slide narration), keyboard navigation
- **CTA:** "Enviar demo link" → `/contact`
- **Keywords:** Pitch, presentación, Ethoz

**Note:** When team says "video", they mean this page. It is NOT an `<video>` element. It's slides + audio navigation.

## 10. Miscellaneous Pages (2 pages)

Feedback and suggestions.

### Suggestions / Feedback — `/suggestions`
- **File:** `src/routes/suggestions/+page.svelte` (313 lines)
- **Purpose:** Capture user feedback from demo. Form: rating, comment, contact info
- **Database:** Supabase `leads` table (source='suggestions')
- **Triggers:** `new-lead-notify` sends alert
- **CTA:** "Enviar feedback" submits form
- **Keywords:** Sugerencias, feedback, opinión

## Layout & Shared Components

### Global Layout
```svelte
<script>
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  // All pages wrap in this
</script>

<NavBar />
<main>
  <slot />
</main>
<Footer />
```

### NavBar Features
- **Logo:** Links to `/`
- **Dropdown:** "Productos" → `/productos`
- **Locale toggle:** ES/EN (via i18n store)
- **CTA button:** "Agendar demo" → `/schedule`
- **Responsive:** Hamburger menu on mobile

### Footer
- **6 columns:** Brand, Producto, Recursos, Empresa, Para ti, Legal
- **Social links:** LinkedIn, Facebook, Instagram, YouTube, Google Business
- **Copyright:** ETHOZ SpA, RUT 78.394.522-3

## Data & Stores

| Store | Purpose |
|-------|---------|
| `src/lib/stores/schools.svelte.ts` | Loads `schools.json`, provides search |
| `src/lib/stores/feedback.svelte.ts` | Feedback modal visibility toggle |
| `src/lib/i18n/index.svelte.ts` | Active language (es/en) |

## Common Patterns

### School Search
Used on `/`, `/demo`. Loads schools from `schools.json`, searches by name or RBD.

```svelte
import { schools } from '$lib/stores/schools.svelte';
const results = $schools.filter(s => 
  s.name.includes(query) || s.rbd === parseInt(query)
);
```

### Form Submission with reCAPTCHA
All forms (contact, demo, suggestions) verify with reCAPTCHA v3 server-side:

```typescript
// In API endpoint or Edge Function
const token = await getRecaptchaToken(); // Client-side
const valid = await verifyRecaptchaToken(token); // Server
if (valid && score > 0.5) {
  // Insert lead
}
```

### Link to Demo
Most CTAs point to `/schedule` or `/demo`. Some pages check localStorage for repeat visitor:

```svelte
import { isRepeatVisitor } from '$lib/utils/visitor';
// If repeat: show "Agendar demo", else show "Ver demo"
```

## SEO & Meta Tags

Each page should have:
- `<title>` with keyword
- `<meta name="description">`
- `<meta name="keywords">`
- Open Graph tags for social sharing

Example:
```svelte
<svelte:head>
  <title>Seguridad de Datos - Ethoz</title>
  <meta name="description" content="Encriptación, RLS, cumplimiento GDPR." />
  <meta name="keywords" content="seguridad datos, encriptación, GDPR, compliance" />
</svelte:head>
```

## Development Notes

- **Port:** Always `npm run dev -- --port 5177`
- **Colors:** Design tokens only (`bg-primary`, `text-muted-foreground`). Never hardcode colors.
- **i18n:** All text via `t('key')` function. No hardcoded strings in templates.
- **Components:** Use shadcn-svelte primitives (Button, Dialog, Input). No raw HTML.
- **Blog:** Auto-discovered from `src/lib/data/posts/` glob. Add file, it appears.

---

**Total:** 40+ routes | **Components:** 2 global (NavBar, Footer) + 9 features + 3 audience + 8 conversion + 4 authority + 3 resources + 4 demo + 2 blog + 1 pitch + 2 misc | **Published:** 2026-04-07
