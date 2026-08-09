'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/LangContext';
import { headingFont, bodyFont } from '@/app/fonts';
import { ThemeLogo } from '@/components/ThemeLogo';

const ROLE_KEYS: Record<string, string> = {
  super_admin: 'role_super_admin',
  admin: 'role_admin',
  moderator: 'role_moderator',
  support: 'role_support',
  premium_user: 'role_premium',
  regular_user: 'role_member',
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'text-red-400 bg-red-950/40 border-red-900/50',
  admin: 'text-orange-400 bg-orange-950/40 border-orange-900/50',
  moderator: 'text-amber-400 bg-amber-950/40 border-amber-900/50',
  support: 'text-blue-400 bg-blue-950/40 border-blue-900/50',
  premium_user: 'text-purple-400 bg-purple-950/40 border-purple-900/50',
  regular_user: 'text-[#767676] bg-[#111111] border-[#222222]',
};

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
}

export function AccountLayout({ children, title }: AccountLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const t = useT();

  const NAV_ITEMS = [
    {
      labelKey: 'nav_profile',
      href: '/account/profile',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    },
    {
      labelKey: 'nav_settings',
      href: '/account/settings',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    },
  ];

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--gf-bg)', color: 'var(--gf-text)' }}>
      {/* Top bar */}
      <div className="border-b fixed top-0 left-0 right-0 z-40" style={{ borderColor: 'var(--gf-border)', backgroundColor: 'var(--gf-bg)' }}>
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className={`${headingFont.className} flex items-center gap-2.5 text-xs uppercase tracking-[0.2em]`} style={{ color: 'var(--gf-text)' }}>
            <ThemeLogo
              width={20}
              height={20}
              className="object-contain"
            />
            GYMFRIENDS
          </Link>
          <div className="flex items-center gap-4">
            {(user?.role === 'super_admin' || user?.role === 'admin') && (
              <Link href="/admin" className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] transition-colors`} style={{ color: 'var(--gf-text-faint)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-faint)'; }}
              >
                {t('nav_admin')}
              </Link>
            )}
            <Link href="/catalog" className={`${bodyFont.className} text-sm transition-colors`} style={{ color: 'var(--gf-text-faint)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-faint)'; }}
            >
              {t('account_shop')}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
          {/* Sidebar */}
          <aside>
            {/* User card */}
            <div className="border p-5 mb-4" style={{ backgroundColor: 'var(--gf-bg-raised)', borderColor: 'var(--gf-border)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border" style={{ backgroundColor: 'var(--gf-bg-surface)', borderColor: 'var(--gf-border-mid)' }}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className={`${headingFont.className} text-sm font-semibold`} style={{ color: 'var(--gf-text)' }}>{initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`${headingFont.className} text-sm font-semibold truncate`} style={{ color: 'var(--gf-text)' }}>{user?.name || t('role_guest')}</p>
                  <p className={`${bodyFont.className} text-xs truncate`} style={{ color: 'var(--gf-text-faint)' }}>{user?.email || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${bodyFont.className} text-[10px] px-2 py-0.5 border rounded-sm ${ROLE_COLORS[user?.role || 'regular_user']}`}>
                  {t(ROLE_KEYS[user?.role || 'regular_user'] || 'role_member')}
                </span>
                {!user?.emailVerified && (
                  <span className={`${bodyFont.className} text-[10px] px-2 py-0.5 border border-amber-900/50 bg-amber-950/40 text-amber-400 rounded-sm`}>
                    {t('status_unverified')}
                  </span>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${bodyFont.className} flex items-center gap-3 px-4 py-2.5 text-sm transition-colors`}
                    style={active
                      ? { backgroundColor: 'var(--gf-bg-surface)', color: 'var(--gf-text)' }
                      : { color: 'var(--gf-text-muted)' }
                    }
                    onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--gf-bg-raised)'; } }}
                    onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-muted)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ''; } }}
                  >
                    <span style={{ color: active ? 'var(--gf-text)' : 'var(--gf-text-dim)' }}>{item.icon}</span>
                    {t(item.labelKey)}
                  </Link>
                );
              })}

              <button
                onClick={handleSignOut}
                className={`${bodyFont.className} flex items-center gap-3 px-4 py-2.5 text-sm transition-colors mt-2 border-t pt-4 w-full text-left`}
                style={{ color: 'var(--gf-text-muted)', borderColor: 'var(--gf-border)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--gf-bg-raised)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-muted)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = ''; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                {t('nav_sign_out')}
              </button>
            </nav>
          </aside>

          {/* Main */}
          <main>
            <h1 className={`${headingFont.className} text-lg font-semibold mb-8`} style={{ color: 'var(--gf-text)' }}>{title}</h1>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
