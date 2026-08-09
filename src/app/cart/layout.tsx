import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Кошик',
  description: 'Перегляньте ваш кошик та оформіть замовлення в Gymfriends.',
  alternates: { canonical: '/cart' },
  openGraph: {
    url: '/cart',
    title: 'Кошик | Gymfriends',
    description: 'Перегляньте ваш кошик та оформіть замовлення в Gymfriends.',
    images: ['https://static.kite.ai/image/upload/e_trim/f_auto,q_auto/v1786265954/app/0780422a-f84c-42a0-a322-29fdbc3daccb/yu70ob871qnxttjrct06.png'],
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
