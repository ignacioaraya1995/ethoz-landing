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

-- Single-column index on visitor_id — no-op if already present
create index if not exists leads_visitor_id_idx on public.leads (visitor_id);
