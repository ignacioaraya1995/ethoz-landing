/**
 * verify-lead — Server-side reCAPTCHA verification + lead insertion
 *
 * Receives lead data + reCAPTCHA token, verifies with Google,
 * inserts into Supabase, and triggers notification.
 *
 * Deploy:
 *   supabase functions deploy verify-lead --project-ref irpesrcijcdwyjxxwpyb
 *
 * Secrets required:
 *   RECAPTCHA_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { sendGa4Event } from '../_shared/ga4.ts';

const RECAPTCHA_SECRET = Deno.env.get('RECAPTCHA_SECRET_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MIN_SCORE = 0.5;

interface LeadPayload {
  school_name: string;
  school_rbd?: number;
  school_commune?: string;
  contact_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone?: string;
  contact_source?: string;
  notes?: string;
  status?: string;
  visitor_id?: string;
  metadata?: Record<string, unknown>;
  recaptcha_token?: string;
  // Attribution (populated client-side by captureAttribution)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  li_fat_id?: string;
  msclkid?: string;
  referrer?: string;
  landing_page?: string;
  first_touch_at?: string;
  last_touch_at?: string;
}

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function verifyRecaptcha(token: string): Promise<{ success: boolean; score: number }> {
  if (!RECAPTCHA_SECRET) {
    console.warn('[verify-lead] RECAPTCHA_SECRET_KEY not configured — skipping verification');
    return { success: true, score: 1.0 };
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET,
        response: token,
      }),
    });

    const data = await res.json();
    return { success: data.success === true, score: data.score ?? 0 };
  } catch (err) {
    console.error('[verify-lead] reCAPTCHA verification error:', err);
    return { success: false, score: 0 };
  }
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const payload: LeadPayload = await req.json();

    // Basic validation
    if (!payload.contact_name?.trim() || !payload.contact_email?.trim() || !payload.contact_role?.trim()) {
      return json({ error: 'Missing required fields: contact_name, contact_email, contact_role' }, 400);
    }

    // Verify reCAPTCHA token
    const token = payload.recaptcha_token;
    if (!token) {
      return json({ error: 'Missing reCAPTCHA token' }, 400);
    }

    const { success, score } = await verifyRecaptcha(token);
    if (!success || score < MIN_SCORE) {
      console.warn(`[verify-lead] reCAPTCHA failed: success=${success}, score=${score}, email=${payload.contact_email.slice(0, 3)}***`);
      return json({ error: 'Security verification failed. Please try again.' }, 403);
    }

    // Insert lead using service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const leadData = {
      school_name: payload.school_name || '',
      school_rbd: payload.school_rbd || null,
      school_commune: payload.school_commune || null,
      contact_name: payload.contact_name.trim(),
      contact_role: payload.contact_role.trim(),
      contact_email: payload.contact_email.trim().toLowerCase(),
      contact_phone: payload.contact_phone?.trim() || null,
      contact_source: payload.contact_source || null,
      notes: payload.notes || null,
      status: payload.status || 'new',
      visitor_id: payload.visitor_id || null,
      metadata: payload.metadata || null,
      utm_source: payload.utm_source || null,
      utm_medium: payload.utm_medium || null,
      utm_campaign: payload.utm_campaign || null,
      utm_content: payload.utm_content || null,
      utm_term: payload.utm_term || null,
      gclid: payload.gclid || null,
      fbclid: payload.fbclid || null,
      li_fat_id: payload.li_fat_id || null,
      msclkid: payload.msclkid || null,
      referrer: payload.referrer || null,
      landing_page: payload.landing_page || null,
      first_touch_at: payload.first_touch_at || null,
      last_touch_at: payload.last_touch_at || null,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from('leads').insert([leadData]);

    if (insertError) {
      console.error('[verify-lead] Insert error:', insertError.message);
      return json({ error: 'Failed to save lead' }, 500);
    }

    // Trigger notification (fire-and-forget, internal call with service role)
    try {
      const notifySecret = Deno.env.get('LEAD_NOTIFY_SECRET');
      if (notifySecret) {
        fetch(`${SUPABASE_URL}/functions/v1/new-lead-notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-secret': notifySecret,
          },
          body: JSON.stringify({ record: leadData }),
        }).catch(() => {}); // Silent — don't block lead insertion
      }
    } catch {
      // Notification failure should never block lead save
    }

    // GA4 MP backup — fires even when client consent denies GTM.
    if (payload.visitor_id) {
      sendGa4Event(payload.visitor_id, {
        name: 'lead_submitted',
        params: {
          source: payload.contact_source || 'unknown',
          school_name: payload.school_name || '',
          utm_source: payload.utm_source || '',
          utm_medium: payload.utm_medium || '',
          utm_campaign: payload.utm_campaign || '',
        },
      }).catch(() => {});
    }

    console.info(`[verify-lead] Lead saved: ${payload.contact_email.slice(0, 3)}*** (score: ${score})`);
    return json({ ok: true });
  } catch (err) {
    console.error('[verify-lead] Unexpected error:', err);
    return json({ error: 'Internal error' }, 500);
  }
});
