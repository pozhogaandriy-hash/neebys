import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function clean(value: unknown, max = 2000) {
  return String(value ?? '').trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstname = clean(body.firstname, 80);
    const lastname = clean(body.lastname, 80);
    const email = clean(body.email, 160);
    const phone = clean(body.phone, 60);
    const message = clean(body.message, 2000);

    if (!firstname || !lastname || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email' },
        { status: 400 },
      );
    }

    const text = [
      '🏋️ GYMFRIENDS — нова заявка',
      '',
      `Імʼя: ${firstname} ${lastname}`,
      `Email: ${email}`,
      `Телефон: ${phone}`,
      `Повідомлення: ${message || '—'}`,
    ].join('\\n');

    // Optional: set these Vercel Environment Variables to receive
    // contact requests directly in Telegram.
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
          }),
        },
      );

      if (!telegramResponse.ok) {
        console.error('Telegram contact notification failed');
      }
    } else {
      console.log(text);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'contact-form' });
}
