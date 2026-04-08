# RUNBOOK.md — Operational Procedures

Step-by-step procedures for common operational tasks. Use these as checklists when performing production operations.

## 1. How to Deploy

**Timeline:** ~5-10 minutes | **Risk:** Medium (can roll back) | **Audience:** Dev leads, DevOps

### Pre-Deployment Checklist

```bash
# 1. Pull latest main
git fetch origin
git pull origin main

# 2. Verify no uncommitted changes
git status
# ^ Should show "working tree clean"

# 3. Install dependencies
npm install

# 4. Build
npm run build

# 5. Run security audit (MUST PASS)
npm run audit:security
# ^ Should show: "✓ All checks passed"

# 6. Run tests (MUST PASS)
npx vitest run
# ^ All tests should pass. If any fail, fix before deploy.

# 7. Verify no hardcoded issues
/usr/bin/grep -rn "dark:" src/routes/ | wc -l           # must be 0
/usr/bin/grep -rn "svelte:component" src/routes/ | wc -l # must be 0
/usr/bin/grep -rn "alert(" src/routes/ | wc -l           # must be 0
```

**If any check fails:** Do NOT proceed. Fix the issue, commit, and restart.

### Deployment Steps

```bash
# 1. Ensure logged in to Firebase
firebase login

# 2. Deploy to Firebase Hosting (BOTH sites automatically)
firebase deploy --only hosting

# Example output:
# ✔  Deploy complete!
# 
# Project Console: https://console.firebase.google.com/project/gestion-estudiantil-dev/overview
# Hosting URL: https://gestion-estudiantil-dev.web.app

# 3. Wait 30 seconds for CDN propagation
sleep 30

# 4. Verify deployment succeeded
curl -sI https://ethoz.cl/ | head -5
# ^ Should show HTTP/2 200 or 301 (redirect to HTTPS)

# 5. Check cache headers
curl -sI https://ethoz.cl/ | grep -i "cache-control"
# ^ Should show: Cache-Control: max-age=0, must-revalidate

# 6. Download and verify HTML
curl -s https://ethoz.cl/ > /tmp/ethoz-live.html
grep -q "Ethoz" /tmp/ethoz-live.html && echo "✓ Content verified" || echo "✗ Content check failed"

# 7. Test critical routes
curl -s https://ethoz.cl/demo | grep -q "busqueda" && echo "✓ /demo works"
curl -s https://ethoz.cl/admin | grep -q "Autenticaci" && echo "✓ /admin works"
curl -s https://ethoz.cl/blog | grep -q "Blog" && echo "✓ /blog works"

# 8. Check Sentry for new errors
# Open: https://sentry.io/organizations/ethoz/issues/?project=...
# Should show no new errors in last 5 minutes
```

### Post-Deployment

1. Check Firebase Console: `https://console.firebase.google.com/project/gestion-estudiantil-dev/hosting/sites`
2. Verify both sites show "Deployed" status (ethoz + gestion-estudiantil-dev)
3. Test on live site:
   - Home page loads
   - School search works
   - Form submission works (check Supabase logs)
   - Admin panel accessible
   - Blog posts load

### Rollback (If Something Goes Wrong)

```bash
# 1. Revert to previous git commit
git log --oneline | head -3
git revert [commit-hash]

# 2. Deploy again
npm run build
firebase deploy --only hosting

# 3. Verify rollback worked
curl -sI https://ethoz.cl/ | grep cache-control
```

---

## 2. How to Verify a Deploy

**Timeline:** ~2 minutes | **Risk:** None (read-only) | **Audience:** QA, product teams

Use this checklist after deployment to confirm everything works.

