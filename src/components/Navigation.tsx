'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { navigation } from '@/data/content';
import { headingFont } from '@/app/fonts';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#0a0a0a] border-b border-[#1a1a1a]' : 'bg-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="relative z-50 flex items-center gap-3">
            <Image
              src="https://static.kite.ai/image/upload/e_trim/f_auto,q_auto,h_64/v1786266687/app/0780422a-f84c-42a0-a322-29fdbc3daccb/psxz79ylgy4zfht6scxh.png"
              alt="Gymfriends"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <span className={`${headingFont.className} text-[#F4F4F4] text-sm uppercase tracking-[0.2em] font-semibold`}>
              GYMFRIENDS
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className={`${headingFont.className} uppercase tracking-widest text-[#F4F4F4] text-xs hover:text-[#767676] transition-colors`}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-[#F4F4F4] hover:text-[#767676] transition-colors">
              <ShoppingBag strokeWidth={1} size={24} />
            </button>
          </div>

          <button className="md:hidden relative z-50 text-[#F4F4F4]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X strokeWidth={1} size={28} /> : <Menu strokeWidth={1} size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center">
          <nav className="flex flex-col items-center gap-8">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setMobileMenuOpen(false)}
                className={`${headingFont.className} uppercase tracking-[0.2em] text-[#F4F4F4] text-xl`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
