'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageShell } from '@/components/PageShell';
import { headingFont, bodyFont } from '@/app/fonts';
import { useCart } from '@/context/CartContext';
import { useT } from '@/context/LangContext';

function CartPageContent() {
  const { items, totalPrice, updateQty, removeItem } = useCart();
  const router = useRouter();
  const t = useT();

  const formatPrice = (n: number) => n.toLocaleString('uk-UA') + ' ₴';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    router.push('/payment');
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--gf-bg)', color: 'var(--gf-text)' }}>
      <Header />

      <div className="max-w-[1440px] mx-auto px-6 pt-32 pb-24">
        <h1 className={`${headingFont.className} text-4xl md:text-6xl uppercase tracking-[0.15em] mb-16`} style={{ color: 'var(--gf-text)' }}>
          {t('cart_title')}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-8 text-center border" style={{ borderColor: 'var(--gf-border)' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--gf-border-mid)' }}>
              <path d="M10 16h8l8 32h22l8-22H20" />
              <circle cx="26" cy="54" r="3" />
              <circle cx="44" cy="54" r="3" />
            </svg>
            <p className={`${bodyFont.className}`} style={{ color: 'var(--gf-text-faint)' }}>{t('cart_empty')}</p>
            <Link
              href="/catalog"
              className={`${headingFont.className} border px-10 py-4 text-xs uppercase tracking-[0.2em] transition-colors`}
              style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gf-text)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gf-border-mid)'; }}
            >
              {t('cart_to_catalog')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
            {/* Left — item list */}
            <div>
              <div className={`${headingFont.className} hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 text-[10px] uppercase tracking-[0.15em] border-b pb-4 mb-2`} style={{ color: 'var(--gf-text-faint)', borderColor: 'var(--gf-border)' }}>
                <span>{t('cart_col_product')}</span>
                <span className="text-center">{t('cart_col_qty')}</span>
                <span className="text-right">{t('cart_col_total')}</span>
                <span />
              </div>

              <ul className="divide-y" style={{ borderColor: 'var(--gf-border)' }}>
                {items.map((item) => (
                  <li key={`${item.id}-${item.size}`} className="py-6 grid grid-cols-1 md:grid-cols-[1fr_120px_120px_40px] gap-4 items-center" style={{ borderColor: 'var(--gf-border)' }}>
                    <div className="flex gap-5 items-start">
                      <Link href={`/catalog/${item.id}`} className="relative w-20 h-[107px] flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity" style={{ backgroundColor: 'var(--gf-bg-surface)' }}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="pt-1">
                        <p className={`${headingFont.className} text-xs uppercase tracking-[0.1em] mb-1`} style={{ color: 'var(--gf-text)' }}>
                          {item.name}
                        </p>
                        <p className={`${bodyFont.className} text-xs mb-2`} style={{ color: 'var(--gf-text-faint)' }}>
                          {t('cart_size_label')} {item.size}
                        </p>
                        <p className={`${bodyFont.className} text-sm md:hidden`} style={{ color: 'var(--gf-text-muted)' }}>
                          {formatPrice(item.priceNum)} {t('cart_unit')}
                        </p>
                      </div>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center justify-start md:justify-center border w-fit md:mx-auto" style={{ borderColor: 'var(--gf-border-mid)' }}>
                      <button
                        onClick={() => updateQty(item.id, item.size, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center transition-colors"
                        style={{ color: 'var(--gf-text-muted)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-muted)'; }}
                        aria-label={t('aria_decrease')}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <line x1="2" y1="6" x2="10" y2="6" />
                        </svg>
                      </button>
                      <span className={`${bodyFont.className} w-9 text-center text-sm`} style={{ color: 'var(--gf-text)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center transition-colors"
                        style={{ color: 'var(--gf-text-muted)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-muted)'; }}
                        aria-label={t('aria_increase')}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <line x1="6" y1="2" x2="6" y2="10" />
                          <line x1="2" y1="6" x2="10" y2="6" />
                        </svg>
                      </button>
                    </div>

                    <p className={`${bodyFont.className} text-sm text-left md:text-right`} style={{ color: 'var(--gf-text)' }}>
                      {formatPrice(item.priceNum * item.quantity)}
                    </p>

                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="transition-colors justify-self-start md:justify-self-end"
                      style={{ color: 'var(--gf-border-mid)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-border-mid)'; }}
                      aria-label={t('aria_remove_item')}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <line x1="3" y1="3" x2="13" y2="13" />
                        <line x1="13" y1="3" x2="3" y2="13" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/catalog"
                  className={`${headingFont.className} text-[10px] uppercase tracking-[0.2em] transition-colors flex items-center gap-2`}
                  style={{ color: 'var(--gf-text-faint)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gf-text-faint)'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <polyline points="9,2 4,7 9,12" />
                  </svg>
                  {t('cart_continue')}
                </Link>
              </div>
            </div>

            {/* Right — order summary + inquiry form */}
            <div className="flex flex-col gap-0">
              {/* Summary */}
              <div className="border p-8 mb-0" style={{ backgroundColor: 'var(--gf-bg-raised)', borderColor: 'var(--gf-border)' }}>
                <p className={`${headingFont.className} text-xs uppercase tracking-[0.2em] mb-6`} style={{ color: 'var(--gf-text)' }}>
                  {t('cart_order_summary')}
                </p>
                <ul className="flex flex-col gap-3 mb-6">
                  {items.map((item) => (
                    <li key={`${item.id}-${item.size}`} className="flex justify-between">
                      <span className={`${bodyFont.className} text-xs`} style={{ color: 'var(--gf-text-muted)' }}>
                        {item.name} ({item.size}) ×{item.quantity}
                      </span>
                      <span className={`${bodyFont.className} text-xs`} style={{ color: 'var(--gf-text)' }}>
                        {formatPrice(item.priceNum * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-5 flex justify-between items-center" style={{ borderColor: 'var(--gf-border)' }}>
                  <span className={`${headingFont.className} text-xs uppercase tracking-[0.15em]`} style={{ color: 'var(--gf-text-muted)' }}>
                    {t('cart_together')}
                  </span>
                  <span className={`${bodyFont.className} text-xl`} style={{ color: 'var(--gf-text)' }}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Inquiry form */}
              <div className="border border-t-0 p-8" style={{ backgroundColor: 'var(--gf-bg-raised)', borderColor: 'var(--gf-border)' }}>
                <p className={`${headingFont.className} text-xs uppercase tracking-[0.2em] mb-6`} style={{ color: 'var(--gf-text-muted)' }}>
                  {t('cart_inquiry_title')}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] mb-2`} style={{ color: 'var(--gf-text-faint)' }}>
                      {t('cart_field_name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder={t('cart_field_name_placeholder')}
                      className={`${bodyFont.className} w-full bg-transparent border-b px-0 py-2.5 text-sm focus:outline-none transition-colors rounded-none`}
                      style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
                      onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gf-text)'; }}
                      onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gf-border-mid)'; }}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] mb-2`} style={{ color: 'var(--gf-text-faint)' }}>
                      {t('cart_field_email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder={t('cart_field_email_placeholder')}
                      className={`${bodyFont.className} w-full bg-transparent border-b px-0 py-2.5 text-sm focus:outline-none transition-colors rounded-none`}
                      style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
                      onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gf-text)'; }}
                      onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gf-border-mid)'; }}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] mb-2`} style={{ color: 'var(--gf-text-faint)' }}>
                      {t('cart_field_phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder={t('cart_field_phone_placeholder')}
                      className={`${bodyFont.className} w-full bg-transparent border-b px-0 py-2.5 text-sm focus:outline-none transition-colors rounded-none`}
                      style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
                      onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gf-text)'; }}
                      onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gf-border-mid)'; }}
                    />
                  </div>
                  <div>
                    <label htmlFor="comment" className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] mb-2`} style={{ color: 'var(--gf-text-faint)' }}>
                      {t('cart_field_comment')}
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={3}
                      placeholder={t('cart_field_comment_placeholder')}
                      className={`${bodyFont.className} w-full bg-transparent border-b px-0 py-2.5 text-sm focus:outline-none transition-colors resize-none rounded-none`}
                      style={{ borderColor: 'var(--gf-border-mid)', color: 'var(--gf-text)' }}
                      onFocus={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--gf-text)'; }}
                      onBlur={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--gf-border-mid)'; }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={items.length === 0}
                    className={`${headingFont.className} w-full py-4 text-xs uppercase tracking-[0.2em] transition-colors mt-4 rounded-none disabled:opacity-40 disabled:cursor-not-allowed`}
                    style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}
                  >
                    {t('cart_submit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function CartPage() {
  return (
    <PageShell>
      <CartPageContent />
    </PageShell>
  );
}
