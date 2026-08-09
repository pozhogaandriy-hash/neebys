'use client';

import { useState, useEffect, useRef } from 'react';
import { bodyFont, headingFont } from '@/app/fonts';
import { LANGUAGES } from '@/data/translations';
import { useLang, useT } from '@/context/LangContext';


export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  // Animate in after open toggles
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [open]);

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
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <style>{`
        @keyframes gf-lang-glow-pulse {
          0%, 100% { box-shadow: 0 0 6px 1px color-mix(in srgb, var(--gf-text) 18%, transparent); }
          50%       { box-shadow: 0 0 12px 3px color-mix(in srgb, var(--gf-text) 30%, transparent); }
        }
        .gf-lang-trigger {
          position: relative;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 9px;
          border: 1px solid var(--gf-border);
          border-radius: 6px;
          background: transparent;
          color: var(--gf-text);
          cursor: pointer;
          transition:
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
          outline: none;
        }
        .gf-lang-trigger:hover,
        .gf-lang-trigger[data-open="true"] {
          border-color: color-mix(in srgb, var(--gf-text) 35%, transparent);
          background: color-mix(in srgb, var(--gf-text) 6%, transparent);
          box-shadow: 0 0 10px 2px color-mix(in srgb, var(--gf-text) 20%, transparent);
        }
        .gf-lang-trigger[data-open="true"] {
          animation: gf-lang-glow-pulse 2s ease-in-out infinite;
        }
        .gf-lang-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 148px;
          z-index: 80;
          border-radius: 8px;
          overflow: hidden;
          overflow-y: auto;
          max-height: 14rem;
          border: 1px solid color-mix(in srgb, var(--gf-text) 14%, transparent);
          background: var(--gf-bg-raised);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.28),
            0 0 0 1px color-mix(in srgb, var(--gf-text) 6%, transparent),
            0 0 20px 2px color-mix(in srgb, var(--gf-text) 8%, transparent);
          transform-origin: top right;
          transition:
            opacity 200ms cubic-bezier(0.4,0,0.2,1),
            transform 200ms cubic-bezier(0.4,0,0.2,1);
          opacity: 0;
          transform: scale(0.94) translateY(-6px);
          pointer-events: none;
        }
        .gf-lang-dropdown[data-mounted="true"] {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: auto;
        }
        .gf-lang-dropdown::-webkit-scrollbar {
          width: 3px;
        }
        .gf-lang-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .gf-lang-dropdown::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--gf-text) 18%, transparent);
          border-radius: 2px;
        }
        .gf-lang-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 12px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: left;
          background: transparent;
          color: var(--gf-text-muted);
          cursor: pointer;
          transition:
            color 150ms ease,
            background 150ms ease,
            padding-left 150ms ease;
          border: none;
          outline: none;
          position: relative;
        }
        .gf-lang-item:hover {
          color: var(--gf-text);
          background: color-mix(in srgb, var(--gf-text) 6%, transparent);
          padding-left: 16px;
        }
        .gf-lang-item[data-active="true"] {
          color: var(--gf-text);
          background: color-mix(in srgb, var(--gf-text) 10%, transparent);
        }
        .gf-lang-item[data-active="true"]:hover {
          background: color-mix(in srgb, var(--gf-text) 13%, transparent);
          padding-left: 16px;
        }
        .gf-lang-chevron {
          transition: transform 220ms cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0;
          color: color-mix(in srgb, var(--gf-text) 50%, transparent);
        }
        .gf-lang-chevron[data-open="true"] {
          transform: rotate(180deg);
        }
        .gf-lang-active-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--gf-text);
          margin-left: auto;
          flex-shrink: 0;
          opacity: 0.7;
        }
      `}</style>

      <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
        {/* Trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={`${t('aria_lang_prefix')} ${current.label}`}
          aria-expanded={open}
          aria-haspopup="listbox"
          data-open={open ? 'true' : 'false'}
          className={`${bodyFont.className} gf-lang-trigger`}
        >
          {/* Real image flag for selected language */}
          <img
            src={current.flagUrl}
            alt={current.label}
            aria-hidden="true"
            width={20}
            height={15}
            style={{
              display: 'block',
              flexShrink: 0,
              width: 20,
              height: 15,
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
          {/* Code label */}
          <span style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 600 }}>{current.label}</span>
          {/* Chevron */}
          <svg
            width="7"
            height="7"
            viewBox="0 0 7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="gf-lang-chevron"
            data-open={open ? 'true' : 'false'}
          >
            <polyline points="1,2 3.5,5 6,2" />
          </svg>
        </button>

        {/* Dropdown — animated via CSS */}
        {open && (
          <div
            ref={dropdownRef}
            role="listbox"
            aria-label={t('aria_lang_prefix')}
            data-mounted={mounted ? 'true' : 'false'}
            className="gf-lang-dropdown"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                role="option"
                aria-selected={l.code === lang}
                data-active={l.code === lang ? 'true' : 'false'}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`${headingFont.className} gf-lang-item`}
              >
                <span style={{ fontSize: '11px' }}>{l.label}</span>
                {l.code === lang && <span className="gf-lang-active-dot" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
