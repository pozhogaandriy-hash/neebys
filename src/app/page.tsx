import { HeroCarousel } from '@/components/HeroCarousel';
import { TabbedProductArray } from '@/components/TabbedProductArray';
import { CategoryMosaic } from '@/components/CategoryMosaic';
import { ScrollingMarquee } from '@/components/ScrollingMarquee';
import { EditorialSplit } from '@/components/EditorialSplit';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { PageShell } from '@/components/PageShell';

export const metadata = {
  title: 'Gymfriends — Преміальний спортивний одяг',
  description: 'Преміальний спортивний одяг для тих, хто не шукає компромісів. Агресивний стиль. Технологічні матеріали. Нові колекції щосезону.',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Gymfriends — Преміальний спортивний одяг',
    description: 'Преміальний спортивний одяг для тих, хто не шукає компромісів. Агресивний стиль. Технологічні матеріали.',
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
