'use client';

/**
 * AuthCard — single-page split-screen auth shell.
 *
 * Layout (desktop):
 *   [  Sign-in form (left 50%)  ] [  Sign-up form (right 50%)  ]
 *
 * The decorative panel (rings + shared brand message) floats absolutely
 * over whichever half is currently *inactive*, blocking it from view and
 * from interaction (pointer-events-none + inert on the hidden form half).
 *
 * Panel slides:
 *   mode === 'sign-in' → panel on RIGHT  (covers sign-up)
 *   mode === 'sign-up' → panel on LEFT   (covers sign-in)
 *
 * On mobile: only the active form is shown; the panel is hidden.
 */

import Link from 'next/link';
import Image from 'next/image';
import { headingFont, bodyFont } from '@/app/fonts';
import { ReactNode, useEffect, useRef } from 'react';
import { useT } from '@/context/LangContext';

/* ------------------------------------------------------------------ */
/*  Starfield                                                          */
/* ------------------------------------------------------------------ */
function makeStars(count: number, seed: number): string {
  const out: string[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const x = Math.abs(s % 2000);
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const y = Math.abs(s % 2000);
    out.push(`${x}px ${y}px #fff`);
  }
  return out.join(', ');
}
const STARS1 = makeStars(700, 42);
const STARS2 = makeStars(200, 137);
const STARS3 = makeStars(100, 999);

/* ------------------------------------------------------------------ */
/*  FormPanel — one of the two side-by-side form halves               */
/* ------------------------------------------------------------------ */
interface FormPanelProps {
  title: string;
  subtitle: string;
  active: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

function FormPanel({ title, subtitle, active, children, footer }: FormPanelProps) {
  return (
    /* inert attribute blocks all interaction when the panel covers this half */
    <div
      className={`w-full lg:w-1/2 flex-shrink-0 flex flex-col items-center justify-center px-6 sm:px-12 py-14 relative z-0 ${!active ? 'hidden lg:flex' : 'flex'}`}
      // Hide from screen-readers and pointer when inactive (covered by panel)
      aria-hidden={!active}
      inert={!active ? true : undefined}
    >
      {/* On desktop, show both halves; the panel covers the inactive one.
          On mobile, only the active half is shown (display:none above handles mobile,
          but we override with lg:flex so desktop shows both always). */}
      <div
        className="w-full max-w-[440px] lg:max-w-none lg:w-full"
        style={{ maxWidth: 440 }}
      >
        <Link href="/" className="flex items-center gap-3 mb-12">
          <Image
            src="https://static.kite.ai/image/upload/e_trim/f_auto,q_auto,h_64/v1786266687/app/0780422a-f84c-42a0-a322-29fdbc3daccb/psxz79ylgy4zfht6scxh.png"
            alt="Gymfriends"
            width={28}
            height={28}
            className="h-7 w-auto object-contain"
          />
          <span className={`${headingFont.className} text-white text-sm uppercase tracking-[0.2em] font-semibold`}>
            GYMFRIENDS
          </span>
        </Link>

        <div className="mb-8">
          <h1 className={`${headingFont.className} text-[28px] sm:text-3xl text-white font-bold mb-2 leading-tight`}>
            {title}
          </h1>
          <p className={`${bodyFont.className} text-[#8B8FA3] text-[15px]`}>
            {subtitle}
          </p>
        </div>

        {children}

        {footer && <div className="mt-8 text-center">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SimpleAuthCard — single-form layout for forgot/reset/verify pages  */
/* ------------------------------------------------------------------ */
interface SimpleAuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** unused — kept for backward compat, ignored */
  promoVariant?: string;
}

export function SimpleAuthCard({ title, subtitle, children, footer }: SimpleAuthCardProps) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <style>{`
        @keyframes gfAnimStarS {
          from { transform: translateY(0px); }
          to   { transform: translateY(-2000px); }
        }
        .gf-s-stars1 { position:absolute;width:1px;height:1px;background:transparent;box-shadow:${STARS1};animation:gfAnimStarS 50s linear infinite; }
        .gf-s-stars1::after { content:"";position:absolute;top:2000px;left:0;width:1px;height:1px;background:transparent;box-shadow:${STARS1}; }
        .gf-s-stars2 { position:absolute;width:2px;height:2px;background:transparent;box-shadow:${STARS2};animation:gfAnimStarS 100s linear infinite; }
        .gf-s-stars2::after { content:"";position:absolute;top:2000px;left:0;width:2px;height:2px;background:transparent;box-shadow:${STARS2}; }
        .gf-s-stars3 { position:absolute;width:3px;height:3px;background:transparent;box-shadow:${STARS3};animation:gfAnimStarS 150s linear infinite; }
        .gf-s-stars3::after { content:"";position:absolute;top:2000px;left:0;width:3px;height:3px;background:transparent;box-shadow:${STARS3}; }
      `}</style>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)' }} />
      <div className="gf-s-stars1" aria-hidden="true" />
      <div className="gf-s-stars2" aria-hidden="true" />
      <div className="gf-s-stars3" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-[440px] mx-auto px-6 py-14">
        <Link href="/" className="flex items-center gap-3 mb-12">
          <Image
            src="https://static.kite.ai/image/upload/e_trim/f_auto,q_auto,h_64/v1786266687/app/0780422a-f84c-42a0-a322-29fdbc3daccb/psxz79ylgy4zfht6scxh.png"
            alt="Gymfriends" width={28} height={28} className="h-7 w-auto object-contain"
          />
          <span className={`${headingFont.className} text-white text-sm uppercase tracking-[0.2em] font-semibold`}>GYMFRIENDS</span>
        </Link>
        <div className="mb-8">
          <h1 className={`${headingFont.className} text-[28px] sm:text-3xl text-white font-bold mb-2 leading-tight`}>{title}</h1>
          {subtitle && <p className={`${bodyFont.className} text-[#8B8FA3] text-[15px]`}>{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="mt-8 text-center">{footer}</div>}
      </div>
    </div>
  );
}

// Alias so existing pages using <AuthCard title=... children=...> still compile
export { SimpleAuthCard as AuthCardLegacy };

/* ------------------------------------------------------------------ */
/*  AuthCard — two-panel single-page layout                            */
/* ------------------------------------------------------------------ */
interface AuthCardProps {
  mode: 'sign-in' | 'sign-up';
  signInPanel: ReactNode;
  signUpPanel: ReactNode;
  signInFooter?: ReactNode;
  signUpFooter?: ReactNode;
}

export function AuthCard({ mode, signInPanel, signUpPanel, signInFooter, signUpFooter }: AuthCardProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevModeRef = useRef<string | null>(null);
  const t = useT();

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const targetLeft = mode === 'sign-in' ? '50%' : '0%';

    if (prevModeRef.current === null) {
      el.style.transition = 'none';
      el.style.left = targetLeft;
      prevModeRef.current = mode;
      return;
    }
    if (prevModeRef.current === mode) return;
    prevModeRef.current = mode;

    el.style.transition = 'left 520ms cubic-bezier(0.4, 0, 0.2, 1)';
    el.style.left = targetLeft;
  }, [mode]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <style>{`
        @keyframes gfAnimStar {
          from { transform: translateY(0px); }
          to   { transform: translateY(-2000px); }
        }
        .gf-stars1 {
          position: absolute; width: 1px; height: 1px;
          background: transparent; box-shadow: ${STARS1};
          animation: gfAnimStar 50s linear infinite;
        }
        .gf-stars1::after {
          content: ""; position: absolute; top: 2000px; left: 0;
          width: 1px; height: 1px; background: transparent; box-shadow: ${STARS1};
        }
        .gf-stars2 {
          position: absolute; width: 2px; height: 2px;
          background: transparent; box-shadow: ${STARS2};
          animation: gfAnimStar 100s linear infinite;
        }
        .gf-stars2::after {
          content: ""; position: absolute; top: 2000px; left: 0;
          width: 2px; height: 2px; background: transparent; box-shadow: ${STARS2};
        }
        .gf-stars3 {
          position: absolute; width: 3px; height: 3px;
          background: transparent; box-shadow: ${STARS3};
          animation: gfAnimStar 150s linear infinite;
        }
        .gf-stars3::after {
          content: ""; position: absolute; top: 2000px; left: 0;
          width: 3px; height: 3px; background: transparent; box-shadow: ${STARS3};
        }
        .gf-rings-container {
          position: absolute; top: 40%; left: 50%;
          transform: translateX(-50%); height: 90%;
          display: flex; justify-content: center; align-items: center;
        }
        .gf-ring-item {
          position: absolute; background-color: transparent;
          aspect-ratio: 1; border-radius: 50%;
          border: 0.9vmin solid rgb(0, 200, 255);
          transform-style: preserve-3d;
          transform: rotateX(70deg) translateZ(50px);
          animation: gfRingMove 3s ease-in-out infinite;
          box-shadow: 0px 0px 15px rgb(124,124,124), inset 0px 0px 15px rgb(124,124,124);
        }
        @keyframes gfRingMove {
          0%, 100% {
            transform: rotateX(70deg) translateZ(50px) translateY(0px);
            filter: hue-rotate(0deg);
          }
          50% {
            transform: rotateX(70deg) translateZ(50px) translateY(-50vmin);
            filter: hue-rotate(180deg);
          }
        }
      `}</style>

