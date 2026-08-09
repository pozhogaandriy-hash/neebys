'use client';

import { InputHTMLAttributes, ReactNode, useState } from 'react';
import { headingFont, bodyFont } from '@/app/fonts';

/* ------------------------------------------------------------------ */
/*  FormField                                                          */
/* ------------------------------------------------------------------ */
interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  suffix?: ReactNode;
  /** Optional leading icon placed inside the input */
  icon?: ReactNode;
}

export function FormField({ label, error, hint, suffix, icon, id, className: _c, ...props }: FormFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className={`${headingFont.className} text-xs font-semibold text-white/90`}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4e63] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={fieldId}
          className={`${bodyFont.className} w-full bg-[#0d1120] border ${
            error ? 'border-red-500/60' : 'border-[#1e2235]'
          } text-white text-sm rounded-lg px-3.5 py-3 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-[#3a3f54] ${
            icon ? 'pl-10' : ''
          } ${suffix ? 'pr-12' : ''}`}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className={`${bodyFont.className} text-red-400 text-xs`}>{error}</p>}
      {hint && !error && <p className={`${bodyFont.className} text-[#4a4e63] text-xs`}>{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PasswordField                                                      */
/* ------------------------------------------------------------------ */
interface PasswordFieldProps extends Omit<FormFieldProps, 'type'> {}

export function PasswordField({ label, ...props }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <FormField
      label={label}
      type={show ? 'text' : 'password'}
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      }
      suffix={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-[#4a4e63] hover:text-white transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      }
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SocialButton                                                       */
/* ------------------------------------------------------------------ */
interface SocialButtonProps {
  provider: 'google' | 'discord' | 'github' | 'apple';
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const SOCIAL_CONFIGS = {
  google: {
    label: 'Continue with Google',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  discord: {
    label: 'Continue with Discord',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
  github: {
    label: 'Continue with GitHub',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  apple: {
    label: 'Continue with Apple',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
};

export function SocialButton({ provider, onClick, loading, disabled }: SocialButtonProps) {
  const config = SOCIAL_CONFIGS[provider];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${headingFont.className} auth-neu-btn w-full flex items-center justify-center gap-3 text-xs uppercase tracking-[0.15em] py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{
        backgroundColor: '#e8e8e8',
        color: '#090909',
        borderRadius: '0.5em',
        border: '1px solid #e8e8e8',
        boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff',
        transition: 'all 0.3s',
      }}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        config.icon
      )}
      <span>{config.label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Divider                                                            */
/* ------------------------------------------------------------------ */
export function Divider({ label = 'or' }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-[#1e2235]" />
      <span className={`${bodyFont.className} text-[#4a4e63] text-xs uppercase tracking-wider`}>
        {label}
      </span>
      <div className="flex-1 h-px bg-[#1e2235]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Alert                                                              */
/* ------------------------------------------------------------------ */
interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  const styles = {
    error: 'bg-red-950/40 border-red-900/50 text-red-400',
    success: 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400',
    warning: 'bg-amber-950/40 border-amber-900/50 text-amber-400',
    info: 'bg-blue-950/40 border-blue-900/50 text-blue-400',
  };
  const icons = {
    error: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    success: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    warning: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 8.25h.008v.008H12V8.25z" />,
  };
  return (
    <div className={`${bodyFont.className} flex items-start gap-3 border px-4 py-3 text-sm rounded-lg ${styles[type]}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </svg>
      <span>{message}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SubmitButton                                                       */
/* ------------------------------------------------------------------ */
interface SubmitButtonProps {
  loading?: boolean;
  children: ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
}

export function SubmitButton({ loading, children, disabled, variant = 'primary' }: SubmitButtonProps) {
  const isPrimary = variant === 'primary';
  const base = `${headingFont.className} w-full py-3 px-4 text-xs uppercase tracking-[0.2em] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2`;
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={isPrimary ? `${base} auth-neu-btn` : `${base} bg-red-600 text-white hover:bg-red-700 rounded-none transition-colors`}
      style={isPrimary ? {
        backgroundColor: '#e8e8e8',
        color: '#090909',
        borderRadius: '0.5em',
        border: '1px solid #e8e8e8',
        boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff',
        transition: 'all 0.3s',
      } : undefined}
    >
      {loading && (
        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
