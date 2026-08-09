'use client';

import { useState } from 'react';
import Image from 'next/image';
import { headingFont, bodyFont } from '@/app/fonts';
import { useT } from '@/context/LangContext';

/* ── Icons ────────────────────────────────────────────────────────── */
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.26 8.26 0 0 0 4.84 1.55V7.16a4.85 4.85 0 0 1-1.08-.47z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

/* ── Input field ──────────────────────────────────────────────────── */
interface FieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

function Field({ id, name, label, type = 'text', placeholder, required, rows }: FieldProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = focused ? 'var(--gf-text)' : 'var(--gf-border-mid)';

  const baseClass = `${bodyFont.className} w-full bg-transparent px-0 py-3 text-sm focus:outline-none transition-all duration-200 rounded-none placeholder:text-[var(--gf-text-dim)]`;

  return (
    <div>
      <label
        htmlFor={id}
        className={`${headingFont.className} block text-[9px] uppercase tracking-[0.2em] mb-2.5 transition-colors duration-200`}
        style={{ color: focused ? 'var(--gf-text)' : 'var(--gf-text-muted)' }}
      >
        {label}
      </label>
      <div style={{ borderBottom: `1px solid ${borderColor}`, transition: 'border-color 200ms' }}>
        {rows ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            required={required}
            placeholder={placeholder}
            className={`${baseClass} resize-none`}
            style={{ color: 'var(--gf-text)' }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            className={baseClass}
            style={{ color: 'var(--gf-text)' }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        )}
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const t = useT();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email as string,
          subject: 'Нова заявка GYMFRIENDS',
          text_body: `First Name: ${data.firstname}\nLast Name: ${data.lastname}\nPhone: ${data.phone}\nMessage: ${data.message}`,
          json_body: data,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const SOCIAL_LINKS = [
    {
      key: 'instagram',
      label: t('social_instagram'),
      href: 'https://www.instagram.com/gymfriends2026?igsh=MWJxczIzcjMyMHgyOA%3D%3D&utm_source=qr',
      icon: <InstagramIcon />,
    },
    {
      key: 'telegram',
      label: t('social_telegram'),
      href: 'https://t.me/gymfriends_shop',
      icon: <TelegramIcon />,
    },
    {
      key: 'tiktok',
      label: t('social_tiktok'),
      href: 'https://www.tiktok.com/@gym.friends.shop?_r=1&_t=ZN-98jfOaoWPZO',
      icon: <TikTokIcon />,
    },
  ];

  return (
    <section
      className="relative w-full"
      style={{ backgroundColor: 'var(--gf-bg)', color: 'var(--gf-text)' }}
    >
      {/* ── Full-bleed two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* ── LEFT: editorial + social ── */}
        <div className="relative flex flex-col justify-between pt-36 pb-16 px-8 md:px-16 lg:px-20 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1600/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-contact-bg.png"
              alt=""
              fill
              className="object-cover object-center"
              priority
            />
            {/* Dark gradient overlay — stronger at bottom for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.92) 100%)',
              }}
            />
          </div>

          {/* Content over image */}
          <div className="relative z-10">
            {/* Eyebrow */}
            <p
              className={`${headingFont.className} text-[10px] uppercase tracking-[0.3em] mb-8`}
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Gymfriends
            </p>

            {/* Large editorial heading */}
            <h1
              className={`${headingFont.className} text-[52px] md:text-[72px] lg:text-[80px] uppercase leading-[0.92] tracking-[-0.02em] font-bold`}
              style={{ color: '#ffffff' }}
            >
              {t('contact_title').split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>

            {/* Subtitle */}
            <p
              className={`${bodyFont.className} text-sm leading-relaxed mt-8 max-w-xs`}
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {t('contact_subtitle')}
            </p>
          </div>

          {/* Social links — bottom of left column */}
          <div className="relative z-10 mt-16">
            <p
              className={`${headingFont.className} text-[9px] uppercase tracking-[0.25em] mb-5`}
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              {t('social_instagram') !== 'INSTAGRAM' ? 'Слідкуйте за нами' : 'Follow us'}
            </p>
            <ul>
              {SOCIAL_LINKS.map((s, i) => (
                <li key={s.key}>
                  {i > 0 && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                  )}
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="group flex items-center justify-between py-3.5 transition-all duration-200"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; }}
                  >
                    <span className="flex items-center gap-3">
                      {s.icon}
                      <span className={`${headingFont.className} text-xs uppercase tracking-[0.15em]`}>
                        {s.label}
                      </span>
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1 group-hover:translate-x-0" style={{ transform: 'translateX(-4px)', transition: 'opacity 200ms, transform 200ms' }}>
                      <ArrowIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div
          className="flex flex-col justify-center pt-36 pb-16 px-8 md:px-16 lg:px-20"
          style={{ backgroundColor: 'var(--gf-bg-surface)' }}
        >
          {/* Section label */}
          <p
            className={`${headingFont.className} text-[9px] uppercase tracking-[0.3em] mb-10`}
            style={{ color: 'var(--gf-text-muted)' }}
          >
            01 — {t('contact_title')}
          </p>

          {status === 'success' ? (
            <div className="py-16">
              <div
                className="w-10 h-px mb-10"
                style={{ backgroundColor: 'var(--gf-text)' }}
              />
              <h2
                className={`${headingFont.className} text-4xl uppercase tracking-[0.1em] font-bold mb-4`}
                style={{ color: 'var(--gf-text)' }}
              >
                {t('contact_success_title')}
              </h2>
              <p
                className={`${bodyFont.className} text-sm leading-relaxed max-w-xs`}
                style={{ color: 'var(--gf-text-muted)' }}
              >
                {t('contact_success_body')}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Field
                  id="firstname"
                  name="firstname"
                  label={t('contact_field_firstname')}
                  placeholder={t('contact_field_name_placeholder')}
                  required
                />
                <Field
                  id="lastname"
                  name="lastname"
                  label={t('contact_field_lastname')}
                  placeholder={t('contact_field_name_placeholder')}
                  required
                />
              </div>

              <Field
                id="email"
                name="email"
                label={t('contact_field_email')}
                type="email"
                placeholder={t('contact_field_email_placeholder')}
                required
              />

              <Field
                id="phone"
                name="phone"
                label={t('contact_field_phone')}
                type="tel"
                placeholder={t('contact_field_phone_placeholder')}
                required
              />

              <Field
                id="message"
                name="message"
                label={t('contact_field_message')}
                placeholder={t('contact_field_message_placeholder')}
                rows={4}
              />

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`${headingFont.className} group relative w-full py-4 text-[11px] uppercase tracking-[0.25em] font-semibold transition-all duration-300 rounded-none overflow-hidden disabled:opacity-40`}
                  style={{
                    backgroundColor: 'var(--gf-invert-bg)',
                    color: 'var(--gf-invert-text)',
                    border: '1px solid var(--gf-invert-bg)',
                  }}
                  onMouseEnter={(e) => {
                    if (status !== 'submitting') {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.backgroundColor = 'transparent';
                      el.style.color = 'var(--gf-text)';
                      el.style.borderColor = 'var(--gf-text)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.backgroundColor = 'var(--gf-invert-bg)';
                    el.style.color = 'var(--gf-invert-text)';
                    el.style.borderColor = 'var(--gf-invert-bg)';
                  }}
                >
                  {status === 'submitting' ? t('contact_submitting') : t('contact_submit')}
                </button>

                {status === 'error' && (
                  <p
                    className={`${bodyFont.className} text-xs mt-4`}
                    style={{ color: '#ef4444' }}
                  >
                    {t('contact_error')}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
