import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

let initialized = false;

export async function initSentry(): Promise<void> {
  if (!browser || initialized) return;

  const dsn = env.PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.info('[Sentry] No DSN configured — error monitoring disabled');
    return;
  }

  try {
    const Sentry = await import('@sentry/browser');
    Sentry.init({
      dsn,
      environment: window.location.hostname === 'ethoz.cl' ? 'production' : 'development',
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0.5,
      beforeSend(event) {
        // Don't send events for internal users
        if (localStorage.getItem('ethoz_internal') === '1') return null;
        // Suppress test-runner + local-dev traffic (Playwright, local preview server)
        const ua = (event.request?.headers?.['User-Agent'] as string | undefined) ?? '';
        const url = event.request?.url ?? '';
        if (ua.includes('HeadlessChrome') || ua.includes('Playwright')) return null;
        if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) return null;
        return event;
      },
    });
    initialized = true;
    console.info('[Sentry] ✔ Error monitoring active');
  } catch (err) {
    console.warn('[Sentry] Failed to initialize:', err);
  }
}
