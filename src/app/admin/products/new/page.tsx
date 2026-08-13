'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { AdminLayout } from '@/components/AdminLayout';
import { headingFont, bodyFont } from '@/app/fonts';
import { createClient } from '@/lib/supabase/client';
import { menuCategories } from '@/data/content';

const inputClass =
  'w-full bg-[#0D0D0D] border border-[#1A1A1A] px-3 py-3 text-sm text-white outline-none focus:border-[#444444] transition-colors';

const labelClass =
  'block text-[10px] uppercase tracking-[0.12em] text-[#666666] mb-2';

const AVAILABLE_SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
];

type Badge = {
  id: string;
  name: string;
  slug: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [badges, setBadges] = useState<Badge[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(true);

  const [showCreateBadge, setShowCreateBadge] = useState(false);
  const [newBadgeName, setNewBadgeName] = useState('');
  const [creatingBadge, setCreatingBadge] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    sale_price: '',
    category: '',
    image: '',
    images: '',
    stock: '0',
    status: 'published',
    featured: false,
    sizes: [] as string[],
    colors: '',
    badge_id: '',
  });

  /*
   * ------------------------------------------------------------
   * LOAD BADGES
   * ------------------------------------------------------------
   */

  useEffect(() => {
    loadBadges();
  }, []);

  async function loadBadges() {
    setBadgesLoading(true);

    const { data, error } = await supabase
      .from('product_badges')
      .select('id, name, slug')
      .order('name', { ascending: true });

    if (error) {
      console.error('Failed to load badges:', error);
      setError('Не вдалося завантажити бейджі.');
    } else {
      setBadges(data || []);
    }

    setBadgesLoading(false);
  }

  /*
   * ------------------------------------------------------------
   * FORM HELPERS
   * ------------------------------------------------------------
   */

  function updateField(
    field: keyof typeof form,
    value: string | boolean | string[]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleSize(size: string) {
    setForm((prev) => {
      const exists = prev.sizes.includes(size);

      return {
        ...prev,
        sizes: exists
          ? prev.sizes.filter((item) => item !== size)
          : [...prev.sizes, size],
      };
    });
  }

  /*
   * ------------------------------------------------------------
   * CREATE BADGE
   * ------------------------------------------------------------
   */

  async function createBadge() {
    const name = newBadgeName.trim();

    if (!name) {
      setError('Введи назву бейджа.');
      return;
    }

    setError('');
    setCreatingBadge(true);

    try {
      const slug = name
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const { data, error } = await supabase
        .from('product_badges')
        .insert({
          name,
          slug: slug || `badge-${Date.now()}`,
        })
        .select('id, name, slug')
        .single();

      if (error) {
        console.error(error);

        if (error.code === '23505') {
          setError('Такий бейдж вже існує.');
        } else {
          setError(error.message);
        }

        return;
      }

      if (data) {
        setBadges((prev) =>
          [...prev, data].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );

        updateField('badge_id', data.id);

        setNewBadgeName('');
        setShowCreateBadge(false);
      }
    } catch (err) {
      console.error(err);
      setError('Не вдалося створити бейдж.');
    } finally {
      setCreatingBadge(false);
    }
  }

  /*
   * ------------------------------------------------------------
   * CREATE PRODUCT
   * ------------------------------------------------------------
   */

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Введи назву товару.');
      return;
    }

    if (!form.sku.trim()) {
      setError('Введи SKU товару.');
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError('Введи правильну ціну.');
      return;
    }

    if (!form.category) {
      setError('Вибери категорію товару.');
      return;
    }

    setLoading(true);

    try {
      const images = form.images
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      const colors = form.colors
        .split(',')
        .map((color) => color.trim())
        .filter(Boolean);

      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name: form.name.trim(),
          description: form.description.trim() || null,
          sku: form.sku.trim(),

          price: Number(form.price),

          sale_price: form.sale_price
            ? Number(form.sale_price)
            : null,

          category: form.category,

          image: form.image.trim() || null,

          images,

          stock: Number(form.stock) || 0,

          sales: 0,

          status: form.status,

          featured: form.featured,

          sizes: form.sizes,

          colors,

          badge_id: form.badge_id || null,
        });

      if (insertError) {
        console.error(insertError);
        setError(insertError.message);
        return;
      }

      setSuccess('Товар успішно створено!');

      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 800);
    } catch (err) {
      console.error(err);
      setError('Сталася помилка під час створення товару.');
    } finally {
      setLoading(false);
    }
  }

  /*
   * ------------------------------------------------------------
   * CATEGORIES
   * ------------------------------------------------------------
   */

  const allCategories = Array.from(
    new Set(
      menuCategories.flatMap((group) => group.items)
    )
  );

  /*
   * ------------------------------------------------------------
   * UI
   * ------------------------------------------------------------
   */

  return (
    <AdminLayout
      title="New Product"
      breadcrumb={[
        { label: 'Admin', href: '/admin' },
        { label: 'Products', href: '/admin/products' },
        { label: 'New Product' },
      ]}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className={`${headingFont.className} text-lg text-white font-semibold`}
          >
            Add New Product
          </h1>

          <p
            className={`${bodyFont.className} text-xs text-[#444444] mt-1`}
          >
            Create a new product for Gymfriends.
          </p>
        </div>

        <Link
          href="/admin/products"
          className={`${headingFont.className} border border-[#222222] text-[#777777] text-[10px] uppercase tracking-[0.12em] px-4 py-2.5 hover:text-white hover:border-[#444444] transition-colors`}
        >
          ← Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* =====================================================
              MAIN INFORMATION
          ====================================================== */}

          <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#111111] p-6">

            <h2
              className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#777777] mb-5`}
            >
              Product Information
            </h2>

            <div className="space-y-5">

              {/* NAME */}

              <div>
                <label className={labelClass}>
                  Product Name *
                </label>

                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    updateField('name', e.target.value)
                  }
                  placeholder="Gymfriends T-Shirt"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className={labelClass}>
                  Description
                </label>

                <textarea
                  className={`${inputClass} min-h-[120px] resize-y`}
                  value={form.description}
                  onChange={(e) =>
                    updateField('description', e.target.value)
                  }
                  placeholder="Premium Gymfriends T-Shirt..."
                />
              </div>

              {/* SKU + CATEGORY */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className={labelClass}>
                    SKU *
                  </label>

                  <input
                    className={inputClass}
                    value={form.sku}
                    onChange={(e) =>
                      updateField('sku', e.target.value)
                    }
                    placeholder="GF-TS-001"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Category *
                  </label>

                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(e) =>
                      updateField('category', e.target.value)
                    }
                  >
                    <option value="">
                      Select category
                    </option>

                    {allCategories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* PRICE */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className={labelClass}>
                    Price (€) *
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputClass}
                    value={form.price}
                    onChange={(e) =>
                      updateField('price', e.target.value)
                    }
                    placeholder="39.99"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Sale Price (€)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputClass}
                    value={form.sale_price}
                    onChange={(e) =>
                      updateField('sale_price', e.target.value)
                    }
                    placeholder="29.99"
                  />
                </div>

              </div>

              {/* MAIN IMAGE */}

              <div>
                <label className={labelClass}>
                  Main Image URL
                </label>

                <input
                  className={inputClass}
                  value={form.image}
                  onChange={(e) =>
                    updateField('image', e.target.value)
                  }
                  placeholder="https://..."
                />
              </div>

              {/* ADDITIONAL IMAGES */}

              <div>
                <label className={labelClass}>
                  Additional Image URLs
                </label>

                <textarea
                  className={`${inputClass} min-h-[100px] resize-y`}
                  value={form.images}
                  onChange={(e) =>
                    updateField('images', e.target.value)
                  }
                  placeholder={`https://image-1.jpg
https://image-2.jpg
https://image-3.jpg`}
                />

                <p className="text-[10px] text-[#3F3F3F] mt-2">
                  One URL per line.
                </p>
              </div>

            </div>
          </div>

          {/* =====================================================
              SIDEBAR
          ====================================================== */}

          <div className="space-y-4">

            {/* INVENTORY */}

            <div className="bg-[#0A0A0A] border border-[#111111] p-6">

              <h2
                className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#777777] mb-5`}
              >
                Inventory
              </h2>

              <div>
                <label className={labelClass}>
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={form.stock}
                  onChange={(e) =>
                    updateField('stock', e.target.value)
                  }
                />
              </div>

            </div>

            {/* OPTIONS */}

            <div className="bg-[#0A0A0A] border border-[#111111] p-6">

              <h2
                className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#777777] mb-5`}
              >
                Options
              </h2>

              <div className="space-y-6">

                {/* STATUS */}

                <div>
                  <label className={labelClass}>
                    Status
                  </label>

                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(e) =>
                      updateField('status', e.target.value)
                    }
                  >
                    <option value="published">
                      Published
                    </option>

                    <option value="draft">
                      Draft
                    </option>

                    <option value="archived">
                      Archived
                    </option>
                  </select>
                </div>

                {/* SIZES */}

                <div>
                  <label className={labelClass}>
                    Sizes
                  </label>

                  <div className="grid grid-cols-3 gap-2">

                    {AVAILABLE_SIZES.map((size) => {
                      const selected =
                        form.sizes.includes(size);

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`py-2.5 border text-xs transition-colors ${
                            selected
                              ? 'bg-white text-black border-white'
                              : 'bg-[#0D0D0D] text-[#666666] border-[#1A1A1A] hover:border-[#444444] hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}

                  </div>

                  <p className="text-[10px] text-[#3F3F3F] mt-2">
                    Select all sizes available for this product.
                  </p>
                </div>

                {/* COLORS */}

                <div>
                  <label className={labelClass}>
                    Colors
                  </label>

                  <input
                    className={inputClass}
                    value={form.colors}
                    onChange={(e) =>
                      updateField('colors', e.target.value)
                    }
                    placeholder="Black, White"
                  />

                  <p className="text-[10px] text-[#3F3F3F] mt-2">
                    Separate colors with commas.
                  </p>
                </div>

                {/* BADGE */}

                <div>
                  <div className="flex items-center justify-between mb-2">

                    <label className={`${labelClass} mb-0`}>
                      Product Badge
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setShowCreateBadge((prev) => !prev)
                      }
                      className="text-[10px] text-[#777777] hover:text-white transition-colors"
                    >
                      + Create
                    </button>

                  </div>

                  <select
                    className={inputClass}
                    value={form.badge_id}
                    disabled={badgesLoading}
                    onChange={(e) =>
                      updateField('badge_id', e.target.value)
                    }
                  >
                    <option value="">
                      No badge
                    </option>

                    {badges.map((badge) => (
                      <option
                        key={badge.id}
                        value={badge.id}
                      >
                        {badge.name}
                      </option>
                    ))}
                  </select>

                  {/* CREATE BADGE */}

                  {showCreateBadge && (
                    <div className="mt-3 border border-[#1A1A1A] bg-[#0D0D0D] p-3">

                      <p className="text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-2">
                        New Badge
                      </p>

                      <div className="flex gap-2">

                        <input
                          className={`${inputClass} flex-1`}
                          value={newBadgeName}
                          onChange={(e) =>
                            setNewBadgeName(e.target.value)
                          }
                          placeholder="LIMITED"
                        />

                        <button
                          type="button"
                          disabled={creatingBadge}
                          onClick={createBadge}
                          className="px-3 bg-white text-black text-[10px] uppercase disabled:opacity-50"
                        >
                          {creatingBadge
                            ? '...'
                            : 'Create'}
                        </button>

                      </div>

                    </div>
                  )}

                  <p className="text-[10px] text-[#3F3F3F] mt-2">
                    Badge is optional.
                  </p>
                </div>

                {/* FEATURED */}

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      updateField(
                        'featured',
                        e.target.checked
                      )
                    }
                    className="w-4 h-4"
                  />

                  <span
                    className={`${bodyFont.className} text-sm text-[#777777]`}
                  >
                    Featured product
                  </span>

                </label>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MESSAGES
        ====================================================== */}

        {error && (
          <div className="mt-4 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 border border-emerald-900/40 bg-emerald-950/20 p-4 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        <div className="flex justify-end gap-3 mt-5">

          <Link
            href="/admin/products"
            className={`${headingFont.className} border border-[#222222] text-[#666666] px-6 py-3 text-[10px] uppercase tracking-[0.12em] hover:text-white hover:border-[#444444] transition-colors`}
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className={`${headingFont.className} bg-white text-black px-7 py-3 text-[10px] uppercase tracking-[0.12em] hover:bg-[#E8E8E8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {loading
              ? 'Creating...'
              : 'Create Product'}
          </button>

        </div>
      </form>
    </AdminLayout>
  );
}