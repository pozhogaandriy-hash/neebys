import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CatalogView } from '@/components/CatalogView';
import { PageShell } from '@/components/PageShell';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Каталог',
  description:
    'Каталог преміального спортивного одягу Gymfriends — футболки, худі, шорти, аксесуари та більше.',
  alternates: { canonical: '/catalog' },
  openGraph: {
    url: '/catalog',
    title: 'Каталог | Gymfriends',
    description:
      'Каталог преміального спортивного одягу Gymfriends — футболки, худі, шорти, аксесуари та більше.',
  },
};

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    collection?: string;
  }>;
}

export default async function CatalogPage({
  searchParams,
}: CatalogPageProps) {
  const { category, collection } = await searchParams;

  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      sku,
      price,
      sale_price,
      category,
      image,
      images,
      stock,
      sales,
      status,
      featured,
      sizes,
      colors,
      created_at,
      updated_at
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Catalog products error:', error);
  }

  return (
    <PageShell>
      <main
        className="min-h-screen"
        style={{
          backgroundColor: 'var(--gf-bg)',
          color: 'var(--gf-text)',
        }}
      >
        <Header />

        <CatalogView
          products={products || []}
          category={category}
          collection={collection}
        />

        <Footer />
      </main>
    </PageShell>
  );
}