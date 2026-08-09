'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { SimpleAuthCard as AuthCard } from '@/components/AuthCard';
import { FormField, Alert, SubmitButton } from '@/components/AuthFormField';
import { useT } from '@/context/LangContext';
import { bodyFont } from '@/app/fonts';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const t = useT();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthCard
      title={t('auth_forgot_title')}
      subtitle={t('auth_forgot_subtitle')}
      promoVariant="default"
      footer={
        <Link href="/auth/sign-in" className={`${bodyFont.className} text-white/70 hover:text-white text-sm flex items-center gap-1.5 transition-colors`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="9,2 4,7 9,12" />
          </svg>
          {t('auth_forgot_back')}
        </Link>
      }
    >
      {sent ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center mx-auto mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <Alert type="success" message={t('auth_forgot_sent').replace('{email}', email)} />
          <p className={`${bodyFont.className} text-[#555555] text-sm mt-5`}>
            {t('auth_forgot_no_receive')}{' '}
            <button onClick={() => { setSent(false); }} className="text-white/70 hover:text-white transition-colors">
              {t('auth_forgot_try_again')}
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField
            label={t('auth_forgot_email_label')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth_forgot_email_placeholder')}
            autoComplete="email"
            required
          />
          <SubmitButton loading={loading}>{t('auth_forgot_submit')}</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