```bash
# 1. Check deployment status
firebase deploy:list
# ^ Last deployment should show today's date

# 2. Check HTTP headers
curl -sI https://ethoz.cl/ | head -10
# Expected:
# HTTP/2 200
# cache-control: max-age=0, must-revalidate
# content-type: text/html; charset=utf-8

# 3. Test home page loads
curl -s https://ethoz.cl/ | grep -q "Ethoz" && echo "✓ Home loads" || echo "✗ Home failed"

# 4. Test school search works
curl -s "https://ethoz.cl/api/schools?q=liceo" | wc -l
# ^ Should return JSON array (not empty)

# 5. Test form submission endpoint
curl -X POST https://ethoz.cl/api/verify-lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","recaptchaToken":"..."}' \
  | grep -q "status" && echo "✓ API works" || echo "✗ API failed"

# 6. Check admin login page
curl -s https://ethoz.cl/admin | grep -q "Contraseña" && echo "✓ Admin accessible" || echo "✗ Admin failed"

# 7. Check blog works
curl -s https://ethoz.cl/blog | grep -q "artículos" && echo "✓ Blog works" || echo "✗ Blog failed"

# 8. Check Sentry for errors
# Open: https://sentry.io/organizations/ethoz/issues/?environment=production
# Should show no new errors from last 5 minutes

# 9. Quick manual tests
# Open in browser:
# - https://ethoz.cl/          (home)
# - https://ethoz.cl/features/analytics (feature page)
# - https://ethoz.cl/blog      (blog index)
# - https://ethoz.cl/admin     (admin login)
# - https://ethoz.cl/demo      (demo search)
```

**All tests passing?** Deployment verified. ✓

**Any tests failing?** 
- Check recent logs: `supabase functions logs social-publish --project-ref [ref]`
- Check Sentry errors: `https://sentry.io/`
- Rollback if necessary

---

## 3. How to Reset a User's Supabase Session

**Timeline:** ~2 minutes | **Risk:** Low | **Audience:** Support, admins

Use when a user is stuck logged in or needs forced logout.

### Browser Session (localStorage)

```bash
# 1. Open browser DevTools (F12)
# 2. Go to Application > Local Storage > https://ethoz.cl
# 3. Find key: sb-[project-ref]-auth-token
# 4. Delete it
# 5. Refresh page

# Or via JavaScript console:
localStorage.removeItem('sb-[project-ref]-auth-token');
location.reload();
```

### Server-Side Session (Supabase)

```bash
# 1. Connect to Supabase
supabase login
supabase link --project-ref [ref]

# 2. Find the user in auth.users
supabase db execute 'SELECT id, email FROM auth.users WHERE email = "user@example.com";'

# 3. Delete the session
supabase db execute 'DELETE FROM auth.sessions WHERE user_id = "[user-id]";'

# 4. User is now logged out everywhere
```

### Reset Password

```bash
# If user forgot password:
# 1. Go to: https://supabase.com/dashboard/project/[ref]/auth/users
# 2. Find user by email
# 3. Click menu (⋮) > "Reset password"
# 4. Supabase sends password reset link to user's email
```

---

## 4. How to Rotate an API Key in `.env.local`

**Timeline:** ~10 minutes | **Risk:** High (causes downtime if key wrong) | **Audience:** DevOps only

Use when an API key is compromised or expires.

### Step-by-Step

```bash
# 1. Identify which key needs rotation
# Example: KIMI_API_KEY (text generation)

# 2. Generate new key from provider
# Kimi: https://platform.moonshot.cn/console/api-keys
# Gemini: https://aistudio.google.com/app/apikey
# Etc.

# 3. Update local .env.local
nano .env.local
# Find: KIMI_API_KEY=old_key
# Change to: KIMI_API_KEY=new_key
# Save and exit (Ctrl+X, Y, Enter)

# 4. Test locally
npm run dev -- --port 5177
# Run test command that uses the key:
# node scripts/generate-content.mjs --platform linkedin --count 1
# ^ Should work with new key

# 5. If Edge Function also needs the key, update secrets
supabase secrets set KIMI_API_KEY=new_key --project-ref [ref]

# 6. Deploy
npm run build
firebase deploy --only hosting

# 7. Verify
curl -s https://ethoz.cl/ | grep -q "Ethoz" && echo "✓ Deploy successful"

# 8. Disable old key at provider
# Go to API provider and revoke the old key
```

