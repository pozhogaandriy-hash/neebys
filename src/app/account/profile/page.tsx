'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AccountLayout } from '@/components/AccountLayout';
import { FormField, Alert, SubmitButton } from '@/components/AuthFormField';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/LangContext';
import { headingFont, bodyFont } from '@/app/fonts';
import Link from 'next/link';

function ProfileContent() {
  const { user, updateUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useT();

  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  // Keep name state in sync when user loads from storage
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  if (isLoading || !isAuthenticated) return null;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    updateUser({ name });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <AccountLayout title={t('profile_title')}>
      <div className="flex flex-col gap-6">
        {/* Avatar section */}
        <section className="border p-6" style={{ backgroundColor: "var(--gf-bg-raised)", borderColor: "var(--gf-border)" }}>
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-5`}>{t('profile_avatar_heading')}</h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 border" style={{ backgroundColor: "var(--gf-bg-surface)", borderColor: "var(--gf-border-mid)" }}>
              <span className={`${headingFont.className} text-white text-2xl font-semibold`}>{initials}</span>
            </div>
            <div>
              <p className={`${bodyFont.className} text-[#767676] text-sm mb-3`}>
                {t('profile_avatar_hint')}
              </p>
              <button type="button" className={`${bodyFont.className} text-xs text-[#555555] border border-[#222222] px-4 py-2 hover:border-[#333333] hover:text-white transition-colors`}>
                {t('profile_upload_photo')}
              </button>
            </div>
          </div>
        </section>

        {/* Basic info */}
        <section className="border p-6" style={{ backgroundColor: "var(--gf-bg-raised)", borderColor: "var(--gf-border)" }}>
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-5`}>{t('profile_basic_heading')}</h2>
          {saved && <div className="mb-5"><Alert type="success" message={t('profile_saved')} /></div>}
          <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-lg">
            <FormField
              label={t('profile_full_name')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FormField
              label={t('profile_email_address')}
              type="email"
              value={user?.email || ''}
              disabled
              hint={t('profile_email_hint')}
            />
            <div className="flex gap-3 pt-1">
              <SubmitButton loading={loading} disabled={name === user?.name}>{t('profile_save_changes')}</SubmitButton>
            </div>
          </form>
        </section>

        {/* Account status */}
        <section className="border p-6" style={{ backgroundColor: "var(--gf-bg-raised)", borderColor: "var(--gf-border)" }}>
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-5`}>{t('profile_status_heading')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className={`${bodyFont.className} text-xs mb-1`} style={{ color: "var(--gf-text-faint)" }}>{t('profile_email_verified_label')}</p>
              <div className="flex items-center gap-2">
                {user?.emailVerified ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className={`${bodyFont.className} text-sm`} style={{ color: "var(--gf-text)" }}>{t('profile_verified')}</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className={`${bodyFont.className} text-sm text-amber-400`}>{t('profile_pending')}</span>
                    <Link href="/auth/verify-email" className={`${bodyFont.className} text-xs text-[#555555] hover:text-white underline transition-colors`}>{t('profile_verify_now')}</Link>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className={`${bodyFont.className} text-xs mb-1`} style={{ color: "var(--gf-text-faint)" }}>{t('profile_member_since')}</p>
              <p className={`${bodyFont.className} text-sm`} style={{ color: "var(--gf-text)" }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</p>
            </div>
            <div>
              <p className={`${bodyFont.className} text-xs mb-1`} style={{ color: "var(--gf-text-faint)" }}>{t('profile_last_login')}</p>
              <p className={`${bodyFont.className} text-sm`} style={{ color: "var(--gf-text)" }}>{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</p>
            </div>
          </div>
        </section>
      </div>
    </AccountLayout>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
