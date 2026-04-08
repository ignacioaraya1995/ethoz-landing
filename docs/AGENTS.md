# AGENTS.md — Critical Rules for AI Agents

**This document is the master guide for any AI agent (Claude, etc.) working on the Ethoz codebase.**

Read this FIRST before making any changes. Violations will fail the security audit (`npm run audit:security`) and block deployment.

## Critical Rules (MUST Follow)

### 1. Design Tokens Only — Never Hardcode Colors

**RULE:** Zero hardcoded color values in Svelte templates or CSS. All colors via Tailwind design tokens.

**Good:**
```svelte
<button class="bg-primary hover:bg-primary/90">Click me</button>
<p class="text-muted-foreground">Secondary text</p>
<div class="border border-border">Card</div>
```

**BAD (will fail audit):**
```svelte
<button class="bg-blue-500">Click me</button>
<p class="text-gray-600">Secondary text</p>
<div class="border-2 border-slate-300">Card</div>
```

**Allowed design tokens:**
- Colors: `primary`, `secondary`, `accent`, `muted`, `muted-foreground`, `foreground`, `background`, `card`, `border`, `destructive`, `warning`, `success`
- Special case: `#25D366` (WhatsApp green) only in WhatsApp button branding
- Special case: `#0F172A` (Navy) only in logo/brand hero as explicit brand statement

**Check:** `npm run audit:security` will grep for hardcoded colors and fail if found.

### 2. No Dark Mode Prefixes

**RULE:** Zero `dark:` prefixes in any Svelte template. Light mode only.

**Good:**
```svelte
<div class="bg-secondary">Light gray section</div>
```

**BAD:**
```svelte
<div class="bg-white dark:bg-slate-900">Section</div>
```

**Why:** Product is light-mode only. Dark mode adds 20% complexity with no user demand. (Can add later.)

**Check:** `grep -r "dark:" src/routes/ | wc -l` must be 0.

### 3. No `<svelte:component>`

**RULE:** Never use `<svelte:component this={X} />`. Use `{@const}` + direct component import instead.

**Good:**
```svelte
<script>
  import { AlertCircle, AlertTriangle } from '@lucide/svelte';
  
  let icon = 'alert';
</script>

{#if icon === 'alert'}
  {@const Icon = AlertCircle}
  <Icon size={20} />
{:else if icon === 'warning'}
  {@const Icon = AlertTriangle}
  <Icon size={20} />
{/if}
```

**BAD:**
```svelte
<svelte:component this={dynamicIcon} />
```

**Why:** `svelte:component` is slower, harder to type-check, and adds indirection. `{@const}` is explicit.

**Check:** `grep -r "svelte:component" src/routes/ | wc -l` must be 0.

### 4. No Raw HTML Form Elements on Admin Pages

**RULE:** Admin pages ONLY use shadcn-svelte components. No raw `<table>`, `<input>`, `<select>`, `<button>`, `<dialog>` in `/admin/*`.

**Good (admin page):**
```svelte
<script>
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
</script>

<Input placeholder="Search..." />
<Button>Submit</Button>
<Table>
  <TableHeader>
    <TableHead>Name</TableHead>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>John</TableCell></TableRow>
  </TableBody>
</Table>
```

**BAD (admin page):**
```svelte
<input placeholder="Search..." />
<button>Submit</button>
<table>
  <thead><tr><th>Name</th></tr></thead>
  <tbody><tr><td>John</td></tr></tbody>
</table>
```

**Exception:** Landing pages can use semantic HTML (e.g., `<section>`, `<header>`). But interactive elements must use shadcn.

**shadcn components available:**
- Button, Dialog, Input, Label, Select, Badge, Table, Tabs, Tooltip, DropdownMenu, Sheet, Separator, Skeleton, Sonner (toast)

**Check:** Manual review of `/admin/*` pages.

### 5. Never Use `alert()` or `confirm()`

**RULE:** No browser `alert()`, `confirm()`, `prompt()`. Use shadcn `Dialog` + `Sonner` toast instead.

