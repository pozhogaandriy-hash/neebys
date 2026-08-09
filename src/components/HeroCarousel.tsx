'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { headingFont, bodyFont } from '@/app/fonts';
import { products } from '@/data/content';
import { useCart, parsePriceNum } from '@/context/CartContext';
import { useT } from '@/context/LangContext';

const TOTAL = products.length;
const DELAY_MS = 3500;

const TAG_KEYS: Record<string, string> = {
  'НОВИНКА': 'tag_new',
  'УНІСЕКС': 'tag_unisex',
  'ХІТ': 'tag_hit',
  'ЖІНОЧА': 'tag_womens',
  'БАЗОВИЙ': 'tag_basic',
};

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [animDir, setAnimDir] = useState<'next' | 'prev'>('next');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addItem, openDrawer } = useCart();
  const t = useT();

  const navigate = useCallback((nextIdx: number, direction: 'next' | 'prev') => {
    setAnimDir(direction);
    setIndex(nextIdx);
    setAnimKey((k) => k + 1);
    setSelectedSize(null);
    setAddedFeedback(false);
  }, []);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % TOTAL;
        setAnimDir('next');
        setAnimKey((k) => k + 1);
        setSelectedSize(null);
        setAddedFeedback(false);
        return next;
      });
    }, DELAY_MS);
  }, []);

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval]);

  const handlePrev = () => {
    navigate((index - 1 + TOTAL) % TOTAL, 'prev');
    resetInterval();
  };

  const handleNext = () => {
    navigate((index + 1) % TOTAL, 'next');
    resetInterval();
  };

  const handleAddToCart = () => {
    const size = selectedSize ?? product.sizes[0];
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: parsePriceNum(product.price),
      image: product.image,
      size,
      quantity: 1,
    });
    setAddedFeedback(true);
    openDrawer();
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const product = products[index];
  const animClass = animKey === 0 ? '' : animDir === 'next' ? 'slide-in-right' : 'slide-in-left';

  return (
    <section className="pt-24 pb-0" style={{ backgroundColor: 'var(--gf-bg)' }}>
      {/* Header row */}
      <div className="max-w-[1440px] mx-auto px-6 mb-6 flex items-center justify-between">
        <div>
          <p className={`${bodyFont.className} text-[11px] uppercase tracking-[0.3em] mb-1`} style={{ color: 'var(--gf-text-muted)' }}>
            {t('hero_collection_label')}
          </p>
          <h2 className={`${headingFont.className} text-2xl md:text-4xl uppercase tracking-[0.08em] font-bold`} style={{ color: 'var(--gf-text)' }}>
            {t('hero_title')}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            aria-label={t('aria_prev')}
            className="w-10 h-10 border flex items-center justify-center transition-all duration-200"
            style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
            onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'var(--gf-text)'; b.style.backgroundColor = 'var(--gf-invert-bg)'; b.style.color = 'var(--gf-invert-text)'; }}
            onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'var(--gf-border-mid)'; b.style.backgroundColor = ''; b.style.color = 'var(--gf-text)'; }}
          >
            <ChevronLeft strokeWidth={1.5} size={20} />
          </button>
          <span className={`${bodyFont.className} text-xs tabular-nums w-14 text-center`} style={{ color: 'var(--gf-text-muted)' }}>
            {String(index + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </span>
          <button
            onClick={handleNext}
            aria-label={t('aria_next')}
            className="w-10 h-10 border flex items-center justify-center transition-all duration-200"
            style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
            onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'var(--gf-text)'; b.style.backgroundColor = 'var(--gf-invert-bg)'; b.style.color = 'var(--gf-invert-text)'; }}
            onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'var(--gf-border-mid)'; b.style.backgroundColor = ''; b.style.color = 'var(--gf-text)'; }}
          >
            <ChevronRight strokeWidth={1.5} size={20} />
          </button>
        </div>
      </div>

      {/* Carousel + sidebar */}
      <div className="max-w-[1440px] mx-auto px-6 flex gap-8 items-stretch">
        {/* Viewport */}
        <Link
          href={`/catalog/${product.id}`}
          className="flex-1 min-w-0 overflow-hidden block"
          style={{ height: '560px', backgroundColor: 'var(--gf-bg-surface)' }}
        >
          <div
            key={animKey}
            className={`relative w-full h-full ${animClass}`}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 75vw"
              priority={index === 0}
            />
            {product.tag && (
              <span className={`${headingFont.className} absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] px-3 py-1 z-10`} style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}>
                {t(TAG_KEYS[product.tag] || product.tag)}
              </span>
            )}
          </div>
        </Link>

        {/* Product detail sidebar — desktop */}
        <div className="hidden md:flex flex-col justify-between w-72 shrink-0 py-2">
          <div>
            <Link href={`/catalog/${product.id}`}>
              <h3 className={`${headingFont.className} text-lg uppercase tracking-[0.08em] mb-4 leading-snug transition-colors`} style={{ color: 'var(--gf-text)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLHeadingElement).style.color = 'var(--gf-text-muted)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLHeadingElement).style.color = 'var(--gf-text)'; }}
              >
                {product.name}
              </h3>
            </Link>
            <p className={`${bodyFont.className} text-2xl mb-6`} style={{ color: 'var(--gf-text)' }}>
              {product.price}
            </p>
            <div className="mb-6">
              <p className={`${bodyFont.className} text-[11px] uppercase tracking-[0.2em] mb-2`} style={{ color: 'var(--gf-text-muted)' }}>
                {t('hero_sizes_label')}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s === selectedSize ? null : s)}
                    className={`${bodyFont.className} text-xs border px-3 py-1.5 transition-colors`}
                    style={selectedSize === s
                      ? { borderColor: 'var(--gf-invert-bg)', backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }
                      : { borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <p className={`${bodyFont.className} text-[11px] uppercase tracking-[0.2em] mb-3`} style={{ color: 'var(--gf-text-muted)' }}>
                {t('hero_collection_dots')}
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigate(i, i > index ? 'next' : 'prev');
                      resetInterval();
                    }}
                    aria-label={`Go to product ${i + 1}`}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{ backgroundColor: i === index ? 'var(--gf-text)' : 'var(--gf-border-mid)' }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className={`${headingFont.className} text-center py-4 text-[11px] uppercase tracking-[0.2em] transition-colors`}
              style={addedFeedback
                ? { backgroundColor: 'var(--gf-bg-surface)', color: 'var(--gf-text-muted)', cursor: 'default' }
                : { backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }
              }
            >
              {addedFeedback ? t('hero_added') : t('hero_add_to_cart')}
            </button>
            <Link
              href="/catalog"
              className={`${headingFont.className} border text-center py-4 text-[11px] uppercase tracking-[0.2em] transition-colors`}
              style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gf-text)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gf-border-mid)'; }}
            >
              {t('hero_view_catalog')}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile product info */}
      <div className="md:hidden max-w-[1440px] mx-auto px-6 pt-5 pb-8 flex items-start justify-between gap-4 border-t mt-6" style={{ borderColor: 'var(--gf-border)' }}>
        <div>
          <Link href={`/catalog/${product.id}`}>
            <h3 className={`${headingFont.className} text-sm uppercase tracking-[0.08em] mb-1 transition-colors`} style={{ color: 'var(--gf-text)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLHeadingElement).style.color = 'var(--gf-text-muted)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLHeadingElement).style.color = 'var(--gf-text)'; }}
            >
              {product.name}
            </h3>
          </Link>
          <div className="flex gap-1.5 flex-wrap mt-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s === selectedSize ? null : s)}
                className={`${bodyFont.className} text-[10px] border px-1.5 py-0.5 transition-colors`}
                style={selectedSize === s
                  ? { borderColor: 'var(--gf-invert-bg)', backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }
                  : { borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text-muted)' }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <span className={`${bodyFont.className} text-sm`} style={{ color: 'var(--gf-text)' }}>{product.price}</span>
          <button
            onClick={handleAddToCart}
            className={`${headingFont.className} px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors`}
            style={addedFeedback
              ? { backgroundColor: 'var(--gf-bg-surface)', color: 'var(--gf-text-muted)' }
              : { backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }
            }
          >
            {addedFeedback ? '✓' : t('hero_add_to_cart')}
          </button>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'var(--gf-border)' }} />

      <style>{`
        .slide-in-right {
          animation: slideInRight 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .slide-in-left {
          animation: slideInLeft 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
