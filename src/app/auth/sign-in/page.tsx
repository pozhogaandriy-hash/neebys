'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
import {
  FormField,
  PasswordField,
  SocialButton,
  Divider,
  Alert,
  SubmitButton,
} from '@/components/AuthFormField';
import { AuthModeSwitch } from '@/components/ui/auth-switch';
import { useAuth } from '@/context/AuthContext';
import { useAuthPanel } from '@/context/AuthPanelContext';
import { useT } from '@/context/LangContext';
import { bodyFont } from '@/app/fonts';
import { triggerGoogleSignIn } from '@/hooks/useGoogleAuth';

/* ------------------------------------------------------------------ */
/*  Sign-in form                                                       */
/* ------------------------------------------------------------------ */
function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password, remember);
    setLoading(false);
    if (result.ok) {
      router.push('/account/profile');
    } else {
      setError(result.error || t('auth_error_sign_in'));
    }
  };

  const handleGoogleSignIn = () => {
    if (socialLoading || loading) return;
    setError('');
    setSocialLoading('google');
    triggerGoogleSignIn(
      async (profile) => {
        const result = await signInWithGoogle(profile);
        setSocialLoading(null);
        if (result.ok) {
          router.push('/account/profile');
        } else {
          setError(result.error || t('auth_error_google_sign_in'));
        }
      },
      (reason) => {
        setSocialLoading(null);
        setError(reason);
      },
    );
  };

  const handleAppleSignIn = async () => {
    if (socialLoading || loading) return;
    setError('');
    setSocialLoading('apple');
    const demoEmail = 'demo-apple@gymfriends.ua';
    const result = await signIn(demoEmail, 'SocialDemo1!', true);
    setSocialLoading(null);
    if (result.ok) {
      router.push('/account/profile');
    } else {
      setError(t('auth_error_apple_sign_in'));
    }
  };

  return (
    <>
      <AuthModeSwitch mode="sign-in" onChange={(m) => m === 'sign-up' && onSwitch()} />

      {error && <div className="mb-5"><Alert type="error" message={error} /></div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label={t('auth_email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth_email_placeholder')}
          autoComplete="email"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
            </svg>
          }
          required
        />
        <PasswordField
          label={t('auth_password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth_password_enter')}
          autoComplete="current-password"
          required
        />
        <div className="flex items-center justify-between">
          <label className={`${bodyFont.className} flex items-center gap-2 text-sm text-[#8B8FA3] cursor-pointer select-none`}>
            <span className="auth-custom-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                aria-label={t('auth_remember_me')}
              />
              <span className="auth-cb-box">
                <svg className="auth-cb-check" width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4L4 7.5L10 1" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </span>
            {t('auth_remember_me')}
          </label>
          <Link
            href="/auth/forgot-password"
            className={`${bodyFont.className} text-sm text-white/70 hover:text-white transition-colors`}
          >
            {t('auth_forgot_password')}
          </Link>
        </div>
        <SubmitButton loading={loading}>{t('auth_sign_in_btn')}</SubmitButton>
      </form>

      <Divider label={t('auth_or_continue_with')} />

      <div className="flex flex-col gap-2.5">
        <SocialButton provider="google" loading={socialLoading === 'google'} disabled={!!socialLoading || loading} onClick={handleGoogleSignIn} />
        <SocialButton provider="apple" loading={socialLoading === 'apple'} disabled={!!socialLoading || loading} onClick={handleAppleSignIn} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sign-up form                                                       */
/* ------------------------------------------------------------------ */
function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const t = useT();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t('auth_validate_name');
    if (!email.trim()) e.email = t('auth_validate_email');
    if (password.length < 8) e.password = t('auth_validate_pw_length');
    if (password !== confirm) e.confirm = t('auth_validate_pw_match');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    const result = await signUp(name, email, password);
    setLoading(false);
    if (result.ok) {
      router.push('/auth/verify-email');
    } else {
      setError(result.error || t('auth_error_sign_up'));
    }
  };

  const handleGoogleSignUp = () => {
    if (socialLoading || loading) return;
    setError('');
    setSocialLoading('google');
    triggerGoogleSignIn(
      async (profile) => {
        const result = await signInWithGoogle(profile);
        setSocialLoading(null);
        if (result.ok) {
          router.push('/account/profile');
        } else {
          setError(result.error || t('auth_error_google_sign_up'));
        }
      },
      (reason) => {
        setSocialLoading(null);
        setError(reason);
      },
    );
  };

  const handleAppleSignUp = async () => {
    if (socialLoading || loading) return;
    setError('');
    setSocialLoading('apple');
    const demoEmail = 'demo-apple@gymfriends.ua';
    const result = await signIn(demoEmail, 'SocialDemo1!', true);
    setSocialLoading(null);
    if (result.ok) {
      router.push('/account/profile');
    } else {
      setError(t('auth_error_apple_sign_up'));
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const strengthLabel = ['', t('auth_strength_weak'), t('auth_strength_fair'), t('auth_strength_good'), t('auth_strength_strong')];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <>
      <AuthModeSwitch mode="sign-up" onChange={(m) => m === 'sign-in' && onSwitch()} />

      {error && <div className="mb-5"><Alert type="error" message={error} /></div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label={t('auth_full_name')}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('auth_name_placeholder')}
          autoComplete="name"
          error={errors.name}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          required
        />
        <FormField
          label={t('auth_email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth_email_placeholder')}
          autoComplete="email"
          error={errors.email}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
            </svg>
          }
          required
        />
        <div>
          <PasswordField
            label={t('auth_password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth_password_placeholder')}
            autoComplete="new-password"
            error={errors.password}
            required
          />
          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : 'bg-[#1e2235]'}`} />
                ))}
              </div>
              <span className={`${bodyFont.className} text-xs text-[#4a4e63]`}>{strengthLabel[strength]}</span>
            </div>
          )}
        </div>
        <PasswordField
          label={t('auth_confirm_password')}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={t('auth_confirm_placeholder')}
          autoComplete="new-password"
          error={errors.confirm}
          required
        />
        <p className={`${bodyFont.className} text-[#2e3350] text-xs`}>
          {t('auth_terms_prefix')}{' '}
          <Link href="#" className="text-white/70 hover:text-white transition-colors">{t('auth_terms')}</Link>
          {' '}{t('auth_terms_and')}{' '}
          <Link href="#" className="text-white/70 hover:text-white transition-colors">{t('auth_privacy')}</Link>.
        </p>
        <SubmitButton loading={loading}>{t('auth_create_account_btn')}</SubmitButton>
      </form>

      <Divider label={t('auth_or_sign_up_with')} />

      <div className="flex flex-col gap-2.5">
        <SocialButton provider="google" loading={socialLoading === 'google'} disabled={!!socialLoading || loading} onClick={handleGoogleSignUp} />
        <SocialButton provider="apple" loading={socialLoading === 'apple'} disabled={!!socialLoading || loading} onClick={handleAppleSignUp} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page — orchestrates mode state and panel side                      */
