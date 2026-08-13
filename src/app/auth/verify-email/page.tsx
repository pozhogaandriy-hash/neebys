'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SimpleAuthCard as AuthCard } from '@/components/AuthCard';
import { Alert } from '@/components/AuthFormField';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { bodyFont, headingFont } from '@/app/fonts';

export default function VerifyEmailPage() {
  const { user, signOut } = useAuth();

  const supabase = createClient();

  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (!user?.email || loading) return;

    setLoading(true);
    setError('');
    setResent(false);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Resend verification error:', error);
        setError(error.message);
        return;
      }

      setResent(true);
    } catch (err) {
      console.error('Resend verification error:', err);
      setError('Не вдалося повторно відправити лист.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.emailVerified) {
    return (
      <AuthCard
        title="Email verified"
        subtitle="Your email address has been verified successfully."
        promoVariant="default"
        footer={
         <Link
  href="/account/profile"
  className={`${headingFont.className} profile-button`}
>
  Go to Profile
</Link>
        }
      >
        <p
          className={`${bodyFont.className} text-[#8B8FA3] text-sm text-center`}
        >
          Your email address has been verified successfully.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Check your inbox"
      subtitle={`We sent a verification link to ${
        user?.email || 'your email address'
      }`}
      promoVariant="default"
      footer={
        <p className={`${bodyFont.className} text-[#4a4e63] text-sm`}>
          Wrong account?{' '}
          <button
            type="button"
            onClick={signOut}
            className="text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
          >
            Sign out
          </button>
        </p>
      }
    >
      <div className="w-full flex flex-col gap-5">
        {resent && (
          <Alert
            type="success"
            message="Verification email sent. Check your inbox."
          />
        )}

        {error && <Alert type="error" message={error} />}

        <p
          className={`${bodyFont.className} text-[#8B8FA3] text-sm leading-relaxed`}
        >
          Click the link in the email to verify your address. The link expires
          in 24 hours.
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className={`${headingFont.className} w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-[0_0_20px_rgba(124,58,237,0.3)]`}
          >
            {loading && (
              <svg
                className="animate-spin w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}

            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    </AuthCard>
  );
}