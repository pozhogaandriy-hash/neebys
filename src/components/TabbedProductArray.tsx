'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { headingFont, bodyFont } from '@/app/fonts';
import { useT } from '@/context/LangContext';

// Stable category keys — independent of language
const tabProducts = [
  { id: '1', name: 'TECH T-SHIRT 01', price: '1 200 ₴', category: 'tshirts', image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-1.png' },
  { id: '2', name: 'MESH PANEL TEE', price: '1 400 ₴', category: 'tshirts', image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-2.png' },
  { id: '3', name: 'OLIVE TECH TEE', price: '1 200 ₴', category: 'tshirts', image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-3.png' },
  { id: '4', name: 'CORE TANK TOP', price: '900 ₴', category: 'tanks', image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-4.png' }
];

export function TabbedProductArray() {
  const t = useT();
  const [activeTab, setActiveTab] = useState<'tshirts' | 'tanks'>('tshirts');

  const tabs: { key: 'tshirts' | 'tanks'; labelKey: string }[] = [
    { key: 'tshirts', labelKey: 'cat_item_tshirts' },
    { key: 'tanks',   labelKey: 'cat_item_tank_tops' },
  ];

  const filteredProducts = tabProducts.filter(p => p.category === activeTab);

  return (
    <section className="py-32" style={{ backgroundColor: 'var(--gf-bg)' }}>
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex justify-center gap-12 mb-20">
          {tabs.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`${headingFont.className} text-xs uppercase tracking-[0.2em] pb-2 border-b transition-colors`}
              style={{
                color: activeTab === key ? 'var(--gf-text)' : 'var(--gf-text-muted)',
                borderColor: activeTab === key ? 'var(--gf-text)' : 'transparent',
              }}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Link href="/catalog" key={product.id} className="group block">
              <div className="relative aspect-[3/4] mb-6 overflow-hidden" style={{ backgroundColor: 'var(--gf-bg-surface)' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}>
                  <Plus strokeWidth={1} size={20} />
                </div>
              </div>
              <div className="text-center">
                <h3 className={`${headingFont.className} text-sm uppercase tracking-[0.1em] mb-2`} style={{ color: 'var(--gf-text)' }}>
                  {product.name}
                </h3>
                <p className={`${bodyFont.className} text-sm`} style={{ color: 'var(--gf-text-muted)' }}>
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
