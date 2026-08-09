import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { PageShell } from '@/components/PageShell';

export const metadata = {
  title: 'Контакти',
  description: "Зв'яжіться з нами для замовлення або консультації щодо розмірів та наявності товарів Gymfriends.",
  alternates: { canonical: '/contact' },
  openGraph: {
    url: '/contact',
    title: 'Контакти | Gymfriends',
    description: "Зв'яжіться з нами для замовлення або консультації щодо розмірів та наявності товарів Gymfriends.",
    images: ['https://static.kite.ai/image/upload/e_trim/f_auto,q_auto/v1786265954/app/0780422a-f84c-42a0-a322-29fdbc3daccb/yu70ob871qnxttjrct06.png'],
  },
};

export default function Contact() {
  return (
    <PageShell>
      <main className="min-h-screen" style={{ backgroundColor: "var(--gf-bg)", color: "var(--gf-text)" }}>
        <Header />
        <ContactForm />
        <Footer />
      </main>
    </PageShell>
  );
}
