'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { AccountLayout } from '@/components/AccountLayout';
import { FormField, Alert, SubmitButton } from '@/components/AuthFormField';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { headingFont, bodyFont } from '@/app/fonts';
import Link from 'next/link';

const supabase = createClient();

type ShippingData = {
  full_name: string;
  phone: string;
  country: string;
  city: string;
  postal_code: string;
  street: string;
  house_number: string;
  apartment: string;
  delivery_notes: string;
};

const emptyShipping: ShippingData = {
  full_name: '',
  phone: '',
  country: 'BE',
  city: '',
  postal_code: '',
  street: '',
  house_number: '',
  apartment: '',
  delivery_notes: '',
};

const EUROPEAN_COUNTRIES = [
  'AL', 'AD', 'AM', 'AT', 'AZ', 'BY', 'BE', 'BA', 'BG',
  'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GE', 'DE',
  'GR', 'HU', 'IS', 'IE', 'IT', 'KZ', 'XK', 'LV', 'LI',
  'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO',
  'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES',
  'SE', 'CH', 'TR', 'UA', 'GB', 'VA'
];

function getCountryName(
  countryCode: string,
  language: string
): string {
  try {
    const localeMap: Record<string, string> = {
      uk: 'uk-UA',
      en: 'en-US',
      fr: 'fr-FR',
      nl: 'nl-BE',
      de: 'de-DE',
      es: 'es-ES',
      it: 'it-IT',
      pt: 'pt-PT',
      pl: 'pl-PL',
      ro: 'ro-RO',
      ru: 'ru-RU',
      tr: 'tr-TR',
      cs: 'cs-CZ',
      sk: 'sk-SK',
      hu: 'hu-HU',
      bg: 'bg-BG',
      el: 'el-GR',
      sv: 'sv-SE',
      da: 'da-DK',
      fi: 'fi-FI',
      no: 'nb-NO',
    };

    const locale =
      localeMap[language] || 'en-US';

    const displayNames = new Intl.DisplayNames(
      [locale],
      {
        type: 'region',
      }
    );

    return (
      displayNames.of(countryCode) ||
      countryCode
    );
  } catch {
    return countryCode;
  }
}
function ProfileContent() {
  const { user, updateUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { lang, t } = useLang();

  const [currentLanguage, setCurrentLanguage] =
  useState('en');

useEffect(() => {
  const detectLanguage = () => {
    const lang =
      document.documentElement.lang ||
      navigator.language ||
      'en';

    setCurrentLanguage(
      lang.split('-')[0].toLowerCase()
    );
  };

  detectLanguage();

  const observer =
    new MutationObserver(detectLanguage);

  observer.observe(
    document.documentElement,
    {
      attributes: true,
      attributeFilter: ['lang'],
    }
  );

  return () => observer.disconnect();
}, []);

  // =========================
  // BASIC PROFILE
  // =========================

  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // =========================
  // SHIPPING
  // =========================

  const [shipping, setShipping] =
    useState<ShippingData>(emptyShipping);

  const [shippingLoading, setShippingLoading] =
    useState(true);

  const [shippingSaving, setShippingSaving] =
    useState(false);

  const [shippingMessage, setShippingMessage] =
    useState('');

  // =========================
  // AUTH REDIRECT
  // =========================

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  // =========================
  // SYNC NAME
  // =========================

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  // =========================
  // LOAD SHIPPING DATA
  // =========================

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      loadShippingData();
    }
  }, [isLoading, isAuthenticated, user]);

  async function loadShippingData() {
    try {
      setShippingLoading(true);

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          full_name,
          phone,
          country,
          city,
          postal_code,
          street,
          house_number,
          apartment,
          delivery_notes
        `)
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error(
          'Error loading delivery details:',
          error
        );
        return;
      }

      if (data) {
        setShipping({
          full_name: data.full_name || '',
          phone: data.phone || '',
          country: data.country || 'Belgium',
          city: data.city || '',
          postal_code: data.postal_code || '',
          street: data.street || '',
          house_number: data.house_number || '',
          apartment: data.apartment || '',
          delivery_notes: data.delivery_notes || '',
        });
      } else {
        // Якщо профілю ще немає,
        // автоматично беремо ім'я з AuthContext
        setShipping((prev) => ({
          ...prev,
          full_name: user?.name || '',
        }));
      }
    } catch (error) {
      console.error(
        'Error loading delivery details:',
        error
      );
    } finally {
      setShippingLoading(false);
    }
  }

  // =========================
  // UPDATE SHIPPING FIELD
  // =========================

  function updateShippingField(
    field: keyof ShippingData,
    value: string
  ) {
    setShipping((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // =========================
  // SAVE BASIC PROFILE
  // =========================

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    await new Promise((r) =>
      setTimeout(r, 700)
    );

    updateUser({ name });

    setLoading(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // =========================
  // SAVE SHIPPING
  // =========================

  async function saveShippingData() {
    try {
      setShippingSaving(true);
      setShippingMessage('');

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setShippingMessage(
          'Error: You must be logged in to save delivery details.'
        );
        return;
      }

      // Перевірка обов'язкових полів

      if (!shipping.full_name.trim()) {
        setShippingMessage(
          'Введіть імʼя та прізвище'
        );
        return;
      }

      if (!shipping.phone.trim()) {
        setShippingMessage(
          'Введіть номер телефону'
        );
        return;
      }

      if (!shipping.country.trim()) {
        setShippingMessage(
          'Виберіть країну'
        );
        return;
      }

      if (!shipping.city.trim()) {
        setShippingMessage(
          'Введіть місто'
        );
        return;
      }

      if (!shipping.postal_code.trim()) {
        setShippingMessage(
          'Введіть поштовий індекс'
        );
        return;
      }

      if (!shipping.street.trim()) {
        setShippingMessage(
          'Введіть назву вулиці'
        );
        return;
      }

      if (!shipping.house_number.trim()) {
        setShippingMessage(
          'Введіть номер будинку'
        );
        return;
      }

      // Зберігаємо / оновлюємо профіль

      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: currentUser.id,

            full_name:
              shipping.full_name.trim(),

            phone:
              shipping.phone.trim(),

            country:
              shipping.country.trim(),

            city:
              shipping.city.trim(),

            postal_code:
              shipping.postal_code.trim(),

            street:
              shipping.street.trim(),

            house_number:
              shipping.house_number.trim(),

            apartment:
              shipping.apartment.trim(),

            delivery_notes:
              shipping.delivery_notes.trim(),

            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        );

      if (error) {
        console.error(
          'Error saving delivery details:',
          error
        );

        setShippingMessage(
          'Unable to save delivery details'
        );

        return;
      }

      setShippingMessage(
        'Delivery data saved ✓'
      );
    } catch (error) {
      console.error(error);

      setShippingMessage(
        'An error occurred. Please try again.'
      );
    } finally {
      setShippingSaving(false);
    }
  }

  // =========================
  // INITIALS
  // =========================

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  if (isLoading || !isAuthenticated) {
    return null;
  }

  // =========================
  // PAGE
  // =========================

  return (
    <AccountLayout title={t('profile_title')}>

      <div className="flex flex-col gap-6">

        {/* ========================================= */}
        {/* AVATAR */}
        {/* ========================================= */}

        <section
          className="border p-6"
          style={{
            backgroundColor:
              'var(--gf-bg-raised)',
            borderColor:
              'var(--gf-border)',
          }}
        >
          <h2
            className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-5`}
          >
            {t('profile_avatar_heading')}
          </h2>

          <div className="flex items-center gap-6">

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 border"
              style={{
                backgroundColor:
                  'var(--gf-bg-surface)',
                borderColor:
                  'var(--gf-border-mid)',
              }}
            >
              <span
                className={`${headingFont.className} text-white text-2xl font-semibold`}
              >
                {initials}
              </span>
            </div>

            <div>

              <p
                className={`${bodyFont.className} text-[#767676] text-sm mb-3`}
              >
                {t('profile_avatar_hint')}
              </p>

              <button
                type="button"
                className={`${bodyFont.className} text-xs text-[#555555] border border-[#222222] px-4 py-2 hover:border-[#333333] hover:text-white transition-colors`}
              >
                {t('profile_upload_photo')}
              </button>

            </div>

          </div>
        </section>


        {/* ========================================= */}
        {/* BASIC INFO */}
        {/* ========================================= */}

        <section
          className="border p-6"
          style={{
            backgroundColor:
              'var(--gf-bg-raised)',
            borderColor:
              'var(--gf-border)',
          }}
        >

          <h2
            className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-5`}
          >
            {t('profile_basic_heading')}
          </h2>

          {saved && (
            <div className="mb-5">
              <Alert
                type="success"
                message={t('profile_saved')}
              />
            </div>
          )}

          <form
            onSubmit={handleSave}
            className="flex flex-col gap-5 max-w-lg"
          >

            <FormField
              label={t('profile_full_name')}
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
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

              <SubmitButton
                loading={loading}
                disabled={name === user?.name}
              >
                {t('profile_save_changes')}
              </SubmitButton>

            </div>

          </form>

        </section>


{/* DELIVERY INFORMATION */}
        <section
          className="border p-6"
          style={{
            backgroundColor: 'var(--gf-bg-raised)',
            borderColor: 'var(--gf-border)',
          }}
        >
          <h2
            className={`${headingFont.className} text-xs uppercase tracking-[0.12em] mb-2`}
            style={{ color: 'var(--gf-text)' }}
          >
            {t('delivery_data_title')}
          </h2>

          <p
            className={`${bodyFont.className} text-sm mb-6`}
            style={{ color: 'var(--gf-text-muted)' }}
          >
            {t('delivery_data_hint')}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveShippingData();
            }}
            className="flex flex-col gap-5 max-w-lg"
          >
            {/* FULL NAME */}
            <div>
              <label
                htmlFor="delivery_full_name"
                className={`${bodyFont.className} block text-sm font-medium mb-2`}
                style={{ color: 'var(--gf-text)' }}
              >
                {t('delivery_recipient_name')}
              </label>

              <input
                id="delivery_full_name"
                name="full_name"
                type="text"
                value={shipping.full_name}
                onChange={(e) =>
                  updateShippingField('full_name', e.target.value)
                }
                placeholder={t('delivery_recipient_name')}
                required
                className={`${bodyFont.className} w-full border rounded-md px-4 py-3 text-sm outline-none`}
                style={{
                  backgroundColor: 'var(--gf-bg-input, #10121c)',
                  borderColor: 'var(--gf-border-mid)',
                  color: 'var(--gf-text)',
                }}
              />
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="delivery_phone"
                className={`${bodyFont.className} block text-sm font-medium mb-2`}
                style={{ color: 'var(--gf-text)' }}
              >
                {t('delivery_phone')}
              </label>

              <input
                id="delivery_phone"
                name="phone"
                type="tel"
                value={shipping.phone}
                onChange={(e) =>
                  updateShippingField('phone', e.target.value)
                }
                placeholder="+32..."
                required
                className={`${bodyFont.className} w-full border rounded-md px-4 py-3 text-sm outline-none`}
                style={{
                  backgroundColor: 'var(--gf-bg-input, #10121c)',
                  borderColor: 'var(--gf-border-mid)',
                  color: 'var(--gf-text)',
                }}
              />
            </div>

            {/* COUNTRY */}
<div>
  <label
    htmlFor="delivery_country"
    className={`${bodyFont.className} block text-sm font-medium mb-2`}
    style={{ color: 'var(--gf-text)' }}
  >
    {t('delivery_country')}
  </label>

  <select
    id="delivery_country"
    name="country"
    value={shipping.country}
    onChange={(e) =>
      updateShippingField(
        'country',
        e.target.value
      )
    }
    required
    className={`${bodyFont.className} w-full border px-4 py-3 text-sm outline-none`}
    style={{
      backgroundColor: 'var(--gf-bg-raised)',
      borderColor: 'var(--gf-border)',
      color: 'var(--gf-text)',
    }}
  >
    {EUROPEAN_COUNTRIES.map((code) => (
      <option
        key={code}
        value={code}
      >
        {getCountryName(code, lang)}
      </option>
    ))}
  </select>
</div>

            {/* CITY + POSTAL CODE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="delivery_city"
                  className={`${bodyFont.className} block text-sm font-medium mb-2`}
                  style={{ color: 'var(--gf-text)' }}
                >
                  {t('delivery_city')}
                </label>

                <input
                  id="delivery_city"
                  name="city"
                  type="text"
                  value={shipping.city}
                  onChange={(e) =>
                    updateShippingField('city', e.target.value)
                  }
                  placeholder={t('delivery_city')}
                  required
                  className={`${bodyFont.className} w-full border rounded-md px-4 py-3 text-sm outline-none`}
                  style={{
                    backgroundColor: 'var(--gf-bg-input, #10121c)',
                    borderColor: 'var(--gf-border-mid)',
                    color: 'var(--gf-text)',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="delivery_postal_code"
                  className={`${bodyFont.className} block text-sm font-medium mb-2`}
                  style={{ color: 'var(--gf-text)' }}
                >
                  {t('delivery_postal_code')}
                </label>

                <input
                  id="delivery_postal_code"
                  name="postal_code"
                  type="text"
                  value={shipping.postal_code}
                  onChange={(e) =>
                    updateShippingField('postal_code', e.target.value)
                  }
                  placeholder="1000"
                  required
                  className={`${bodyFont.className} w-full border rounded-md px-4 py-3 text-sm outline-none`}
                  style={{
                    backgroundColor: 'var(--gf-bg-input, #10121c)',
                    borderColor: 'var(--gf-border-mid)',
                    color: 'var(--gf-text)',
                  }}
                />
              </div>
            </div>

            {/* STREET */}
            <div>
              <label
                htmlFor="delivery_street"
                className={`${bodyFont.className} block text-sm font-medium mb-2`}
                style={{ color: 'var(--gf-text)' }}
              >
                {t('delivery_street')}
              </label>

              <input
                id="delivery_street"
                name="street"
                type="text"
                value={shipping.street}
                onChange={(e) =>
                  updateShippingField('street', e.target.value)
                }
                placeholder={t('delivery_street')}
                required
                className={`${bodyFont.className} w-full border rounded-md px-4 py-3 text-sm outline-none`}
                style={{
                  backgroundColor: 'var(--gf-bg-input, #10121c)',
                  borderColor: 'var(--gf-border-mid)',
                  color: 'var(--gf-text)',
                }}
              />
            </div>

            {/* HOUSE + APARTMENT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="delivery_house_number"
                  className={`${bodyFont.className} block text-sm font-medium mb-2`}
                  style={{ color: 'var(--gf-text)' }}
                >
                  {t('delivery_house_number')}
                </label>

                <input
                  id="delivery_house_number"
                  name="house_number"
                  type="text"
                  value={shipping.house_number}
                  onChange={(e) =>
                    updateShippingField('house_number', e.target.value)
                  }
                  placeholder="80"
                  required
                  className={`${bodyFont.className} w-full border rounded-md px-4 py-3 text-sm outline-none`}
                  style={{
                    backgroundColor: 'var(--gf-bg-input, #10121c)',
                    borderColor: 'var(--gf-border-mid)',
                    color: 'var(--gf-text)',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="delivery_apartment"
                  className={`${bodyFont.className} block text-sm font-medium mb-2`}
                  style={{ color: 'var(--gf-text)' }}
                >
                  {t('delivery_apartment')}
                </label>

                <input
                  id="delivery_apartment"
                  name="apartment"
                  type="text"
                  value={shipping.apartment}
                  onChange={(e) =>
                    updateShippingField('apartment', e.target.value)
                  }
                  placeholder="2"
                  className={`${bodyFont.className} w-full border rounded-md px-4 py-3 text-sm outline-none`}
                  style={{
                    backgroundColor: 'var(--gf-bg-input, #10121c)',
                    borderColor: 'var(--gf-border-mid)',
                    color: 'var(--gf-text)',
                  }}
                />
              </div>
            </div>

            {/* DELIVERY NOTES */}
            <div>
              <label
                htmlFor="delivery_notes"
                className={`${bodyFont.className} block text-sm font-medium mb-2`}
                style={{ color: 'var(--gf-text)' }}
              >
                {t('delivery_notes')}
              </label>

              <textarea
                id="delivery_notes"
                name="delivery_notes"
                rows={4}
                value={shipping.delivery_notes}
                onChange={(e) =>
                  updateShippingField('delivery_notes', e.target.value)
                }
                placeholder={t('delivery_notes_placeholder')}
                className={`${bodyFont.className} w-full border px-4 py-3 text-sm outline-none resize-none`}
                style={{
                  backgroundColor: 'var(--gf-bg-input, #10121c)',
                  borderColor: 'var(--gf-border-mid)',
                  color: 'var(--gf-text)',
                }}
              />
            </div>

            {/* MESSAGE */}
            {shippingMessage && (
              <div
                className={`${bodyFont.className} border px-4 py-3 text-sm`}
                style={{
                  backgroundColor: 'var(--gf-bg-surface)',
                  borderColor: 'var(--gf-border)',
                  color: 'var(--gf-text-muted)',
                }}
              >
                {shippingMessage}
              </div>
            )}

            {/* SAVE */}
            <button
              type="submit"
              disabled={shippingSaving || shippingLoading}
              className={`${headingFont.className} w-full py-4 text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{
                backgroundColor: 'var(--gf-text)',
                color: 'var(--gf-bg)',
              }}
            >
              {shippingSaving
                ? 'ЗБЕРЕЖЕННЯ...'
                : t('delivery_save')}
            </button>
          </form>
        </section>

        {/* ========================================= */}
        {/* ACCOUNT STATUS */}
        {/* ========================================= */}

        <section
          className="border p-6"
          style={{
            backgroundColor:
              'var(--gf-bg-raised)',
            borderColor:
              'var(--gf-border)',
          }}
        >

          <h2
            className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#767676] mb-5`}
          >
            {t('profile_status_heading')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* EMAIL */}

            <div>

              <p
                className={`${bodyFont.className} text-xs mb-1`}
                style={{
                  color:
                    'var(--gf-text-faint)',
                }}
              >
                {t(
                  'profile_email_verified_label'
                )}
              </p>

              <div className="flex items-center gap-2">

                {user?.emailVerified ? (

                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />

                    <span
                      className={`${bodyFont.className} text-sm`}
                      style={{
                        color:
                          'var(--gf-text)',
                      }}
                    >
                      {t('profile_verified')}
                    </span>
                  </>

                ) : (

                  <>
                    <div className="w-2 h-2 rounded-full bg-amber-500" />

                    <span
                      className={`${bodyFont.className} text-sm text-amber-400`}
                    >
                      {t('profile_pending')}
                    </span>

                    <Link
                      href="/auth/verify-email"
                      className={`${bodyFont.className} text-xs text-[#555555] hover:text-white underline transition-colors`}
                    >
                      {t(
                        'profile_verify_now'
                      )}
                    </Link>
                  </>

                )}

              </div>

            </div>


            {/* MEMBER SINCE */}

            <div>

              <p
                className={`${bodyFont.className} text-xs mb-1`}
                style={{
                  color:
                    'var(--gf-text-faint)',
                }}
              >
                {t('profile_member_since')}
              </p>

              <p
                className={`${bodyFont.className} text-sm`}
                style={{
                  color:
                    'var(--gf-text)',
                }}
              >
                {user?.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )
                  : '—'}
              </p>

            </div>


            {/* LAST LOGIN */}

            <div>

              <p
                className={`${bodyFont.className} text-xs mb-1`}
                style={{
                  color:
                    'var(--gf-text-faint)',
                }}
              >
                {t('profile_last_login')}
              </p>

              <p
                className={`${bodyFont.className} text-sm`}
                style={{
                  color:
                    'var(--gf-text)',
                }}
              >
                {user?.lastLoginAt
                  ? new Date(
                      user.lastLoginAt
                    ).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )
                  : '—'}
              </p>

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