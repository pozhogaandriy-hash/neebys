'use client';

/**
 * AuthModeSwitch — tab bar that switches between Sign In and Create Account
 * on the single-page auth screen. No navigation — purely local state.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { headingFont } from '@/app/fonts';
import { useT } from '@/context/LangContext';

interface AuthModeSwitchProps {
  mode: 'sign-in' | 'sign-up';
  onChange: (mode: 'sign-in' | 'sign-up') => void;
}

export function AuthModeSwitch({ mode, onChange }: AuthModeSwitchProps) {
  const [signInPressed, setSignInPressed] = useState(false);
  const [createPressed, setCreatePressed] = useState(false);
  const t = useT();

  const ke1221ActiveStyle = (pressed: boolean): React.CSSProperties => ({
    color: pressed ? '#666' : '#090909',
    background: '#e8e8e8',
    border: '1px solid #e8e8e8',
    borderRadius: '0.5em',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: pressed
      ? 'inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff'
      : '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff',
  });

  const ke1221InactiveBlackStyle = (pressed: boolean): React.CSSProperties => ({
    color: pressed ? '#aaaaaa' : '#ffffff',
    background: '#0d0d0d',
    border: '1px solid #0d0d0d',
    borderRadius: '0.5em',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: pressed
      ? 'inset 4px 4px 12px #000000, inset -4px -4px 12px #2a2a2a'
      : '6px 6px 12px #000000, -6px -6px 12px #2a2a2a',
  });

  return (
    <nav
      aria-label="Authentication mode"
      className="flex w-full mb-8"
    >
      <button
        type="button"
        aria-current={mode === 'sign-in' ? 'page' : undefined}
        onClick={() => onChange('sign-in')}
        onMouseDown={() => setSignInPressed(true)}
        onMouseUp={() => setSignInPressed(false)}
        onMouseLeave={() => setSignInPressed(false)}
        onTouchStart={() => setSignInPressed(true)}
        onTouchEnd={() => setSignInPressed(false)}
        className={cn(
          headingFont.className,
          'flex-1 py-2.5 text-center text-xs uppercase tracking-[0.2em] focus-visible:outline-none',
        )}
        style={mode === 'sign-in' ? ke1221ActiveStyle(signInPressed) : ke1221InactiveBlackStyle(signInPressed)}
      >
        {t('auth_tab_sign_in')}
      </button>
      <button
        type="button"
        aria-current={mode === 'sign-up' ? 'page' : undefined}
        onClick={() => onChange('sign-up')}
        onMouseDown={() => setCreatePressed(true)}
        onMouseUp={() => setCreatePressed(false)}
        onMouseLeave={() => setCreatePressed(false)}
        onTouchStart={() => setCreatePressed(true)}
        onTouchEnd={() => setCreatePressed(false)}
        className={cn(
          headingFont.className,
          'flex-1 py-2.5 text-center text-xs uppercase tracking-[0.2em] focus-visible:outline-none',
        )}
        style={mode === 'sign-up' ? ke1221ActiveStyle(createPressed) : ke1221InactiveBlackStyle(createPressed)}
      >
        {t('auth_tab_create_account')}
      </button>
    </nav>
  );
}

export default AuthModeSwitch;
