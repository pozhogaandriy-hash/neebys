'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/data/content';
import { useT } from '@/context/LangContext';
import { bodyFont, headingFont } from '@/app/fonts';

interface Props {
  /** 'bar' = compact header strip (desktop); 'drawer' = full-width in mobile menu */
  variant?: 'bar' | 'drawer';
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-zа-яіїєёa-z0-9\s]/gi, ' ');
}

function match(product: typeof products[number], query: string) {
  const q = normalize(query);
  const haystack = normalize(
    `${product.name} ${product.tag} ${product.description}`
  );
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function HeaderSearch({ variant = 'bar' }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useT();

  const results = query.trim().length >= 1
    ? products.filter((p) => match(p, query)).slice(0, 6)
    : [];

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleSelect = useCallback((id: string) => {
    setQuery('');
    setOpen(false);
    router.push(`/catalog/${id}`);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0].id);
  };

  const isBar = variant === 'bar';

  return (
    <div
      ref={wrapperRef}
      className={isBar ? 'relative flex items-center max-w-[190px] w-full' : 'relative flex items-center w-64'}
    >
      <form onSubmit={handleSubmit} className="w-full">
        {/* Search icon — adapts to theme */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none shrink-0 z-10"
          style={{ fill: 'var(--gf-text-faint)' }}
        >
          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={(e) => {
            if (query.trim().length >= 1) setOpen(true);
            (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gf-text-muted)';
            (e.currentTarget as HTMLInputElement).style.backgroundColor = 'var(--gf-bg-raised)';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gf-border)';
            (e.currentTarget as HTMLInputElement).style.backgroundColor = 'var(--gf-bg-surface)';
          }}
          placeholder={t('search_placeholder')}
          aria-label={t('search_placeholder')}
          autoComplete="off"
          className={`${bodyFont.className} w-full ${isBar ? 'h-9' : 'h-10'} pl-9 pr-3 rounded-lg text-sm outline-none transition-all`}
          style={{
            backgroundColor: 'var(--gf-bg-surface)',
            border: '1px solid var(--gf-border)',
            color: 'var(--gf-text)',
          }}
        />
      </form>

      {/* Dropdown results */}
      {open && query.trim().length >= 1 && (
        <div
          className={`absolute ${isBar ? 'top-full mt-2 w-[320px] right-0' : 'top-full mt-2 w-full left-0'} rounded-lg shadow-2xl z-[70] overflow-hidden border`}
          style={{ backgroundColor: 'var(--gf-bg-raised)', borderColor: 'var(--gf-border)' }}
        >
          {results.length > 0 ? (
            <>
              <div className="px-3 pt-3 pb-1">
                <p className={`${headingFont.className} text-[9px] uppercase tracking-[0.15em]`} style={{ color: 'var(--gf-text-dim)' }}>
                  {t('search_products_label')}
                </p>
              </div>
              <ul role="listbox" aria-label="Search results">
                {results.map((product) => (
                  <li key={product.id} role="option" aria-selected="false">
                    <button
                      type="button"
                      onMouseDown={() => handleSelect(product.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left"
                      style={{ color: 'var(--gf-text)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--gf-bg-surface)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = ''; }}
                    >
                      {/* Thumbnail */}
                      <div className="w-9 h-9 rounded flex-shrink-0 overflow-hidden border" style={{ backgroundColor: 'var(--gf-bg-surface)', borderColor: 'var(--gf-border)' }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <p className={`${headingFont.className} text-[10px] uppercase tracking-[0.1em] truncate`} style={{ color: 'var(--gf-text)' }}>
                          {product.name}
                        </p>
                        <p className={`${bodyFont.className} text-[11px]`} style={{ color: 'var(--gf-text-faint)' }}>
                          {product.price}
                          {product.tag && (
                            <span className="ml-2" style={{ color: 'var(--gf-text-dim)' }}>· {product.tag}</span>
                          )}
                        </p>
                      </div>
                      {/* Arrow */}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0" style={{ color: 'var(--gf-border-mid)' }}>
                        <polyline points="4,2 8,6 4,10" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              {/* View all link */}
              <div className="border-t" style={{ borderColor: 'var(--gf-border-sub)' }}>
                <button
                  type="button"
                  onMouseDown={() => { setQuery(''); setOpen(false); router.push('/catalog'); }}
                  className={`${bodyFont.className} w-full text-center py-2.5 text-xs transition-colors`}
                  style={{ color: 'var(--gf-text-faint)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--gf-bg-surface)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gf-text-faint)'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = ''; }}
                >
                  {t('search_view_all')}
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className={`${bodyFont.className} text-sm`} style={{ color: 'var(--gf-text-faint)' }}>
                {t('search_no_results')} &ldquo;{query}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
