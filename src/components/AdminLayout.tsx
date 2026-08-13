'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { headingFont, bodyFont } from '@/app/fonts';
import { ADMIN_NOTIFICATIONS } from '@/data/auth';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
      { label: 'Analytics', href: '/admin/analytics', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
      { label: 'Notifications', href: '/admin/notifications', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>, badge: ADMIN_NOTIFICATIONS.filter(n => !n.read).length },
    ],
  },
  {
    label: 'Users',
    items: [
      { label: 'Users', href: '/admin/users', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    ],
  },
  {
    label: 'Products',
    items: [
      { label: 'All Products', href: '/admin/products', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
      { label: 'Categories', href: '/admin/categories', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> },
      { label: 'Collections', href: '/admin/collections', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h5l2-4 2 4 2-2 2 2h5M3 7v12a2 2 0 002 2h14a2 2 0 002-2V7"/></svg> },
      { label: 'Product Analytics', href: '/admin/product-analytics', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    ],
  },
  {
  label: 'Orders',
  href: '/admin/orders',
  icon: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
      />
      <path d="M3 9h18" />
      <path d="M8 4v5" />
      <path d="M16 4v5" />
    </svg>
  ),
  permission: 'manage_orders',
},
  {
    label: 'Security',
    items: [
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
    ],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function AdminLayout({ children, title, breadcrumb }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = ADMIN_NOTIFICATIONS.filter(n => !n.read).length;

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 w-[220px] bg-[#080808] border-r border-[#111111] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Brand */}
        <div className="px-4 h-14 flex items-center border-b border-[#111111] flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="https://static.kite.ai/image/upload/e_trim/f_auto,q_auto,h_64/v1786266687/app/0780422a-f84c-42a0-a322-29fdbc3daccb/psxz79ylgy4zfht6scxh.png"
              alt="Gymfriends"
              width={18}
              height={18}
              className="h-4.5 w-auto object-contain"
            />
            <span className={`${headingFont.className} text-white text-[11px] uppercase tracking-[0.2em]`}>Gymfriends</span>
          </Link>
          <span className={`${bodyFont.className} ml-auto text-[9px] uppercase tracking-wider text-[#333333] border border-[#1A1A1A] px-1.5 py-0.5`}>Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-5">
              <p className={`${headingFont.className} text-[9px] uppercase tracking-[0.15em] text-[#2A2A2A] px-3 mb-1.5`}>{group.label}</p>
              {group.items ? (
                group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-sm transition-colors mb-0.5 ${active ? 'bg-[#141414] text-white' : 'text-[#555555] hover:text-white hover:bg-[#0E0E0E]'}`}
                    >
                      <span className={active ? 'text-white' : 'text-[#333333]'}>{item.icon}</span>
                      <span className={bodyFont.className}>{item.label}</span>
                      {'badge' in item && (item.badge as number) > 0 && (
                        <span className="ml-auto bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                          {item.badge as number}
                        </span>
                      )}
                    </Link>
                  );
                })
              ) : group.href ? (
                <Link
                  key={group.href}
                  href={group.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-sm transition-colors mb-0.5 ${isActive(group.href) ? 'bg-[#141414] text-white' : 'text-[#555555] hover:text-white hover:bg-[#0E0E0E]'}`}
                >
                  <span className={isActive(group.href) ? 'text-white' : 'text-[#333333]'}>{group.icon}</span>
                  <span className={bodyFont.className}>{group.label}</span>
                </Link>
              ) : null}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#111111] p-3">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
              <span className={`${headingFont.className} text-white text-[10px]`}>{initials}</span>
            </div>
            <div className="min-w-0">
              <p className={`${bodyFont.className} text-white text-xs truncate`}>{user?.name || 'Admin'}</p>
              <p className={`${bodyFont.className} text-[#444444] text-[10px] truncate`}>{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/account/profile" className={`${bodyFont.className} text-[11px] text-[#444444] hover:text-white flex-1 text-center py-1.5 border border-[#111111] hover:border-[#222222] transition-colors`}>
              Profile
            </Link>
            <button onClick={handleSignOut} className={`${bodyFont.className} text-[11px] text-[#444444] hover:text-red-400 flex-1 text-center py-1.5 border border-[#111111] hover:border-red-900/50 transition-colors`}>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main area */}
      <div className="flex-1 lg:ml-[220px] flex flex-col min-h-screen">
        {/* Topbar */}
        <div className="h-14 bg-[#080808] border-b border-[#111111] flex items-center gap-4 px-6 sticky top-0 z-30">
          <button
            className="lg:hidden text-[#555555] hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {breadcrumb ? (
              breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-[#2A2A2A]">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className={`${bodyFont.className} text-sm text-[#555555] hover:text-white transition-colors`}>{crumb.label}</Link>
                  ) : (
                    <span className={`${bodyFont.className} text-sm text-white`}>{crumb.label}</span>
                  )}
                </span>
              ))
            ) : (
              <span className={`${bodyFont.className} text-sm text-white`}>{title}</span>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link href="/admin/notifications" className="relative text-[#555555] hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </Link>
            <Link href="/" className={`${bodyFont.className} text-[11px] text-[#444444] border border-[#111111] px-3 py-1.5 hover:text-white hover:border-[#222222] transition-colors`}>
              View Site
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
