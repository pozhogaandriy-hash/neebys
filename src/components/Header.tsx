'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { headingFont, bodyFont } from '@/app/fonts';
import { content, menuCategories, collections } from '@/data/content';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/LangContext';
import { CartDrawer } from '@/components/CartDrawer';
import { HeaderSearch } from '@/components/HeaderSearch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeLogo } from '@/components/ThemeLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Role labels are now resolved via t() — this map is kept as key lookup
const ROLE_KEYS: Record<string, string> = {
  super_admin: 'role_super_admin',
  admin: 'role_admin',
  moderator: 'role_moderator',
  support: 'role_support',
  premium_user: 'role_premium',
  regular_user: 'role_member',
};

// Nav item href → translation key
const NAV_LABEL_KEYS: Record<string, string> = {
  '/': 'nav_label_home',
  '/catalog': 'nav_label_catalog',
  '/shipping': 'nav_label_shipping',
  '/contact': 'nav_label_contact',
};

// Category group title → translation key
const CAT_TITLE_KEYS: Record<string, string> = {
  'Tops': 'cat_tops',
  'Bottoms': 'cat_bottoms',
  'Outerwear': 'cat_outerwear',
  'Accessories': 'cat_accessories',
};

// Category item → translation key
const CAT_ITEM_KEYS: Record<string, string> = {
  'T-Shirts': 'cat_item_tshirts',
  'Tank Tops': 'cat_item_tank_tops',
  'Long Sleeves': 'cat_item_long_sleeves',
  'Hoodies': 'cat_item_hoodies',
  'Compression Tops': 'cat_item_compression_tops',
  'Shorts': 'cat_item_shorts',
  'Joggers': 'cat_item_joggers',
  'Leggings': 'cat_item_leggings',
  'Compression Tights': 'cat_item_compression_tights',
  'Track Pants': 'cat_item_track_pants',
  'Hoodies & Zip-ups': 'cat_item_hoodies_zipups',
  'Jackets': 'cat_item_jackets',
  'Windbreakers': 'cat_item_windbreakers',
  'Vests': 'cat_item_vests',
  'Gym Bags': 'cat_item_gym_bags',
  'Caps': 'cat_item_caps',
  'Socks': 'cat_item_socks',
  'Wrist Wraps': 'cat_item_wrist_wraps',
  'Shakers': 'cat_item_shakers',
};