      {/* Starfield base */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)' }}
      />
      <div className="gf-stars1" aria-hidden="true" />
      <div className="gf-stars2" aria-hidden="true" />
      <div className="gf-stars3" aria-hidden="true" />

      {/* Both form halves — side by side on desktop */}
      <div className="relative z-0 min-h-screen flex lg:flex-row">
        {/* Sign-in half (left) */}
        <FormPanel
          title={t('auth_panel_welcome')}
          subtitle={t('auth_panel_sign_in_sub')}
          active={mode === 'sign-in'}
          footer={signInFooter}
        >
          {signInPanel}
        </FormPanel>

        {/* Sign-up half (right) */}
        <FormPanel
          title={t('auth_panel_create')}
          subtitle={t('auth_panel_create_sub')}
          active={mode === 'sign-up'}
          footer={signUpFooter}
        >
          {signUpPanel}
        </FormPanel>
      </div>

      {/* Sliding decorative panel — desktop only */}
      <div
        ref={panelRef}
        aria-hidden="true"
        className="hidden lg:flex absolute top-0 bottom-0 w-1/2 overflow-hidden items-center justify-center z-10"
        style={{ left: mode === 'sign-in' ? '50%' : '0%' }}
      >
        <div className="absolute inset-0 bg-[#030508]" />
        <div className="gf-rings-container">
          {Array.from({ length: 21 }, (_, i) => (
            <div
              key={i}
              className="gf-ring-item"
              style={{ width: `calc(${i} * 2.5vmin)`, animationDelay: `calc(${i} * 0.08s)` }}
            />
          ))}
        </div>
        {/* Shared brand message — same in both modes */}
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-8 text-white/80">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className={`${headingFont.className} text-2xl sm:text-[28px] text-white font-bold mb-4 leading-tight`}>
            {t('auth_panel_community')}
          </h2>
          <p className={`${bodyFont.className} text-white/70 text-[15px] leading-relaxed`}>
            {t('auth_panel_community_body')}
          </p>
        </div>
      </div>
    </div>
  );
}
