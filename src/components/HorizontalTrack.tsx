'use client';

import { headingFont } from '@/app/fonts';

const features = [
  "ІННОВАЦІЙНІ ТКАНИНИ",
  "ІДЕАЛЬНА ПОСАДКА",
  "МАКСИМАЛЬНА ВІДДАЧА",
  "АГРЕСИВНИЙ СТИЛЬ"
];

export function HorizontalTrack() {
  return (
    <section className="bg-[#111111] py-32 overflow-hidden border-y border-[#1a1a1a]">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...features, ...features, ...features].map((feat, idx) => (
          <div key={idx} className="flex items-center">
            <span className={`${headingFont.className} text-5xl md:text-8xl uppercase tracking-widest text-transparent stroke-text px-8`}>
              {feat}
            </span>
            <span className="w-4 h-4 bg-white rounded-full mx-4" />
          </div>
        ))}
      </div>
      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px #333333;
          color: transparent;
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}
