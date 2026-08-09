'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { ADMIN_PRODUCTS, AdminProduct } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

type Tab = 'general' | 'media' | 'variants' | 'pricing' | 'inventory' | 'shipping' | 'seo';

const TABS: { id: Tab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'media', label: 'Media' },
  { id: 'variants', label: 'Variants' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'seo', label: 'SEO' },
];

function InputField({ label, value, onChange, type = 'text', placeholder, hint, disabled }: {
  label: string; value: string; onChange?: (v: string) => void; type?: string; placeholder?: string; hint?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-1.5`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${bodyFont.className} w-full bg-[#111111] border border-[#1A1A1A] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#333333] transition-colors placeholder:text-[#2A2A2A] disabled:opacity-40`}
      />
      {hint && <p className={`${bodyFont.className} text-[11px] text-[#333333] mt-1`}>{hint}</p>}
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 4, placeholder }: {
  label: string; value: string; onChange?: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-1.5`}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`${bodyFont.className} w-full bg-[#111111] border border-[#1A1A1A] text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#333333] transition-colors resize-none placeholder:text-[#2A2A2A]`}
      />
    </div>
  );
}

export default function ProductEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const found = ADMIN_PRODUCTS.find((p) => p.id === id);

  const [tab, setTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);
  const [product, setProduct] = useState<AdminProduct>(found || ADMIN_PRODUCTS[0]);

  // General fields
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [shortDesc, setShortDesc] = useState('Premium athletic performance tee.');
  const [fullDesc, setFullDesc] = useState('');
  const [brand, setBrand] = useState(product.brand);
  const [category, setCategory] = useState(product.category);
  const [subcategory, setSubcategory] = useState(product.subcategory);
  const [tags, setTags] = useState(product.tags.join(', '));
  const [sku, setSku] = useState(product.sku);
  const [barcode, setBarcode] = useState('');
  const [material, setMaterial] = useState('88% Polyester, 12% Elastane');
  const [gender, setGender] = useState('Unisex');
  const [season, setSeason] = useState('All Season');
  const [country, setCountry] = useState('China');

  // Pricing
  const [price, setPrice] = useState(String(product.price));
  const [salePrice, setSalePrice] = useState(String(product.salePrice || ''));
  const [costPrice, setCostPrice] = useState('');

  // Inventory
  const [stock, setStock] = useState(String(product.stock));
  const [lowStockAlert, setLowStockAlert] = useState('5');
  const [continueSelling, setContinueSelling] = useState(false);

  // Shipping
  const [weight, setWeight] = useState('0.25');
  const [width, setWidthVal] = useState('30');
  const [heightVal, setHeightVal] = useState('40');
  const [length, setLength] = useState('2');
  const [freeShipping, setFreeShipping] = useState(false);

  // SEO
  const [seoTitle, setSeoTitle] = useState(product.name + ' | Gymfriends');
  const [seoDesc, setSeoDesc] = useState('Shop ' + product.name + ' at Gymfriends. Premium sportswear for serious athletes.');
  const [seoKeywords, setSeoKeywords] = useState(product.tags.join(', '));
  const [canonical, setCanonical] = useState('/catalog/' + product.slug);

  // Visibility
  const [status, setStatus] = useState<AdminProduct['status']>(product.status);
  const [featured, setFeatured] = useState(product.featured);

  const margin = price && costPrice ? Math.round(((parseFloat(price) - parseFloat(costPrice)) / parseFloat(price)) * 100) : null;
  const discount = price && salePrice ? Math.round(((parseFloat(price) - parseFloat(salePrice)) / parseFloat(price)) * 100) : null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout title="Edit Product" breadcrumb={[
      { label: 'Admin', href: '/admin' },
      { label: 'Products', href: '/admin/products' },
      { label: product.name },
    ]}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>{product.name}</h1>
          <span className={`${bodyFont.className} text-[10px] px-2 py-0.5 border ${status === 'published' ? 'border-emerald-900/50 text-emerald-400' : 'border-[#1A1A1A] text-[#555555]'}`}>
            {status}
          </span>
        </div>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminProduct['status'])}
            className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2 focus:outline-none`}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
          <button onClick={handleSave} className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-5 py-2 hover:bg-[#E8E8E8] transition-colors`}>
            {saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
        {/* Main editor */}
        <div>
          {/* Tabs */}
          <div className="flex gap-0 border-b border-[#111111] mb-5 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`${bodyFont.className} text-sm px-5 py-3 whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? 'border-white text-white' : 'border-transparent text-[#444444] hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          {tab === 'general' && (
            <div className="flex flex-col gap-5">
              <div className="bg-[#0A0A0A] border border-[#111111] p-5">
                <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>Basic Information</h3>
                <div className="flex flex-col gap-4">
                  <InputField label="Product Name" value={name} onChange={setName} />
                  <InputField label="Slug" value={slug} onChange={setSlug} hint="URL: /catalog/your-slug" />
                  <InputField label="Short Description" value={shortDesc} onChange={setShortDesc} />
                  <TextAreaField label="Full Description" value={fullDesc} onChange={setFullDesc} rows={5} placeholder="Detailed product description..." />
                </div>
              </div>
              <div className="bg-[#0A0A0A] border border-[#111111] p-5">
                <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>Classification</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Brand" value={brand} onChange={setBrand} />
                  <InputField label="Category" value={category} onChange={setCategory} />
                  <InputField label="Subcategory" value={subcategory} onChange={setSubcategory} />
                  <InputField label="Gender" value={gender} onChange={setGender} />
                  <InputField label="Season" value={season} onChange={setSeason} />
                  <InputField label="Country of Manufacture" value={country} onChange={setCountry} />
                  <InputField label="Material" value={material} onChange={setMaterial} />
                  <InputField label="SKU" value={sku} onChange={setSku} />
                  <InputField label="Barcode (EAN/UPC)" value={barcode} onChange={setBarcode} placeholder="0000000000000" />
                  <InputField label="Tags (comma-separated)" value={tags} onChange={setTags} />
                </div>
              </div>
            </div>
          )}

          {tab === 'media' && (
            <div className="bg-[#0A0A0A] border border-[#111111] p-5">
              <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>Product Media</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-5">
                <div className="aspect-square bg-[#111111] border border-[#1A1A1A] overflow-hidden relative">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="120px" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <button className="text-white text-[10px] border border-white px-2 py-1">Remove</button>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-white text-black text-[8px] px-1">MAIN</div>
                </div>
                {[2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-[#0D0D0D] border border-[#1A1A1A] border-dashed flex items-center justify-center cursor-pointer hover:border-[#333333] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </div>
                ))}
              </div>
              <div className="border border-dashed border-[#1A1A1A] p-8 text-center">
                <p className={`${bodyFont.className} text-[#333333] text-sm mb-2`}>Drag and drop images, or click to upload</p>
                <p className={`${bodyFont.className} text-[#2A2A2A] text-xs`}>Supports JPEG, PNG, WebP — Max 5MB per file</p>
                <button className={`${bodyFont.className} mt-4 text-xs border border-[#222222] text-[#555555] px-5 py-2 hover:border-[#333333] hover:text-white transition-colors`}>
                  Choose Files
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="border border-[#1A1A1A] p-4 text-center">
                  <p className={`${bodyFont.className} text-[#333333] text-xs mb-2`}>Video (URL)</p>
                  <input type="url" placeholder="https://youtube.com/..." className={`${bodyFont.className} w-full bg-[#111111] border border-[#1A1A1A] text-[#555555] text-xs px-3 py-2 focus:outline-none`} />
                </div>
                <div className="border border-[#1A1A1A] p-4 text-center">
                  <p className={`${bodyFont.className} text-[#333333] text-xs mb-2`}>3D Model (GLB/USDZ URL)</p>
                  <input type="url" placeholder="https://storage.example.com/model.glb" className={`${bodyFont.className} w-full bg-[#111111] border border-[#1A1A1A] text-[#555555] text-xs px-3 py-2 focus:outline-none`} />
                </div>
              </div>
            </div>
          )}

          {tab === 'variants' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#0A0A0A] border border-[#111111] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555]`}>Variant Options</h3>
                  <button className={`${bodyFont.className} text-[11px] text-[#555555] border border-[#1A1A1A] px-3 py-1.5 hover:text-white hover:border-[#333333] transition-colors`}>+ Add Option</button>
                </div>
                {[
                  { name: 'Size', values: ['S', 'M', 'L', 'XL', 'XXL'] },
                  { name: 'Color', values: ['Black', 'White', 'Grey'] },
                ].map((opt) => (
                  <div key={opt.name} className="flex items-center gap-4 py-3 border-b border-[#0F0F0F] last:border-0">
                    <span className={`${bodyFont.className} text-sm text-[#767676] w-24`}>{opt.name}</span>
                    <div className="flex gap-2 flex-wrap">
                      {opt.values.map((v) => (
                        <span key={v} className={`${bodyFont.className} text-xs border border-[#1A1A1A] px-2.5 py-1 text-[#555555]`}>{v}</span>
                      ))}
                      <button className={`${bodyFont.className} text-xs text-[#333333] border border-dashed border-[#1A1A1A] px-2.5 py-1`}>+ Add</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#0A0A0A] border border-[#111111] p-5 overflow-x-auto">
                <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>Variant Table</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#111111]">
                      {['Variant', 'SKU', 'Price', 'Stock', 'Available'].map((h) => (
                        <th key={h} className={`${headingFont.className} text-left text-[9px] uppercase tracking-[0.1em] text-[#2A2A2A] px-3 py-2 font-normal`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0D0D0D]">
                    {['S / Black', 'M / Black', 'L / Black', 'XL / Black', 'S / White', 'M / White'].map((v, i) => (
                      <tr key={v} className="hover:bg-[#0D0D0D] transition-colors">
                        <td className={`${bodyFont.className} px-3 py-2.5 text-sm text-[#767676]`}>{v}</td>
                        <td className="px-3 py-2.5">
                          <input defaultValue={product.sku + `-${String.fromCharCode(65 + i)}`} className={`${bodyFont.className} bg-[#111111] border border-[#1A1A1A] text-[#555555] text-xs px-2 py-1 w-28 focus:outline-none focus:border-[#333333]`} />
                        </td>
                        <td className="px-3 py-2.5">
                          <input defaultValue={product.price} className={`${bodyFont.className} bg-[#111111] border border-[#1A1A1A] text-white text-xs px-2 py-1 w-20 focus:outline-none focus:border-[#333333]`} />
                        </td>
                        <td className="px-3 py-2.5">
                          <input defaultValue={Math.floor(product.stock / 4)} className={`${bodyFont.className} bg-[#111111] border border-[#1A1A1A] text-white text-xs px-2 py-1 w-16 focus:outline-none focus:border-[#333333]`} />
                        </td>
                        <td className="px-3 py-2.5">
                          <input type="checkbox" defaultChecked className="accent-white" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'pricing' && (
            <div className="bg-[#0A0A0A] border border-[#111111] p-5">
              <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>Pricing</h3>
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                <InputField label="Regular Price (₴)" value={price} onChange={setPrice} type="number" />
                <InputField label="Sale Price (₴)" value={salePrice} onChange={setSalePrice} type="number" />
                <InputField label="Cost Price (₴)" value={costPrice} onChange={setCostPrice} type="number" hint="Used for margin calculation only" />
                <div>
                  <label className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-1.5`}>Discount</label>
                  <div className="bg-[#0D0D0D] border border-[#1A1A1A] px-3 py-2.5 text-sm text-[#555555]">
                    {discount !== null ? `${discount}% off` : '—'}
                  </div>
                </div>
                <div>
                  <label className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-1.5`}>Margin</label>
                  <div className={`bg-[#0D0D0D] border border-[#1A1A1A] px-3 py-2.5 text-sm ${margin !== null ? (margin > 30 ? 'text-emerald-400' : margin > 15 ? 'text-amber-400' : 'text-red-400') : 'text-[#555555]'}`}>
                    {margin !== null ? `${margin}%` : 'Enter cost price'}
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-[#111111]">
                <h4 className={`${headingFont.className} text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-3`}>Scheduled Sale</h4>
                <div className="grid grid-cols-2 gap-4 max-w-sm">
                  <div>
                    <label className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-1.5`}>Start Date</label>
                    <input type="date" className={`${bodyFont.className} w-full bg-[#111111] border border-[#1A1A1A] text-[#555555] text-sm px-3 py-2.5 focus:outline-none focus:border-[#333333]`} />
                  </div>
                  <div>
                    <label className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-1.5`}>End Date</label>
                    <input type="date" className={`${bodyFont.className} w-full bg-[#111111] border border-[#1A1A1A] text-[#555555] text-sm px-3 py-2.5 focus:outline-none focus:border-[#333333]`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'inventory' && (
            <div className="bg-[#0A0A0A] border border-[#111111] p-5">
              <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>Inventory Management</h3>
              <div className="flex flex-col gap-5 max-w-lg">
                <InputField label="Stock Quantity" value={stock} onChange={setStock} type="number" />
                <InputField label="Low Stock Alert Threshold" value={lowStockAlert} onChange={setLowStockAlert} type="number" hint="You'll be notified when stock falls below this number" />
                <div className="flex items-center justify-between py-3 border-b border-[#111111]">
                  <div>
                    <p className={`${bodyFont.className} text-sm text-white`}>Continue selling when out of stock</p>
                    <p className={`${bodyFont.className} text-xs text-[#444444] mt-0.5`}>Allow orders even when stock is 0</p>
                  </div>
                  <button
                    onClick={() => setContinueSelling((v) => !v)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${continueSelling ? 'bg-white' : 'bg-[#1A1A1A]'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-transform ${continueSelling ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="p-4 bg-[#0D0D0D] border border-[#111111]">
                  <p className={`${bodyFont.className} text-xs text-[#555555] mb-2`}>Stock status</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${parseInt(stock) > 10 ? 'bg-emerald-500' : parseInt(stock) > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <span className={`${bodyFont.className} text-sm ${parseInt(stock) > 10 ? 'text-emerald-400' : parseInt(stock) > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                      {parseInt(stock) > 10 ? 'In Stock' : parseInt(stock) > 0 ? `Low Stock (${stock} left)` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'shipping' && (
            <div className="bg-[#0A0A0A] border border-[#111111] p-5">
              <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>Shipping Details</h3>
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                <InputField label="Weight (kg)" value={weight} onChange={setWeight} type="number" />
                <div />
                <InputField label="Width (cm)" value={width} onChange={setWidthVal} type="number" />
                <InputField label="Height (cm)" value={heightVal} onChange={setHeightVal} type="number" />
                <InputField label="Length (cm)" value={length} onChange={setLength} type="number" />
                <div />
              </div>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#111111] max-w-lg">
                <div>
                  <p className={`${bodyFont.className} text-sm text-white`}>Free Shipping</p>
                  <p className={`${bodyFont.className} text-xs text-[#444444] mt-0.5`}>Override default shipping cost to free</p>
                </div>
                <button
                  onClick={() => setFreeShipping((v) => !v)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${freeShipping ? 'bg-white' : 'bg-[#1A1A1A]'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-transform ${freeShipping ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          )}

          {tab === 'seo' && (
            <div className="bg-[#0A0A0A] border border-[#111111] p-5">
              <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-4`}>SEO Settings</h3>
              <div className="flex flex-col gap-4 max-w-lg">
                <InputField label="SEO Title" value={seoTitle} onChange={setSeoTitle} hint={`${seoTitle.length}/60 characters`} />
                <TextAreaField label="Meta Description" value={seoDesc} onChange={setSeoDesc} rows={3} />
                <InputField label="Focus Keywords" value={seoKeywords} onChange={setSeoKeywords} hint="Comma-separated" />
                <InputField label="Canonical URL" value={canonical} onChange={setCanonical} hint="Leave blank to use default URL" />
                <InputField label="OG Image URL" value={product.image} disabled />
                <div className="flex items-center justify-between py-3 border-b border-[#111111]">
                  <div>
                    <p className={`${bodyFont.className} text-sm text-white`}>Include in Sitemap</p>
                    <p className={`${bodyFont.className} text-xs text-[#444444] mt-0.5`}>Show this product in sitemap.xml</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-white w-4 h-4" />
                </div>
              </div>
              {/* Preview */}
              <div className="mt-5 pt-4 border-t border-[#111111]">
                <p className={`${headingFont.className} text-[10px] uppercase tracking-[0.1em] text-[#333333] mb-3`}>Google Preview</p>
                <div className="bg-[#0D0D0D] border border-[#111111] p-4">
                  <p className="text-blue-400 text-base">{seoTitle}</p>
                  <p className="text-emerald-600 text-xs mt-0.5">gymfriends.ua{canonical}</p>
                  <p className="text-[#767676] text-sm mt-1">{seoDesc}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Status */}
          <div className="bg-[#0A0A0A] border border-[#111111] p-4">
            <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-3`}>Visibility</h3>
            <div className="flex flex-col gap-2">
              {(['draft', 'published', 'scheduled', 'archived'] as const).map((s) => (
                <label key={s} className={`${bodyFont.className} flex items-center gap-2.5 text-sm cursor-pointer capitalize ${status === s ? 'text-white' : 'text-[#444444]'}`}>
                  <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="accent-white" />
                  {s}
                </label>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[#111111] flex items-center justify-between">
              <span className={`${bodyFont.className} text-sm text-[#767676]`}>Featured</span>
              <button
                onClick={() => setFeatured((v) => !v)}
                className={`w-10 h-5 rounded-full transition-colors relative ${featured ? 'bg-white' : 'bg-[#1A1A1A]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-transform ${featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-[#0A0A0A] border border-[#111111] p-4">
            <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-3`}>Performance</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Views', value: product.views.toLocaleString() },
                { label: 'Sales', value: product.sales.toLocaleString() },
                { label: 'Revenue', value: `₴${product.revenue.toLocaleString()}` },
                { label: 'Conv. Rate', value: product.views > 0 ? `${((product.sales / product.views) * 100).toFixed(1)}%` : '—' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className={`${bodyFont.className} text-xs text-[#555555]`}>{stat.label}</span>
                  <span className={`${bodyFont.className} text-sm text-white`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="bg-[#0A0A0A] border border-[#111111] p-4">
            <h3 className={`${headingFont.className} text-[10px] uppercase tracking-[0.12em] text-[#555555] mb-3`}>Dates</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className={`${bodyFont.className} text-xs text-[#444444]`}>Created</span>
                <span className={`${bodyFont.className} text-xs text-[#767676]`}>{product.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${bodyFont.className} text-xs text-[#444444]`}>Updated</span>
                <span className={`${bodyFont.className} text-xs text-[#767676]`}>{product.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
