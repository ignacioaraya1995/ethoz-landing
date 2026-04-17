/**
 * GA4 Measurement Protocol — server-side conversion backup.
 *
 * Used from edge functions when a high-value event happens and we can
 * no longer rely on client-side GTM (e.g., user rejected consent,
 * adblocker, browser closed between form submit and Cal.com callback).
 *
 * Secrets (set via `supabase secrets set`):
 *   GA4_MEASUREMENT_ID   — the "G-XXXXXXX" measurement ID
 *   GA4_API_SECRET       — the Measurement Protocol API secret
 *
 * Both must be set for events to ship. If either is missing, the
 * function silently no-ops — never blocks the caller.
 */

export interface Ga4Event {
  name: string;
  params?: Record<string, string | number | boolean>;
}

/** Fire-and-forget send. Never throws. */
export async function sendGa4Event(
  clientId: string,
  event: Ga4Event
): Promise<void> {
  const measurementId = Deno.env.get('GA4_MEASUREMENT_ID');
  const apiSecret = Deno.env.get('GA4_API_SECRET');

  if (!measurementId || !apiSecret || !clientId) return;

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          events: [event],
        }),
      }
    );
  } catch (err) {
    console.warn('[ga4] Measurement Protocol send failed:', err);
  }
}

/** Derive a stable client_id from a visitor_id (preferred) or hashed IP fallback. */
export function resolveClientId(
  visitorId: string | null | undefined,
  ipHash: string | null | undefined
): string {
  return visitorId || ipHash || '';
}
