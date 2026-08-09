import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Gymfriends',
    template: '%s | Gymfriends',
  },
  description:
    'Преміальний спортивний одяг для тих, хто не шукає компромісів. Агресивний стиль. Технологічні матеріали.',
  metadataBase: new URL('https://gymfriends.com.ua'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        {process.env.NODE_ENV === 'production' &&
          process.env.NEXT_PUBLIC_PIRSCH_TOKEN && (
            <script
              defer
              src="https://api.pirsch.io/pa.js"
              id="pianjs"
              data-code={process.env.NEXT_PUBLIC_PIRSCH_TOKEN}
            />
          )}
      </head>
      <body>{children}</body>
    </html>
  );
}
