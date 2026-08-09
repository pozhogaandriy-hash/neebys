'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { PRODUCT_CATEGORIES } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(PRODUCT_CATEGORIES);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const handleAdd = () => {
    if (!newName || !newSlug) return;
    setCategories((prev) => [...prev, { id: `cat-${Date.now()}`, name: newName, slug: newSlug, productCount: 0, status: 'draft' }]);
    setNewName('');
    setNewSlug('');
    setAdding(false);
  };

  const toggleStatus = (id: string) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === 'active' ? 'draft' : 'active' } : c));
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminLayout title="Categories" breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Products', href: '/admin/products' }, { label: 'Categories' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>Product Categories</h1>
          <p className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}>{categories.length} categories</p>
        </div>
        <button onClick={() => setAdding(true)} className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-[#E8E8E8] transition-colors`}>
          + New Category
        </button>
      </div>

      {adding && (
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 mb-4">
          <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>New Category</h3>
          <div className="flex gap-3 flex-wrap">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Category name" className={`${bodyFont.className} bg-[#111111] border border-[#1A1A1A] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#333333] flex-1 min-w-[160px]`} />
            <input value={newSlug} onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="slug" className={`${bodyFont.className} bg-[#111111] border border-[#1A1A1A] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#333333] flex-1 min-w-[160px]`} />
            <button onClick={handleAdd} className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-5 py-2.5 hover:bg-[#E8E8E8] transition-colors`}>Add</button>
            <button onClick={() => setAdding(false)} className={`${bodyFont.className} text-sm text-[#555555] border border-[#1A1A1A] px-5 py-2.5 hover:text-white hover:border-[#333333] transition-colors`}>Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#0A0A0A] border border-[#111111]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#111111]">
              {['Name', 'Slug', 'Products', 'Status', 'Actions'].map((h) => (
                <th key={h} className={`${headingFont.className} text-left text-[10px] uppercase tracking-[0.12em] text-[#333333] px-4 py-3 font-normal`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0D0D0D]">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#0D0D0D] transition-colors">
                <td className={`${bodyFont.className} px-4 py-3 text-sm text-white`}>{cat.name}</td>
                <td className={`${bodyFont.className} px-4 py-3 text-xs text-[#444444] font-mono`}>{cat.slug}</td>
                <td className={`${bodyFont.className} px-4 py-3 text-sm text-[#555555]`}>{cat.productCount}</td>
                <td className="px-4 py-3">
                  <span className={`${bodyFont.className} text-xs flex items-center gap-1.5 ${cat.status === 'active' ? 'text-emerald-400' : 'text-[#555555]'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 'active' ? 'bg-emerald-500' : 'bg-[#333333]'}`} />{cat.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(cat.id)} className={`${bodyFont.className} text-xs text-[#555555] hover:text-white transition-colors`}>
                      {cat.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <span className="text-[#222222]">|</span>
                    <button onClick={() => handleDelete(cat.id)} className={`${bodyFont.className} text-xs text-[#444444] hover:text-red-400 transition-colors`}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
