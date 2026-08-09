'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AccountLayout } from '@/components/AccountLayout';
import { FormField, PasswordField, Alert, SubmitButton } from '@/components/AuthFormField';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/LangContext';
import { headingFont, bodyFont } from '@/app/fonts';

function SettingsContent() {
  const { user, updateUser, signOut, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useT();

  // Change email
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Change password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const handleEmailChange = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEmail || !emailPassword) return;
    setEmailLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setEmailLoading(false);
    updateUser({ email: newEmail });
    setEmailMsg({ type: 'success', text: t('settings_email_updated') });
    setNewEmail('');
    setEmailPassword('');
    setTimeout(() => setEmailMsg(null), 5000);
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) {
      setPwMsg({ type: 'error', text: t('settings_pw_too_short') });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'error', text: t('settings_pw_mismatch') });
      return;
    }
    setPwLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setPwLoading(false);
    setPwMsg({ type: 'success', text: t('settings_pw_changed') });
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setTimeout(() => setPwMsg(null), 5000);
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    if (deleteConfirm !== 'DELETE') return;
    setDeleteLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    signOut();
    router.push('/');
  };

  return (
    <AccountLayout title={t('settings_title')}>
      <div className="flex flex-col gap-6">
        {/* Change email */}
        <section className="border p-6" style={{ backgroundColor: "var(--gf-bg-raised)", borderColor: "var(--gf-border)" }}>
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-1.5`}>{t('settings_change_email_heading')}</h2>
          <p className={`${bodyFont.className} text-[#444444] text-xs mb-5`}>{t('settings_current_email_prefix')} {user?.email}</p>
          {emailMsg && <div className="mb-5"><Alert type={emailMsg.type} message={emailMsg.text} /></div>}
          <form onSubmit={handleEmailChange} className="flex flex-col gap-4 max-w-lg">
            <FormField
              label={t('settings_new_email_label')}
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={t('settings_new_email_placeholder')}
              required
            />
            <PasswordField
              label={t('settings_confirm_pw_label')}
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              placeholder={t('settings_pw_dots')}
              required
            />
            <div><SubmitButton loading={emailLoading}>{t('settings_update_email_btn')}</SubmitButton></div>
          </form>
        </section>

        {/* Change password */}
        <section className="border p-6" style={{ backgroundColor: "var(--gf-bg-raised)", borderColor: "var(--gf-border)" }}>
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-5`}>{t('settings_change_pw_heading')}</h2>
          {pwMsg && <div className="mb-5"><Alert type={pwMsg.type} message={pwMsg.text} /></div>}
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 max-w-lg">
            <PasswordField
              label={t('settings_current_pw_label')}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder={t('settings_pw_dots')}
              required
            />
            <PasswordField
              label={t('settings_new_pw_label')}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder={t('settings_new_pw_placeholder')}
              required
            />
            <PasswordField
              label={t('settings_confirm_new_pw_label')}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder={t('settings_confirm_new_pw_placeholder')}
              required
            />
            <div><SubmitButton loading={pwLoading}>{t('settings_change_pw_btn')}</SubmitButton></div>
          </form>
        </section>

        {/* Connected accounts */}
        <section className="border p-6" style={{ backgroundColor: "var(--gf-bg-raised)", borderColor: "var(--gf-border)" }}>
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-5`}>{t('settings_connected_heading')}</h2>
          <div className="flex flex-col gap-3">
            {(['google', 'discord', 'github', 'apple'] as const).map((provider) => (
              <div key={provider} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: "var(--gf-border-sub)" }}>
                <span className={`${bodyFont.className} text-sm text-white capitalize`}>{provider}</span>
                <button type="button" className={`${bodyFont.className} text-xs text-[#555555] border border-[#222222] px-4 py-1.5 hover:border-white hover:text-white transition-colors`}>
                  {t('settings_connect_btn')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Danger zone */}
        <section className="border border-red-900/30 p-6" style={{ backgroundColor: "var(--gf-bg-raised)" }}>
          <h2 className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-red-400 mb-2`}>{t('settings_danger_heading')}</h2>
          <p className={`${bodyFont.className} text-sm mb-5`} style={{ color: "var(--gf-text-faint)" }}>
            {t('settings_danger_desc')}
          </p>
          <form onSubmit={handleDelete} className="flex flex-col gap-4 max-w-lg">
            <FormField
              label={t('settings_delete_confirm_label')}
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={t('settings_delete_placeholder')}
            />
            <div>
              <SubmitButton loading={deleteLoading} disabled={deleteConfirm !== 'DELETE'} variant="danger">
                {t('settings_delete_btn')}
              </SubmitButton>
            </div>
          </form>
        </section>
      </div>
    </AccountLayout>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}
