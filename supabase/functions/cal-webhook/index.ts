/**
 * Cal.com Webhook → Supabase Lead Status Update
 *
 * Receives BOOKING_CREATED / BOOKING_RESCHEDULED from Cal.com,
 * finds the matching lead by attendee email, and updates status
 * to 'demo_scheduled'.
 *
 * Deploy:
 *   supabase functions deploy cal-webhook --project-ref irpesrcijcdwyjxxwpyb
 *
 * Set secrets:
 *   supabase secrets set CAL_WEBHOOK_SECRET=<your-cal-webhook-secret> --project-ref irpesrcijcdwyjxxwpyb
 *
 * Configure in Cal.com:
 *   Settings → Developer → Webhooks → Add
 *   URL: https://irpesrcijcdwyjxxwpyb.supabase.co/functions/v1/cal-webhook
 *   Events: BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED
 *   Secret: <same secret you set above>
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendGa4Event } from '../_shared/ga4.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://app.cal.com',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-cal-signature-256',
};

// ── Webhook signature verification ──
async function verifySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const expected = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return expected === signature;
  } catch {
    return false;
  }
}

// ── Helpers ──
function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ── Main handler ──
Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = await req.text();

    // ── Verify signature (mandatory) ──
    const webhookSecret = Deno.env.get('CAL_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('[cal-webhook] CAL_WEBHOOK_SECRET not configured');
      return json({ error: 'Webhook not configured' }, 500);
    }
    const signature = req.headers.get('x-cal-signature-256') ?? '';
    const valid = await verifySignature(body, signature, webhookSecret);
    if (!valid) {
      console.error('[cal-webhook] Invalid signature');
      return json({ error: 'Invalid signature' }, 401);
    }

    const payload = JSON.parse(body);
    const { triggerEvent, payload: booking } = payload;

    // ── Handle cancellations ──
    if (triggerEvent === 'BOOKING_CANCELLED') {
      const email = booking?.attendees?.[0]?.email?.toLowerCase();
      if (!email) return json({ ok: true, ignored: 'no email' });

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const { data: leads } = await supabase
        .from('leads')
        .select('id')
        .eq('contact_email', email)
        .eq('status', 'demo_scheduled')
        .order('created_at', { ascending: false })
        .limit(1);

      if (leads?.length) {
        await supabase
          .from('leads')
          .update({ status: 'new', notes: 'Booking cancelled via Cal.com' })
          .eq('id', leads[0].id);
        console.info(`[cal-webhook] Lead ${leads[0].id} reverted to 'new' (cancelled)`);
      }

      return json({ ok: true, action: 'cancelled' });
    }

    // ── Only process bookings ──
    if (!['BOOKING_CREATED', 'BOOKING_RESCHEDULED'].includes(triggerEvent)) {
      return json({ ok: true, ignored: triggerEvent });
    }

    // ── Extract attendee email ──
    const attendeeEmail = booking?.attendees?.[0]?.email?.toLowerCase();
    if (!attendeeEmail) {
      console.warn('[cal-webhook] No attendee email in payload');
      return json({ ok: true, warning: 'no attendee email' });
    }

    // ── Supabase client (service role — bypasses RLS) ──
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── Find matching lead ���─
    const { data: leads, error: selectError } = await supabase
      .from('leads')
      .select('id, status, visitor_id, school_name, utm_source, utm_medium, utm_campaign')
      .eq('contact_email', attendeeEmail)
      .in('status', ['new', 'contacted'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (selectError) {
      console.error('[cal-webhook] Select error:', selectError.message);
      return json({ error: 'Internal error' }, 500);
    }

    if (!leads?.length) {
      // Already updated by client-side or no matching lead
      console.info(`[cal-webhook] No pending lead for ${attendeeEmail}`);
      return json({ ok: true, already_updated: true });
    }

    // ── Update lead (idempotent) ──
    const notes = [
      `Booking: ${booking?.title ?? 'Demo'}`,
      `Date: ${booking?.startTime ?? 'N/A'}`,
      `Cal ID: ${booking?.uid ?? 'N/A'}`,
      triggerEvent === 'BOOKING_RESCHEDULED' ? '(rescheduled)' : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'demo_scheduled', notes })
      .eq('id', leads[0].id);

    if (updateError) {
      console.error('[cal-webhook] Update error:', updateError.message);
      return json({ error: 'Internal error' }, 500);
    }

    // GA4 MP backup — fires independently of client-side GTM.
    const lead = leads[0] as {
      id: string;
      visitor_id?: string;
      school_name?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
    };
    if (lead.visitor_id) {
      sendGa4Event(lead.visitor_id, {
        name: 'demo_booked',
        params: {
          school_name: lead.school_name || '',
          utm_source: lead.utm_source || '',
          utm_medium: lead.utm_medium || '',
          utm_campaign: lead.utm_campaign || '',
          rescheduled: triggerEvent === 'BOOKING_RESCHEDULED',
        },
      }).catch(() => {});
    }

    console.info(
      `[cal-webhook] Lead ${lead.id} → demo_scheduled (${attendeeEmail})`
    );
    return json({ ok: true, lead_id: lead.id });
  } catch (err) {
    console.error('[cal-webhook] Unexpected error:', err);
    return json({ error: 'Internal error' }, 500);
  }
});
