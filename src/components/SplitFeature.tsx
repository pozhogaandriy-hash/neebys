import Image from 'next/image'
import Link from 'next/link'
import { headingFont, bodyFont } from '@/app/fonts'

export default function SplitFeature() {
  return (
    <section className="py-32 px-6 md:px-12 bg-[#0A0A0A] text-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 relative">
          
          {/* Left Side */}
          <div className="w-full lg:w-1/2 relative aspect-[3/4] lg:aspect-auto lg:h-[800px]">
            <Image 
              src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-new-drops-left.png"
              alt="New drops female"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Overlapping Box */}
            <div className="absolute -bottom-8 left-6 md:-left-8 lg:-bottom-16 lg:-left-12 bg-[#141414]/90 backdrop-blur-sm p-8 md:p-12 w-[calc(100%-3rem)] md:w-[400px] border border-white/10 z-10">
              <h3 className={`${headingFont.className} text-2xl md:text-3xl uppercase tracking-[0.15em] mb-4`}>
                НОВІ ДРОПИ
              </h3>
              <p className={`${bodyFont.className} text-white/70 tracking-wide mb-8 text-sm leading-relaxed`}>
                ФУТУРИСТИЧНИЙ ДИЗАЙН. МАКСИМАЛЬНА ВІДДАЧА. ОНОВЛЕНА КОЛЕКЦІЯ ДЛЯ ТИХ, ХТО НЕ ЗНАЄ МЕЖ.
              </p>
              <Link 
                href="/catalog"
                className={`${bodyFont.className} inline-block border border-white px-8 py-4 uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-none`}
              >
                ДІЗНАТИСЯ БІЛЬШЕ
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-1/2 relative aspect-[3/4] lg:aspect-auto lg:h-[800px] mt-24 lg:mt-32">
            <Image 
              src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-new-drops-right.png"
              alt="New drops male"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Overlapping Box */}
            <div className="absolute -top-8 right-6 md:-right-8 lg:-top-16 lg:-right-12 bg-white p-8 md:p-12 w-[calc(100%-3rem)] md:w-[400px] z-10 text-black">
              <h3 className={`${headingFont.className} text-2xl md:text-3xl uppercase tracking-[0.15em] mb-4`}>
                ТЕХНОЛОГІЇ РУХУ
              </h3>
              <p className={`${bodyFont.className} text-black/70 tracking-wide mb-8 text-sm leading-relaxed`}>
                КОЖНА ДЕТАЛЬ СТВОРЕНА ДЛЯ ТВОГО КОМФОРТУ НА ТРЕНУВАННІ. ІННОВАЦІЙНІ МАТЕРІАЛИ ТА БЕЗДОГАННИЙ КРІЙ.
              </p>
              <Link 
                href="/catalog"
                className={`${bodyFont.className} inline-block bg-[#D2B48C] text-white px-8 py-4 uppercase tracking-widest text-xs hover:bg-black transition-colors rounded-none`}
              >
                ПЕРЕГЛЯНУТИ КАТАЛОГ
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
