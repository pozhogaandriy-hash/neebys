import type { Metadata } from 'next';
import './globals.css';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export const metadata: Metadata = {
  title: {
    default: 'Neebys',
    template: '%s | Neebys',
  },
  description:
    'Neebys is a online clothes store',
  metadataBase: new URL('https://neebys.com'),
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
     <body>
  <AnalyticsTracker />

  {children}
</body>
    </html>
  );
}