### Keys to Never Commit

```bash
# These should ONLY be in .env.local, never git history:
PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
KIMI_API_KEY
GEMINI_API_KEY
RECAPTCHA_SECRET_KEY
PUBLIC_SENTRY_DSN
SENTRY_AUTH_TOKEN
FIREBASE_TOKEN  (for CI/CD)
```

### Check Git History for Accidental Commits

```bash
# If a key was accidentally committed:
git log --oneline | head -10
git show [commit-hash] | grep -i "api_key"

# If found, the key is compromised. Immediately:
# 1. Revoke the key at the provider
# 2. Generate a new key
# 3. Update .env.local
# 4. `git revert [commit-hash]` to remove from history
# 5. Force-push (dangerous, coordinate with team)
```

---

## 5. How to Add a New Admin User

**Timeline:** ~5 minutes | **Risk:** Medium (security) | **Audience:** Admin lead

### Via Supabase Dashboard

```bash
# 1. Open Supabase dashboard
# https://supabase.com/dashboard/project/[ref]/auth/users

# 2. Click "Add user" (top right)

# 3. Fill form:
#    Email: newadmin@school.edu.cl
#    Password: [auto-generated or custom]
#    [Check] Email confirmed

# 4. Click "Create user"

# 5. Optionally send password reset email
# Menu (⋮) > "Send password reset email"

# 6. New user can now log in at https://ethoz.cl/admin
```

### Via Supabase CLI

```bash
# 1. Connect to project
supabase login
supabase link --project-ref [ref]

# 2. Create user with direct SQL
supabase db execute 'INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  "00000000-0000-0000-0000-000000000000",
  gen_random_uuid(),
  "authenticated",
  "authenticated",
  "newadmin@school.edu.cl",
  crypt("TempPassword123!", gen_salt("bf")),
  now(),
  now(),
  now()
);'

# 3. Send password reset email (user must set password)
# Use dashboard to send reset link
```

### Verify New User Can Log In

```bash
# 1. Open https://ethoz.cl/admin
# 2. Enter: newadmin@school.edu.cl + password
# 3. Should see admin dashboard
```

### Add User to RLS Bypass (Super Admin)

```bash
# By default, new users can't see data (RLS policy blocks them)
# To make them admin, add their UUID to RLS policy

# 1. Find user's UUID
supabase db execute 'SELECT id FROM auth.users WHERE email = "newadmin@school.edu.cl";'
# ^ Returns: id | [uuid-here]

# 2. Update RLS policy in Supabase dashboard
# Go to: SQL Editor > Create new query
# Paste and execute:
UPDATE leads
SET admin_uuid = '[new-uuid]'
WHERE admin_uuid = '169e6037-fcc2-4201-b2af-92547e1d6739';

# Or update the RLS policy definition itself:
ALTER POLICY "admin_only" ON leads
  USING (auth.uid() IN (
    '169e6037-fcc2-4201-b2af-92547e1d6739',
    '[new-uuid]'
  ));

# 3. New admin can now access `/admin/leads`, `/admin/content`, etc.
```

---

## 6. How to Purge Cloudflare Cache

**Timeline:** ~1 minute | **Risk:** None (just clears cache) | **Audience:** DevOps, performance teams

Use when content updates immediately and cache is stale.

### Via Cloudflare Dashboard

```bash
# 1. Open: https://dash.cloudflare.com/ > ethoz.cl > Caching > Configuration
# 2. Click "Purge Cache" (red button)
# 3. Select: "Purge Everything"
# 4. Wait ~30 seconds for purge to complete
```

### Via Cloudflare API