// Collection slug → name/description translation keys
const COL_NAME_KEYS: Record<string, string> = {
  'new-arrivals': 'col_new_arrivals',
  'essentials': 'col_essentials',
  'performance': 'col_performance',
  'streetwear': 'col_streetwear',
  'limited-edition': 'col_limited_edition',
};
const COL_DESC_KEYS: Record<string, string> = {
  'new-arrivals': 'col_new_arrivals_desc',
  'essentials': 'col_essentials_desc',
  'performance': 'col_performance_desc',
  'streetwear': 'col_streetwear_desc',
  'limited-edition': 'col_limited_edition_desc',
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const t = useT();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    if (!accountOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-account-menu]')) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [accountOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'border-b py-4' : 'bg-transparent py-6'
        }`}
        style={isScrolled ? { backgroundColor: 'var(--gf-header-scroll-bg)', borderColor: 'var(--gf-border)' } : undefined}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">

          {/* Left cluster: menu trigger + search */}
          <div className="flex items-center gap-4">
            {/* Menu trigger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? t('aria_close_menu') : t('aria_open_menu')}
              className="relative z-[70] transition-colors gf-text-muted hover:gf-text"
              style={{ color: 'var(--gf-text)' }}
            >
              {menuOpen ? (
                <X strokeWidth={1.2} size={24} />
              ) : (
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="1" y1="2" x2="21" y2="2" />
                  <line x1="1" y1="9" x2="21" y2="9" />
                  <line x1="1" y1="16" x2="21" y2="16" />
                </svg>
              )}
            </button>

            {/* Search — desktop only */}
            <div className="hidden md:flex">
              <HeaderSearch variant="bar" />
            </div>
          </div>

          {/* Logo — center */}
          <Link href="/" className="relative z-[70] inline-flex flex-col items-center justify-center gap-1">
            <ThemeLogo
              width={32}
              height={32}
              className="object-contain mx-auto"
              priority
            />
            <span className={`${headingFont.className} text-[10px] uppercase tracking-[0.2em] font-semibold text-center leading-none`} style={{ color: 'var(--gf-text)' }}>
              GYMFRIENDS
            </span>

          </Link>

          {/* Right cluster: language + theme toggle + account/login + cart */}
          <div className="flex items-center gap-3">

            {/* Language switcher */}
            <div className="hidden md:flex">
              <LanguageSwitcher />
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Account / Sign in */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" data-account-menu>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: 'var(--gf-text)' }}
                  aria-label={t('aria_account_menu')}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center border" style={{ backgroundColor: 'var(--gf-bg-surface)', borderColor: 'var(--gf-border)' }}>
                    <span className={`${headingFont.className} text-[10px]`} style={{ color: 'var(--gf-text)' }}>{initials}</span>
                  </div>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`}>
                    <polyline points="2,3 5,7 8,3" />
                  </svg>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-10 w-52 py-1 shadow-2xl z-[60] border" style={{ backgroundColor: 'var(--gf-bg-raised)', borderColor: 'var(--gf-border)' }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--gf-border-sub)' }}>
                      <p className={`${headingFont.className} text-xs truncate`} style={{ color: 'var(--gf-text)' }}>{user?.name}</p>
                      <p className={`${bodyFont.className} text-[10px] truncate`} style={{ color: 'var(--gf-text-dim)' }}>                       {t(ROLE_KEYS[user?.role || 'regular_user'] || 'role_member')}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/account/profile" onClick={() => setAccountOpen(false)} className={`${bodyFont.className} flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors`} style={{ color: 'var(--gf-text-muted)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--gf-bg-surface)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ''; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {t('nav_profile')}
                      </Link>
                      <Link href="/account/settings" onClick={() => setAccountOpen(false)} className={`${bodyFont.className} flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors`} style={{ color: 'var(--gf-text-muted)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--gf-bg-surface)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ''; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {t('nav_settings')}
                      </Link>
                      {isAdmin && (
                        <>
                          <div className="border-t my-1" style={{ borderColor: 'var(--gf-border-sub)' }} />
                          <Link href="/admin" onClick={() => setAccountOpen(false)} className={`${bodyFont.className} flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors`} style={{ color: 'var(--gf-text-faint)' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--gf-bg-surface)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-faint)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ''; }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                            {t('nav_admin_dashboard')}
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="border-t pt-1" style={{ borderColor: 'var(--gf-border-sub)' }}>
                      <button
                        onClick={() => { signOut(); setAccountOpen(false); }}
                        className={`${bodyFont.className} flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors w-full text-left`}
                        style={{ color: 'var(--gf-text-faint)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--gf-bg-surface)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-faint)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = ''; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        {t('nav_sign_out')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                aria-label="User Login Button"
                className="hidden md:flex w-[90px] h-[32px] rounded-[10px] cursor-pointer transition-all duration-300 items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(to bottom right, var(--gf-text) 0%, transparent 30%)',
                  backgroundColor: 'color-mix(in srgb, var(--gf-text) 10%, transparent)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = 'color-mix(in srgb, var(--gf-text) 25%, transparent)';
                  el.style.boxShadow = '0 0 10px color-mix(in srgb, var(--gf-text) 40%, transparent)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = 'color-mix(in srgb, var(--gf-text) 10%, transparent)';
                  el.style.boxShadow = '';
                }}
              >
                <div className="w-[86px] h-[28px] rounded-[8px] flex items-center justify-center gap-[8px] font-semibold text-xs" style={{ backgroundColor: 'var(--gf-bg-surface)', color: 'var(--gf-text)' }}>
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <g data-name="Layer 2">
                      <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
                    </g>
                  </svg>
                  <p>{t('nav_log_in')}</p>
                </div>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openDrawer}
              aria-label={`${t('drawer_cart')}${totalItems > 0 ? `, ${totalItems}` : ''}`}
              className="relative transition-colors"
              style={{ color: 'var(--gf-text)' }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h12a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="19" y2="6" />
                <path d="M14 10a3 3 0 01-6 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  className={`${headingFont.className} absolute -top-2 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none`}
                  style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Slide-out mega menu ──────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[55] backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Panel — slides in from left */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-[60] w-full max-w-[540px] border-r overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--gf-menu-bg)', borderColor: 'var(--gf-border)' }}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <span className={`${headingFont.className} text-sm uppercase tracking-[0.2em]`} style={{ color: 'var(--gf-text)' }}>
            {t('nav_menu')}
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="transition-colors"
            style={{ color: 'var(--gf-text-faint)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-faint)'; }}
            aria-label={t('aria_close_menu')}
          >
            <X strokeWidth={1.2} size={24} />
          </button>
        </div>

        {/* Search on mobile */}
        <div className="px-8 pb-6 md:hidden">
          <HeaderSearch variant="drawer" />
        </div>

        {/* Language switcher — mobile */}
        <div className="px-8 pb-4 md:hidden">
          <LanguageSwitcher />
        </div>

        {/* Page links */}
        <div className="px-8 pb-6 flex flex-col gap-1">
          {content.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`${headingFont.className} text-[13px] uppercase tracking-[0.15em] py-2.5 transition-colors`}
              style={{ color: 'var(--gf-text-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
            >
              {t(NAV_LABEL_KEYS[item.href] || 'nav_label_home')}
            </Link>
          ))}
        </div>

        <div className="mx-8 border-t" style={{ borderColor: 'var(--gf-border-sub)' }} />

        {/* Categories — 2-column grid */}
        <div className="px-8 py-8">
          <p className={`${headingFont.className} text-[10px] uppercase tracking-[0.2em] mb-6`} style={{ color: 'var(--gf-text-faint)' }}>
            {t('nav_shop_by_category')}
          </p>
          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            {menuCategories.map((cat) => (
              <div key={cat.title}>
                <p className={`${headingFont.className} text-xs uppercase tracking-[0.12em] mb-3`} style={{ color: 'var(--gf-text)' }}>
                  {t(CAT_TITLE_KEYS[cat.title] || cat.title)}
                </p>
                <ul className="flex flex-col gap-2">
                  {cat.items.map((item) => (
                    <li key={item}>
                      <Link
                        href={`/catalog?category=${encodeURIComponent(item)}`}
                        onClick={() => setMenuOpen(false)}
                        className={`${bodyFont.className} text-sm transition-colors`}
                        style={{ color: 'var(--gf-text-muted)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
                      >
                        {t(CAT_ITEM_KEYS[item] || item)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-8 border-t" style={{ borderColor: 'var(--gf-border-sub)' }} />

        {/* Collections */}
        <div className="px-8 py-8">
          <p className={`${headingFont.className} text-[10px] uppercase tracking-[0.2em] mb-5`} style={{ color: 'var(--gf-text-faint)' }}>
            {t('nav_collections')}
          </p>
          <div className="flex flex-col gap-4">
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/catalog?collection=${col.slug}`}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between"
              >
                <div>
                  <p className={`${headingFont.className} text-sm uppercase tracking-[0.1em] transition-colors`} style={{ color: 'var(--gf-text)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLParagraphElement).style.color = 'var(--gf-text-muted)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLParagraphElement).style.color = 'var(--gf-text)'; }}
                  >
                    {t(COL_NAME_KEYS[col.slug] || col.slug)}
                  </p>
                  <p className={`${bodyFont.className} text-[11px]`} style={{ color: 'var(--gf-text-dim)' }}>
                    {t(COL_DESC_KEYS[col.slug] || col.slug)}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" className="flex-shrink-0 transition-colors" style={{ color: 'var(--gf-border)' }}>
                  <polyline points="5,2 10,7 5,12" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-8 border-t" style={{ borderColor: 'var(--gf-border-sub)' }} />

        {/* Auth links (mobile only when menu doubles as mobile nav) */}
        <div className="px-8 py-8 lg:hidden">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link href="/account/profile" onClick={() => setMenuOpen(false)} className={`${headingFont.className} text-xs uppercase tracking-[0.15em] transition-colors`} style={{ color: 'var(--gf-text-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
              >
                {t('nav_account')}
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className={`${headingFont.className} text-xs uppercase tracking-[0.15em] transition-colors`} style={{ color: 'var(--gf-text-faint)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-faint)'; }}
                >
                  {t('nav_admin')}
                </Link>
              )}
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className={`${headingFont.className} text-xs uppercase tracking-[0.15em] transition-colors text-left`}
                style={{ color: 'var(--gf-text-faint)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-faint)'; }}
              >
                {t('nav_sign_out')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/auth/sign-in" onClick={() => setMenuOpen(false)} className={`${headingFont.className} text-xs uppercase tracking-[0.15em] transition-colors`} style={{ color: 'var(--gf-text-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; }}
              >
                {t('nav_sign_in')}
              </Link>
            </div>
          )}
        </div>
      </div>

      <CartDrawer />
    </>
  );
}
