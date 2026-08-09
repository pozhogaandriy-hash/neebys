'use client';

import Image from 'next/image';
import Link from 'next/link';
import { headingFont, bodyFont } from '@/app/fonts';
import { products } from '@/data/content';
import { useCart, parsePriceNum } from '@/context/CartContext';

export function ProductGrid() {
  const { addItem, openDrawer } = useCart();

  const handleQuickAdd = (
    e: React.MouseEvent,
    product: (typeof products)[number]
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes[0];
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: parsePriceNum(product.price),
      image: product.image,
      size,
      quantity: 1,
    });
    openDrawer();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link href={`/catalog/${product.id}`} key={product.id} className="group block">
          <div className="relative aspect-[3/4] bg-[#111111] mb-6 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.tag && (
              <span className={`${headingFont.className} absolute top-4 left-4 bg-white text-black text-[10px] uppercase tracking-[0.1em] px-2 py-1`}>
                {product.tag}
              </span>
            )}
            {/* Quick-add button */}
            <button
              onClick={(e) => handleQuickAdd(e, product)}
              className={`${headingFont.className} absolute bottom-0 left-0 right-0 bg-white text-black text-[10px] uppercase tracking-[0.15em] py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300`}
            >
              + В КОШИК
            </button>
          </div>
          <div className="text-center">
            <h3 className={`${headingFont.className} text-sm uppercase tracking-[0.1em] text-white mb-2`}>
              {product.name}
            </h3>
            <p className={`${bodyFont.className} text-[#767676] text-sm`}>
              {product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