/* ------------------------------------------------------------------ */
export default function SignInPage() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const { setPanelSide } = useAuthPanel();
  const t = useT();

  const switchToSignUp = () => {
    setMode('sign-up');
    setPanelSide('left');
  };

  const switchToSignIn = () => {
    setMode('sign-in');
    setPanelSide('right');
  };

  return (
    <AuthCard
      mode={mode}
      signInPanel={<SignInForm onSwitch={switchToSignUp} />}
      signUpPanel={<SignUpForm onSwitch={switchToSignIn} />}
      signInFooter={
        <p className={`${bodyFont.className} text-[#4a4e63] text-sm`}>
          {t('auth_no_account')}{' '}
          <button type="button" onClick={switchToSignUp} className="text-white/70 hover:text-white transition-colors font-medium bg-transparent border-0 p-0 cursor-pointer">
            {t('auth_sign_up_link')}
          </button>
        </p>
      }
      signUpFooter={
        <p className={`${bodyFont.className} text-[#4a4e63] text-sm`}>
          {t('auth_have_account')}{' '}
          <button type="button" onClick={switchToSignIn} className="text-white/70 hover:text-white transition-colors font-medium bg-transparent border-0 p-0 cursor-pointer">
            {t('auth_sign_in_link')}
          </button>
        </p>
      }
    />
  );
}