```bash
# 1. Get API token from Cloudflare dashboard
# Dashboard > Account > API Tokens > Create Token
# Scope: Zone.Cache Purge

# 2. Save token to .env.local
echo "CLOUDFLARE_API_TOKEN=your_token_here" >> .env.local

# 3. Purge from CLI
curl -X POST "https://api.cloudflare.com/client/v4/zones/[zone_id]/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'

# Response:
# {
#   "success": true,
#   "errors": [],
#   "messages": [],
#   "result": { "id": "..." }
# }
```

### Verify Cache Cleared

```bash
# Check cache age before/after
curl -sI https://ethoz.cl/ | grep "cf-cache-status"
# Should change from "HIT" → "MISS" after purge
```

---

## 7. How to Reconnect OAuth for Social Platforms

**Timeline:** ~10 minutes per platform | **Risk:** Medium (blocking publishing) | **Audience:** Marketing, admins

Use when OAuth tokens expire or need to be refreshed.

### LinkedIn OAuth

```bash
# 1. Visit https://ethoz.cl/admin/settings (logged in as admin)
# 2. Find "LinkedIn" section
# 3. Click "Conectar LinkedIn"
# 4. Redirect to LinkedIn OAuth consent screen
# 5. Click "Authorize"
# 6. Should redirect back to settings showing "Connected ✓"
# 7. Token saved to Supabase `social_tokens` table

# Check token in Supabase:
supabase db execute 'SELECT * FROM social_tokens WHERE platform = "linkedin";'
# ^ Should show access_token, refresh_token, token_expiry
```

### Instagram / Facebook (Meta)

```bash
# 1. Visit https://ethoz.cl/admin/settings (logged in as admin)
# 2. Find "Instagram / Facebook" section
# 3. Click "Conectar Meta"
# 4. Redirect to Meta login
# 5. Enter Facebook/Instagram credentials
# 6. Select business account to connect
# 7. Click "Allow" on permission screen
# 8. Should redirect back showing "Connected ✓"

# Required Facebook app settings:
# - App Domains: ethoz.cl, *.firebase.com
# - Redirect URIs: https://ethoz.cl/admin/settings
# - App roles: Must be admin or developer

# Check token in Supabase:
supabase db execute 'SELECT platform, page_id FROM social_tokens WHERE platform = "meta";'
# ^ Should show page_id (Instagram/Facebook page linked)
```

### Google / YouTube

```bash
# 1. Visit https://ethoz.cl/admin/settings (logged in as admin)
# 2. Find "YouTube" section
# 3. Click "Conectar Google"
# 4. Redirect to Google OAuth consent screen
# 5. Click "Allow" (grant access to YouTube account)
# 6. Should redirect back showing "Connected ✓"

# Check token in Supabase:
supabase db execute 'SELECT * FROM social_tokens WHERE platform = "google";'
# ^ Should show access_token, refresh_token, token_expiry
```

### Troubleshooting OAuth Failures

```bash
# 1. Check Edge Function logs
supabase functions logs social-auth-linkedin --project-ref [ref]
supabase functions logs social-auth-meta --project-ref [ref]
supabase functions logs social-auth-google --project-ref [ref]

# 2. Common errors:
# - "Invalid client_id": Check Edge Function secrets (LINKEDIN_CLIENT_ID, etc.)
# - "CSRF state mismatch": Browser cache issue, try private/incognito window
# - "Permission denied": User doesn't have admin role in Meta app
# - "Redirect URI mismatch": Check OAuth app settings vs Edge Function code

# 3. Reset tokens and try again
supabase db execute 'DELETE FROM social_tokens WHERE platform = "linkedin";'
# ^ Then reconnect
```

---

## 8. How to Debug a Failed Edge Function

**Timeline:** ~5 minutes | **Risk:** None (read-only) | **Audience:** DevOps, developers

Use when `social-publish`, `verify-lead`, etc. fail.

### Check Logs

