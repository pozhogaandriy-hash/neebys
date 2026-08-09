'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { DASHBOARD_STATS, ADMIN_NOTIFICATIONS } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';
import Link from 'next/link';

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'text-red-400',
  admin: 'text-orange-400',
  moderator: 'text-amber-400',
  support: 'text-blue-400',
  premium_user: 'text-purple-400',
  regular_user: 'text-[#767676]',
};

function StatCard({ label, value, sub, color = 'text-white', href }: { label: string; value: string | number; sub?: string; color?: string; href?: string }) {
  const inner = (
    <div className="bg-[#0A0A0A] border border-[#111111] p-5 hover:border-[#1E1E1E] transition-colors">
      <p className={`${bodyFont.className} text-[#555555] text-xs mb-3`}>{label}</p>
      <p className={`${headingFont.className} text-2xl font-semibold ${color}`}>{value}</p>
      {sub && <p className={`${bodyFont.className} text-[#444444] text-xs mt-1`}>{sub}</p>}
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}

function MiniBarChart({ data }: { data: { label: string; sessions: number }[] }) {
  const max = Math.max(...data.map((d) => d.sessions));
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full bg-[#222222] hover:bg-[#333333] transition-colors"
            style={{ height: `${(d.sessions / max) * 56}px` }}
          />
          <span className={`${bodyFont.className} text-[9px] text-[#333333]`}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const stats = DASHBOARD_STATS;
  const unread = ADMIN_NOTIFICATIONS.filter((n) => !n.read);

  return (
    <AdminLayout title="Dashboard" breadcrumb={[{ label: 'Admin' }, { label: 'Dashboard' }]}>
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} sub={`+${stats.newUsersToday} today`} href="/admin/users" />
        <StatCard label="Active Users (24h)" value={stats.activeUsers.toLocaleString()} href="/admin/analytics" />
        <StatCard label="Published Products" value={`${stats.publishedProducts} / ${stats.totalProducts}`} href="/admin/products" />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString()} sub={`${stats.pendingOrders} pending`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <StatCard label="Total Revenue" value={stats.revenue} sub={stats.revenueGrowth + ' this month'} color="text-emerald-400" />
        <StatCard label="Server Uptime" value={stats.serverUptime} color="text-emerald-400" />
        <StatCard label="Avg. Response Time" value={stats.avgResponseTime} sub={`Error rate ${stats.errorRate}`} />
      </div>

      {/* Charts and tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Traffic */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#111111] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676]`}>Sessions — Last 7 Days</h3>
            <Link href="/admin/analytics" className={`${bodyFont.className} text-[11px] text-[#444444] hover:text-white transition-colors`}>View all →</Link>
          </div>
          <MiniBarChart data={stats.trafficData} />
          <div className="flex justify-between mt-3">
            <span className={`${bodyFont.className} text-xs text-[#444444]`}>Total: {stats.trafficData.reduce((a, b) => a + b.sessions, 0).toLocaleString()} sessions</span>
            <span className={`${bodyFont.className} text-xs text-emerald-400`}>+12.3% vs last week</span>
          </div>
        </div>

        {/* Server status */}
        <div className="bg-[#0A0A0A] border border-[#111111] p-5">
          <h3 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-5`}>Server Status</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Web Server', status: 'Operational', ok: true },
              { label: 'Database', status: 'Operational', ok: true },
              { label: 'CDN', status: 'Operational', ok: true },
              { label: 'Email Service', status: 'Operational', ok: true },
              { label: 'Error Rate', status: stats.errorRate, ok: parseFloat(stats.errorRate) < 0.5 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className={`${bodyFont.className} text-sm text-[#767676]`}>{row.label}</span>
                <span className={`${bodyFont.className} text-xs flex items-center gap-1.5 ${row.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${row.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent logins + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent logins */}
        <div className="bg-[#0A0A0A] border border-[#111111] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676]`}>Recent Logins</h3>
            <Link href="/admin/audit-logs" className={`${bodyFont.className} text-[11px] text-[#444444] hover:text-white transition-colors`}>View all →</Link>
          </div>
          <div className="flex flex-col divide-y divide-[#0F0F0F]">
            {stats.recentLogins.map((login, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <div>
                  <p className={`${bodyFont.className} text-sm text-white truncate max-w-[200px]`}>{login.user}</p>
                  <p className={`${bodyFont.className} text-[11px] text-[#444444]`}>{login.ip}</p>
                </div>
                <div className="text-right">
                  <p className={`${bodyFont.className} text-xs text-[#555555]`}>Today, {login.time}</p>
                  <p className={`${bodyFont.className} text-[10px] capitalize ${ROLE_COLORS[login.role]}`}>{login.role.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#0A0A0A] border border-[#111111] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676]`}>Recent Alerts</h3>
            <Link href="/admin/notifications" className={`${bodyFont.className} text-[11px] text-[#444444] hover:text-white transition-colors`}>View all →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {unread.slice(0, 4).map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-3 border ${n.severity === 'critical' ? 'border-red-900/40 bg-red-950/20' : n.severity === 'warning' ? 'border-amber-900/30 bg-amber-950/10' : 'border-[#111111] bg-[#0D0D0D]'}`}>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.severity === 'critical' ? 'bg-red-500' : n.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <div className="min-w-0">
                  <p className={`${bodyFont.className} text-sm text-white`}>{n.title}</p>
                  <p className={`${bodyFont.className} text-[11px] text-[#444444] truncate`}>{n.timestamp}</p>
                </div>
              </div>
            ))}
            {unread.length === 0 && (
              <p className={`${bodyFont.className} text-sm text-[#333333] text-center py-4`}>All caught up — no new alerts</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
