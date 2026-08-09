'use client';

import Link from 'next/link';
import { bodyFont, headingFont } from '@/app/fonts';
import { content } from '@/data/content';
import { ThemeLogo } from '@/components/ThemeLogo';
import { useT } from '@/context/LangContext';

// Nav item href → translation key (mirrors Header.tsx)
const NAV_LABEL_KEYS: Record<string, string> = {
  '/': 'nav_label_home',
  '/catalog': 'nav_label_catalog',
  '/shipping': 'nav_label_shipping',
  '/contact': 'nav_label_contact',
};

export function Footer() {
  const t = useT();

  return (
    <footer className="border-t pt-24 pb-12" style={{ backgroundColor: 'var(--gf-bg)', borderColor: 'var(--gf-border)' }}>
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <ThemeLogo
              width={40}
              height={40}
              className="object-contain"
            />
            <span className={`${headingFont.className} text-base uppercase tracking-[0.2em] font-semibold`} style={{ color: 'var(--gf-text)' }}>
              GYMFRIENDS
            </span>
          </Link>
          <p className={`${bodyFont.className} max-w-sm leading-relaxed`} style={{ color: 'var(--gf-text-muted)' }}>
            {t('footer_tagline')}
          </p>
        </div>
        
        <div>
          <h4 className={`${headingFont.className} text-xs uppercase tracking-[0.2em] mb-6`} style={{ color: 'var(--gf-text)' }}>{t('footer_nav_title')}</h4>
          <ul className="flex flex-col gap-4">
            {content.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`${bodyFont.className} transition-colors text-sm`} style={{ color: 'var(--gf-text-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
                >
                  {t(NAV_LABEL_KEYS[item.href] || item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={`${headingFont.className} text-xs uppercase tracking-[0.2em] mb-6`} style={{ color: 'var(--gf-text)' }}>{t('footer_account_title')}</h4>
          <ul className="flex flex-col gap-4">
            <li>
              <Link href="/auth/sign-in" className={`${bodyFont.className} transition-colors text-sm`} style={{ color: 'var(--gf-text-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
              >
                {t('nav_sign_in')}
              </Link>
            </li>
            <li>
              <Link href="/auth/sign-up" className={`${bodyFont.className} transition-colors text-sm`} style={{ color: 'var(--gf-text-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
              >
                {t('nav_create_account')}
              </Link>
            </li>
            <li>
              <Link href="/account/profile" className={`${bodyFont.className} transition-colors text-sm`} style={{ color: 'var(--gf-text-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
              >
                {t('nav_my_profile')}
              </Link>
            </li>
            <li>
              <Link href="/shipping" className={`${bodyFont.className} transition-colors text-sm`} style={{ color: 'var(--gf-text-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
              >
                {t('footer_shipping_link')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center border-t pt-8" style={{ borderColor: 'var(--gf-border)' }}>
        <p className={`${bodyFont.className} text-xs`} style={{ color: 'var(--gf-text-muted)' }}>
          &copy; {new Date().getFullYear()} GYMFRIENDS. {t('footer_rights')}
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="https://www.instagram.com/gymfriends2026?igsh=MWJxczIzcjMyMHgyOA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className={`${bodyFont.className} text-xs transition-colors`} style={{ color: 'var(--gf-text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
          >INSTAGRAM</Link>
          <Link href="https://t.me/gymfriends_shop" target="_blank" rel="noopener noreferrer" className={`${bodyFont.className} text-xs transition-colors`} style={{ color: 'var(--gf-text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
          >TELEGRAM</Link>
        </div>
      </div>
    </footer>
  );
}
