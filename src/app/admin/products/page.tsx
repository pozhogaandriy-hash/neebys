'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { ADMIN_PRODUCTS, AdminProduct } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

const STATUS_BADGE: Record<AdminProduct['status'], { label: string; color: string; dot: string }> = {
  published: { label: 'Published', color: 'text-emerald-400', dot: 'bg-emerald-500' },
  draft: { label: 'Draft', color: 'text-[#555555]', dot: 'bg-[#333333]' },
  archived: { label: 'Archived', color: 'text-[#444444]', dot: 'bg-[#2A2A2A]' },
  scheduled: { label: 'Scheduled', color: 'text-blue-400', dot: 'bg-blue-500' },
};

const PAGE_SIZE = 8;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(ADMIN_PRODUCTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionProduct, setActionProduct] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStatusChange = (id: string, status: AdminProduct['status']) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    setActionProduct(null);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setActionProduct(null);
  };

  return (
    <AdminLayout title="Products" breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Products' }]}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>Products</h1>
          <p className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}>{filtered.length} products</p>
        </div>
        <Link href="/admin/products/new" className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-[#E8E8E8] transition-colors`}>
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444]">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search by name or SKU..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${bodyFont.className} w-full bg-[#0A0A0A] border border-[#111111] text-white text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#222222] placeholder:text-[#333333]`} />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none`}>
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none`}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex border border-[#111111]">
          {(['table', 'grid'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-2.5 transition-colors ${view === v ? 'bg-[#1A1A1A] text-white' : 'text-[#444444] hover:text-white'}`}>
              {v === 'table' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="3"/><rect x="3" y="9" width="18" height="3"/><rect x="3" y="15" width="18" height="3"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className={`${bodyFont.className} flex items-center gap-3 px-4 py-2.5 bg-[#111111] border border-[#1A1A1A] mb-3 text-sm`}>
          <span className="text-white">{selected.size} selected</span>
          <span className="text-[#333333]">|</span>
          <button className="text-white hover:text-[#CCCCCC] transition-colors">Publish</button>
          <button className="text-[#555555] hover:text-white transition-colors">Unpublish</button>
          <button className="text-[#555555] hover:text-white transition-colors">Archive</button>
          <button className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
          <button className="ml-auto text-[#444444] hover:text-white transition-colors" onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}

      {view === 'table' ? (
        <div className="bg-[#0A0A0A] border border-[#111111] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#111111]">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="accent-white" onChange={(e) => {
                    if (e.target.checked) setSelected(new Set(paged.map(p => p.id)));
                    else setSelected(new Set());
                  }} />
                </th>
                {['Product', 'SKU', 'Category', 'Status', 'Price', 'Stock', 'Sales', 'Actions'].map((h) => (
                  <th key={h} className={`${headingFont.className} text-left text-[10px] uppercase tracking-[0.12em] text-[#333333] px-3 py-3 font-normal`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0D0D0D]">
              {paged.map((product) => {
                const st = STATUS_BADGE[product.status];
                return (
                  <tr key={product.id} className={`hover:bg-[#0D0D0D] transition-colors ${selected.has(product.id) ? 'bg-[#0D0D0D]' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleSelect(product.id)} className="accent-white" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#111111] border border-[#1A1A1A] overflow-hidden flex-shrink-0">
                          <Image src={product.image} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className={`${bodyFont.className} text-sm text-white`}>{product.name}</p>
                          {product.featured && <span className={`${bodyFont.className} text-[9px] text-amber-400`}>★ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className={`${bodyFont.className} px-3 py-3 text-xs text-[#555555] font-mono`}>{product.sku}</td>
                    <td className={`${bodyFont.className} px-3 py-3 text-xs text-[#555555]`}>{product.category}</td>
                    <td className="px-3 py-3">
                      <span className={`${bodyFont.className} text-xs flex items-center gap-1.5 ${st.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <p className={`${bodyFont.className} text-sm text-white`}>₴{product.price.toLocaleString()}</p>
                      {product.salePrice && <p className={`${bodyFont.className} text-[11px] text-emerald-400`}>Sale: ₴{product.salePrice.toLocaleString()}</p>}
                    </td>
                    <td className={`${bodyFont.className} px-3 py-3 text-sm ${product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-amber-400' : 'text-white'}`}>{product.stock}</td>
                    <td className={`${bodyFont.className} px-3 py-3 text-sm text-[#555555]`}>{product.sales}</td>
                    <td className="px-3 py-3">
                      <div className="relative flex gap-1.5">
                        <Link href={`/admin/products/${product.id}`} className="text-[#444444] hover:text-white transition-colors p-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </Link>
                        <button onClick={() => setActionProduct(actionProduct === product.id ? null : product.id)} className="text-[#444444] hover:text-white transition-colors p-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                        {actionProduct === product.id && (
                          <div className="absolute right-0 top-8 z-20 bg-[#111111] border border-[#1E1E1E] py-1 w-40 shadow-xl">
                            {[
                              { label: 'Duplicate', action: () => setActionProduct(null) },
                              { label: product.status === 'published' ? 'Unpublish' : 'Publish', action: () => handleStatusChange(product.id, product.status === 'published' ? 'draft' : 'published') },
                              { label: 'Archive', action: () => handleStatusChange(product.id, 'archived') },
                              { label: 'Delete', action: () => handleDelete(product.id), color: 'text-red-400' },
                            ].map((a, i) => (
                              <button key={i} onClick={a.action} className={`${bodyFont.className} w-full text-left px-4 py-2 text-sm hover:bg-[#1A1A1A] transition-colors ${a.color || 'text-[#767676]'}`}>{a.label}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {paged.length === 0 && (
            <div className="py-16 text-center">
              <p className={`${bodyFont.className} text-[#333333]`}>No products match your filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {paged.map((product) => {
            const st = STATUS_BADGE[product.status];
            return (
              <div key={product.id} className="bg-[#0A0A0A] border border-[#111111] hover:border-[#1E1E1E] transition-colors">
                <div className="relative aspect-square bg-[#111111]">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="200px" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className={`${bodyFont.className} text-[9px] px-1.5 py-0.5 bg-black/70 ${st.color}`}>{st.label}</span>
                  </div>
                  {product.featured && <span className={`${bodyFont.className} absolute top-2 right-2 text-[9px] px-1.5 py-0.5 bg-black/70 text-amber-400`}>★ Featured</span>}
                </div>
                <div className="p-3">
                  <p className={`${bodyFont.className} text-xs text-white mb-1 truncate`}>{product.name}</p>
                  <p className={`${bodyFont.className} text-[10px] text-[#444444] mb-2`}>₴{product.price.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.id}`} className={`${bodyFont.className} text-[10px] text-[#555555] border border-[#1A1A1A] px-2.5 py-1 hover:text-white hover:border-[#333333] flex-1 text-center transition-colors`}>Edit</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className={`${bodyFont.className} text-xs text-[#444444]`}>{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`${bodyFont.className} text-xs px-3 py-2 border border-[#111111] text-[#555555] hover:text-white disabled:opacity-30 transition-colors`}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`${bodyFont.className} text-xs w-8 h-8 border transition-colors ${p === page ? 'border-white text-white bg-[#111111]' : 'border-[#111111] text-[#555555] hover:text-white'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`${bodyFont.className} text-xs px-3 py-2 border border-[#111111] text-[#555555] hover:text-white disabled:opacity-30 transition-colors`}>Next</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
