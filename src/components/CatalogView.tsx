'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';

import { headingFont, bodyFont } from '@/app/fonts';
import { menuCategories } from '@/data/content';
import { useCart, parsePriceNum } from '@/context/CartContext';
import { useT } from '@/context/LangContext';

const CAT_ITEM_KEYS: Record<string, string> = {
  'T-Shirts': 'cat_item_tshirts',
  'Tank Tops': 'cat_item_tank_tops',
  'Long Sleeves': 'cat_item_long_sleeves',
  Hoodies: 'cat_item_hoodies',
  'Compression Tops': 'cat_item_compression_tops',
  Shorts: 'cat_item_shorts',
  Joggers: 'cat_item_joggers',
  Leggings: 'cat_item_leggings',
  'Compression Tights': 'cat_item_compression_tights',
  'Track Pants': 'cat_item_track_pants',
  'Hoodies & Zip-ups': 'cat_item_hoodies_zipups',
  Jackets: 'cat_item_jackets',
  Windbreakers: 'cat_item_windbreakers',
  Vests: 'cat_item_vests',
  'Gym Bags': 'cat_item_gym_bags',
  Caps: 'cat_item_caps',
  Socks: 'cat_item_socks',
  'Wrist Wraps': 'cat_item_wrist_wraps',
  Shakers: 'cat_item_shakers',
};

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  sale_price: number | null;
  category: string | null;
  image: string | null;
  images: string[] | null;
  stock: number;
  sales: number;
  status: string;
  featured: boolean;
  sizes: string[] | null;
  colors: string[] | null;
  created_at: string;
  updated_at: string;
}

interface CatalogViewProps {
  products: Product[];
  category?: string;
  collection?: string;
}

function getProductImage(product: Product) {
  if (product.image) {
    return product.image;
  }

  if (product.images && product.images.length > 0) {
    return product.images[0];
  }

  return '/images/product-placeholder.jpg';
}

function getProductPrice(product: Product) {
  if (
    product.sale_price !== null &&
    product.sale_price !== undefined &&
    product.sale_price < product.price
  ) {
    return {
      current: `€${product.sale_price.toFixed(2)}`,
      old: `€${product.price.toFixed(2)}`,
      currentNumber: product.sale_price,
    };
  }

  return {
    current: `€${product.price.toFixed(2)}`,
    old: null,
    currentNumber: product.price,
  };
}

function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { addItem, openDrawer } = useCart();
  const t = useT();

  const image = getProductImage(product);
  const price = getProductPrice(product);

  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const firstSize = product.sizes?.[0] || '';

    addItem({
      id: product.id,
      name: product.name,
      price: price.current,
      priceNum: parsePriceNum(price.current),
      image,
      size: firstSize,
      quantity: 1,
    });

    openDrawer();
  };

  return (
    <Link href={`/catalog/${product.id}`} className="group block">
      <div
        className={`relative overflow-hidden mb-4 ${
          featured ? 'aspect-[2/3]' : 'aspect-[3/4]'
        }`}
        style={{ backgroundColor: 'var(--gf-bg-surface)' }}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {product.featured && (
          <span
            className={`${headingFont.className} absolute top-4 left-4 text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5`}
            style={{
              backgroundColor: 'var(--gf-invert-bg)',
              color: 'var(--gf-invert-text)',
            }}
          >
            {t('tag_new')}
          </span>
        )}

        <button
          onClick={handleQuickAdd}
          className={`${headingFont.className} absolute bottom-0 left-0 right-0 text-[10px] uppercase tracking-[0.15em] py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300`}
          style={{
            backgroundColor: 'var(--gf-invert-bg)',
            color: 'var(--gf-invert-text)',
          }}
        >
          {t('catalog_quick_add')}
        </button>
      </div>

      <div>
        <p
          className={`${headingFont.className} text-[11px] uppercase tracking-[0.12em] mb-1`}
          style={{ color: 'var(--gf-text-faint)' }}
        >
          {product.category
            ? t(CAT_ITEM_KEYS[product.category] || product.category)
            : t('catalog_other')}
        </p>

        <h3
          className={`${headingFont.className} text-sm uppercase tracking-[0.08em] mb-1.5`}
          style={{ color: 'var(--gf-text)' }}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <p
            className={`${bodyFont.className} text-sm`}
            style={{ color: 'var(--gf-text-muted)' }}
          >
            {price.current}
          </p>

          {price.old && (
            <p
              className={`${bodyFont.className} text-xs line-through`}
              style={{ color: 'var(--gf-text-faint)' }}
            >
              {price.old}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function FilterStrip({ active }: { active: string }) {
  const allCategories = menuCategories.flatMap((g) => g.items);
  const t = useT();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href="/catalog"
        className={`${headingFont.className} flex-shrink-0 px-4 py-2 border text-[10px] uppercase tracking-[0.15em] transition-colors`}
        style={
          !active
            ? {
                borderColor: 'var(--gf-text)',
                color: 'var(--gf-text)',
              }
            : {
                borderColor: 'var(--gf-border-mid)',
                color: 'var(--gf-text-faint)',
              }
        }
      >
        {t('catalog_all')}
      </Link>

      {allCategories.slice(0, 8).map((cat) => (
        <Link
          key={cat}
          href={`/catalog?category=${encodeURIComponent(cat)}`}
          className={`${headingFont.className} flex-shrink-0 px-4 py-2 border text-[10px] uppercase tracking-[0.15em] transition-colors`}
          style={
            active === cat
              ? {
                  borderColor: 'var(--gf-text)',
                  color: 'var(--gf-text)',
                }
              : {
                  borderColor: 'var(--gf-border-mid)',
                  color: 'var(--gf-text-faint)',
                }
          }
        >
          {t(CAT_ITEM_KEYS[cat] || cat)}
        </Link>
      ))}
    </div>
  );
}

function EmptyState() {
  const t = useT();

  return (
    <div className="py-32 text-center">
      <p
        className={bodyFont.className}
        style={{ color: 'var(--gf-text-faint)' }}
      >
        {t('catalog_empty')}
      </p>

      <Link
        href="/catalog"
        className={`${headingFont.className} inline-block mt-8 border px-10 py-4 text-xs uppercase tracking-[0.2em] transition-colors`}
        style={{
          borderColor: 'var(--gf-border-mid)',
          color: 'var(--gf-text)',
        }}
      >
        {t('catalog_show_all')}
      </Link>
    </div>
  );
}

function FilteredView({
  filtered,
  title,
}: {
  filtered: Product[];
  title: string;
}) {
  const t = useT();

  if (filtered.length === 0) {
    return <EmptyState />;
  }

  const [hero, ...rest] = filtered;

  return (
    <div>
      <div className="mb-12">
        <h1
          className={`${headingFont.className} text-4xl md:text-6xl uppercase tracking-[0.12em] mb-3`}
          style={{ color: 'var(--gf-text)' }}
        >
          {title}
        </h1>

        <p
          className={`${bodyFont.className} text-xs mt-2 uppercase tracking-[0.1em]`}
          style={{ color: 'var(--gf-text-dim)' }}
        >
          {filtered.length}{' '}
          {filtered.length === 1
            ? t('catalog_items_count_one')
            : t('catalog_items_count_few')}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            featured={index === 0 && filtered.length >= 3}
          />
        ))}
      </div>
    </div>
  );
}

