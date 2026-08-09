'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { headingFont, bodyFont } from '@/app/fonts';
import { content } from '@/data/content';

export function HomeHero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1600/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-home-hero.png"
          alt="Gymfriends Hero"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 p-12 md:p-24 border border-white/20 bg-transparent flex flex-col items-center text-center max-w-4xl mx-4">
        <h1 className={`${headingFont.className} text-4xl md:text-7xl uppercase tracking-[0.15em] text-white mb-6 leading-tight`}>
          {content.hero.headline}
        </h1>
        <p className={`${bodyFont.className} text-[#A0A0A0] text-sm md:text-base max-w-lg mx-auto mb-10`}>
          {content.hero.subheadline}
        </p>
        <Link 
          href="/catalog" 
          className={`${headingFont.className} bg-white text-black px-10 py-4 uppercase tracking-widest text-xs hover:bg-[#F4F4F4] transition-colors rounded-none`}
        >
          {content.hero.cta}
        </Link>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-10 h-10 border border-white/30 flex items-center justify-center rounded-full">
          <ArrowDown strokeWidth={1} size={20} className="text-white" />
        </div>
      </div>
    </section>
  );
}
