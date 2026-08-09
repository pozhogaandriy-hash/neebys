'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { PRODUCT_COLLECTIONS } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState(PRODUCT_COLLECTIONS);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const handleAdd = () => {
    if (!newName || !newSlug) return;
    setCollections((prev) => [...prev, { id: `col-${Date.now()}`, name: newName, slug: newSlug, productCount: 0, status: 'draft' }]);
    setNewName('');
    setNewSlug('');
    setAdding(false);
  };

  const toggleStatus = (id: string) => {
    setCollections((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === 'active' ? 'draft' : 'active' } : c));
  };

  const handleDelete = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminLayout title="Collections" breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Products', href: '/admin/products' }, { label: 'Collections' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>Product Collections</h1>
          <p className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}>{collections.length} collections</p>
        </div>
        <button onClick={() => setAdding(true)} className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-[#E8E8E8] transition-colors`}>
          + New Collection
        </button>
      </div>

      {adding && (
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 mb-4">
          <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>New Collection</h3>
          <div className="flex gap-3 flex-wrap">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Collection name" className={`${bodyFont.className} bg-[#111111] border border-[#1A1A1A] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#333333] flex-1 min-w-[160px]`} />
            <input value={newSlug} onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="slug" className={`${bodyFont.className} bg-[#111111] border border-[#1A1A1A] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#333333] flex-1 min-w-[160px]`} />
            <button onClick={handleAdd} className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-5 py-2.5 hover:bg-[#E8E8E8] transition-colors`}>Add</button>
            <button onClick={() => setAdding(false)} className={`${bodyFont.className} text-sm text-[#555555] border border-[#1A1A1A] px-5 py-2.5 hover:text-white hover:border-[#333333] transition-colors`}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {collections.map((col) => (
          <div key={col.id} className="bg-[#0A0A0A] border border-[#111111] p-5 hover:border-[#1E1E1E] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`${headingFont.className} text-sm text-white font-semibold`}>{col.name}</h3>
                <p className={`${bodyFont.className} text-xs text-[#444444] mt-0.5 font-mono`}>/collections/{col.slug}</p>
              </div>
              <span className={`${bodyFont.className} text-xs flex items-center gap-1.5 ${col.status === 'active' ? 'text-emerald-400' : 'text-[#555555]'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${col.status === 'active' ? 'bg-emerald-500' : 'bg-[#333333]'}`} />
                {col.status}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#111111]">
              <span className={`${bodyFont.className} text-xs text-[#555555]`}>{col.productCount} products</span>
              <div className="flex gap-3">
                <button onClick={() => toggleStatus(col.id)} className={`${bodyFont.className} text-xs text-[#555555] hover:text-white transition-colors`}>
                  {col.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(col.id)} className={`${bodyFont.className} text-xs text-[#444444] hover:text-red-400 transition-colors`}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
