'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageShell } from '@/components/PageShell';
import { headingFont, bodyFont } from '@/app/fonts';
import { products } from '@/data/content';
import { useCart, parsePriceNum } from '@/context/CartContext';
import { useT } from '@/context/LangContext';

const TAG_KEYS: Record<string, string> = {
  'НОВИНКА': 'tag_new',
  'УНІСЕКС': 'tag_unisex',
  'ХІТ': 'tag_hit',
  'ЖІНОЧА': 'tag_womens',
  'БАЗОВИЙ': 'tag_basic',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <PageShell>
      <ProductDetail product={product} />
    </PageShell>
  );
}

function ProductDetail({ product }: { product: (typeof products)[number] }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { addItem, openDrawer } = useCart();
  const t = useT();

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: parsePriceNum(product.price),
      image: product.image,
      size: selectedSize,
      quantity: 1,
    });
    setAddedFeedback(true);
    openDrawer();
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--gf-bg)', color: 'var(--gf-text)' }}>
      <Header />

      <div className="max-w-[1440px] mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav className={`${bodyFont.className} flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-12`} style={{ color: 'var(--gf-text-faint)' }}>
          <Link href="/catalog" className="transition-colors"
            style={{ color: 'var(--gf-text-faint)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-faint)'; }}
          >
            {t('product_breadcrumb_catalog')}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--gf-text)' }}>{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image */}
          <div className="relative aspect-[3/4] w-full overflow-hidden" style={{ backgroundColor: 'var(--gf-bg-surface)' }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {product.tag && (
              <span className={`${headingFont.className} absolute top-6 left-6 text-[10px] uppercase tracking-[0.1em] px-3 py-1.5`} style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}>
                {t(TAG_KEYS[product.tag] || product.tag)}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className={`${headingFont.className} text-3xl md:text-5xl uppercase tracking-[0.15em] mb-4 leading-tight`} style={{ color: 'var(--gf-text)' }}>
              {product.name}
            </h1>

            <p className={`${bodyFont.className} text-2xl mb-8`} style={{ color: 'var(--gf-text)' }}>
              {product.price}
            </p>

            <p className={`${bodyFont.className} text-sm leading-relaxed mb-10 max-w-md`} style={{ color: 'var(--gf-text-muted)' }}>
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mb-8">
              <p className={`${headingFont.className} text-xs uppercase tracking-[0.15em] mb-4`} style={{ color: 'var(--gf-text)' }}>
                {t('product_size_label')}
              </p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`${headingFont.className} w-12 h-12 border text-xs uppercase tracking-[0.1em] transition-colors`}
                    style={selectedSize === size
                      ? { borderColor: 'var(--gf-invert-bg)', backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }
                      : { borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className={`${bodyFont.className} text-xs mt-3`} style={{ color: 'var(--gf-text-faint)' }}>
                  {t('product_pick_size')}
                </p>
              )}
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`${headingFont.className} w-full py-4 text-xs uppercase tracking-[0.2em] transition-colors mb-4 rounded-none`}
              style={addedFeedback
                ? { backgroundColor: 'var(--gf-bg-surface)', color: 'var(--gf-text-muted)', cursor: 'default' }
                : selectedSize
                ? { backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }
                : { backgroundColor: 'var(--gf-bg-surface)', color: 'var(--gf-text-dim)', cursor: 'not-allowed', border: '1px solid var(--gf-border-mid)' }
              }
            >
              {addedFeedback ? t('product_added') : t('product_add_to_cart')}
            </button>

            {/* Secondary CTA */}
            <Link
              href="/cart"
              className={`${headingFont.className} block w-full text-center border py-4 text-xs uppercase tracking-[0.2em] transition-colors`}
              style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gf-text)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gf-border-mid)'; }}
            >
              {t('product_view_cart')}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
