'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SimpleAuthCard as AuthCard } from '@/components/AuthCard';
import { PasswordField, Alert, SubmitButton } from '@/components/AuthFormField';
import { bodyFont } from '@/app/fonts';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
    setTimeout(() => router.push('/auth/sign-in'), 2500);
  };

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password for your account"
      promoVariant="default"
      footer={
        <Link href="/auth/sign-in" className={`${bodyFont.className} text-[#A78BFA] hover:text-[#C4B5FD] text-sm flex items-center gap-1.5 transition-colors`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="9,2 4,7 9,12" />
          </svg>
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <Alert type="success" message="Password updated successfully. Redirecting to sign in..." />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && <Alert type="error" message={error} />}
          <PasswordField
            label="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            required
          />
          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
            required
          />
          <SubmitButton loading={loading}>Reset Password</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
