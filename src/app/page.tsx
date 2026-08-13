import { HeroCarousel } from '@/components/HeroCarousel';
import { TabbedProductArray } from '@/components/TabbedProductArray';
import { CategoryMosaic } from '@/components/CategoryMosaic';
import { ScrollingMarquee } from '@/components/ScrollingMarquee';
import { EditorialSplit } from '@/components/EditorialSplit';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { PageShell } from '@/components/PageShell';

export const metadata = {
  title: 'Neebys shop',
  description: 'Premium sportswear for those who don\'t look for compromises. Technological materials. New collections every season.',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Neebys shop',
    description: 'Premium sportswear for those who don\'t look for compromises. Technological materials. New collections every season.',
    images: ['https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-hero-1.png'],
  },
};

export default function Home() {
  return (
    <PageShell>
      <main className="min-h-screen" style={{ backgroundColor: 'var(--gf-bg)', color: 'var(--gf-text)' }}>
        <Header />
        <HeroCarousel />
        <TabbedProductArray />
        <CategoryMosaic />
        <ScrollingMarquee />
        <EditorialSplit />
        <Footer />
      </main>
    </PageShell>
  );
}
