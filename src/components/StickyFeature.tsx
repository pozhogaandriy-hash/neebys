'use client';

import Image from 'next/image';
import Link from 'next/link';
import { headingFont, bodyFont } from '@/app/fonts';

const images = [
  'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-feature-lifestyle-1.png',
  'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-feature-lifestyle-2.png'
];

export function StickyFeature() {
  return (
    <section className="bg-[#0a0a0a] relative">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          <div className="w-full lg:w-1/2 flex flex-col gap-12 lg:gap-32 py-12 lg:py-32">
            {images.map((src, idx) => (
              <div key={idx} className="relative aspect-[3/4] w-full max-w-lg mx-auto lg:ml-auto lg:mr-0">
                <Image
                  src={src}
                  alt={`Lifestyle feature ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="w-full lg:w-1/2 lg:py-32 flex items-center">
            <div className="sticky top-1/3 max-w-md">
              <h2 className={`${headingFont.className} uppercase tracking-[0.15em] text-3xl md:text-5xl text-white mb-8 leading-tight`}>
                БЕЗКОМПРОМІСНА ЯКІСТЬ
              </h2>
              <p className={`${bodyFont.className} text-[#A0A0A0] text-base leading-relaxed mb-10`}>
                Ми створюємо одяг, який витримує найжорсткіші тренування. Інноваційні тканини, ідеальна посадка та дизайн, що підкреслює твою форму.
              </p>
              <Link 
                href="/catalog" 
                className={`${headingFont.className} inline-block bg-white text-black px-10 py-4 uppercase tracking-widest text-xs hover:bg-[#F4F4F4] transition-colors rounded-none`}
              >
                ДІЗНАТИСЯ БІЛЬШЕ
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
