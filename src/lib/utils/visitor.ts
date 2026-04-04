import { browser } from '$app/environment';

const STORAGE_KEY = 'ethoz_vid';

/** Get or create a persistent visitor ID for cross-platform matching */
export function getVisitorId(): string {
  if (!browser) return '';

  let vid = localStorage.getItem(STORAGE_KEY);
  if (!vid) {
    vid = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, vid);
  }
  return vid;
}

/** Identify visitor in GA4 via dataLayer */
export function identifyGA4(vid: string): void {
  if (!browser || !vid) return;
  const dl = (window as any).dataLayer;
  if (!dl) return;
  dl.push({ user_id: vid, ethoz_visitor_id: vid });
}

/** Identify visitor in Microsoft Clarity */
export function identifyClarity(vid: string): void {
  if (!browser || !vid) return;
  const clarity = (window as any).clarity;
  if (typeof clarity === 'function') {
    clarity('identify', vid);
  }
}

/** Identify visitor across all platforms */
export function identifyVisitor(): string {
  const vid = getVisitorId();
  if (vid) {
    identifyGA4(vid);
    identifyClarity(vid);
  }
  return vid;
}
