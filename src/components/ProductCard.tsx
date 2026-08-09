import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { headingFont, bodyFont } from '@/app/fonts';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  sizes?: string[];
}

export function ProductCard({ id, name, price, image }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col">
      <Link href={`/catalog/${id}`} className="relative aspect-[3/4] w-full overflow-hidden mb-6 block" style={{ backgroundColor: 'var(--gf-bg-surface)' }}>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <button className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}>
          <Plus strokeWidth={1} size={24} />
        </button>
      </Link>
      <div className="flex flex-col items-center text-center">
        <h3 className={`${headingFont.className} uppercase tracking-widest text-xs mb-2`} style={{ color: 'var(--gf-text)' }}>{name}</h3>
        <p className={`${bodyFont.className} text-sm`} style={{ color: 'var(--gf-text-muted)' }}>{price}</p>
      </div>
    </div>
  );
}
