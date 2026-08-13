import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      session_id,
      user_id,
      event_type,
      page_url,
      referrer,
      user_agent,
    } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        session_id,
        user_id: user_id || null,
        event_type: event_type || 'page_view',
        page_url: page_url || null,
        referrer: referrer || null,
        user_agent: user_agent || null,
      });

    if (error) {
      console.error('Analytics insert error:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Analytics track error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}