import { ReactNode } from 'react';
import { PageShell } from '@/components/PageShell';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
