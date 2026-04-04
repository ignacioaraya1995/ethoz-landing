## Design Context

### Users
School directors, *sostenedores* (school network administrators), and decision-makers at Chilean educational institutions with 500+ students. They are evaluating Ethoz as a compliance and student safety solution. They browse on desktop during office hours, occasionally on mobile. Their job on this page: understand the product, feel trust, and schedule a demo. They are conservative buyers — trust and institutional credibility matter more than flash.

### Brand Personality
**Trustworthy. Clear. Protective.**

Ethoz should feel like a competent institution — serious about data protection, approachable enough for a first-year teacher, and unmistakable when safety is at stake. The tone is **non-technical**: a school director should understand everything without Googling a term.

Emotional goals:
- **Primary:** Trust and calm — "This is a serious, reliable platform built by people who understand our reality"
- **Secondary:** Urgency — "The compliance deadline is approaching and we need to act"
- **Tertiary:** Relief — "Finally, a solution that handles the complexity for us"

### Aesthetic Direction

**Visual tone:** Apple-inspired minimalism. Pure white canvas, bold typography, generous whitespace. Light mode only — no dark/inverted sections. Use `bg-secondary` for alternation, never `bg-foreground`.

**Structural references:**
- IntegratePIE.cl: Simple page structure, easy to understand what the product does, non-technical language, clear "¿Qué es?" and "¿Cómo contratar?" navigation
- Kimche.cl: Module-based product pages, WhatsApp-first sales, regulatory content as SEO, named testimonials
- Apple.com: Pure white backgrounds, bold sans-serif typography, section-based storytelling

**Anti-references (explicitly NOT this):**
- Dark/inverted sections: No `bg-foreground` backgrounds, no dark trust bars or compliance sections
- Technical jargon: No "pgcrypto", "Row-Level Security", "pg_trgm" in user-facing copy. Keep technical terms for /compliance page only
- Generic SaaS: No cookie-cutter layouts, stock photography, or identical card grids repeated 4+ times
- Data-dense dashboards: No Grafana/analytics feel

**Theme:** Light mode only. Schools operate during daytime.

### Color Palette (OKLch — all via CSS custom properties)

| Token | Value | Purpose |
|-------|-------|---------|
| Background | `oklch(1 0 0)` | Pure white canvas |
| Foreground | `oklch(0.145 0.005 286)` | Near-black text |
| Primary | `oklch(0.52 0.21 264)` | System blue — ALL interactive elements |
| Secondary | `oklch(0.94 0.003 264)` | Cool-tinted gray — section alternation |
| Accent | `oklch(0.94 0.003 264)` | Subtle hover tint (NOT same as primary) |
| Muted | `oklch(0.93 0 0)` | Visible neutral gray for backgrounds |
| Muted fg | `oklch(0.556 0.01 286)` | Secondary text |
| Border | `oklch(0.915 0.005 286)` | Subtle dividers |
| Destructive | `oklch(0.55 0.22 25)` | Red — safety alerts |
| Warning | `oklch(0.75 0.15 85)` | Amber — caution |
| Success | `oklch(0.62 0.19 145)` | Green — positive states |

**Key rules:**
- One accent color (primary blue) for all interactive elements
- Semantic colors only for meaning
- NEVER hardcode colors in templates — always use design tokens
- Selection: light blue highlight with dark text (readable on all backgrounds)

### Typography

- **Font:** Inter Variable with OpenType features (`cv02`, `cv03`, `cv04`, `cv11`)
- **Headlines:** `font-bold tracking-tight`, line-height: 1.1
- **Body:** Regular weight, line-height: 1.6
- **Hierarchy through weight and size**, not color
- **text-wrap: balance** on headings, **text-wrap: pretty** on paragraphs
- All font sizes via Tailwind scale — never hardcoded px values

### Spacing & Layout

- **Max content width:** `max-w-7xl` (80rem) for page containers
- **Section padding:** `py-24 sm:py-32` for major sections
- **Grid gaps:** `gap-6` for card grids, `gap-8` for step layouts
- **Mobile-first:** Design for 375px, add `md:` and `lg:` breakpoints
- **Consistent alignment:** NavBar, content, footer all align to same `max-w-7xl` grid
- All spacing via Tailwind scale — never hardcoded values

### Components

- **NavBar:** Shared `NavBar.svelte` — fixed, `bg-background/80 backdrop-blur-lg`, Ethoz logo + locale toggle + CTA
- **Footer:** Shared `Footer.svelte` — compact, `bg-secondary`, 3 columns (Product+Company, Legal, Brand). NOT dark. NOT corporate.
- **Cards:** `rounded-xl border border-border bg-card` — icon + title INLINE (same row), never stacked vertically
- **Buttons:** shadcn-svelte Button. Primary = filled blue. XL for hero CTAs. `hover:shadow-md` for lift.
- **Icons:** Lucide — size-4 to size-6

### Content Principles

- **Non-technical language:** Write for a school director, not a developer. No database terms in user-facing copy.
- **Spanish-first, English-second.** All text via `t()` function — NEVER hardcoded in templates.
- **URLs in English** (`/pricing`, `/schedule`, `/features/safe-pickups`), content in both ES/EN.
- **McKinsey + Apple tone:** Precise, authoritative, every word earns its place. No buzzwords, no fluff.
- **Show the model, not the price.** Consultation-driven sales, WhatsApp-first conversion.

### Sales Flow

1. Landing page → understand the product (condensed features, "Conocer más" links)
2. Feature pages → deep dive on each module
3. `/demo` → find your school, fill contact details
4. `/schedule` → book via Google Calendar with pre-filled data
5. WhatsApp as secondary conversion channel everywhere

### Accessibility

- **Target:** WCAG AAA
- **Contrast:** Minimum 7:1 for normal text, 4.5:1 for large text
- **Motion:** Respect `prefers-reduced-motion`
- **Color blindness:** Never use color alone — always icons + text + color
- **Keyboard:** All interactive elements focusable, visible focus ring
- **Touch targets:** Minimum 44x44px on mobile

### Design Principles

1. **Trust through restraint** — Every element earns its place. White space IS the design.
2. **One color, maximum impact** — Primary blue for all interactive elements. Semantic colors only when meaning demands it.
3. **Non-technical by default** — If a school director can't understand it in 5 seconds, rewrite it.
4. **Nothing hardcoded** — All colors, spacing, and text flow through design tokens and i18n. Easy to edit later.
5. **Light and clean** — No dark sections. `bg-secondary` for alternation. The page should feel bright and trustworthy.
6. **Compact, not corporate** — Footer, nav, and UI elements should be efficient, not sprawling. Less padding > more padding.
7. **Accessible by default** — WCAG AAA. High contrast, keyboard navigable, screen reader compatible.
