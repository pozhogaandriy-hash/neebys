'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId() {
  try {
    const existing =
      localStorage.getItem(
        'gf-analytics-session'
      );

    if (existing) {
      return existing;
    }

    const id =
      crypto.randomUUID();

    localStorage.setItem(
      'gf-analytics-session',
      id
    );

    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const sessionId =
      getSessionId();

    const sendAnalytics = async () => {
      try {
        await fetch(
          '/api/analytics/track',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              session_id: sessionId,
              page_path: pathname,
              referrer:
                document.referrer ||
                null,
              user_agent:
                navigator.userAgent,
            }),
            keepalive: true,
          }
        );
      } catch (error) {
        console.error(
          'Analytics tracking failed:',
          error
        );
      }
    };

    sendAnalytics();
  }, [pathname]);

  return null;
}