'use client';

import Image from 'next/image';
import Link from 'next/link';
import { headingFont, bodyFont } from '@/app/fonts';
import { useT } from '@/context/LangContext';

export function EditorialSplit() {
  const t = useT();

  return (
    <section className="py-32 overflow-hidden" style={{ backgroundColor: 'var(--gf-bg)' }}>
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        
        <div className="order-2 md:order-1 flex flex-col justify-center max-w-md mx-auto md:mx-0">
          <h2 className={`${headingFont.className} text-3xl md:text-5xl uppercase tracking-[0.15em] mb-8 leading-tight`} style={{ color: 'var(--gf-text)' }}>
            {t('home_bestsellers_title')}
          </h2>
          <p className={`${bodyFont.className} text-base leading-relaxed mb-12`} style={{ color: 'var(--gf-text-muted)' }}>
            {t('home_bestsellers_body')}
          </p>
          <Link
            href="/catalog"
            className={`${headingFont.className} inline-block px-10 py-4 text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-80 w-fit rounded-none`}
            style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}
          >
            {t('home_bestsellers_cta')}
          </Link>
        </div>

        <div className="order-1 md:order-2 relative w-full h-[600px] md:h-[800px]">
          <div className="absolute top-0 right-0 w-[80%] h-[80%] z-10" style={{ backgroundColor: 'var(--gf-bg-surface)' }}>
            <Image
              src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-bestseller-main.png"
              alt="Best Seller Main"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-[55%] h-[45%] z-20 border-8" style={{ borderColor: 'var(--gf-bg)', backgroundColor: 'var(--gf-bg-surface)' }}>
            <Image
              src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-bestseller-overlap.png"
              alt="Best Seller Detail"
              fill
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
