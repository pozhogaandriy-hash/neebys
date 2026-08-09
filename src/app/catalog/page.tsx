import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CatalogView } from '@/components/CatalogView';
import { PageShell } from '@/components/PageShell';

export const metadata = {
  title: 'Каталог',
  description: 'Каталог преміального спортивного одягу Gymfriends — футболки, худі, шорти, аксесуари та більше.',
  alternates: { canonical: '/catalog' },
  openGraph: {
    url: '/catalog',
    title: 'Каталог | Gymfriends',
    description: 'Каталог преміального спортивного одягу Gymfriends — футболки, худі, шорти, аксесуари та більше.',
    images: ['https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-1.png'],
  },
};

interface CatalogPageProps {
  searchParams: Promise<{ category?: string; collection?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category, collection } = await searchParams;

  return (
    <PageShell>
      <main className="min-h-screen" style={{ backgroundColor: "var(--gf-bg)", color: "var(--gf-text)" }}>
        <Header />
        <CatalogView category={category} collection={collection} />
        <Footer />
      </main>
    </PageShell>
  );
}