**Good:**
```svelte
<script>
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  
  let showConfirm = false;
  
  function handleDelete() {
    showConfirm = true;
  }
  
  function confirmDelete() {
    // Delete action
    toast.success('Deleted');
    showConfirm = false;
  }
</script>

{#if showConfirm}
  <Dialog open={true} onOpenChange={(open) => showConfirm = open}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this?</DialogTitle>
      </DialogHeader>
      <button on:click={confirmDelete}>Yes, delete</button>
      <button on:click={() => showConfirm = false}>Cancel</button>
    </DialogContent>
  </Dialog>
{/if}
```

**BAD:**
```svelte
function handleDelete() {
  if (confirm('Delete this?')) {
    // Delete
    alert('Deleted!');
  }
}
```

**Check:** `grep -r "alert\|confirm\|prompt" src/routes/ --include="*.svelte" | wc -l` must be 0.

### 6. No TypeScript `as` Casts in `{#each}` Blocks

**RULE:** Never use `as` type assertions inside `{#each}` destructuring. Use post-loop type narrowing instead.

**Good:**
```svelte
{#each items as item}
  {@const typedItem = item as ImportantType}
  <div>{typedItem.field}</div>
{/each}

<!-- Or better: -->
{#each items as item}
  {#if 'field' in item}
    <div>{item.field}</div>
  {/if}
{/each}
```

**BAD:**
```svelte
{#each items as item (item as ImportantType)}
  <div>{item.field}</div>
{/each}

{#each items as { field: string }}
  <div>{field}</div>
{/each}
```

**Why:** Svelte 5 parses `{:}` syntax strictly. `as` inside `{}` is read as destructuring, not type assertion.

### 7. Never Hardcode PII or Secrets

**RULE:** Zero PII in code. No hardcoded emails, API keys, OAuth secrets, or sensitive data.

**Good:**
```svelte
<!-- Use env variables -->
<a href="mailto:{import.meta.env.VITE_CONTACT_EMAIL}">Contact</a>

<!-- Mask email in logs -->
import { maskEmail } from '$lib/supabase';
console.log(`Lead email: ${maskEmail(email)}`);
```

**BAD:**
```svelte
<!-- Hardcoded email -->
<a href="mailto:idaraya@uc.cl">Contact</a>

<!-- Logs raw email -->
console.log(`Lead email: ${email}`);
```

**Keys must be in `.env.local`:**
```
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
PUBLIC_RECAPTCHA_SITE_KEY
RECAPTCHA_SECRET_KEY
PUBLIC_CAL_USERNAME
PUBLIC_SENTRY_DSN
SENTRY_AUTH_TOKEN
KIMI_API_KEY
GEMINI_API_KEY
```

**Check:** `grep -r "idaraya\|@uc.cl\|sk_" src/` should return nothing.

### 8. No Direct Database Inserts

**RULE:** Never insert directly into `leads` table. Always go through `verify-lead` Edge Function (server-side reCAPTCHA verification).

**Good:**
```typescript
// Client-side
const { data, error } = await supabase.functions.invoke('verify-lead', {
  body: {
    name, email, school, message,
    source: 'contact'
  }
});
```

**BAD:**
```typescript
// Never do this
const { error } = await supabase
  .from('leads')
  .insert([{ name, email, school, message }]);
```

**Why:** Unverified leads = spam/bots. Server-side reCAPTCHA required.

### 9. No OAuth Secrets in URL Params

**RULE:** OAuth `client_secret` and tokens ONLY in POST body or Edge Function secrets, never in URL.

**Good:**
```typescript
// Edge Function with secrets
const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
const response = await fetch('...', {
  method: 'POST',
  body: JSON.stringify({ client_secret: clientSecret, ... })
});
```

