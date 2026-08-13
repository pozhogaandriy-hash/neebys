'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AdminLayout } from '@/components/AdminLayout';
import type { AdminProduct } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';
import { createClient } from '@/lib/supabase/client';

const STATUS_BADGE: Record<
  AdminProduct['status'],
  {
    label: string;
    color: string;
    dot: string;
  }
> = {
  published: {
    label: 'Published',
    color: 'text-emerald-400',
    dot: 'bg-emerald-500',
  },
  draft: {
    label: 'Draft',
    color: 'text-[#777777]',
    dot: 'bg-[#444444]',
  },
  archived: {
    label: 'Archived',
    color: 'text-[#555555]',
    dot: 'bg-[#333333]',
  },
  scheduled: {
    label: 'Scheduled',
    color: 'text-blue-400',
    dot: 'bg-blue-500',
  },
};

const PAGE_SIZE = 8;

const supabase = createClient();

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [view, setView] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionProduct, setActionProduct] = useState<string | null>(null);

  const [processing, setProcessing] = useState<string | null>(null);

  /*
   * LOAD PRODUCTS
   */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace('/login');
          return;
        }

        const role =
          user.app_metadata?.role ??
          user.user_metadata?.role ??
          null;

        if (role !== 'admin' && role !== 'super_admin') {
          router.replace('/');
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to load products:', error);
          return;
        }

        const mappedProducts: AdminProduct[] = (data ?? []).map((p) => {
          const validStatuses: AdminProduct['status'][] = [
            'published',
            'draft',
            'archived',
            'scheduled',
          ];

          const productStatus: AdminProduct['status'] =
            validStatuses.includes(p.status)
              ? p.status
              : 'draft';

          return {
            id: String(p.id),
            name: p.name ?? '',
            slug: p.slug ?? '',
            sku: p.sku ?? '',
            brand: p.brand ?? 'Gymfriends',
            category: p.category ?? '',
            subcategory: p.subcategory ?? '',
            status: productStatus,
            featured: Boolean(p.featured),
            price: Number(p.price ?? 0),

            salePrice:
              p.sale_price !== null &&
              p.sale_price !== undefined
                ? Number(p.sale_price)
                : undefined,

            stock: Number(p.stock ?? 0),
            views: Number(p.views ?? 0),
            sales: Number(p.sales ?? 0),
            revenue: Number(p.revenue ?? 0),

            image: p.image ?? '',

            createdAt: p.created_at ?? '',
            updatedAt: p.updated_at ?? '',

            tags: Array.isArray(p.tags) ? p.tags : [],
          };
        });

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Products loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [router]);

  /*
   * FILTER PRODUCTS
   */
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase().trim();

      const matchSearch =
        !searchValue ||
        product.name.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue) ||
        product.slug.toLowerCase().includes(searchValue);

      const matchStatus =
        statusFilter === 'all' ||
        product.status === statusFilter;

      const matchCategory =
        categoryFilter === 'all' ||
        product.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [
    products,
    search,
    statusFilter,
    categoryFilter,
  ]);

  /*
   * PAGINATION
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paged = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /*
   * CATEGORIES
   */
  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    );
  }, [products]);

  /*
   * SELECT PRODUCT
   */
  const toggleSelect = (id: string) => {
    setSelected((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  /*
   * SELECT PAGE
   */
  const toggleSelectPage = () => {
    const pageIds = paged.map((product) => product.id);

    const allSelected =
      pageIds.length > 0 &&
      pageIds.every((id) => selected.has(id));

    setSelected((previous) => {
      const next = new Set(previous);

      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }

      return next;
    });
  };

  /*
   * UPDATE PRODUCT STATUS
   */
  const handleStatusChange = async (
    id: string,
    status: AdminProduct['status']
  ) => {
    try {
      setProcessing(id);

      const now = new Date().toISOString();

      const { error } = await supabase
        .from('products')
        .update({
          status,
          updated_at: now,
        })
        .eq('id', id);

      if (error) {
        console.error(
          'Status update error:',
          error
        );

        alert(
          'Не вдалося змінити статус товару.'
        );

        return;
      }

      setProducts((previous) =>
        previous.map((product) =>
          product.id === id
            ? {
                ...product,
                status,
                updatedAt: now,
              }
            : product
        )
      );

      setActionProduct(null);
    } finally {
      setProcessing(null);
    }
  };

  /*
   * DELETE PRODUCT
   */
  const handleDelete = async (id: string) => {
    const product = products.find(
      (item) => item.id === id
    );

    if (!product) return;

    const confirmed = window.confirm(
      `Видалити товар "${product.name}"?\n\nЦю дію неможливо скасувати.`
    );

    if (!confirmed) return;

    try {
      setProcessing(id);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(
          'Delete product error:',
          error
        );

        alert(
          'Не вдалося видалити товар.'
        );

        return;
      }

      setProducts((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      setSelected((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });

      setActionProduct(null);
    } finally {
      setProcessing(null);
    }
  };

  /*
   * BULK STATUS UPDATE
   */
  const handleBulkStatus = async (
    status: AdminProduct['status']
  ) => {
    if (selected.size === 0) return;

    const ids = Array.from(selected);
    const now = new Date().toISOString();

    try {
      setProcessing('bulk');

      const { error } = await supabase
        .from('products')
        .update({
          status,
          updated_at: now,
        })
        .in('id', ids);

      if (error) {
        console.error(
          'Bulk status update error:',
          error
        );

        alert(
          'Не вдалося оновити товари.'
        );

        return;
      }

      setProducts((previous) =>
        previous.map((product) =>
          selected.has(product.id)
            ? {
                ...product,
                status,
                updatedAt: now,
              }
            : product
        )
      );

      setSelected(new Set());
    } finally {
      setProcessing(null);
    }
  };

  /*
   * BULK DELETE
   */
  const handleBulkDelete = async () => {
    if (selected.size === 0) return;

    const confirmed = window.confirm(
      `Видалити ${selected.size} товарів?\n\nЦю дію неможливо скасувати.`
    );

    if (!confirmed) return;

    const ids = Array.from(selected);

    try {
      setProcessing('bulk');

      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', ids);

      if (error) {
        console.error(
          'Bulk delete error:',
          error
        );

        alert(
          'Не вдалося видалити товари.'
        );

        return;
      }

      setProducts((previous) =>
        previous.filter(
          (product) =>
            !selected.has(product.id)
        )
      );

      setSelected(new Set());
    } finally {
      setProcessing(null);
    }
  };

  /*
   * PAGE RESET
   */
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const allPageSelected =
    paged.length > 0 &&
    paged.every((product) =>
      selected.has(product.id)
    );

  return (
    <AdminLayout
      title="Products"
      breadcrumb={[
        {
          label: 'Admin',
          href: '/admin',
        },
        {
          label: 'Products',
        },
      ]}
    >
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1
            className={`${headingFont.className} text-lg text-white font-semibold`}
          >
            Products
          </h1>

          <p
            className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}
          >
            {filtered.length} products
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-[#E8E8E8] transition-colors`}
        >
          + Add Product
        </Link>
      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444]"
          >
            <circle cx="11" cy="11" r="8" />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            />
          </svg>

          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className={`${bodyFont.className} w-full bg-[#0A0A0A] border border-[#111111] text-white text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#222222] placeholder:text-[#333333]`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
          className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none`}
        >
          <option value="all">
            All Statuses
          </option>

          <option value="published">
            Published
          </option>

          <option value="draft">
            Draft
          </option>

          <option value="archived">
            Archived
          </option>

          <option value="scheduled">
            Scheduled
          </option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(event.target.value);
            setPage(1);
          }}
          className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none`}
        >
          <option value="all">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        {/* VIEW SWITCH */}

        <div className="flex border border-[#111111]">
          <button
            type="button"
            onClick={() =>
              setView('table')
            }
            className={`px-3 py-2.5 transition-colors ${
              view === 'table'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#444444] hover:text-white'
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="3"
              />
              <rect
                x="3"
                y="9"
                width="18"
                height="3"
              />
              <rect
                x="3"
                y="15"
                width="18"
                height="3"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() =>
              setView('grid')
            }
            className={`px-3 py-2.5 transition-colors ${
              view === 'grid'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#444444] hover:text-white'
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
              />

              <rect
                x="14"
                y="3"
                width="7"
                height="7"
              />

              <rect
                x="3"
                y="14"
                width="7"
                height="7"
              />

              <rect
                x="14"
                y="14"
                width="7"
                height="7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* BULK ACTIONS */}

      {selected.size > 0 && (
        <div
          className={`${bodyFont.className} flex flex-wrap items-center gap-3 px-4 py-2.5 bg-[#111111] border border-[#1A1A1A] mb-3 text-sm`}
        >
          <span className="text-white">
            {selected.size} selected
          </span>

          <span className="text-[#333333]">
            |
          </span>

          <button
            type="button"
            disabled={processing === 'bulk'}
            onClick={() =>
              handleBulkStatus(
                'published'
              )
            }
            className="text-white hover:text-[#CCCCCC] disabled:opacity-40 transition-colors"
          >
            Publish
          </button>

          <button
            type="button"
            disabled={processing === 'bulk'}
            onClick={() =>
              handleBulkStatus('draft')
            }
            className="text-[#777777] hover:text-white disabled:opacity-40 transition-colors"
          >
            Unpublish
          </button>

          <button
            type="button"
            disabled={processing === 'bulk'}
            onClick={() =>
              handleBulkStatus(
                'archived'
              )
            }
            className="text-[#777777] hover:text-white disabled:opacity-40 transition-colors"
          >
            Archive
          </button>

          <button
            type="button"
            disabled={processing === 'bulk'}
            onClick={handleBulkDelete}
            className="text-red-400 hover:text-red-300 disabled:opacity-40 transition-colors"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={() =>
              setSelected(new Set())
            }
            className="ml-auto text-[#444444] hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* CONTENT */}

      {loading ? (
        <div className="bg-[#0A0A0A] border border-[#111111] py-20 text-center">
          <p
            className={`${bodyFont.className} text-sm text-[#555555]`}
          >
            Loading products...
          </p>
        </div>
      ) : view === 'table' ? (
        /* TABLE */

        <div className="bg-[#0A0A0A] border border-[#111111] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#111111]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      allPageSelected
                    }
                    onChange={
                      toggleSelectPage
                    }
                    className="accent-white"
                  />
                </th>

                {[
                  'Product',
                  'SKU',
                  'Category',
                  'Status',
                  'Price',
                  'Stock',
                  'Sales',
                  'Actions',
                ].map((heading) => (
                  <th
                    key={heading}
                    className={`${headingFont.className} text-left text-[10px] uppercase tracking-[0.12em] text-[#333333] px-3 py-3 font-normal`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#0D0D0D]">
              {paged.map((product) => {
                const status =
                  STATUS_BADGE[
                    product.status
                  ];

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-[#0D0D0D] transition-colors ${
                      selected.has(
                        product.id
                      )
                        ? 'bg-[#0D0D0D]'
                        : ''
                    }`}
                  >
                    {/* SELECT */}

                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(
                          product.id
                        )}
                        onChange={() =>
                          toggleSelect(
                            product.id
                          )
                        }
                        className="accent-white"
                      />
                    </td>

                    {/* PRODUCT */}

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#111111] border border-[#1A1A1A] overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.name
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#333333] text-xs">
                              —
                            </div>
                          )}
                        </div>

                        <div>
                          <p
                            className={`${bodyFont.className} text-sm text-white`}
                          >
                            {
                              product.name
                            }
                          </p>

                          {product.featured && (
                            <span
                              className={`${bodyFont.className} text-[9px] text-amber-400`}
                            >
                              ★ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* SKU */}

                    <td
                      className={`${bodyFont.className} px-3 py-3 text-xs text-[#555555] font-mono`}
                    >
                      {product.sku}
                    </td>

                    {/* CATEGORY */}

                    <td
                      className={`${bodyFont.className} px-3 py-3 text-xs text-[#555555]`}
                    >
                      {
                        product.category
                      }
                    </td>

                    {/* STATUS */}

                    <td className="px-3 py-3">
                      <span
                        className={`${bodyFont.className} text-xs flex items-center gap-1.5 ${status.color}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                        />

                        {
                          status.label
                        }
                      </span>
                    </td>

                    {/* PRICE */}

                    <td className="px-3 py-3">
                      <p
                        className={`${bodyFont.className} text-sm text-white`}
                      >
                        ₴
                        {product.price.toLocaleString()}
                      </p>

                      {product.salePrice !==
                        undefined && (
                        <p
                          className={`${bodyFont.className} text-[11px] text-emerald-400`}
                        >
                          Sale: ₴
                          {product.salePrice.toLocaleString()}
                        </p>
                      )}
                    </td>

                    {/* STOCK */}

                    <td
                      className={`${bodyFont.className} px-3 py-3 text-sm ${
                        product.stock === 0
                          ? 'text-red-400'
                          : product.stock <
                            10
                          ? 'text-amber-400'
                          : 'text-white'
                      }`}
                    >
                      {
                        product.stock
                      }
                    </td>

                    {/* SALES */}

                    <td
                      className={`${bodyFont.className} px-3 py-3 text-sm text-[#555555]`}
                    >
                      {product.sales}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-3 py-3">
                      <div className="relative flex gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-[#444444] hover:text-white transition-colors p-1"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1-1-4 9.5-9.5z" />
                          </svg>
                        </Link>

                        <button
                          type="button"
                          disabled={
                            processing ===
                            product.id
                          }
                          onClick={() =>
                            setActionProduct(
                              actionProduct ===
                                product.id
                                ? null
                                : product.id
                            )
                          }
                          className="text-[#444444] hover:text-white disabled:opacity-30 transition-colors p-1"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle
                              cx="12"
                              cy="5"
                              r="1"
                            />

                            <circle
                              cx="12"
                              cy="12"
                              r="1"
                            />

                            <circle
                              cx="12"
                              cy="19"
                              r="1"
                            />
                          </svg>
                        </button>

                        {actionProduct ===
                          product.id && (
                          <div className="absolute right-0 top-8 z-20 bg-[#111111] border border-[#1E1E1E] py-1 w-44 shadow-xl">
                            <button
                              type="button"
                              onClick={() =>
                                setActionProduct(
                                  null
                                )
                              }
                              className={`${bodyFont.className} w-full text-left px-4 py-2 text-sm text-[#767676] hover:bg-[#1A1A1A] hover:text-white transition-colors`}
                            >
                              Duplicate
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  product.id,
                                  product.status ===
                                    'published'
                                    ? 'draft'
                                    : 'published'
                                )
                              }
                              className={`${bodyFont.className} w-full text-left px-4 py-2 text-sm text-[#767676] hover:bg-[#1A1A1A] hover:text-white transition-colors`}
                            >
                              {product.status ===
                              'published'
                                ? 'Unpublish'
                                : 'Publish'}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  product.id,
                                  'archived'
                                )
                              }
                              className={`${bodyFont.className} w-full text-left px-4 py-2 text-sm text-[#767676] hover:bg-[#1A1A1A] hover:text-white transition-colors`}
                            >
                              Archive
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  product.id
                                )
                              }
                              className={`${bodyFont.className} w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1A1A1A] hover:text-red-300 transition-colors`}
                            >
                              Delete
                            </button>
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
              <p
                className={`${bodyFont.className} text-[#333333]`}
              >
                No products match your
                filters.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* GRID */

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {paged.map((product) => {
            const status =
              STATUS_BADGE[
                product.status
              ];

            return (
              <div
                key={product.id}
                className="bg-[#0A0A0A] border border-[#111111] hover:border-[#1E1E1E] transition-colors"
              >
                <div className="relative aspect-square bg-[#111111]">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#333333]">
                      No image
                    </div>
                  )}

                  <div className="absolute top-2 left-2">
                    <span
                      className={`${bodyFont.className} text-[9px] px-1.5 py-0.5 bg-black/70 ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {product.featured && (
                    <span
                      className={`${bodyFont.className} absolute top-2 right-2 text-[9px] px-1.5 py-0.5 bg-black/70 text-amber-400`}
                    >
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <p
                    className={`${bodyFont.className} text-xs text-white mb-1 truncate`}
                  >
                    {product.name}
                  </p>

                  <p
                    className={`${bodyFont.className} text-[10px] text-[#444444] mb-2`}
                  >
                    ₴
                    {product.price.toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className={`${bodyFont.className} text-[10px] text-[#555555] border border-[#1A1A1A] px-2.5 py-1 hover:text-white hover:border-[#333333] flex-1 text-center transition-colors`}
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          product.id
                        )
                      }
                      className={`${bodyFont.className} text-[10px] text-red-400 border border-[#1A1A1A] px-2.5 py-1 hover:border-red-900 transition-colors`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {paged.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p
                className={`${bodyFont.className} text-[#333333]`}
              >
                No products match your
                filters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PAGINATION */}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p
            className={`${bodyFont.className} text-xs text-[#444444]`}
          >
            {filtered.length === 0
              ? 0
              : (page - 1) *
                  PAGE_SIZE +
                1}
            –
            {Math.min(
              page * PAGE_SIZE,
              filtered.length
            )}{' '}
            of {filtered.length}
          </p>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.max(
                    1,
                    current - 1
                  )
                )
              }
              disabled={page === 1}
              className={`${bodyFont.className} text-xs px-3 py-2 border border-[#111111] text-[#555555] hover:text-white disabled:opacity-30 transition-colors`}
            >
              Prev
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map(
              (pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  onClick={() =>
                    setPage(
                      pageNumber
                    )
                  }
                  className={`${bodyFont.className} text-xs w-8 h-8 border transition-colors ${
                    pageNumber === page
                      ? 'border-white text-white bg-[#111111]'
                      : 'border-[#111111] text-[#555555] hover:text-white'
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1
                  )
                )
              }
              disabled={
                page === totalPages
              }
              className={`${bodyFont.className} text-xs px-3 py-2 border border-[#111111] text-[#555555] hover:text-white disabled:opacity-30 transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}