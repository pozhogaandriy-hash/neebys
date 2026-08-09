'use client';

import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { products } from '@/data/content';
import { headingFont } from '@/app/fonts';

export function ProductSwitcher() {
  const [activeTab, setActiveTab] = useState<'Нові дропи' | 'Хіти продажу'>('Нові дропи');

  const displayProducts = activeTab === 'Нові дропи' ? products : [...products].reverse();

  return (
    <section className="py-32 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex justify-center gap-12 mb-20">
          {(['Нові дропи', 'Хіти продажу'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${headingFont.className} uppercase tracking-[0.15em] text-sm pb-2 border-b transition-colors duration-300 ${
                activeTab === tab 
                  ? 'border-white text-white' 
                  : 'border-transparent text-[#767676] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
