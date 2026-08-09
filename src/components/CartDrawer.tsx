'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useT } from '@/context/LangContext';
import { headingFont, bodyFont } from '@/app/fonts';

export function CartDrawer() {
  const { items, drawerOpen, totalItems, totalPrice, removeItem, updateQty, closeDrawer } = useCart();
  const t = useT();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const formatPrice = (n: number) =>
    n.toLocaleString('uk-UA') + ' ₴';

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[60]"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-[70] flex flex-col transition-transform duration-300 ease-in-out border-l ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--gf-bg-raised)', borderColor: 'var(--gf-border)' }}
        aria-label={t('drawer_cart')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--gf-border)' }}>
          <span className={`${headingFont.className} text-xs uppercase tracking-[0.2em]`} style={{ color: 'var(--gf-text)' }}>
            {t('drawer_cart')} {totalItems > 0 && <span style={{ color: 'var(--gf-text-muted)' }}>({totalItems})</span>}
          </span>
          <button
            onClick={closeDrawer}
            aria-label={t('aria_close_cart')}
            className="transition-colors"
            style={{ color: 'var(--gf-text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-muted)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--gf-border)' }}>
                <path d="M8 12h4l4 20h16l4-16H14" />
                <circle cx="20" cy="38" r="2" />
                <circle cx="32" cy="38" r="2" />
              </svg>
              <p className={`${bodyFont.className} text-sm`} style={{ color: 'var(--gf-text-faint)' }}>
                {t('drawer_empty')}
              </p>
              <button
                onClick={closeDrawer}
                className={`${headingFont.className} text-[10px] uppercase tracking-[0.2em] border px-6 py-3 transition-colors`}
                style={{ color: 'var(--gf-text)', borderColor: 'var(--gf-border-mid)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gf-text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gf-border-mid)'; }}
              >
                {t('drawer_to_catalog')}
              </button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y" style={{ borderColor: 'var(--gf-border)' }}>
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="py-5 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-[107px] flex-shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--gf-bg-surface)' }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className={`${headingFont.className} text-[11px] uppercase tracking-[0.1em] leading-tight mb-1`} style={{ color: 'var(--gf-text)' }}>
                        {item.name}
                      </p>
                      <p className={`${bodyFont.className} text-xs mb-3`} style={{ color: 'var(--gf-text-faint)' }}>
                        {t('drawer_size')} {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty control */}
                      <div className="flex items-center border" style={{ borderColor: 'var(--gf-border-mid)' }}>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{ color: 'var(--gf-text-muted)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-muted)'; }}
                          aria-label={t('aria_decrease')}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <line x1="2" y1="6" x2="10" y2="6" />
                          </svg>
                        </button>
                        <span className={`${bodyFont.className} w-8 text-center text-xs`} style={{ color: 'var(--gf-text)' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
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

                      {/* Subtotal + remove */}
                      <div className="flex items-center gap-3">
                        <span className={`${bodyFont.className} text-sm`} style={{ color: 'var(--gf-text)' }}>
                          {formatPrice(item.priceNum * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="transition-colors"
                          style={{ color: 'var(--gf-text-dim)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-dim)'; }}
                          aria-label={t('aria_remove')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <line x1="3" y1="3" x2="11" y2="11" />
                            <line x1="11" y1="3" x2="3" y2="11" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-6 flex flex-col gap-4" style={{ borderColor: 'var(--gf-border)' }}>
            <div className="flex justify-between items-center">
              <span className={`${headingFont.className} text-xs uppercase tracking-[0.15em]`} style={{ color: 'var(--gf-text-muted)' }}>
                {t('drawer_total')}
              </span>
              <span className={`${bodyFont.className} text-lg`} style={{ color: 'var(--gf-text)' }}>
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className={`${headingFont.className} block w-full text-center py-4 text-xs uppercase tracking-[0.2em] transition-colors`}
              style={{ backgroundColor: 'var(--gf-invert-bg)', color: 'var(--gf-invert-text)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.9'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            >
              {t('drawer_checkout')}
            </Link>
            <button
              onClick={closeDrawer}
              className={`${headingFont.className} w-full border py-3 text-[10px] uppercase tracking-[0.2em] transition-colors`}
              style={{ color: 'var(--gf-text)', borderColor: 'var(--gf-border-mid)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gf-text)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gf-border-mid)'; }}
            >
              {t('drawer_continue')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
