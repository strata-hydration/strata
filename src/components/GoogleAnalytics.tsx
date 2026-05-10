'use client';

import { useEffect, useMemo, useRef } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { analyticsEnabled, getGaMeasurementId, trackEvent, trackPageView } from '@/lib/analytics';

const SESSION_REF_KEY = 'strata.analytics.lastPath';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const measurementId = useMemo(() => getGaMeasurementId(), []);
  const lastTrackedPath = useRef<string>('');

  const routePath = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!analyticsEnabled()) return;

    const previousPath =
      lastTrackedPath.current ||
      (typeof window !== 'undefined' ? window.sessionStorage.getItem(SESSION_REF_KEY) ?? '' : '');

    trackPageView(routePath, typeof document !== 'undefined' ? document.title : undefined);

    if (previousPath && previousPath !== routePath) {
      trackEvent('route_transition', {
        from_path: previousPath,
        to_path: routePath,
      });
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_REF_KEY, routePath);
    }
    lastTrackedPath.current = routePath;
  }, [routePath]);

  useEffect(() => {
    if (!analyticsEnabled()) return;

    const milestones = new Set([25, 50, 75, 90]);
    const reached = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const height = doc.scrollHeight - doc.clientHeight;
      if (height <= 0) return;
      const percent = Math.round((window.scrollY / height) * 100);

      milestones.forEach((milestone) => {
        if (percent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          trackEvent('scroll_depth', {
            percent_scrolled: milestone,
            page_path: routePath,
          });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [routePath]);

  useEffect(() => {
    if (!analyticsEnabled()) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a');
      if (!anchor?.href) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin === window.location.origin) return;

      trackEvent('outbound_click', {
        link_url: url.href,
        link_domain: url.hostname,
        page_path: routePath,
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [routePath]);

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: false,
            anonymize_ip: true,
            transport_type: 'beacon'
          });
        `}
      </Script>
    </>
  );
}
