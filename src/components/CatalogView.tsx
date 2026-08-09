'use client';

import Image from 'next/image';
import Link from 'next/link';
import { headingFont, bodyFont } from '@/app/fonts';
import { products, collections, menuCategories } from '@/data/content';
import { useCart, parsePriceNum } from '@/context/CartContext';
import { useT } from '@/context/LangContext';

/* ------------------------------------------------------------------ */
/*  Tag → translation key lookup                                       */
/* ------------------------------------------------------------------ */
const TAG_KEYS: Record<string, string> = {
  'НОВИНКА': 'tag_new',
  'УНІСЕКС': 'tag_unisex',
  'ХІТ': 'tag_hit',
  'ЖІНОЧА': 'tag_womens',
  'БАЗОВИЙ': 'tag_basic',
};

/* ------------------------------------------------------------------ */
/*  Category item → translation key lookup                             */
/* ------------------------------------------------------------------ */
const CAT_ITEM_KEYS: Record<string, string> = {
  'T-Shirts': 'cat_item_tshirts',
  'Tank Tops': 'cat_item_tank_tops',
  'Long Sleeves': 'cat_item_long_sleeves',
  'Hoodies': 'cat_item_hoodies',
  'Compression Tops': 'cat_item_compression_tops',
  'Shorts': 'cat_item_shorts',
  'Joggers': 'cat_item_joggers',
  'Leggings': 'cat_item_leggings',
  'Compression Tights': 'cat_item_compression_tights',
  'Track Pants': 'cat_item_track_pants',
  'Hoodies & Zip-ups': 'cat_item_hoodies_zipups',
  'Jackets': 'cat_item_jackets',
  'Windbreakers': 'cat_item_windbreakers',
  'Vests': 'cat_item_vests',
  'Gym Bags': 'cat_item_gym_bags',
  'Caps': 'cat_item_caps',
  'Socks': 'cat_item_socks',
  'Wrist Wraps': 'cat_item_wrist_wraps',
  'Shakers': 'cat_item_shakers',
};

/* ------------------------------------------------------------------ */
/*  Collection slug → translation key lookup                           */
/* ------------------------------------------------------------------ */
const COL_NAME_KEYS: Record<string, string> = {
  'new-arrivals': 'col_new_arrivals',
  'essentials': 'col_essentials',
  'performance': 'col_performance',
  'streetwear': 'col_streetwear',
  'limited-edition': 'col_limited_edition',
};
const COL_DESC_KEYS: Record<string, string> = {
  'new-arrivals': 'col_new_arrivals_desc',
  'essentials': 'col_essentials_desc',
  'performance': 'col_performance_desc',
  'streetwear': 'col_streetwear_desc',
  'limited-edition': 'col_limited_edition_desc',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type Product = (typeof products)[number];

function getFilteredProducts(category?: string, collection?: string): Product[] {
  if (category) {
    return products.filter((p) => p.category === category);
  }
  if (collection) {
    return products.filter((p) => p.collection === collection);
  }
  return products;
}

function getCollectionMeta(slug: string) {
  return collections.find((c) => c.slug === slug);
}

/* ------------------------------------------------------------------ */
/*  Product card                                                       */
/* ------------------------------------------------------------------ */
interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem, openDrawer } = useCart();
  const t = useT();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: parsePriceNum(product.price),
      image: product.image,
      size: product.sizes[0],
      quantity: 1,
    });
    openDrawer();
  };

  return (
    <Link href={`/catalog/${product.id}`} className="group block">
      <div
        className={`relative overflow-hidden mb-4 ${featured ? 'aspect-[2/3]' : 'aspect-[3/4]'}`}
        style={{ backgroundColor: 'var(--gf-bg-surface)' }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.tag && (
          <span
            className={`${headingFont.className} absolute top-4 left-4 text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5`}
            style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}
          >
            {t(TAG_KEYS[product.tag] || product.tag)}
          </span>
        )}
        {/* Quick-add strip */}
        <button
          onClick={handleQuickAdd}
          className={`${headingFont.className} absolute bottom-0 left-0 right-0 text-[10px] uppercase tracking-[0.15em] py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300`}
          style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}
        >
          {t('catalog_quick_add')}
        </button>
      </div>
      <div>
        <p className={`${headingFont.className} text-[11px] uppercase tracking-[0.12em] mb-1`} style={{ color: 'var(--gf-text-faint)' }}>
          {t(CAT_ITEM_KEYS[product.category] || product.category)}
        </p>
        <h3 className={`${headingFont.className} text-sm uppercase tracking-[0.08em] mb-1.5`} style={{ color: 'var(--gf-text)' }}>
          {product.name}
        </h3>
        <p className={`${bodyFont.className} text-sm`} style={{ color: 'var(--gf-text-muted)' }}>
          {product.price}
        </p>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter chip strip                                                  */
