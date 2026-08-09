import { Manrope } from 'next/font/google';

// Brand fonts wired in by nextjs-generation/scripts/plan_files.py.
// The planner LLM picks one Google Font per typography role from the
// Available Fonts map; this file exports each role as a next/font
// instance for components to apply via `.className`.

const _manrope = Manrope({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const heroFont = _manrope;
export const headingFont = _manrope;
export const subHeadingFont = _manrope;
export const bodyFont = _manrope;
