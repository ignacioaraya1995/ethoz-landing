export function trackEvent(event: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event,
      ...params
    });
  }
}
