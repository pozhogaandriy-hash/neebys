import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function getStartDate(range: string) {
  const now = new Date();

  switch (range) {
    case '30d':
      now.setDate(now.getDate() - 30);
      break;

    case '90d':
      now.setDate(now.getDate() - 90);
      break;

    case '7d':
    default:
      now.setDate(now.getDate() - 7);
      break;
  }

  return now;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '7d';

    const startDate = getStartDate(range);

    const { data: events, error } = await supabaseAdmin
      .from('analytics_events')
      .select(`
        id,
        session_id,
        user_id,
        event_type,
        page_url,
        referrer,
        user_agent,
        created_at
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', {
        ascending: true,
      });

    if (error) {
      console.error('Analytics database error:', error);

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    const rows = events || [];

    // =========================
    // SESSIONS
    // =========================

    const sessionIds = new Set(
      rows
        .map((event) => event.session_id)
        .filter(Boolean)
    );

    const totalSessions = sessionIds.size;

    // =========================
    // UNIQUE VISITORS
    // =========================

    const visitorIds = new Set(
      rows
        .filter((event) => event.user_id)
        .map((event) => event.user_id)
    );

    const anonymousSessions = new Set(
      rows
        .filter((event) => !event.user_id)
        .map((event) => event.session_id)
        .filter(Boolean)
    );

    const uniqueVisitors =
      visitorIds.size + anonymousSessions.size;

    // =========================
    // PAGE VIEWS
    // =========================

    const pageViews = rows.filter(
      (event) => event.event_type === 'page_view'
    );

    // =========================
    // SESSIONS BY DAY
    // =========================

    const sessionsByDay = new Map<
      string,
      Set<string>
    >();

    for (const event of rows) {
      if (!event.session_id) continue;

      const date = new Date(event.created_at)
        .toISOString()
        .slice(0, 10);

      if (!sessionsByDay.has(date)) {
        sessionsByDay.set(
          date,
          new Set<string>()
        );
      }

      sessionsByDay
        .get(date)!
        .add(event.session_id);
    }

    const trafficData = Array.from(
      sessionsByDay.entries()
    )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, sessions]) => ({
        label: new Date(date).toLocaleDateString(
          'en-US',
          {
            weekday: 'short',
          }
        ),
        sessions: sessions.size,
        date,
      }));

    // =========================
    // TOP PAGES
    // =========================

    const pageMap = new Map<string, number>();

    for (const event of pageViews) {
      if (!event.page_url) continue;

      let path = event.page_url;

      try {
        path = new URL(event.page_url).pathname;
      } catch {
        // Якщо URL некоректний — залишаємо як є
      }

      pageMap.set(
        path,
        (pageMap.get(path) || 0) + 1
      );
    }

    const topPages = Array.from(
      pageMap.entries()
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({
        path,
        views,
      }));

    // =========================
    // TRAFFIC SOURCES
    // =========================

    const sourceMap = new Map<string, number>();

    for (const event of rows) {
      let source = 'Direct';

      if (event.referrer) {
        try {
          const referrerUrl = new URL(
            event.referrer
          );

          const hostname =
            referrerUrl.hostname.toLowerCase();

          if (
            hostname.includes('google.') ||
            hostname.includes('bing.') ||
            hostname.includes('yahoo.')
          ) {
            source = 'Organic Search';
          } else if (
            hostname.includes('instagram.') ||
            hostname.includes('facebook.') ||
            hostname.includes('tiktok.') ||
            hostname.includes('youtube.')
          ) {
            source = 'Social';
          } else {
            source = 'Referral';
          }
        } catch {
          source = 'Referral';
        }
      }

      sourceMap.set(
        source,
        (sourceMap.get(source) || 0) + 1
      );
    }

    const totalTraffic = Array.from(
      sourceMap.values()
    ).reduce(
      (sum, value) => sum + value,
      0
    );

    const trafficSources = Array.from(
      sourceMap.entries()
    )
      .sort((a, b) => b[1] - a[1])
      .map(([source, sessions]) => ({
        source,
        sessions,
        pct:
          totalTraffic > 0
            ? Math.round(
                (sessions / totalTraffic) * 100
              )
            : 0,
      }));

    // =========================
    // RESULT
    // =========================

    return NextResponse.json({
      success: true,
      range,

      stats: {
        totalSessions,
        uniqueVisitors,
        pageViews: pageViews.length,
        trafficData,
        topPages,
        trafficSources,
      },
    });
  } catch (error) {
    console.error(
      'Admin analytics error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}