```bash
# 1. View real-time logs
supabase functions logs social-publish --project-ref [ref] --tail

# 2. Example output:
# FunctionInvokedResponse
# 2026-04-07T10:30:45.123Z: Starting social-publish
# 2026-04-07T10:30:46.234Z: ERROR: Invalid refresh token
# 2026-04-07T10:30:47.345Z: Function failed

# 3. For specific invocation, find the error timestamp
# Search logs before/after that timestamp for context
```

### Common Function Issues

| Function | Error | Solution |
|----------|-------|----------|
| `verify-lead` | "reCAPTCHA score too low" | Check reCAPTCHA_SECRET_KEY in secrets |
| `social-publish` | "Invalid refresh token" | Reconnect OAuth in `/admin/settings` |
| `social-publish` | "Rate limited" | Wait 1 hour, retry. Check API quota. |
| `new-lead-notify` | "SMTP auth failed" | Check email credentials in secrets |
| `cal-webhook` | "Signature verification failed" | Check CAL_WEBHOOK_SECRET matches Cal.com |

### Debug Steps

```bash
# 1. Check function exists
supabase functions list --project-ref [ref]
# ^ Should show: social-publish, verify-lead, new-lead-notify, etc.

# 2. Check function secrets
supabase secrets list --project-ref [ref]
# ^ Should show: LINKEDIN_CLIENT_ID, RECAPTCHA_SECRET_KEY, etc.

# 3. If secret is wrong, update it
supabase secrets set LINKEDIN_CLIENT_SECRET="new_value" --project-ref [ref]

# 4. Deploy function again
supabase functions deploy social-publish --project-ref [ref]

# 5. Test manually
curl -X POST https://[project].supabase.co/functions/v1/social-publish \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{"postId":"[uuid]","platform":"linkedin"}' \
  | jq

# 6. Check response for error details
```

### View Function Code

```bash
# If you need to check function code locally:
cat supabase/functions/social-publish/index.ts

# Common issues to look for:
# - Missing error handling (try/catch)
# - Hardcoded secrets (should use Deno.env.get)
# - Wrong API endpoints
# - Missing headers (Authorization, Content-Type)
```

---

## 9. How to Add a New Page to the Sitemap

**Timeline:** ~5 minutes | **Risk:** Low | **Audience:** Developers, content teams

Use when adding a new route that should be in search engines.

### Check Current Sitemap

```bash
# 1. Open in browser: https://ethoz.cl/sitemap.xml
# 2. Should list all public routes

# 3. Check if file exists locally
cat src/routes/sitemap.xml/+server.ts
# ^ SvelteKit auto-generates sitemap from routes

# Or check if manually-created:
ls -la static/sitemap.xml
```

### Add New Page

**Option 1: Auto-generated (recommended)**

```bash
# 1. Create new route directory
mkdir -p src/routes/nuevo-pagina

# 2. Create page file
touch src/routes/nuevo-pagina/+page.svelte

# 3. SvelteKit automatically includes in sitemap

# 4. Deploy and verify
npm run build
grep "nuevo-pagina" build/output/sitemap.xml
```

**Option 2: Manual sitemap**

```bash
# 1. Edit static/sitemap.xml
nano static/sitemap.xml

# 2. Add entry (if auto-generation disabled):
<url>
  <loc>https://ethoz.cl/nuevo-pagina</loc>
  <lastmod>2026-04-07</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>

# 3. Save and deploy
```

### Verify in Google Search Console

```bash
# 1. Open: https://search.google.com/search-console
# 2. Select property: ethoz.cl
# 3. Go to: Sitemaps > Submit new sitemap
# 4. Paste: https://ethoz.cl/sitemap.xml
# 5. Google crawls and indexes new page (24-48 hours)

# Or request indexing immediately:
# URL Inspection > Paste URL > "Request indexing"
```

---

## 10. How to Add a New Blog Post

**Timeline:** ~15 minutes | **Risk:** Low | **Audience:** Developers, content teams

Use when publishing a new blog article.

### Create Post File

