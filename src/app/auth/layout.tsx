import { ReactNode } from 'react';
import { PageShell } from '@/components/PageShell';
import { AuthPanelProvider } from '@/context/AuthPanelContext';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <AuthPanelProvider>
        {children}
      </AuthPanelProvider>
    </PageShell>
  );
}
