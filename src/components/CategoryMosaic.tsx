'use client';

import Image from 'next/image';
import Link from 'next/link';
import { headingFont } from '@/app/fonts';
import { useT } from '@/context/LangContext';

export function CategoryMosaic() {
  const t = useT();

  return (
    <section className="w-full flex flex-col md:flex-row h-auto md:h-[900px]" style={{ backgroundColor: 'var(--gf-bg)' }}>
      <Link href="/catalog" className="relative w-full md:w-1/2 h-[600px] md:h-full group overflow-hidden block">
        <Image
          src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-mosaic-main.png"
          alt="Performance Collection"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className={`${headingFont.className} text-3xl md:text-5xl text-white uppercase tracking-[0.2em]`}>
            {t('home_mosaic_performance')}
          </h2>
        </div>
      </Link>

      <div className="w-full md:w-1/2 flex flex-col h-[600px] md:h-full">
        <Link href="/catalog" className="relative w-full h-1/2 group overflow-hidden block">
          <Image
            src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1600/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-mosaic-sub1.png"
            alt="Technical Details"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className={`${headingFont.className} text-xl md:text-3xl text-white uppercase tracking-[0.2em]`}>
              {t('home_mosaic_details')}
            </h2>
          </div>
        </Link>
        <Link href="/catalog" className="relative w-full h-1/2 group overflow-hidden block">
          <Image
            src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1600/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-mosaic-sub2.png"
            alt="Essentials"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className={`${headingFont.className} text-xl md:text-3xl text-white uppercase tracking-[0.2em]`}>
              {t('home_mosaic_base')}
            </h2>
          </div>
        </Link>
      </div>
    </section>
  );
}