**BAD:**
```typescript
// Never do this
const url = `https://api.linkedin.com/oauth?client_secret=${secret}&code=${code}`;
```

**Check:** `grep -r "client_secret\|LINKEDIN_SECRET" src/routes/ | grep -v "supabase/functions" | wc -l` must be 0.

### 10. Webhook Signature Verification is Mandatory

**RULE:** All webhooks (Cal.com, etc.) MUST verify signatures. Never trust webhook body without verification.

**Good:**
```typescript
// In cal-webhook Edge Function
import { verify } from 'https://deno.land/x/djwt@v2.10/mod.ts';

const signature = request.headers.get('X-Cal-Signature');
const secret = Deno.env.get('CAL_WEBHOOK_SECRET');

try {
  verify(signature, body, secret);
} catch (e) {
  return new Response('Unauthorized', { status: 401 });
}
```

**BAD:**
```typescript
// Never do this
const body = await request.json();
const lead = body.data; // UNSAFE without signature check
```

**Check:** All webhook handlers in `supabase/functions/*` must call `verify()`.

---

## Deploy Protocol

**MUST follow this order. Skipping any step = deploy failure.**

```bash
# 1. Build
npm run build

# 2. Run security audit (MUST PASS)
npm run audit:security

# 3. Run tests (MUST PASS)
npx vitest run

# 4. Verify no violations
/usr/bin/grep -rn "dark:" src/routes/ | wc -l           # must be 0
/usr/bin/grep -rn "svelte:component" src/routes/ | wc -l # must be 0
/usr/bin/grep -rn 'size="sm"' src/routes/ --include="*.svelte" | /usr/bin/grep -v admin | /usr/bin/grep -v recursos | wc -l # must be 0

# 5. Deploy to Firebase (BOTH sites)
firebase deploy --only hosting

# 6. Verify deploy
curl -sI https://ethoz.cl/ | grep cache-control # must be max-age=0

# 7. Check live site
open https://ethoz.cl/
```

**Common issues:**
- **`dark:` prefixes found:** Search for "dark:" and remove. Light mode only.
- **`svelte:component` found:** Replace with `{@const Icon = X}` pattern.
- **`size="sm"` on public pages:** Remove. Use `size="md"` or larger for accessibility.
- **Cache-Control not `max-age=0`:** Check `firebase.json` `public` rule for `Cache-Control` header.

---

## Common Pitfalls (Learned the Hard Way)

### 1. Firebase Has TWO Hosting Sites

**Mistake:** Deploying to `hosting:ethoz` (backup site) instead of the primary `hosting:gestion-estudiantil-dev`.

**Truth:**
- `hosting:ethoz` → `ethoz.web.app` (backup, internal only)
- `hosting:gestion-estudiantil-dev` → **`ethoz.cl`** (primary, customer-facing) AND `gestion-estudiantil-dev.web.app`
- DNS TXT record: `hosting-site=gestion-estudiantil-dev`

**Solution:** Always deploy with `firebase deploy --only hosting` (no target). Firebase auto-routes to correct site via DNS TXT.

### 2. Extensionless Routes Need Explicit Cache Headers

**Mistake:** `/demo`, `/schedule`, `/features/alerts` getting `Cache-Control: max-age=3600` from Firebase default.

**Truth:** Firebase defaults to 1 hour cache on extensionless routes. Ethoz requires `max-age=0` (no cache) for instant updates.

**Solution:** In `firebase.json`:
```json
{
  "hosting": {
    "public": "build",
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "**",
        "headers": [{ "key": "Cache-Control", "value": "max-age=0, must-revalidate" }]
      }
    ]
  }
}
```

### 3. RTK Intercepts Grep Output

**Mistake:** Running `grep -r "dark:" src/routes/` and getting empty result even though dark: exists.

**Truth:** RTK (Rust Token Killer) hook intercepts grep and filters output for performance.

**Solution:** Use full path: `/usr/bin/grep -r "dark:" src/routes/` or use the Grep tool.

### 4. Don't Trust `curl | grep` for Deploy Verification

**Mistake:** Running `curl https://ethoz.cl/ | grep "ETH"` to verify deploy, missing intermittent failures.

**Truth:** Piped curl can have buffering issues. Download the file first.

**Solution:**
```bash
curl -sI https://ethoz.cl/ | grep cache-control  # Check headers
curl -s https://ethoz.cl/ > /tmp/ethoz.html
grep -c "Ethoz" /tmp/ethoz.html                   # Check content
```

### 5. Agents Fabricate URLs and Blog Slugs

**Mistake:** Linking to `/blog/ley-21719-explicada` (doesn't exist) instead of actual slug `/blog/ley-21719-que-deben-saber-los-colegios`.

**Truth:** Blog slugs are auto-discovered from filenames. If file doesn't exist, the page 404s.

**Solution:** Always check `src/lib/data/posts/` for actual filenames before referencing blog posts.

**Real slugs:**
- `ley-21719-que-deben-saber-los-colegios`
- `circular-n30-libro-clases-digital`
- `multas-proteccion-datos-sostenedores`
- etc. (13 total)

### 6. Svelte 5 Template Parsing is Strict

**Mistake:** `{#each [] as { field: string }}` causes parse error (reads as destructuring, not type).

**Truth:** Svelte 5 destructures `{}` syntax. You can't inline types.

**Solution:**
```svelte
<!-- Good: Use plain variable, then {@const} for typing -->
{#each items as item}
  {@const typedItem = item as MyType}
  {typedItem.field}
{/each}

<!-- Or: No destructuring at all -->
{#each items as item}
  {item.field}
{/each}
```

### 7. Don't Hardcode Feature Page Count

**Mistake:** Documentation saying "5 feature pages" when actually 9 exist.

**Truth:** Check `src/routes/features/` before claiming a number. As of 2026-04-07, there are 9 features.

**Solution:** Always verify directory contents when documenting page counts.

---

## Security Architecture

### RLS (Row-Level Security)

All Supabase tables locked to admin UUID `169e6037-fcc2-4201-b2af-92547e1d6739`.

**Policy example:**
```sql
CREATE POLICY "admin_only" ON leads
  FOR ALL
  USING (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739'::uuid);
```

**Tables with RLS:**
- `leads` — Form submissions (contact, demo, etc.)
- `prospects` — Mineduc directory data + scoring
- `content_posts` — Draft/published posts
- `social_tokens` — OAuth access tokens

### Auth Flow

1. Admin logs in at `/admin` (email + password)
2. Supabase Auth creates session, stores in localStorage
3. Layout guard checks `adminStore.authenticated`
4. If not auth'd, redirect to `/admin` (login page)
5. Logout clears localStorage session

**Session location:** `localStorage['sb-[project-ref]-auth-token']`

### reCAPTCHA v3

All leads must pass server-side verification:

```typescript
// Server-side (Edge Function)
const token = request.body.recaptchaToken;
const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
  method: 'POST',
  body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
});
const { score } = await response.json();
if (score < 0.5) return new Response('Score too low', { status: 403 });
// Insert lead
```

### OAuth Tokens

Stored in `social_tokens` table with service role key:

| Field | Value |
|-------|-------|
| `platform` | 'google', 'linkedin', 'meta' |
| `access_token` | API token (encrypted in transit) |
| `refresh_token` | Refresh token (for expiry) |
| `token_expiry` | Timestamp of expiration |
| `org_id` | LinkedIn org ID (for company posts) |
| `page_id` | Facebook/Instagram page ID |

**Edge Function `social-publish` handles refresh before use.**

---

## shadcn-svelte Components Available

All in `$lib/components/ui/`:

| Component | Import | Use |
|-----------|--------|-----|
| Button | `$lib/components/ui/button` | All clickable buttons |
| Dialog | `$lib/components/ui/dialog` | Modals, confirmations |
| Table | `$lib/components/ui/table` | Data tables (admin only) |
| Select | `$lib/components/ui/select` | Dropdowns, filters |
| Input | `$lib/components/ui/input` | Text inputs |
| Label | `$lib/components/ui/label` | Form labels |
| Badge | `$lib/components/ui/badge` | Status tags |
| Tabs | `$lib/components/ui/tabs` | Tab navigation |
| Tooltip | `$lib/components/ui/tooltip` | Hover hints |
| Skeleton | `$lib/components/ui/skeleton` | Loading placeholders |
| Separator | `$lib/components/ui/separator` | Visual dividers |
| DropdownMenu | `$lib/components/ui/dropdown-menu` | Action menus |
| Sheet | `$lib/components/ui/sheet` | Slide-over panels |
| Sonner | `svelte-sonner` | Toast notifications |

**Add new components:**
```bash
npx shadcn-svelte add <component> --overwrite
```

---

## Edge Functions (7 Total)

Located at `supabase/functions/`. Deploy with:

```bash
supabase functions deploy [function-name] --project-ref [ref]
```

| Function | Purpose | Triggered by |
|----------|---------|--------------|
| `verify-lead` | reCAPTCHA check + lead insert | Form submission |
| `new-lead-notify` | Email/Slack alert on new lead | Database trigger |
| `social-publish` | Publish to LinkedIn/IG/FB/YT | Admin panel |
| `social-auth-google` | OAuth token exchange (Google) | Settings page |
| `social-auth-linkedin` | OAuth token exchange (LinkedIn) | Settings page |
| `social-auth-meta` | OAuth token exchange (Meta) | Settings page |
| `cal-webhook` | Cal.com booking webhook handler | Cal.com → webhook |

**Secrets for Edge Functions** (set via `supabase secrets set`):
```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
META_APP_ID
META_APP_SECRET
CAL_WEBHOOK_SECRET
RECAPTCHA_SECRET_KEY
```

---

## Verification Commands (Copy-Paste)

Quick audit suite to verify no regressions:

```bash
# Build
npm run build
echo "✓ Build successful"

# Security audit
npm run audit:security
echo "✓ Security audit passed"

# Tests
npx vitest run
echo "✓ Tests passed"

# Check hardcoded colors
/usr/bin/grep -rn "#[0-9A-Fa-f]\{6\}" src/routes/ --include="*.svelte" | /usr/bin/grep -v "#0F172A" | /usr/bin/grep -v "#25D366" | wc -l
# ^ Must be 0 (except Navy #0F172A and WhatsApp #25D366)

# Check dark: prefixes
/usr/bin/grep -rn "dark:" src/routes/ | wc -l
# ^ Must be 0

# Check svelte:component
/usr/bin/grep -rn "svelte:component" src/routes/ | wc -l
# ^ Must be 0

# Check raw alert/confirm
/usr/bin/grep -rn "\balert\|confirm\|prompt" src/routes/ --include="*.svelte" | wc -l
# ^ Must be 0

# Check deployed cache headers
curl -sI https://ethoz.cl/ | grep cache-control
# ^ Must include "max-age=0"

echo "✓ All checks passed — ready to deploy"
```

---

## Git Commit Message Format

When committing changes:

```
feat: [description]
fix: [description]
refactor: [description]
docs: [description]

Example:
feat: add /para-porteros page with porter-specific CTAs
fix: remove hardcoded color from admin table header
docs: update AGENTS.md with shadcn-svelte examples
```

**Never commit:**
- `.env.local` (secrets)
- `node_modules/`
- `build/` or `.svelte-kit/`
- `firebase-debug.log`

---

## Questions?

If an agent gets stuck:

1. Check `.impeccable.md` — Design system spec
2. Check `docs/1-landing/README.md` — All routes
3. Check `docs/2-admin/README.md` — Admin panel
4. Check `docs/4-content-generation/README.md` — Content pipeline
5. Check this file (AGENTS.md) — Critical rules
6. Ask in CLAUDE.md context for project background

**Remember:** The goal is to make Ethoz feel **trustworthy, simple, and professional.** Every decision should support that.

---

Generated: 2026-04-07 | Version: 1.0 | Next review: 2026-05-07
