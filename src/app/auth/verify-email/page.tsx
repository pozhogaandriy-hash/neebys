'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SimpleAuthCard as AuthCard } from '@/components/AuthCard';
import { Alert } from '@/components/AuthFormField';
import { useAuth } from '@/context/AuthContext';
import { bodyFont, headingFont } from '@/app/fonts';

export default function VerifyEmailPage() {
  const { user, updateUser, signOut } = useAuth();
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setResent(true);
  };

  const handleMockVerify = () => {
    updateUser({ emailVerified: true });
    setResent(false);
  };

  if (user?.emailVerified) {
    return (
      <AuthCard title="Email verified" subtitle="Your account is fully activated" promoVariant="default">
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className={`${bodyFont.className} text-[#8B8FA3] text-sm`}>Your email address has been verified successfully.</p>
          <Link href="/account/profile" className={`${headingFont.className} text-sm font-semibold bg-[#7C3AED] text-white px-8 py-3 rounded-lg hover:bg-[#6D28D9] shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all`}>
            Go to Profile
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Check your inbox"
      subtitle={`We sent a verification link to ${user?.email || 'your email address'}`}
      promoVariant="default"
      footer={
        <p className={`${bodyFont.className} text-[#4a4e63] text-sm`}>
          Wrong account?{' '}
          <button onClick={signOut} className="text-[#A78BFA] hover:text-[#C4B5FD] transition-colors">
            Sign out
          </button>
        </p>
      }
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-950/40 border border-blue-900/50 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {resent && <Alert type="success" message="Verification email resent. Check your inbox." />}

        <p className={`${bodyFont.className} text-[#8B8FA3] text-sm leading-relaxed`}>
          Click the link in the email to verify your address. The link expires in 24 hours.
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={loading || resent}
            className={`${headingFont.className} w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-[0_0_20px_rgba(124,58,237,0.3)]`}
          >
            {loading && (
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {resent ? 'Email Sent' : 'Resend Verification Email'}
          </button>
          <button
            type="button"
            onClick={handleMockVerify}
            className={`${bodyFont.className} text-[#2e3350] text-xs hover:text-[#4a4e63] transition-colors`}
          >
            (Demo: Mark as verified)
          </button>
        </div>
      </div>
    </AuthCard>
  );
}
