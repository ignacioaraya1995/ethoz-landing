-- Fix Supabase advisor: rls_disabled_in_public
-- Enables RLS on social_tokens (OAuth tokens for LinkedIn/Google/Meta publishing).
-- Admin-only access; Edge Functions use the service_role key which bypasses RLS.

ALTER TABLE IF EXISTS public.social_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_social_tokens" ON public.social_tokens;

CREATE POLICY "admin_all_social_tokens" ON public.social_tokens
  FOR ALL TO authenticated
  USING (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739')
  WITH CHECK (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739');
