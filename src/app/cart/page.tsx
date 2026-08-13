'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageShell } from '@/components/PageShell';
import { headingFont, bodyFont } from '@/app/fonts';
import { useCart } from '@/context/CartContext';
import { useT } from '@/context/LangContext';
import { createClient } from '@/lib/supabase/client';

function CartPageContent() {
  const {
    items,
    totalPrice,
    updateQty,
    removeItem,
  } = useCart();

  const router = useRouter();
  const t = useT();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (n: number) =>
    n.toLocaleString('uk-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' ₴';

  /*
   * Генерація номера замовлення
   */
  const generateOrderNumber = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const random = Math.floor(1000 + Math.random() * 9000);

    return `GF-${year}${month}${day}-${random}`;
  };

  /*
   * Створення замовлення
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (items.length === 0 || loading) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const customerName = String(
        formData.get('name') || ''
      ).trim();

      const customerEmail = String(
        formData.get('email') || ''
      )
        .trim()
        .toLowerCase();

      const customerPhone = String(
        formData.get('phone') || ''
      ).trim();

      const notes = String(
        formData.get('comment') || ''
      ).trim();

      /*
       * Перевірка контактних даних
       */
      if (!customerName) {
        setError('Введіть ваше імʼя.');
        return;
      }

      if (!customerEmail) {
        setError('Введіть email.');
        return;
      }

      if (!customerPhone) {
        setError('Введіть номер телефону.');
        return;
      }

      /*
       * Отримуємо авторизованого користувача.
       * Гостьове замовлення також дозволене.
       */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // ========================================
      // GET DELIVERY PROFILE
      // ========================================

      if (!user) {
        setError(
          'Увійдіть у свій акаунт, щоб оформити замовлення.'
        );
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select(`
          id,
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
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          'PROFILE ERROR:',
          profileError
        );

        setError(
          'Не вдалося завантажити дані доставки.'
        );

        return;
      }

      if (!profile) {
        setError(
          'Профіль не знайдений. Заповніть дані доставки у профілі.'
        );

        return;
      }

      // ========================================
      // CHECK DELIVERY ADDRESS
      // ========================================

      if (
        !profile.country ||
        !profile.city ||
        !profile.postal_code ||
        !profile.street ||
        !profile.house_number
      ) {
        setError(
          'Спочатку заповніть країну, місто, поштовий індекс, вулицю та номер будинку у профілі.'
        );

        return;
      }

      // ========================================
      // BUILD SHIPPING ADDRESS
      // ========================================

      const shippingAddress = [
        profile.street,
        profile.house_number,
        profile.apartment
          ? `Apt. ${profile.apartment}`
          : null,
      ]
        .filter(Boolean)
        .join(', ');
      
      /*
       * Отримуємо ID товарів із кошика
       */
      const productIds = [
        ...new Set(
          items.map((item) => String(item.id))
        ),
      ];

      /*
       * Отримуємо актуальні товари з Supabase.
       *
       * ВАЖЛИВО:
       * ціну беремо саме з бази, а не з браузера.
       */
      const {
        data: products,
        error: productsError,
      } = await supabase
        .from('products')
        .select(
          'id, name, sku, price, sale_price, stock, status'
        )
        .in('id', productIds);

      if (productsError) {
        console.error(
          'PRODUCTS ERROR:',
          productsError
        );

        setError(
          'Не вдалося перевірити товари.'
        );

        return;
      }

      /*
       * Перевіряємо, що всі товари існують
       */
      if (
        !products ||
        products.length !== productIds.length
      ) {
        setError(
          'Один із товарів більше недоступний.'
        );

        return;
      }

      /*
       * Робимо Map для швидкого пошуку
       */
      const productMap = new Map(
        products.map((product) => [
          String(product.id),
          product,
        ])
      );

      /*
       * Загальна сума
       */
      let subtotal = 0;

      /*
       * Майбутні order_items
       */
      const orderItems = [];

      /*
       * Перевіряємо кожен товар
       */
      for (const item of items) {
        const product = productMap.get(
          String(item.id)
        );

        if (!product) {
          setError(
            `Товар "${item.name}" не знайдений.`
          );

          return;
        }

        /*
         * Перевірка статусу
         */
        if (
          product.status &&
          product.status !== 'published'
        ) {
          setError(
            `Товар "${product.name}" більше недоступний.`
          );

          return;
        }

        /*
         * Перевірка кількості
         */
        const quantity = Number(item.quantity);

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          setError(
            `Неправильна кількість товару "${product.name}".`
          );

          return;
        }

        /*
         * Перевірка розміру
         */
        if (!item.size) {
          setError(
            `Для товару "${product.name}" не вибрано розмір.`
          );

          return;
        }

        /*
         * Перевірка складу
         */
        if (
          product.stock !== null &&
          product.stock !== undefined &&
          Number(product.stock) < quantity
        ) {
          setError(
            `Товар "${product.name}" має недостатню кількість на складі.`
          );

          return;
        }

        /*
         * Визначаємо актуальну ціну.
         *
         * Якщо є sale_price — використовуємо її.
         * Інакше звичайну price.
         */
        const unitPrice =
          product.sale_price !== null &&
          product.sale_price !== undefined &&
          Number(product.sale_price) >= 0
            ? Number(product.sale_price)
            : Number(product.price);

        if (
          !Number.isFinite(unitPrice) ||
          unitPrice < 0
        ) {
          setError(
            `Неправильна ціна товару "${product.name}".`
          );

          return;
        }

        const itemTotal =
          unitPrice * quantity;

        subtotal += itemTotal;

        /*
         * Створюємо майбутній order_item
         */
        orderItems.push({
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku || null,

          size: item.size || null,

          color:
            (item as any).color || null,

          quantity,

          unit_price: unitPrice,

          total_price: itemTotal,
        });
      }

      /*
       * Генеруємо номер замовлення
       */
      const orderNumber =
        generateOrderNumber();

      /*
       * ========================================
       * CREATE ORDER
       * ========================================
       */
      const {
        data: order,
        error: orderError,
      } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,

                    user_id: user.id,

          customer_email:
            user.email || customerEmail,

          customer_name:
            profile.full_name?.trim() ||
            customerName,

          customer_phone:
            profile.phone?.trim() ||
            customerPhone,

          shipping_country:
            profile.country,

          shipping_city:
            profile.city,

          shipping_address:
            shippingAddress,

          shipping_postal_code:
            profile.postal_code,
          subtotal,

          shipping_cost: 0,

          discount: 0,

          total: subtotal,

          payment_status: 'pending',

          order_status: 'new',

          shipping_method: null,

          tracking_number: null,

          notes: notes || null,
        })
        .select('id, order_number')
        .single();

      if (orderError || !order) {
        console.error(
          'ORDER CREATION ERROR:',
          orderError
        );

        setError(
          orderError?.message ||
            'Не вдалося створити замовлення.'
        );

        return;
      }

      /*
       * ========================================
       * CREATE ORDER ITEMS
       * ========================================
       */
      const itemsToInsert =
        orderItems.map((item) => ({
          ...item,
          order_id: order.id,
        }));

      const {
        error: orderItemsError,
      } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      /*
       * Якщо order_items не створились —
       * видаляємо головне замовлення.
       */
      if (orderItemsError) {
        console.error(
          'ORDER ITEMS ERROR:',
          orderItemsError
        );

        await supabase
          .from('orders')
          .delete()
          .eq('id', order.id);

        setError(
          orderItemsError.message ||
            'Не вдалося зберегти товари замовлення.'
        );

        return;
      }

      /*
       * ========================================
       * SUCCESS
       * ========================================
       */

      /*
       * Видаляємо товари з кошика
       */
      for (const item of items) {
        removeItem(
          item.id,
          item.size
        );
      }

      /*
       * Переходимо на payment
       */
      router.push(
        `/payment?order=${encodeURIComponent(
          order.order_number
        )}`
      );
    } catch (err) {
      console.error(
        'CHECKOUT ERROR:',
        err
      );

      setError(
        'Сталася помилка під час оформлення замовлення.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--gf-bg)',
        color: 'var(--gf-text)',
      }}
    >
      <Header />

      <div className="max-w-[1440px] mx-auto px-6 pt-32 pb-24">

        <h1
          className={`${headingFont.className} text-4xl md:text-6xl uppercase tracking-[0.15em] mb-16`}
          style={{
            color: 'var(--gf-text)',
          }}
        >
          {t('cart_title')}
        </h1>

        {items.length === 0 ? (

          <div
            className="flex flex-col items-center justify-center py-24 gap-8 text-center border"
            style={{
              borderColor:
                'var(--gf-border)',
            }}
          >

            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              style={{
                color:
                  'var(--gf-border-mid)',
              }}
            >
              <path d="M10 16h8l8 32h22l8-22H20" />

              <circle
                cx="26"
                cy="54"
                r="3"
              />

              <circle
                cx="44"
                cy="54"
                r="3"
              />
            </svg>

            <p
              className={bodyFont.className}
              style={{
                color:
                  'var(--gf-text-faint)',
              }}
            >
              {t('cart_empty')}
            </p>

            <Link
              href="/catalog"
              className={`${headingFont.className} border px-10 py-4 text-xs uppercase tracking-[0.2em] transition-colors`}
              style={{
                borderColor:
                  'var(--gf-border-mid)',
                color:
                  'var(--gf-text)',
              }}
            >
              {t('cart_to_catalog')}
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">

            {/* PRODUCTS */}

            <div>

              <div
                className={`${headingFont.className} hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 text-[10px] uppercase tracking-[0.15em] border-b pb-4 mb-2`}
                style={{
                  color:
                    'var(--gf-text-faint)',
                  borderColor:
                    'var(--gf-border)',
                }}
              >
                <span>
                  {t('cart_col_product')}
                </span>

                <span className="text-center">
                  {t('cart_col_qty')}
                </span>

                <span className="text-right">
                  {t('cart_col_total')}
                </span>

                <span />
              </div>

              <ul
                className="divide-y"
                style={{
                  borderColor:
                    'var(--gf-border)',
                }}
              >

                {items.map((item) => (

                  <li
                    key={`${item.id}-${item.size}`}
                    className="py-6 grid grid-cols-1 md:grid-cols-[1fr_120px_120px_40px] gap-4 items-center"
                  >

                    <div className="flex gap-5 items-start">

                      <Link
                        href={`/catalog/${item.id}`}
                        className="relative w-20 h-[107px] flex-shrink-0 overflow-hidden"
                        style={{
                          backgroundColor:
                            'var(--gf-bg-surface)',
                        }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="pt-1">

                        <p
                          className={`${headingFont.className} text-xs uppercase tracking-[0.1em] mb-1`}
                          style={{
                            color:
                              'var(--gf-text)',
                          }}
                        >
                          {item.name}
                        </p>

                        <p
                          className={`${bodyFont.className} text-xs mb-2`}
                          style={{
                            color:
                              'var(--gf-text-faint)',
                          }}
                        >
                          {t('cart_size_label')}{' '}
                          {item.size}
                        </p>

                        <p
                          className={`${bodyFont.className} text-sm md:hidden`}
                          style={{
                            color:
                              'var(--gf-text-muted)',
                          }}
                        >
                          {formatPrice(
                            item.priceNum
                          )}
                        </p>

                      </div>

                    </div>

                    {/* QUANTITY */}

                    <div
                      className="flex items-center justify-start md:justify-center border w-fit md:mx-auto"
                      style={{
                        borderColor:
                          'var(--gf-border-mid)',
                      }}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.id,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="w-9 h-9 flex items-center justify-center"
                        style={{
                          color:
                            'var(--gf-text-muted)',
                        }}
                      >
                        −
                      </button>

                      <span
                        className={`${bodyFont.className} w-9 text-center text-sm`}
                        style={{
                          color:
                            'var(--gf-text)',
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.id,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="w-9 h-9 flex items-center justify-center"
                        style={{
                          color:
                            'var(--gf-text-muted)',
                        }}
                      >
                        +
                      </button>

                    </div>

                    {/* TOTAL */}

                    <p
                      className={`${bodyFont.className} text-sm text-left md:text-right`}
                      style={{
                        color:
                          'var(--gf-text)',
                      }}
                    >
                      {formatPrice(
                        item.priceNum *
                          item.quantity
                      )}
                    </p>

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.id,
                          item.size
                        )
                      }
                      className="justify-self-start md:justify-self-end"
                      style={{
                        color:
                          'var(--gf-border-mid)',
                      }}
                      aria-label="Remove item"
                    >
                      ×
                    </button>

                  </li>

                ))}

              </ul>

              <div className="mt-8">

                <Link
                  href="/catalog"
                  className={`${headingFont.className} text-[10px] uppercase tracking-[0.2em] flex items-center gap-2`}
                  style={{
                    color:
                      'var(--gf-text-faint)',
                  }}
                >
                  ← {t('cart_continue')}
                </Link>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex flex-col">

              {/* SUMMARY */}

              <div
                className="border p-8"
                style={{
                  backgroundColor:
                    'var(--gf-bg-raised)',
                  borderColor:
                    'var(--gf-border)',
                }}
              >

                <p
                  className={`${headingFont.className} text-xs uppercase tracking-[0.2em] mb-6`}
                  style={{
                    color:
                      'var(--gf-text)',
                  }}
                >
                  {t('cart_order_summary')}
                </p>

                <ul className="flex flex-col gap-3 mb-6">

                  {items.map((item) => (

                    <li
                      key={`${item.id}-${item.size}`}
                      className="flex justify-between gap-4"
                    >

                      <span
                        className={`${bodyFont.className} text-xs`}
                        style={{
                          color:
                            'var(--gf-text-muted)',
                        }}
                      >
                        {item.name} (
                        {item.size}
                        ) ×{item.quantity}
                      </span>

                      <span
                        className={`${bodyFont.className} text-xs`}
                        style={{
                          color:
                            'var(--gf-text)',
                        }}
                      >
                        {formatPrice(
                          item.priceNum *
                            item.quantity
                        )}
                      </span>

                    </li>

                  ))}

                </ul>

                <div
                  className="border-t pt-5 flex justify-between items-center"
                  style={{
                    borderColor:
                      'var(--gf-border)',
                  }}
                >

                  <span
                    className={`${headingFont.className} text-xs uppercase tracking-[0.15em]`}
                    style={{
                      color:
                        'var(--gf-text-muted)',
                    }}
                  >
                    {t('cart_together')}
                  </span>

                  <span
                    className={`${bodyFont.className} text-xl`}
                    style={{
                      color:
                        'var(--gf-text)',
                    }}
                  >
                    {formatPrice(totalPrice)}
                  </span>

                </div>

              </div>

              {/* CUSTOMER FORM */}

              <div
                className="border border-t-0 p-8"
                style={{
                  backgroundColor:
                    'var(--gf-bg-raised)',
                  borderColor:
                    'var(--gf-border)',
                }}
              >

                <p
                  className={`${headingFont.className} text-xs uppercase tracking-[0.2em] mb-6`}
                  style={{
                    color:
                      'var(--gf-text-muted)',
                  }}
                >
                  {t('cart_inquiry_title')}
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* NAME */}

                  <div>

                    <label
                      htmlFor="name"
                      className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] mb-2`}
                      style={{
                        color:
                          'var(--gf-text-faint)',
                      }}
                    >
                      {t('cart_field_name')}
                    </label>

                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder={t(
                        'cart_field_name_placeholder'
                      )}
                      className={`${bodyFont.className} w-full bg-transparent border-b px-0 py-2.5 text-sm focus:outline-none`}
                      style={{
                        borderColor:
                          'var(--gf-border-mid)',
                        color:
                          'var(--gf-text)',
                      }}
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] mb-2`}
                      style={{
                        color:
                          'var(--gf-text-faint)',
                      }}
                    >
                      {t('cart_field_email')}
                    </label>

                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder={t(
                        'cart_field_email_placeholder'
                      )}
                      className={`${bodyFont.className} w-full bg-transparent border-b px-0 py-2.5 text-sm focus:outline-none`}
                      style={{
                        borderColor:
                          'var(--gf-border-mid)',
                        color:
                          'var(--gf-text)',
                      }}
                    />

                  </div>

                  {/* PHONE */}

                  <div>

                    <label
                      htmlFor="phone"
                      className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] mb-2`}
                      style={{
                        color:
                          'var(--gf-text-faint)',
                      }}
                    >
                      {t('cart_field_phone')}
                    </label>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder={t(
                        'cart_field_phone_placeholder'
                      )}
                      className={`${bodyFont.className} w-full bg-transparent border-b px-0 py-2.5 text-sm focus:outline-none`}
                      style={{
                        borderColor:
                          'var(--gf-border-mid)',
                        color:
                          'var(--gf-text)',
                      }}
                    />

                  </div>

                  {/* COMMENT */}

                  <div>

                    <label
                      htmlFor="comment"
                      className={`${headingFont.className} block text-[10px] uppercase tracking-[0.1em] mb-2`}
                      style={{
                        color:
                          'var(--gf-text-faint)',
                      }}
                    >
                      {t('cart_field_comment')}
                    </label>

                    <textarea
                      id="comment"
                      name="comment"
                      rows={3}
                      placeholder={t(
                        'cart_field_comment_placeholder'
                      )}
                      className={`${bodyFont.className} w-full bg-transparent border-b px-0 py-2.5 text-sm focus:outline-none resize-none`}
                      style={{
                        borderColor:
                          'var(--gf-border-mid)',
                        color:
                          'var(--gf-text)',
                      }}
                    />

                  </div>

                  {/* ERROR */}

                  {error && (

                    <div className="border border-red-900/50 bg-red-950/20 px-4 py-3">

                      <p
                        className={`${bodyFont.className} text-sm text-red-400`}
                      >
                        {error}
                      </p>

                    </div>

                  )}

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      items.length === 0
                    }
                    className={`${headingFont.className} w-full py-4 text-xs uppercase tracking-[0.2em] transition-opacity disabled:opacity-40 disabled:cursor-not-allowed`}
                    style={{
                      backgroundColor:
                        'var(--gf-invert-bg)',
                      color:
                        'var(--gf-invert-text)',
                    }}
                  >
                    {loading
                      ? 'CREATING ORDER...'
                      : t('cart_submit')}
                  </button>

                </form>

              </div>

            </div>

          </div>

        )}

      </div>

      <Footer />
    </main>
  );
}

export default function CartPage() {
  return (
    <PageShell>
      <CartPageContent />
    </PageShell>
  );
}
