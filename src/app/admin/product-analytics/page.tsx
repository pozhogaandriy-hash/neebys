'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { ADMIN_PRODUCTS } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

export default function ProductAnalyticsPage() {
  const sorted = [...ADMIN_PRODUCTS].sort((a, b) => b.revenue - a.revenue);
  const topSellers = [...ADMIN_PRODUCTS].sort((a, b) => b.sales - a.sales);
  const recentlyAdded = [...ADMIN_PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  const totalRevenue = ADMIN_PRODUCTS.reduce((a, b) => a + b.revenue, 0);
  const totalSales = ADMIN_PRODUCTS.reduce((a, b) => a + b.sales, 0);
  const totalViews = ADMIN_PRODUCTS.reduce((a, b) => a + b.views, 0);
  const avgConversion = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(2) : '0.00';

  function MiniBar({ value, max }: { value: number; max: number }) {
    return (
      <div className="w-20 h-1.5 bg-[#111111]">
        <div className="h-full bg-[#333333]" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    );
  }

  const maxRevenue = Math.max(...ADMIN_PRODUCTS.map((p) => p.revenue));
  const maxSales = Math.max(...ADMIN_PRODUCTS.map((p) => p.sales));

  return (
    <AdminLayout title="Product Analytics" breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Product Analytics' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>Product Analytics</h1>
          <p className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}>All-time product performance</p>
        </div>
        <select className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none`}>
          <option>All time</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Revenue', value: `₴${totalRevenue.toLocaleString()}`, sub: 'All published products' },
          { label: 'Total Sales', value: totalSales.toLocaleString(), sub: 'Units sold' },
          { label: 'Total Views', value: totalViews.toLocaleString(), sub: 'Product page views' },
          { label: 'Avg. Conversion', value: `${avgConversion}%`, sub: 'Views to sales' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#0A0A0A] border border-[#111111] p-5">
            <p className={`${bodyFont.className} text-[#555555] text-xs mb-2`}>{kpi.label}</p>
            <p className={`${headingFont.className} text-2xl font-semibold text-white`}>{kpi.value}</p>
            <p className={`${bodyFont.className} text-xs text-[#333333] mt-1`}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Revenue by product */}
        <div className="bg-[#0A0A0A] border border-[#111111] p-5">
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-4`}>Revenue by Product</h2>
          <div className="flex flex-col divide-y divide-[#0D0D0D]">
            {sorted.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-3">
                <div className="w-8 h-8 bg-[#111111] overflow-hidden flex-shrink-0">
                  <Image src={p.image} alt={p.name} width={32} height={32} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${bodyFont.className} text-xs text-white truncate`}>{p.name}</p>
                  <MiniBar value={p.revenue} max={maxRevenue} />
                </div>
                <span className={`${bodyFont.className} text-sm text-white whitespace-nowrap`}>₴{p.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top sellers */}
        <div className="bg-[#0A0A0A] border border-[#111111] p-5">
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-4`}>Best Sellers (Units)</h2>
          <div className="flex flex-col divide-y divide-[#0D0D0D]">
            {topSellers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-3">
                <span className={`${headingFont.className} text-xl font-semibold ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-[#767676]' : 'text-[#333333]'} w-6`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`${bodyFont.className} text-xs text-white truncate`}>{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MiniBar value={p.sales} max={maxSales} />
                    <span className={`${bodyFont.className} text-[10px] text-[#444444]`}>{p.sales} sold</span>
                  </div>
                </div>
                <span className={`${bodyFont.className} text-xs text-[#555555]`}>{p.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently added */}
      <div className="bg-[#0A0A0A] border border-[#111111] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676]`}>Recently Added</h2>
          <Link href="/admin/products" className={`${bodyFont.className} text-[11px] text-[#444444] hover:text-white transition-colors`}>View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {recentlyAdded.map((p) => (
            <Link key={p.id} href={`/admin/products/${p.id}`} className="bg-[#0D0D0D] border border-[#111111] hover:border-[#1E1E1E] transition-colors p-3">
              <div className="aspect-square bg-[#111111] mb-3 overflow-hidden relative">
                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="160px" />
              </div>
              <p className={`${bodyFont.className} text-xs text-white truncate`}>{p.name}</p>
              <p className={`${bodyFont.className} text-[10px] text-[#444444] mt-0.5`}>Added {p.createdAt}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
