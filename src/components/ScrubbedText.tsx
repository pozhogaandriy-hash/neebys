'use client';

import { useRef, useEffect, useState } from 'react';
import { headingFont } from '@/app/fonts';

export function ScrubbedText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = windowHeight;
      const end = -rect.height;
      
      const current = rect.top;
      const rawProgress = (start - current) / (start - end);
      setProgress(Math.min(Math.max(rawProgress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const text = "МИ ЗАБЕЗПЕЧУЄМО ШВИДКУ ДОСТАВКУ ПО ВСІЙ УКРАЇНІ. ТВІЙ ОДЯГ — ТВОЇ ПРАВИЛА.";

  return (
    <section ref={containerRef} className="py-48 px-6 bg-[#0a0a0a] min-h-screen flex items-center justify-center">
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 
          className={`${headingFont.className} text-4xl md:text-6xl lg:text-8xl uppercase tracking-[0.1em] leading-tight bg-clip-text text-transparent`}
          style={{
            backgroundImage: `linear-gradient(to right, #FFFFFF ${progress * 100}%, #333333 ${progress * 100}%)`
          }}
        >
          {text}
        </h2>
      </div>
    </section>
  );
}
