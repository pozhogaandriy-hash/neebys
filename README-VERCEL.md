# Gymfriends — Vercel-ready export

This version removes Kite's proprietary `@appsmithorg/*` dependencies.

## What was replaced

- Kite editor/dev error overlay → removed from production runtime.
- Kite global error page helpers → replaced with a standalone Next.js error page.
- Kite contact-form API → replaced with `POST /api/contact`.
- Kite analytics/conversion hooks → removed. Optional Pirsch analytics remains.
- Kite-specific npm registry → removed from `.npmrc`.

## Vercel

Import this repository into Vercel.

Build command:
`next build`

Install command:
`pnpm install`

Node.js:
`22.x`

Optional environment variables:

- `NEXT_PUBLIC_PIRSCH_TOKEN`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

If Telegram variables are set, contact-form submissions are sent to the configured Telegram chat. Otherwise the API accepts the submission and logs it on the server.

## Important

The admin dashboard, users, products, analytics and roles in this export currently use local/mock data from `src/data/auth.ts`. They are UI/demo data, not a real database-backed admin system.

The Google sign-in code is also frontend-only. It does not create a secure server-side session and should not be treated as production authentication until it is connected to a real auth provider.
