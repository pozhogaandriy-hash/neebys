import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { heroFont, headingFont } from '@/app/fonts';
import { content } from '@/data/content';

export function HeroStatement() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1600/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-hero.png"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 w-[90%] max-w-[1000px] border border-white p-10 md:p-20 flex flex-col items-center justify-center text-center bg-transparent">
        <h1 className={`${heroFont.className} text-5xl md:text-8xl text-white uppercase tracking-[0.15em] mb-6 leading-tight`}>
          {content.hero.statement}
        </h1>
        <p className={`${headingFont.className} text-xs md:text-sm text-[#F4F4F4] uppercase tracking-[0.2em] mb-12 max-w-lg`}>
          {content.hero.subheadline}
        </p>
        <Link
          href="/catalog"
          className={`${headingFont.className} bg-white text-black px-12 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#F4F4F4] transition-colors rounded-none`}
        >
          {content.hero.cta}
        </Link>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-pulse">
        <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center">
          <ArrowDown strokeWidth={1} size={16} className="text-white" />
        </div>
      </div>
    </section>
  );
}