```bash
# 1. Create new file in src/lib/data/posts/
touch src/lib/data/posts/nuevo-articulo-titulo.ts

# 2. Use this template:
cat > src/lib/data/posts/nuevo-articulo-titulo.ts << 'EOF'
import type { Post } from './types';

export const post: Post = {
  slug: 'nuevo-articulo-titulo',
  title: 'Título del Artículo',
  date: '2026-04-07',
  excerpt: 'Resumen corto de 1-2 líneas para preview.',
  content: `# Título del Artículo

Párrafo introductorio aquí...

## Sección 1

Contenido de la sección.

## Sección 2

Más contenido.

## Conclusión

Resumen y CTA.
  `,
  tags: ['cumplimiento', 'seguridad', 'ethoz'],
  author: 'Equipo Ethoz',
  image: '/images/posts/nuevo-articulo-titulo.jpg'
};

export default post;
EOF

# 3. Update src/lib/data/posts/index.ts to include new post
nano src/lib/data/posts/index.ts

# Add to the array:
import { post as nuevoArticulo } from './nuevo-articulo-titulo';

export const posts = [
  // ... existing posts
  nuevoArticulo,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
```

### Generate Cover Image (Optional)

```bash
# 1. Create cover image (1200x630px) using Gemini
node scripts/generate-covers.mjs --slug "nuevo-articulo-titulo"

# 2. Or upload manually to: static/images/posts/nuevo-articulo-titulo.jpg

# 3. Test image loads
curl -I https://ethoz.cl/images/posts/nuevo-articulo-titulo.jpg
# ^ Should return HTTP 200
```

### Publish

```bash
# 1. Build locally
npm run build

# 2. Test post appears in blog index
npm run dev -- --port 5177
# Open: http://localhost:5177/blog
# ^ Should see new post in list

# 3. Test individual post
# Open: http://localhost:5177/blog/nuevo-articulo-titulo
# ^ Should render full post with content

# 4. Deploy
firebase deploy --only hosting

# 5. Verify live
curl -s https://ethoz.cl/blog | grep -q "nuevo-articulo-titulo" && echo "✓ Post published"
```

### Update Sitemap

```bash
# 1. If using auto-generated sitemap, it updates automatically
grep "nuevo-articulo-titulo" https://ethoz.cl/sitemap.xml

# 2. If manual, add entry:
nano static/sitemap.xml
# Add:
# <url>
#   <loc>https://ethoz.cl/blog/nuevo-articulo-titulo</loc>
#   <lastmod>2026-04-07</lastmod>
#   <changefreq>never</changefreq>
#   <priority>0.7</priority>
# </url>

# 3. Submit to Google Search Console
```

---

## Emergency Contacts & Escalation

| Issue | Contact | Response Time |
|-------|---------|----------------|
| Site down | DevOps lead | 5 minutes |
| Data breach | Security officer | Immediate |
| Database corruption | Database admin | 15 minutes |
| OAuth not working | Integration lead | 30 minutes |
| Deploy failure | Release lead | 10 minutes |
| Performance degradation | Infrastructure team | 30 minutes |

**Escalation path:**
1. Try troubleshooting (use runbook steps)
2. Check logs (Sentry, Firebase, Supabase)
3. Notify immediate contact
4. If critical (site down), notify team lead
5. If data impact, notify CTO

---

## Useful Links

- **Firebase Console:** https://console.firebase.google.com/project/gestion-estudiantil-dev
- **Supabase Dashboard:** https://supabase.com/dashboard/project/[ref]
- **Sentry Errors:** https://sentry.io/organizations/ethoz/issues/?project=...
- **Google Search Console:** https://search.google.com/search-console
- **Cloudflare Dashboard:** https://dash.cloudflare.com/ > ethoz.cl
- **Cal.com Schedule:** https://cal.com/[username]/availability
- **GitHub Repo:** (set in CLAUDE.md context)

---

Generated: 2026-04-07 | Maintained by: Ethoz operations team | Last updated: [date]