/* ------------------------------------------------------------------ */
function FilterStrip({ active }: { active: string }) {
  const allCategories = menuCategories.flatMap((g) => g.items);
  const t = useT();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href="/catalog"
        className={`${headingFont.className} flex-shrink-0 px-4 py-2 border text-[10px] uppercase tracking-[0.15em] transition-colors`}
        style={!active
          ? { borderColor: 'var(--gf-text)', color: 'var(--gf-text)' }
          : { borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text-faint)' }
        }
      >
        {t('catalog_all')}
      </Link>
      {allCategories.slice(0, 8).map((cat) => (
        <Link
          key={cat}
          href={`/catalog?category=${encodeURIComponent(cat)}`}
          className={`${headingFont.className} flex-shrink-0 px-4 py-2 border text-[10px] uppercase tracking-[0.15em] transition-colors`}
          style={active === cat
            ? { borderColor: 'var(--gf-text)', color: 'var(--gf-text)' }
            : { borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text-faint)' }
          }
        >
          {t(CAT_ITEM_KEYS[cat] || cat)}
        </Link>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filtered view — category or collection selected                    */
/* ------------------------------------------------------------------ */
function FilteredView({
  filtered,
  title,
  subtitle,
}: {
  filtered: Product[];
  title: string;
  subtitle?: string;
}) {
  const t = useT();

  if (filtered.length === 0) {
    return (
      <div className="py-32 text-center">
        <p className={`${bodyFont.className}`} style={{ color: 'var(--gf-text-faint)' }}>
          {t('catalog_empty')}
        </p>
        <Link
          href="/catalog"
          className={`${headingFont.className} inline-block mt-8 border px-10 py-4 text-xs uppercase tracking-[0.2em] transition-colors`}
          style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
        >
          {t('catalog_show_all')}
        </Link>
      </div>
    );
  }

  const [hero, ...rest] = filtered;

  return (
    <div>
      <div className="mb-12">
        <h1 className={`${headingFont.className} text-4xl md:text-6xl uppercase tracking-[0.12em] mb-3`} style={{ color: 'var(--gf-text)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className={`${bodyFont.className} text-sm`} style={{ color: 'var(--gf-text-faint)' }}>{subtitle}</p>
        )}
        <p className={`${bodyFont.className} text-xs mt-2 uppercase tracking-[0.1em]`} style={{ color: 'var(--gf-text-dim)' }}>
          {filtered.length} {filtered.length === 1 ? t('catalog_items_count_one') : t('catalog_items_count_few')}
        </p>
      </div>

      {hero && (
        <div className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-6">
            <Link href={`/catalog/${hero.id}`} className="group block">
              <div className="relative aspect-[16/9] lg:aspect-[3/2] overflow-hidden mb-4" style={{ backgroundColor: 'var(--gf-bg-surface)' }}>
                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {hero.tag && (
                  <span className={`${headingFont.className} absolute top-6 left-6 text-[11px] uppercase tracking-[0.1em] px-3 py-1.5`} style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}>
                    {t(TAG_KEYS[hero.tag] || hero.tag)}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h2 className={`${headingFont.className} text-xl md:text-3xl uppercase tracking-[0.1em] text-white mb-1`}>
                    {hero.name}
                  </h2>
                  <p className="text-white/70 text-sm">{hero.price}</p>
                </div>
              </div>
            </Link>
            {rest.length > 0 && (
              <div className="flex flex-col gap-6">
                {rest.slice(0, 2).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {rest.length > 2 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {rest.slice(2).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  All-products view — grouped by category                            */
/* ------------------------------------------------------------------ */
function AllProductsView() {
  const categoryOrder = menuCategories.flatMap((g) => g.items);
  const t = useT();
  const grouped: Record<string, Product[]> = {};

  for (const p of products) {
    const cat = p.category || t('catalog_other');
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  }

  const sortedCategories = [
    ...categoryOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div>
      <h1 className={`${headingFont.className} text-4xl md:text-6xl uppercase tracking-[0.12em] mb-4`} style={{ color: 'var(--gf-text)' }}>
        {t('catalog_title')}
      </h1>
      <p className={`${bodyFont.className} text-sm mb-12`} style={{ color: 'var(--gf-text-faint)' }}>
        {products.length} {t('catalog_items_across')}
      </p>

      <div className="flex flex-col gap-24">
        {sortedCategories.map((cat) => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;

          return (
            <section key={cat}>
              <div className="flex items-end justify-between mb-8 border-b pb-5" style={{ borderColor: 'var(--gf-border-sub)' }}>
                <div>
                  <h2 className={`${headingFont.className} text-xl md:text-2xl uppercase tracking-[0.12em]`} style={{ color: 'var(--gf-text)' }}>
                    {t(CAT_ITEM_KEYS[cat] || cat)}
                  </h2>
                  <p className={`${bodyFont.className} text-xs mt-1 uppercase tracking-[0.1em]`} style={{ color: 'var(--gf-text-dim)' }}>
                    {items.length} {items.length === 1 ? t('catalog_items_count_one') : t('catalog_items_count_few')}
                  </p>
                </div>
                <Link
                  href={`/catalog?category=${encodeURIComponent(cat)}`}
                  className={`${headingFont.className} text-[10px] uppercase tracking-[0.15em] transition-colors flex items-center gap-1.5`}
                  style={{ color: 'var(--gf-text-faint)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-faint)'; }}
                >
                  {t('catalog_view_all')}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="3,2 7,5 3,8" />
                  </svg>
                </Link>
              </div>

              {items.length === 1 ? (
                <div className="max-w-xs">
                  <ProductCard product={items[0]} />
                </div>
              ) : items.length === 2 ? (
                <div className="grid grid-cols-2 gap-6">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((p, i) => (
                    <div key={p.id} className={i === 0 && items.length >= 3 ? 'col-span-2 md:col-span-1' : ''}>
                      <ProductCard product={p} featured={i === 0 && items.length >= 3} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CatalogView — main export                                          */
/* ------------------------------------------------------------------ */
interface CatalogViewProps {
  category?: string;
  collection?: string;
}

export function CatalogView({ category, collection }: CatalogViewProps) {
  const t = useT();
  const filtered = getFilteredProducts(category, collection);
  const activeFilter = category || collection || '';

  let filterTitle = category ? t(CAT_ITEM_KEYS[category] || category) : '';
  let filterSubtitle: string | undefined;

  if (collection) {
    filterTitle = t(COL_NAME_KEYS[collection] || collection);
    filterSubtitle = t(COL_DESC_KEYS[collection] || collection);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 pt-32 pb-24">
      <div className="mb-10">
        <FilterStrip active={activeFilter} />
      </div>

      {activeFilter ? (
        <FilteredView
          filtered={filtered}
          title={filterTitle}
          subtitle={filterSubtitle}
        />
      ) : (
        <AllProductsView />
      )}
    </div>
  );
}
