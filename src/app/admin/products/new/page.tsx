'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { headingFont, bodyFont } from '@/app/fonts';

export default function NewProductPage() {
  return (
    <AdminLayout title="New Product" breadcrumb={[
      { label: 'Admin', href: '/admin' },
      { label: 'Products', href: '/admin/products' },
      { label: 'New Product' },
    ]}>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>Add New Product</h1>
        <Link href="/admin/products/p1" className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-[#E8E8E8] transition-colors`}>
          Open Demo Product Editor →
        </Link>
      </div>
      <div className="bg-[#0A0A0A] border border-[#111111] p-8 text-center">
        <div className="w-12 h-12 border border-dashed border-[#333333] flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
        <p className={`${bodyFont.className} text-[#555555] text-sm mb-4`}>The full product editor is available for existing products. Click the button above to open the demo editor with all fields.</p>
        <p className={`${bodyFont.className} text-[#333333] text-xs`}>In production, this page would contain the same editor as the edit view, pre-populated with empty fields.</p>
      </div>
    </AdminLayout>
  );
}
