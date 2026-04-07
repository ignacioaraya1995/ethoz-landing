# Ethoz — Project Context

## What is this
Ethoz (ethoz.cl) is a school protection platform for Chilean K-12 schools. SvelteKit 2 + Svelte 5 (runes), Tailwind CSS v4, Supabase (Auth + DB + Edge Functions), Firebase Hosting + Cloudflare DNS.

**Not a school management system** — complements existing ERPs (Napsis, Syscol, Lirmi) by adding security, compliance, and student data protection.

## Architecture

```
src/routes/           — SvelteKit pages (landing + admin)
src/routes/admin/     — Admin panel (auth-gated): leads CRM, prospecting, content manager
src/lib/components/   — Shared UI (NavBar, Footer, shadcn-svelte)
src/lib/data/posts/   — Blog posts as TypeScript modules (auto-discovered via glob)
src/lib/content/      — Content strategy + pitch slides
src/lib/i18n/         — i18n (es/en) via t() function
scripts/              — Content pipeline (generate, publish, images, video)
supabase/functions/   — Edge Functions (social-publish, new-lead-notify, etc.)
static/data/          — schools.json (processed from Mineduc CSVs)
docs/                 — Documentation index (5 sections + knowledge base + content bank)
```

## Critical Rules

### Code
- Dev server: `npm run dev -- --port 5177` (ALWAYS port 5177)
- Build: `npm run build` | Deploy: `npm run build && firebase deploy`
- All text via `t()` i18n function — NEVER hardcode strings in templates
- URLs in English (`/features/safe-pickups`), content in ES/EN
- Svelte 5 runes API (`$state`, `$derived`, `$effect`) — no legacy reactive syntax
- Blog posts: export `BlogPost` from `src/lib/data/posts/*.ts` — auto-discovered, no manual registration

### Design (see .impeccable.md for full spec)
- Light mode only. Brand: Navy #0F172A + Blue #2563EB + White #FFFFFF
- NEVER hardcode colors — use design tokens (bg-primary, text-muted-foreground, etc.)
- Icons + titles ALWAYS inline (same row), never stacked. No icon-in-colored-box wrappers.
- Card pattern: `rounded-xl border border-border bg-card`
- McKinsey + Apple tone: precise, authoritative, no buzzwords

### Content
- Spanish chileno profesional (no slang, no extreme modismos)
- No markdown in social posts (no **, *, #, backticks)
- Max 2-3 emojis per post, ZERO on LinkedIn
- Ethoz COMPLEMENTS existing systems — never say "replaces"
- Knowledge base: `docs/5-knowledge-base/` (stats, competitors, laws, trends, messaging)
- Content bank: `docs/content-bank/` (posts, scripts, calendar)

### Brand context
- Company: ETHOZ SpA | RUT: 78.394.522-3 | Founded: 2026
- Tagline: "Proteccion escolar inteligente"
- Key urgency: Ley 21.719 (data protection) enters full enforcement December 2026
- Fines: up to 20,000 UTM (~$1,300M CLP) or 4% annual revenue
- TAM: 12,038 schools, 5,777 sostenedores. Tier 1: 402 multi-school operators

### APIs and Keys
All in `.env.local` (never commit): Supabase (anon + service_role), Kimi, Gemini, reCAPTCHA, Cal.com, Sentry, Cloudflare, Clarity.
Content pipeline: Kimi CLI (text) → Gemini (images) → Supabase Edge Functions (publish)

## Documentation Map
- `docs/1-landing/` — All public pages documented
- `docs/2-admin/` — Admin panel, auth, CRM, Edge Functions
- `docs/3-prospecting/` — Mineduc CSVs, scoring, outbound pipeline
- `docs/4-content-generation/` — 12 scripts, strategy.ts, publish flow
- `docs/5-knowledge-base/` — 10 files: stats, competitors, laws, trends, positioning, audiences, stories, quotes
- `docs/content-bank/` — 70+ social posts, 5 YT scripts, 30-day calendar
- `.impeccable.md` — Full design system spec (colors, typography, spacing, components, accessibility)

---

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->
