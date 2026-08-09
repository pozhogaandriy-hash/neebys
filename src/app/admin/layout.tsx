import { ReactNode } from 'react';
import { PageShell } from '@/components/PageShell';

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
