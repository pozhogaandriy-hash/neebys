'use client';

import Image from 'next/image';
import { headingFont, bodyFont } from '@/app/fonts';
import { useT } from '@/context/LangContext';

export function ProcessGrid() {
  const t = useT();

  return (
    <section className="relative w-full min-h-screen py-32" style={{ backgroundColor: 'var(--gf-bg)', clipPath: 'inset(0)' }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="https://static.kite.ai/image/upload/f_auto,q_auto,w_1600/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-shipping-bg.png"
          alt="Shipping Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 h-full flex flex-col justify-center mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="p-12 md:p-16 rounded-none" style={{ backgroundColor: 'var(--gf-bg-surface)' }}>
            <h2 className={`${headingFont.className} text-2xl uppercase tracking-[0.15em] mb-8`} style={{ color: 'var(--gf-text)' }}>
              {t('shipping_title')}
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className={`${headingFont.className} text-sm uppercase tracking-[0.1em] mb-3`} style={{ color: 'var(--gf-text)' }}>{t('shipping_nova_post')}</h3>
                <p className={`${bodyFont.className} text-sm leading-relaxed`} style={{ color: 'var(--gf-text-muted)' }}>
                  {t('shipping_nova_body')}
                </p>
              </div>
              <div>
                <h3 className={`${headingFont.className} text-sm uppercase tracking-[0.1em] mb-3`} style={{ color: 'var(--gf-text)' }}>{t('shipping_intl')}</h3>
                <p className={`${bodyFont.className} text-sm leading-relaxed`} style={{ color: 'var(--gf-text-muted)' }}>
                  {t('shipping_intl_body')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-12 md:p-16 rounded-none md:translate-y-20" style={{ backgroundColor: 'var(--gf-bg-surface)' }}>
            <h2 className={`${headingFont.className} text-2xl uppercase tracking-[0.15em] mb-8`} style={{ color: 'var(--gf-text)' }}>
              {t('payment_title')}
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className={`${headingFont.className} text-sm uppercase tracking-[0.1em] mb-3`} style={{ color: 'var(--gf-text)' }}>{t('payment_online')}</h3>
                <p className={`${bodyFont.className} text-sm leading-relaxed`} style={{ color: 'var(--gf-text-muted)' }}>
                  {t('payment_online_body')}
                </p>
              </div>
              <div>
                <h3 className={`${headingFont.className} text-sm uppercase tracking-[0.1em] mb-3`} style={{ color: 'var(--gf-text)' }}>{t('payment_cash')}</h3>
                <p className={`${bodyFont.className} text-sm leading-relaxed`} style={{ color: 'var(--gf-text-muted)' }}>
                  {t('payment_cash_body')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
