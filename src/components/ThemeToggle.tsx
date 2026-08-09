'use client';

import { useTheme } from '@/context/ThemeContext';
import { useT } from '@/context/LangContext';

/**
 * Animated day/night slider toggle — RiccardoRapelli style.
 * Dark mode  → night scene (dark-blue pill, stars, moon knob)
 * Light mode → day scene  (sky-blue pill, clouds, sun knob)
 *
 * Purely self-contained: no external libraries, no image files.
 * All animation runs via CSS transitions/keyframes in the <style> block.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useT();
  const isLight = theme === 'light';

  return (
    <>
      <style>{`
        /* ── toggle pill ── */
        .gf-toggle-label {
          display: inline-flex;
          align-items: center;
          position: relative;
          width: 52px;
          height: 26px;
          border-radius: 13px;
          cursor: pointer;
          overflow: hidden;
          flex-shrink: 0;
          background: #1c2a4a;
          transition: background 0.45s ease;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.35);
        }
        .gf-toggle-label.is-light {
          background: #4eb8f5;
        }

        /* ── sliding knob ── */
        .gf-toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f5c518;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.35s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* night: moon white */
        .gf-toggle-knob.is-dark {
          background: #e8eaf6;
          transform: translateX(0px);
        }
        /* day: sun yellow, shifted right */
        .gf-toggle-knob.is-light {
          background: #f5c518;
          transform: translateX(26px);
        }

        /* ── moon crater ── */
        .gf-moon-crater {
          position: absolute;
          border-radius: 50%;
          background: #c5c8e8;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .gf-toggle-knob.is-dark .gf-moon-crater {
          opacity: 1;
        }

        /* ── sun rays ── */
        .gf-sun-ray {
          position: absolute;
          width: 2px;
          height: 4px;
          background: #f5c518;
          border-radius: 1px;
          transform-origin: 1px 14px;
          opacity: 0;
          transition: opacity 0.3s ease 0.1s;
        }
        .gf-toggle-knob.is-light .gf-sun-ray {
          opacity: 1;
        }

        /* ── stars (night side, right area) ── */
        .gf-star {
          position: absolute;
          background: #ffffff;
          border-radius: 50%;
          transition: opacity 0.35s ease;
        }
        .gf-toggle-label.is-light .gf-star {
          opacity: 0;
        }
        .gf-toggle-label:not(.is-light) .gf-star {
          opacity: 1;
        }

        /* ── clouds (day side, left area) ── */
        .gf-cloud {
          position: absolute;
          background: rgba(255,255,255,0.85);
          border-radius: 9999px;
          transition: opacity 0.35s ease, transform 0.45s ease;
        }
        .gf-toggle-label.is-light .gf-cloud {
          opacity: 1;
        }
        .gf-toggle-label:not(.is-light) .gf-cloud {
          opacity: 0;
        }

        /* ── focus ring ── */
        .gf-toggle-label:focus-visible {
          outline: 2px solid #4eb8f5;
          outline-offset: 2px;
        }

        /* twinkle */
        @keyframes gf-twinkle {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.3; }
        }
        .gf-star:nth-child(1) { animation: gf-twinkle 2.1s ease-in-out infinite; }
        .gf-star:nth-child(2) { animation: gf-twinkle 1.7s ease-in-out infinite 0.4s; }
        .gf-star:nth-child(3) { animation: gf-twinkle 2.5s ease-in-out infinite 0.9s; }
        .gf-star:nth-child(4) { animation: gf-twinkle 1.9s ease-in-out infinite 1.3s; }
      `}</style>

      <button
        role="switch"
        aria-checked={isLight}
        aria-label={isLight ? t('theme_to_dark') : t('theme_to_light')}
        title={isLight ? t('theme_dark') : t('theme_light')}
        onClick={toggleTheme}
        className={`gf-toggle-label${isLight ? ' is-light' : ''}`}
      >
        {/* ── Stars (visible in dark mode, right side) ── */}
        <span className="gf-star" style={{ width: 2, height: 2, top: 6,  right: 8 }} />
        <span className="gf-star" style={{ width: 2, height: 2, top: 14, right: 6 }} />
        <span className="gf-star" style={{ width: 1.5, height: 1.5, top: 9, right: 13 }} />
        <span className="gf-star" style={{ width: 1.5, height: 1.5, top: 17, right: 11 }} />

        {/* ── Clouds (visible in light mode, left side) ── */}
        {/* main cloud body */}
        <span className="gf-cloud" style={{ width: 18, height: 7, bottom: 5, left: 4 }} />
        {/* cloud puff top-left */}
        <span className="gf-cloud" style={{ width: 9, height: 9, bottom: 8, left: 5 }} />
        {/* cloud puff top-right */}
        <span className="gf-cloud" style={{ width: 7, height: 7, bottom: 9, left: 11 }} />

        {/* ── Sliding knob ── */}
        <span className={`gf-toggle-knob${isLight ? ' is-light' : ' is-dark'}`}>
          {/* Moon craters (dark mode) */}
          <span className="gf-moon-crater" style={{ width: 5, height: 5, top: 3, left: 4 }} />
          <span className="gf-moon-crater" style={{ width: 3, height: 3, top: 10, left: 10 }} />

          {/* Sun rays (light mode) — 8 rays rotated around centre */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <span
              key={deg}
              className="gf-sun-ray"
              style={{ transform: `rotate(${deg}deg)`, left: 8 }}
            />
          ))}
        </span>
      </button>
    </>
  );
}
