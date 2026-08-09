import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProcessGrid } from '@/components/ProcessGrid';
import { PageShell } from '@/components/PageShell';

export const metadata = {
  title: 'Доставка й оплата',
  description: 'Умови доставки та оплати Gymfriends. Нова Пошта, міжнародна доставка, онлайн оплата та накладений платіж.',
  alternates: { canonical: '/shipping' },
  openGraph: {
    url: '/shipping',
    title: 'Доставка й оплата | Gymfriends',
    description: 'Умови доставки та оплати Gymfriends. Нова Пошта, міжнародна доставка, онлайн оплата та накладений платіж.',
    images: ['https://static.kite.ai/image/upload/e_trim/f_auto,q_auto/v1786265954/app/0780422a-f84c-42a0-a322-29fdbc3daccb/yu70ob871qnxttjrct06.png'],
  },
};

export default function Shipping() {
  return (
    <PageShell>
      <main className="min-h-screen" style={{ backgroundColor: "var(--gf-bg)", color: "var(--gf-text)" }}>
        <Header />
        <ProcessGrid />
        <Footer />
      </main>
    </PageShell>
  );
}