function AllProductsView({ products }: { products: Product[] }) {
  const categoryOrder = menuCategories.flatMap((g) => g.items);
  const t = useT();

  const grouped: Record<string, Product[]> = {};

  for (const product of products) {
    const category = product.category || t('catalog_other');

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(product);
  }

  const sortedCategories = [
    ...categoryOrder.filter((category) => grouped[category]),
    ...Object.keys(grouped).filter(
      (category) => !categoryOrder.includes(category)
    ),
  ];

  return (
    <div>
      <h1
        className={`${headingFont.className} text-4xl md:text-6xl uppercase tracking-[0.12em] mb-4`}
        style={{ color: 'var(--gf-text)' }}
      >
        {t('catalog_title')}
      </h1>

      <p
        className={`${bodyFont.className} text-sm mb-12`}
        style={{ color: 'var(--gf-text-faint)' }}
      >
        {products.length} {t('catalog_items_across')}
      </p>

      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-24">
          {sortedCategories.map((category) => {
            const items = grouped[category];

            if (!items || items.length === 0) {
              return null;
            }

            return (
              <section key={category}>
                <div
                  className="flex items-end justify-between mb-8 border-b pb-5"
                  style={{ borderColor: 'var(--gf-border-sub)' }}
                >
                  <div>
                    <h2
                      className={`${headingFont.className} text-xl md:text-2xl uppercase tracking-[0.12em]`}
                      style={{ color: 'var(--gf-text)' }}
                    >
                      {t(CAT_ITEM_KEYS[category] || category)}
                    </h2>

                    <p
                      className={`${bodyFont.className} text-xs mt-1 uppercase tracking-[0.1em]`}
                      style={{ color: 'var(--gf-text-dim)' }}
                    >
                      {items.length}{' '}
                      {items.length === 1
                        ? t('catalog_items_count_one')
                        : t('catalog_items_count_few')}
                    </p>
                  </div>

                  <Link
                    href={`/catalog?category=${encodeURIComponent(category)}`}
                    className={`${headingFont.className} text-[10px] uppercase tracking-[0.15em] transition-colors flex items-center gap-1.5`}
                    style={{ color: 'var(--gf-text-faint)' }}
                  >
                    {t('catalog_view_all')}

                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <polyline points="3,2 7,5 3,8" />
                    </svg>
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((product, index) => (
                    <div key={product.id}>
                      <ProductCard
                        product={product}
                        featured={index === 0 && items.length >= 3}
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CatalogView({
  products,
  category,
  collection,
}: CatalogViewProps) {
  const t = useT();

  /*
   * collection поки не використовується,
   * тому що в таблиці products немає колонки collection.
   */
  void collection;

  const filtered = category
    ? products.filter((product) => product.category === category)
    : products;

  const activeFilter = category || '';

  const filterTitle = category
    ? t(CAT_ITEM_KEYS[category] || category)
    : '';

  return (
    <div className="max-w-[1440px] mx-auto px-6 pt-32 pb-24">
      <div className="mb-10">
        <FilterStrip active={activeFilter} />
      </div>

      {activeFilter ? (
        <FilteredView
          filtered={filtered}
          title={filterTitle}
        />
      ) : (
        <AllProductsView products={products} />
      )}
    </div>
  );
}