'use client'
import { useRef } from 'react'
import { headingFont, bodyFont } from '@/app/fonts'
import { ProductCard } from './ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const bestSellers = [
  { id: 'b1', name: 'STEALTH TECH TEE BLACK', price: '1 200 ₴', sizes: ['S', 'M', 'L', 'XL'], image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-1.png' },
  { id: 'b2', name: 'PHANTOM DRY-FIT TEE GREY', price: '1 100 ₴', sizes: ['S', 'M', 'L'], image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-2.png' },
  { id: 'b3', name: 'OBSIDIAN OVERSIZED TEE', price: '1 350 ₴', sizes: ['M', 'L', 'XL'], image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-3.png' },
  { id: 'b4', name: 'COMPRESSION LONG-SLEEVE ASH', price: '1 400 ₴', sizes: ['S', 'M', 'L'], image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_1200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-4.png' }
]

export default function Carousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-32 px-6 md:px-12 bg-[#0A0A0A] text-white overflow-clip">
      <div className="max-w-[1440px] mx-auto relative">
        <div className="flex justify-between items-end mb-12">
          <h2 className={`${headingFont.className} text-3xl md:text-5xl uppercase tracking-[0.15em]`}>
            ХІТИ ПРОДАЖУ
          </h2>
          <div className="hidden md:flex gap-4">
            <button onClick={() => scroll('left')} className="p-4 border border-white/20 hover:bg-white hover:text-black transition-colors rounded-none">
              <ChevronLeft className="w-6 h-6" strokeWidth={1} />
            </button>
            <button onClick={() => scroll('right')} className="p-4 border border-white/20 hover:bg-white hover:text-black transition-colors rounded-none">
              <ChevronRight className="w-6 h-6" strokeWidth={1} />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bestSellers.map(product => (
            <div key={product.id} className="min-w-[85vw] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(25%-1.5rem)] snap-start shrink-0">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
