const GA_MEASUREMENT_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '').trim();

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | null | undefined | object>;

export function analyticsEnabled(): boolean {
  return Boolean(GA_MEASUREMENT_ID);
}

export function getGaMeasurementId(): string {
  return GA_MEASUREMENT_ID;
}

export function trackPageView(path: string, title?: string) {
  if (!analyticsEnabled() || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (!analyticsEnabled() || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

export function trackException(description: string, fatal = false) {
  trackEvent('exception', {
    description,
    fatal,
  });
}
