'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { headingFont, bodyFont } from '@/app/fonts'

export default function Hero() {
  const [offsetY, setOffsetY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-clip bg-[#0A0A0A] flex items-center justify-center">
      <div 
        className="absolute inset-0 w-full h-[120vh] -top-[10vh] z-0"
        style={{ transform: `translateY(${offsetY * 0.4}px)` }}
      >
        <Image 
          src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1600/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-hero-main.png"
          alt="Neebys Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <p className={`${bodyFont.className} text-sm md:text-base text-white/90 uppercase tracking-[0.2em] mb-12 max-w-xl mx-auto drop-shadow-lg`}>
          НОВИЙ РІВЕНЬ ТРЕНУВАНЬ. ТВОЯ ЕНЕРГІЯ. ТВІЙ СТИЛЬ.
        </p>
        <Link 
          href="/catalog"
          className={`${bodyFont.className} bg-white text-black px-12 py-5 uppercase tracking-[0.2em] text-sm font-bold hover:bg-[#D2B48C] hover:text-white transition-colors rounded-none`}
        >
          КАТАЛОГ
        </Link>
      </div>
    </section>
  )
}
