'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AdminLayout } from '@/components/AdminLayout';
import { headingFont, bodyFont } from '@/app/fonts';
import { createClient } from '@/lib/supabase/client';

type Order = {
  id: string;
  order_number: string;

  user_id: string | null;

  customer_email: string;
  customer_name: string;
  customer_phone: string;

  shipping_country: string | null;
  shipping_city: string | null;
  shipping_address: string | null;
  shipping_postal_code: string | null;

  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;

  payment_status: string;
  order_status: string;

  shipping_method: string | null;
  tracking_number: string | null;

  notes: string | null;

  created_at: string;
  updated_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;

  product_name: string;
  product_sku: string | null;

  size: string | null;
  color: string | null;

  quantity: number;

  unit_price: number;
  total_price: number;
};

const supabase = createClient();

const PAGE_SIZE = 10;

const ORDER_STATUSES = [
  'new',
  'processing',
  'shipped',
  'completed',
  'cancelled',
];

const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'failed',
  'refunded',
];

function formatPrice(value: number) {
  return `${Number(value || 0).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₴`;
}

function formatDate(value: string) {
  if (!value) return '—';

  return new Date(value).toLocaleString('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getOrderStatusClass(status: string) {
  switch (status) {
    case 'new':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/20';

    case 'processing':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';

    case 'shipped':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/20';

    case 'completed':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

    case 'cancelled':
      return 'text-red-400 bg-red-500/10 border-red-500/20';

    default:
      return 'text-[#888888] bg-white/[0.03] border-white/[0.08]';
  }
}

function getPaymentStatusClass(status: string) {
  switch (status) {
    case 'paid':
      return 'text-emerald-400';

    case 'pending':
      return 'text-yellow-400';

    case 'failed':
      return 'text-red-400';

    case 'refunded':
      return 'text-purple-400';

    default:
      return 'text-[#777777]';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'new':
      return 'New';

    case 'processing':
      return 'Processing';

    case 'shipped':
      return 'Shipped';

    case 'completed':
      return 'Completed';

    case 'cancelled':
      return 'Cancelled';

    default:
      return status || 'Unknown';
  }
}

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [page, setPage] = useState(1);

  /*
   * LOAD ORDERS
   */
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        /*
         * Check authentication
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace('/login');
          return;
        }

        /*
         * Check admin role
         */
        const role =
          user.app_metadata?.role ??
          user.user_metadata?.role ??
          null;

        if (
          role !== 'admin' &&
          role !== 'super_admin' &&
          role !== 'support'
        ) {
          router.replace('/');
          return;
        }

        /*
         * Get orders
         */
        const {
          data: ordersData,
          error: ordersError,
        } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', {
            ascending: false,
          });

        if (ordersError) {
          console.error(
            'Failed to load orders:',
            ordersError
          );

          return;
        }

        /*
         * Get order items
         */
        const {
          data: itemsData,
          error: itemsError,
        } = await supabase
          .from('order_items')
          .select('*')
          .order('created_at', {
            ascending: true,
          });

        if (itemsError) {
          console.error(
            'Failed to load order items:',
            itemsError
          );

          return;
        }

        setOrders(
          (ordersData ?? []).map((order) => ({
            ...order,
            subtotal: Number(order.subtotal ?? 0),
            shipping_cost: Number(
              order.shipping_cost ?? 0
            ),
            discount: Number(
              order.discount ?? 0
            ),
            total: Number(order.total ?? 0),
          }))
        );

        setOrderItems(
          (itemsData ?? []).map((item) => ({
            ...item,
            quantity: Number(item.quantity ?? 0),
            unit_price: Number(
              item.unit_price ?? 0
            ),
            total_price: Number(
              item.total_price ?? 0
            ),
          }))
        );
      } catch (error) {
        console.error(
          'Orders loading error:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  /*
   * FILTER ORDERS
   */
  const filteredOrders = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    return orders.filter((order) => {
      const matchesSearch =
        !value ||
        order.order_number
          ?.toLowerCase()
          .includes(value) ||
        order.customer_name
          ?.toLowerCase()
          .includes(value) ||
        order.customer_email
          ?.toLowerCase()
          .includes(value) ||
        order.customer_phone
          ?.toLowerCase()
          .includes(value);

      const matchesStatus =
        statusFilter === 'all' ||
        order.order_status === statusFilter;

      const matchesPayment =
        paymentFilter === 'all' ||
        order.payment_status === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ]);

  /*
   * PAGINATION
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length / PAGE_SIZE
    )
  );

  const paginatedOrders =
    filteredOrders.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );

  /*
   * CHANGE ORDER STATUS
   */
  const updateOrderStatus = async (
    orderId: string,
    status: string
  ) => {
    try {
      setUpdating(orderId);

      const now =
        new Date().toISOString();

      const {
        data,
        error,
      } = await supabase
        .from('orders')
        .update({
          order_status: status,
          updated_at: now,
        })
        .eq('id', orderId)
        .select('*')
        .single();

      if (error) {
        console.error(
          'Order status update error:',
          error
        );

        alert(
          'Не вдалося змінити статус замовлення.'
        );

        return;
      }

      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...data,
                subtotal: Number(
                  data.subtotal ?? 0
                ),
                shipping_cost: Number(
                  data.shipping_cost ?? 0
                ),
                discount: Number(
                  data.discount ?? 0
                ),
                total: Number(
                  data.total ?? 0
                ),
              }
            : order
        )
      );

      setSelectedOrder((previous) =>
        previous?.id === orderId
          ? {
              ...previous,
              ...data,
              subtotal: Number(
                data.subtotal ?? 0
              ),
              shipping_cost: Number(
                data.shipping_cost ?? 0
              ),
              discount: Number(
                data.discount ?? 0
              ),
              total: Number(
                data.total ?? 0
              ),
            }
          : previous
      );
    } finally {
      setUpdating(null);
    }
  };

  /*
   * ITEMS FOR SELECTED ORDER
   */
  const selectedItems = selectedOrder
    ? orderItems.filter(
        (item) =>
          item.order_id ===
          selectedOrder.id
      )
    : [];

  return (
    <AdminLayout
      title="Orders"
      breadcrumb={[
        {
          label: 'Admin',
          href: '/admin',
        },
        {
          label: 'Orders',
        },
      ]}
    >
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1
            className={`${headingFont.className} text-lg text-white font-semibold`}
          >
            Orders
          </h1>

          <p
            className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}
          >
            {filteredOrders.length}{' '}
            orders
          </p>
        </div>
      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[240px]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444]"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            />
          </svg>

          <input
            type="text"
            placeholder="Search order, customer or email..."
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value
              );
              setPage(1);
            }}
            className={`${bodyFont.className} w-full bg-[#0A0A0A] border border-[#151515] text-white text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#292929] placeholder:text-[#333333]`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(
              event.target.value
            );
            setPage(1);
          }}
          className={`${bodyFont.className} bg-[#0A0A0A] border border-[#151515] text-[#777777] text-sm px-4 py-2.5 focus:outline-none`}
        >
          <option value="all">
            All order statuses
          </option>

          {ORDER_STATUSES.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {getStatusLabel(status)}
              </option>
            )
          )}
        </select>

        <select
          value={paymentFilter}
          onChange={(event) => {
            setPaymentFilter(
              event.target.value
            );
            setPage(1);
          }}
          className={`${bodyFont.className} bg-[#0A0A0A] border border-[#151515] text-[#777777] text-sm px-4 py-2.5 focus:outline-none`}
        >
          <option value="all">
            All payment statuses
          </option>

          {PAYMENT_STATUSES.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            )
          )}
        </select>
      </div>

      {/* TABLE */}

      <div className="border border-[#151515] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-[#151515] bg-[#0A0A0A]">
                <th className="text-left px-5 py-3">
                  <span
                    className={`${headingFont.className} text-[9px] uppercase tracking-[0.12em] text-[#555555]`}
                  >
                    Order
                  </span>
                </th>

                <th className="text-left px-5 py-3">
                  <span
                    className={`${headingFont.className} text-[9px] uppercase tracking-[0.12em] text-[#555555]`}
                  >
                    Customer
                  </span>
                </th>

                <th className="text-left px-5 py-3">
                  <span
                    className={`${headingFont.className} text-[9px] uppercase tracking-[0.12em] text-[#555555]`}
                  >
                    Date
                  </span>
                </th>

                <th className="text-left px-5 py-3">
                  <span
                    className={`${headingFont.className} text-[9px] uppercase tracking-[0.12em] text-[#555555]`}
                  >
                    Payment
                  </span>
                </th>

                <th className="text-left px-5 py-3">
                  <span
                    className={`${headingFont.className} text-[9px] uppercase tracking-[0.12em] text-[#555555]`}
                  >
                    Status
                  </span>
                </th>

                <th className="text-right px-5 py-3">
                  <span
                    className={`${headingFont.className} text-[9px] uppercase tracking-[0.12em] text-[#555555]`}
                  >
                    Total
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >
                    <span
                      className={`${bodyFont.className} text-sm text-[#555555]`}
                    >
                      Loading orders...
                    </span>
                  </td>
                </tr>
              ) : paginatedOrders.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >
                    <span
                      className={`${bodyFont.className} text-sm text-[#555555]`}
                    >
                      No orders found.
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(
                  (order) => (
                    <tr
                      key={order.id}
                      onClick={() =>
                        setSelectedOrder(
                          order
                        )
                      }
                      className="border-b border-[#111111] hover:bg-[#0D0D0D] cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span
                          className={`${headingFont.className} text-xs text-white`}
                        >
                          #
                          {
                            order.order_number
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p
                            className={`${bodyFont.className} text-sm text-white`}
                          >
                            {
                              order.customer_name
                            }
                          </p>

                          <p
                            className={`${bodyFont.className} text-xs text-[#555555] mt-0.5`}
                          >
                            {
                              order.customer_email
                            }
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`${bodyFont.className} text-xs text-[#777777]`}
                        >
                          {formatDate(
                            order.created_at
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`${headingFont.className} text-[10px] uppercase tracking-[0.08em] ${getPaymentStatusClass(
                            order.payment_status
                          )}`}
                        >
                          {
                            order.payment_status
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`${headingFont.className} inline-flex items-center border px-2.5 py-1 text-[9px] uppercase tracking-[0.08em] ${getOrderStatusClass(
                            order.order_status
                          )}`}
                        >
                          {getStatusLabel(
                            order.order_status
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span
                          className={`${bodyFont.className} text-sm text-white`}
                        >
                          {formatPrice(
                            order.total
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}

      {!loading &&
        filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-5">
            <p
              className={`${bodyFont.className} text-xs text-[#444444]`}
            >
              Page {page} of{' '}
              {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (previous) =>
                      Math.max(
                        1,
                        previous - 1
                      )
                  )
                }
                className="border border-[#181818] px-3 py-2 text-xs text-[#777777] disabled:opacity-30 hover:text-white"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  setPage(
                    (previous) =>
                      Math.min(
                        totalPages,
                        previous + 1
                      )
                  )
                }
                className="border border-[#181818] px-3 py-2 text-xs text-[#777777] disabled:opacity-30 hover:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedOrder(null)
          }
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#090909] border border-[#1B1B1B]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between gap-5 px-6 py-5 border-b border-[#151515]">
              <div>
                <p
                  className={`${headingFont.className} text-[9px] uppercase tracking-[0.15em] text-[#555555] mb-1`}
                >
                  Order
                </p>

                <h2
                  className={`${headingFont.className} text-xl text-white font-semibold`}
                >
                  #
                  {
                    selectedOrder.order_number
                  }
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="text-[#555555] hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-7">
              {/* CUSTOMER */}

              <section>
                <h3
                  className={`${headingFont.className} text-[10px] uppercase tracking-[0.15em] text-[#555555] mb-3`}
                >
                  Customer
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-[#444444] uppercase">
                      Name
                    </p>

                    <p
                      className={`${bodyFont.className} text-sm text-white mt-1`}
                    >
                      {
                        selectedOrder.customer_name
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#444444] uppercase">
                      Email
                    </p>

                    <p
                      className={`${bodyFont.className} text-sm text-white mt-1 break-all`}
                    >
                      {
                        selectedOrder.customer_email
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#444444] uppercase">
                      Phone
                    </p>

                    <p
                      className={`${bodyFont.className} text-sm text-white mt-1`}
                    >
                      {
                        selectedOrder.customer_phone
                      }
                    </p>
                  </div>
                </div>
              </section>

              {/* PRODUCTS */}

              <section>
                <h3
                  className={`${headingFont.className} text-[10px] uppercase tracking-[0.15em] text-[#555555] mb-3`}
                >
                  Products
                </h3>

                <div className="border border-[#151515]">
                  {selectedItems.length ===
                  0 ? (
                    <div className="p-5 text-sm text-[#555555]">
                      No products found.
                    </div>
                  ) : (
                    selectedItems.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 px-4 py-4 border-b border-[#111111] last:border-b-0"
                        >
                          <div className="min-w-0">
                            <p
                              className={`${bodyFont.className} text-sm text-white`}
                            >
                              {
                                item.product_name
                              }
                            </p>

                            <div className="flex flex-wrap gap-3 mt-1">
                              {item.product_sku && (
                                <span className="text-[10px] text-[#555555]">
                                  SKU:{' '}
                                  {
                                    item.product_sku
                                  }
                                </span>
                              )}

                              {item.size && (
                                <span className="text-[10px] text-[#555555]">
                                  Size:{' '}
                                  {
                                    item.size
                                  }
                                </span>
                              )}

                              {item.color && (
                                <span className="text-[10px] text-[#555555]">
                                  Color:{' '}
                                  {
                                    item.color
                                  }
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-xs text-[#777777]">
                              ×
                              {
                                item.quantity
                              }
                            </p>

                            <p className="text-sm text-white mt-1">
                              {formatPrice(
                                item.total_price
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </section>

              {/* SHIPPING */}

              <section>
                <h3
                  className={`${headingFont.className} text-[10px] uppercase tracking-[0.15em] text-[#555555] mb-3`}
                >
                  Shipping
                </h3>

                <div className="border border-[#151515] p-4">
                  <p
                    className={`${bodyFont.className} text-sm text-white`}
                  >
                    {[
                      selectedOrder.shipping_country,
                      selectedOrder.shipping_city,
                      selectedOrder.shipping_address,
                      selectedOrder.shipping_postal_code,
                    ]
                      .filter(Boolean)
                      .join(', ') ||
                      'Shipping address not provided'}
                  </p>

                  {selectedOrder.shipping_method && (
                    <p className="text-xs text-[#555555] mt-2">
                      Method:{' '}
                      {
                        selectedOrder.shipping_method
                      }
                    </p>
                  )}

                  {selectedOrder.tracking_number && (
                    <p className="text-xs text-[#777777] mt-1">
                      Tracking:{' '}
                      {
                        selectedOrder.tracking_number
                      }
                    </p>
                  )}
                </div>
              </section>

              {/* NOTES */}

              {selectedOrder.notes && (
                <section>
                  <h3
                    className={`${headingFont.className} text-[10px] uppercase tracking-[0.15em] text-[#555555] mb-3`}
                  >
                    Notes
                  </h3>

                  <div className="border border-[#151515] p-4">
                    <p
                      className={`${bodyFont.className} text-sm text-[#999999] whitespace-pre-wrap`}
                    >
                      {
                        selectedOrder.notes
                      }
                    </p>
                  </div>
                </section>
              )}

              {/* TOTAL */}

              <section className="border-t border-[#151515] pt-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[#555555]">
                      Subtotal
                    </span>

                    <span className="text-sm text-white">
                      {formatPrice(
                        selectedOrder.subtotal
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs text-[#555555]">
                      Shipping
                    </span>

                    <span className="text-sm text-white">
                      {formatPrice(
                        selectedOrder.shipping_cost
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs text-[#555555]">
                      Discount
                    </span>

                    <span className="text-sm text-white">
                      -
                      {formatPrice(
                        selectedOrder.discount
                      )}
                    </span>
                  </div>

                  <div className="border-t border-[#151515] pt-4 mt-3 flex justify-between">
                    <span
                      className={`${headingFont.className} text-xs uppercase tracking-[0.12em] text-[#777777]`}
                    >
                      Total
                    </span>

                    <span className="text-xl text-white">
                      {formatPrice(
                        selectedOrder.total
                      )}
                    </span>
                  </div>
                </div>
              </section>

              {/* STATUS */}

              <section>
                <h3
                  className={`${headingFont.className} text-[10px] uppercase tracking-[0.15em] text-[#555555] mb-3`}
                >
                  Order status
                </h3>

                <select
                  value={
                    selectedOrder.order_status
                  }
                  disabled={
                    updating ===
                    selectedOrder.id
                  }
                  onChange={(event) =>
                    updateOrderStatus(
                      selectedOrder.id,
                      event.target.value
                    )
                  }
                  className={`${headingFont.className} w-full bg-[#0A0A0A] border border-[#1B1B1B] text-white text-xs px-4 py-3 uppercase tracking-[0.08em] focus:outline-none`}
                >
                  {ORDER_STATUSES.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {getStatusLabel(
                          status
                        )}
                      </option>
                    )
                  )}
                </select>

                {updating ===
                  selectedOrder.id && (
                  <p className="text-[10px] text-[#555555] mt-2">
                    Saving...
                  </p>
                )}
              </section>

              {/* META */}

              <div className="border-t border-[#151515] pt-4 flex flex-wrap gap-6">
                <div>
                  <p className="text-[9px] uppercase text-[#444444]">
                    Created
                  </p>

                  <p className="text-xs text-[#777777] mt-1">
                    {formatDate(
                      selectedOrder.created_at
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase text-[#444444]">
                    Payment
                  </p>

                  <p
                    className={`text-xs mt-1 ${getPaymentStatusClass(
                      selectedOrder.payment_status
                    )}`}
                  >
                    {
                      selectedOrder.payment_status
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}