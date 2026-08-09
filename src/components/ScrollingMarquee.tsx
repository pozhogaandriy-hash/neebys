'use client';

import Image from 'next/image';
import { heroFont } from '@/app/fonts';
import { useT } from '@/context/LangContext';

export function ScrollingMarquee() {
  const t = useT();

  const items = [
    { type: 'text', key: 'marquee_new_drops' },
    { type: 'image', src: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-marquee-1.png' },
    { type: 'text', key: 'marquee_quality' },
    { type: 'image', src: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-marquee-2.png' },
    { type: 'text', key: 'marquee_sport' },
  ];

  return (
    <section className="py-24 overflow-hidden whitespace-nowrap flex items-center border-y" style={{ backgroundColor: 'var(--gf-bg)', borderColor: 'var(--gf-border)' }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
      <div className="flex animate-marquee items-center">
        {[...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center mx-8">
            {item.type === 'text' ? (
              <span className={`${heroFont.className} text-6xl md:text-8xl uppercase tracking-[0.1em]`} style={{ color: 'var(--gf-text)' }}>
                {t(item.key!)}
              </span>
            ) : (
              <div className="relative h-16 md:h-24 w-24 md:w-36">
                <Image
                  src={item.src!}
                  alt="Marquee Image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
