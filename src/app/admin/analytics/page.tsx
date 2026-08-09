'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { DASHBOARD_STATS } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

function BarChart({ data, height = 80 }: { data: { label: string; sessions: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.sessions));
  return (
    <div className="flex items-end gap-2" style={{ height: `${height}px` }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1 group">
          <div className="relative w-full">
            <div
              className="w-full bg-[#1A1A1A] group-hover:bg-[#2A2A2A] transition-colors"
              style={{ height: `${(d.sessions / max) * (height - 20)}px` }}
            />
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className={`${bodyFont.className} text-[9px] text-white whitespace-nowrap`}>{d.sessions}</span>
            </div>
          </div>
          <span className={`${bodyFont.className} text-[10px] text-[#333333]`}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const topPages = [
  { path: '/', views: 4821, bounce: '38%', duration: '2m 14s' },
  { path: '/catalog', views: 3209, bounce: '44%', duration: '3m 07s' },
  { path: '/catalog/p3', views: 1872, bounce: '52%', duration: '1m 48s' },
  { path: '/catalog/p1', views: 1654, bounce: '49%', duration: '1m 52s' },
  { path: '/cart', views: 912, bounce: '22%', duration: '4m 33s' },
  { path: '/shipping', views: 744, bounce: '55%', duration: '1m 12s' },
  { path: '/contact', views: 620, bounce: '41%', duration: '2m 01s' },
];

const trafficSources = [
  { source: 'Organic Search', sessions: 2104, pct: 37 },
  { source: 'Direct', sessions: 1487, pct: 26 },
  { source: 'Social', sessions: 1142, pct: 20 },
  { source: 'Referral', sessions: 685, pct: 12 },
  { source: 'Email', sessions: 286, pct: 5 },
];

export default function AdminAnalyticsPage() {
  const stats = DASHBOARD_STATS;

  return (
    <AdminLayout title="Analytics" breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Analytics' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>Website Analytics</h1>
          <p className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}>Last 7 days overview</p>
        </div>
        <select className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none`}>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Sessions', value: stats.trafficData.reduce((a, b) => a + b.sessions, 0).toLocaleString(), delta: '+12.3%', up: true },
          { label: 'Unique Visitors', value: '4,891', delta: '+8.7%', up: true },
          { label: 'Avg. Session Duration', value: '2m 38s', delta: '+0.3%', up: true },
          { label: 'Bounce Rate', value: '42.1%', delta: '-1.8%', up: true },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#0A0A0A] border border-[#111111] p-5">
            <p className={`${bodyFont.className} text-[#555555] text-xs mb-3`}>{kpi.label}</p>
            <p className={`${headingFont.className} text-2xl font-semibold text-white`}>{kpi.value}</p>
            <p className={`${bodyFont.className} text-xs mt-1 ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.delta} vs last period</p>
          </div>
        ))}
      </div>

      {/* Sessions chart */}
      <div className="bg-[#0A0A0A] border border-[#111111] p-6 mb-4">
        <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-6`}>Sessions by Day</h2>
        <BarChart data={stats.trafficData} height={120} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top pages */}
        <div className="bg-[#0A0A0A] border border-[#111111] p-5">
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-4`}>Top Pages</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0F0F0F]">
                {['Page', 'Views', 'Bounce', 'Duration'].map((h) => (
                  <th key={h} className={`${headingFont.className} text-left text-[9px] uppercase tracking-[0.1em] text-[#2A2A2A] pb-2 font-normal`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0D0D0D]">
              {topPages.map((p) => (
                <tr key={p.path} className="hover:bg-[#0D0D0D] transition-colors">
                  <td className={`${bodyFont.className} text-sm text-[#767676] py-2.5 font-mono`}>{p.path}</td>
                  <td className={`${bodyFont.className} text-sm text-white py-2.5`}>{p.views.toLocaleString()}</td>
                  <td className={`${bodyFont.className} text-sm text-[#555555] py-2.5`}>{p.bounce}</td>
                  <td className={`${bodyFont.className} text-sm text-[#555555] py-2.5`}>{p.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Traffic sources */}
        <div className="bg-[#0A0A0A] border border-[#111111] p-5">
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-4`}>Traffic Sources</h2>
          <div className="flex flex-col gap-3">
            {trafficSources.map((s) => (
              <div key={s.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`${bodyFont.className} text-sm text-[#767676]`}>{s.source}</span>
                  <span className={`${bodyFont.className} text-sm text-white`}>{s.sessions.toLocaleString()}</span>
                </div>
                <div className="w-full h-1 bg-[#111111]">
                  <div className="h-full bg-[#333333]" style={{ width: `${s.pct}%` }} />
                </div>
                <p className={`${bodyFont.className} text-[10px] text-[#333333] mt-0.5`}>{s.pct}% of total</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
