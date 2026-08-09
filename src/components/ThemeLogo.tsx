'use client';

import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

const DARK_LOGO =
  'https://static.kite.ai/image/upload/e_trim/f_auto,q_auto,h_64/v1786266687/app/0780422a-f84c-42a0-a322-29fdbc3daccb/psxz79ylgy4zfht6scxh.png';
const LIGHT_LOGO =
  'https://static.kite.ai/image/upload/e_trim/f_auto,q_auto,h_64/v1786266687/app/0780422a-f84c-42a0-a322-29fdbc3daccb/psxz79ylgy4zfht6scxh.png';

interface ThemeLogoProps {
  /** Rendered height in px — controls the CSS h-* size class */
  height: number;
  /** Rendered width in px — controls the CSS w-* size class */
  width: number;
  /** Extra Tailwind/CSS classes forwarded to the <Image> wrapper */
  className?: string;
  /** Whether to preload (set true for LCP logo in the header) */
  priority?: boolean;
  /** Intrinsic width for next/image layout calculation */
  intrinsicWidth?: number;
  /** Intrinsic height for next/image layout calculation */
  intrinsicHeight?: number;
}

export function ThemeLogo({
  height,
  width,
  className = 'object-contain',
  priority = false,
  intrinsicWidth,
  intrinsicHeight,
}: ThemeLogoProps) {
  const { theme } = useTheme();
  const src = theme === 'light' ? LIGHT_LOGO : DARK_LOGO;

  return (
    <Image
      src={src}
      alt="Gymfriends"
      width={intrinsicWidth ?? width}
      height={intrinsicHeight ?? height}
      className={className}
      priority={priority}
      style={{ width, height }}
    />
  );
}
