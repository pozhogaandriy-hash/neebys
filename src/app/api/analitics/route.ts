import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const range = searchParams.get('range') || 'all';

    let fromDate: string | null = null;

    if (range !== 'all') {
      const daysMap: Record<string, number> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
      };

      const days = daysMap[range];

      if (days) {
        const date = new Date();

        date.setDate(date.getDate() - days);

        fromDate = date.toISOString();
      }
    }

    // --------------------------------------------------
    // PRODUCTS
    // --------------------------------------------------

    const {
      data: products,
      error: productsError,
    } = await supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        sku,
        image,
        price,
        sale_price,
        stock,
        views,
        status,
        created_at
      `)
      .order('created_at', {
        ascending: false,
      });

    if (productsError) {
      console.error(
        'Analytics products error:',
        productsError
      );

      return NextResponse.json(
        {
          error: productsError.message,
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // ORDERS
    // --------------------------------------------------

    let ordersQuery = supabaseAdmin
      .from('orders')
      .select(`
        id,
        subtotal,
        shipping_cost,
        discount,
        total,
        payment_status,
        order_status,
        created_at
      `);

    if (fromDate) {
      ordersQuery = ordersQuery.gte(
        'created_at',
        fromDate
      );
    }

    const {
      data: orders,
      error: ordersError,
    } = await ordersQuery;

    if (ordersError) {
      console.error(
        'Analytics orders error:',
        ordersError
      );

      return NextResponse.json(
        {
          error: ordersError.message,
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // ONLY REAL PAID ORDERS
    // --------------------------------------------------

    const paidOrders = (orders ?? []).filter(
      (order) =>
        order.payment_status === 'paid' &&
        order.order_status !== 'cancelled'
    );

    const paidOrderIds = paidOrders.map(
      (order) => order.id
    );

    // --------------------------------------------------
    // ORDER ITEMS
    // --------------------------------------------------

    let orderItems: any[] = [];

    if (paidOrderIds.length > 0) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from('order_items')
        .select(`
          id,
          order_id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        `)
        .in(
          'order_id',
          paidOrderIds
        );

      if (error) {
        console.error(
          'Analytics order items error:',
          error
        );

        return NextResponse.json(
          {
            error: error.message,
          },
          { status: 500 }
        );
      }

      orderItems = data ?? [];
    }

    // --------------------------------------------------
    // TOTALS
    // --------------------------------------------------

    const totalRevenue = paidOrders.reduce(
      (sum, order) =>
        sum + Number(order.total ?? 0),
      0
    );

    const totalSales = orderItems.reduce(
      (sum, item) =>
        sum + Number(item.quantity ?? 0),
      0
    );

    const totalViews = (products ?? []).reduce(
      (sum, product) =>
        sum + Number(product.views ?? 0),
      0
    );

    const avgConversion =
      totalViews > 0
        ? (totalSales / totalViews) * 100
        : 0;

    // --------------------------------------------------
    // PRODUCT ANALYTICS
    // --------------------------------------------------

    const productMap = new Map<
      string,
      {
        id: string;
        name: string;
        sku: string;
        image: string;
        views: number;
        sales: number;
        revenue: number;
        stock: number;
        price: number;
        createdAt: string;
      }
    >();

    for (const product of products ?? []) {
      productMap.set(
        String(product.id),
        {
          id: String(product.id),
          name: product.name ?? '',
          sku: product.sku ?? '',
          image: product.image ?? '',
          views: Number(
            product.views ?? 0
          ),
          sales: 0,
          revenue: 0,
          stock: Number(
            product.stock ?? 0
          ),
          price: Number(
            product.sale_price ??
              product.price ??
              0
          ),
          createdAt:
            product.created_at ?? '',
        }
      );
    }

    // --------------------------------------------------
    // ADD REAL SALES FROM ORDER ITEMS
    // --------------------------------------------------

    for (const item of orderItems) {
      const productId = String(
        item.product_id
      );

      const existing =
        productMap.get(productId);

      if (!existing) {
        productMap.set(
          productId,
          {
            id: productId,
            name:
              item.product_name ??
              'Unknown product',
            sku:
              item.product_sku ??
              '',
            image: '',
            views: 0,
            sales: Number(
              item.quantity ?? 0
            ),
            revenue: Number(
              item.total_price ?? 0
            ),
            stock: 0,
            price: Number(
              item.unit_price ?? 0
            ),
            createdAt: '',
          }
        );
      } else {
        existing.sales += Number(
          item.quantity ?? 0
        );

        existing.revenue += Number(
          item.total_price ?? 0
        );
      }
    }

    const productAnalytics = Array.from(
      productMap.values()
    );

    // --------------------------------------------------
    // REVENUE BY PRODUCT
    // --------------------------------------------------

    const revenueByProduct =
      [...productAnalytics]
        .filter(
          (product) =>
            product.revenue > 0
        )
        .sort(
          (a, b) =>
            b.revenue - a.revenue
        )
        .slice(0, 10);

    // --------------------------------------------------
    // BEST SELLERS
    // --------------------------------------------------

    const bestSellers =
      [...productAnalytics]
        .sort(
          (a, b) =>
            b.sales - a.sales
        )
        .slice(0, 10);

    // --------------------------------------------------
    // RECENTLY ADDED
    // --------------------------------------------------

    const recentlyAdded =
      (products ?? [])
        .slice()
        .sort(
          (a, b) =>
            new Date(
              b.created_at
            ).getTime() -
            new Date(
              a.created_at
            ).getTime()
        )
        .slice(0, 8)
        .map((product) => {
          const analytics =
            productMap.get(
              String(product.id)
            );

          return {
            id: String(product.id),
            name:
              product.name ?? '',
            image:
              product.image ?? '',
            price: Number(
              product.sale_price ??
                product.price ??
                0
            ),
            stock: Number(
              product.stock ?? 0
            ),
            views:
              analytics?.views ?? 0,
            sales:
              analytics?.sales ?? 0,
            revenue:
              analytics?.revenue ?? 0,
            createdAt:
              product.created_at ?? '',
          };
        });

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      range,

      stats: {
        totalRevenue,
        totalSales,
        totalViews,
        avgConversion,
        totalOrders:
          paidOrders.length,
      },

      revenueByProduct,

      bestSellers,

      recentlyAdded,
    });
  } catch (error) {
    console.error(
      'Analytics API error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to load analytics.',
      },
      { status: 500 }
    );
  }
}