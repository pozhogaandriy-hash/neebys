'use client';

import { useState, ReactNode } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { ADMIN_NOTIFICATIONS, AdminNotification } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

const TYPE_ICON: Record<AdminNotification['type'], ReactNode> = {
  registration: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  security: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  server: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  contact: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  order: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>,
  system: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0117 19.07M4.93 4.93A10 10 0 017 19.07"/></svg>,
};

const SEVERITY_STYLES: Record<AdminNotification['severity'], { border: string; dot: string }> = {
  critical: { border: 'border-red-900/40 bg-red-950/10', dot: 'bg-red-500' },
  warning: { border: 'border-amber-900/30 bg-amber-950/10', dot: 'bg-amber-500' },
  info: { border: 'border-[#111111] bg-[#0A0A0A]', dot: 'bg-blue-500' },
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(ADMIN_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const displayed = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AdminLayout title="Notifications" breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Notifications' }]}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>Notifications</h1>
          {unreadCount > 0 && (
            <p className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}>{unreadCount} unread</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className={`${bodyFont.className} text-xs border px-4 py-2 transition-colors ${filter === 'unread' ? 'border-white text-white' : 'border-[#1A1A1A] text-[#555555] hover:border-[#333333] hover:text-white'}`}
          >
            {filter === 'unread' ? 'Show All' : 'Unread Only'}
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className={`${bodyFont.className} text-xs border border-[#1A1A1A] text-[#555555] px-4 py-2 hover:border-[#333333] hover:text-white transition-colors`}>
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {displayed.length === 0 && (
          <div className="bg-[#0A0A0A] border border-[#111111] py-16 text-center">
            <p className={`${bodyFont.className} text-[#333333]`}>No notifications to display.</p>
          </div>
        )}
        {displayed.map((n) => {
          const styles = SEVERITY_STYLES[n.severity];
          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 border transition-colors cursor-pointer ${styles.border} ${n.read ? 'opacity-50' : ''}`}
              onClick={() => !n.read && markRead(n.id)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.severity === 'critical' ? 'bg-red-950/40 text-red-400' : n.severity === 'warning' ? 'bg-amber-950/40 text-amber-400' : 'bg-blue-950/40 text-blue-400'}`}>
                {TYPE_ICON[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {!n.read && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />}
                    <p className={`${headingFont.className} text-sm text-white font-semibold`}>{n.title}</p>
                  </div>
                  <span className={`${bodyFont.className} text-[11px] text-[#444444] whitespace-nowrap`}>{n.timestamp}</span>
                </div>
                <p className={`${bodyFont.className} text-sm text-[#555555] mt-1`}>{n.message}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <span className={`${bodyFont.className} text-[9px] uppercase tracking-wider px-2 py-0.5 border ${n.severity === 'critical' ? 'border-red-900/40 text-red-400' : n.severity === 'warning' ? 'border-amber-900/40 text-amber-400' : 'border-blue-900/40 text-blue-400'}`}>
                  {n.severity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
