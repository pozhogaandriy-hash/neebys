import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

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

type OrderItemInput = {
  id: string;
  size?: string;
  color?: string;
  quantity: number;
};

type CreateOrderBody = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: string;
  items: OrderItemInput[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody;

    const {
      customer_name,
      customer_email,
      customer_phone,
      notes,
      items,
    } = body;

    // --------------------------------------------------
    // GET AUTHENTICATED USER
    // --------------------------------------------------

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(
                ({ name, value, options }) => {
                  cookieStore.set(
                    name,
                    value,
                    options
                  );
                }
              );
            } catch {
              // Ignore cookie errors in Route Handler
            }
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: 'You must be signed in to place an order.',
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!customer_name?.trim()) {
      return NextResponse.json(
        {
          error: 'Customer name is required.',
        },
        { status: 400 }
      );
    }

    if (!customer_email?.trim()) {
      return NextResponse.json(
        {
          error: 'Customer email is required.',
        },
        { status: 400 }
      );
    }

    if (!customer_phone?.trim()) {
      return NextResponse.json(
        {
          error: 'Customer phone is required.',
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: 'Cart is empty.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // GET USER PROFILE
    // --------------------------------------------------

    const {
      data: profile,
      error: profileError,
    } = await supabaseAdmin
      .from('profiles')
      .select(
        `
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
        `
      )
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        'Profile loading error:',
        profileError
      );

      return NextResponse.json(
        {
          error: 'Failed to load your profile.',
        },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        {
          error:
            'Your profile was not found. Please complete your delivery information first.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // VALIDATE DELIVERY ADDRESS
    // --------------------------------------------------

    if (
      !profile.country ||
      !profile.city ||
      !profile.postal_code ||
      !profile.street ||
      !profile.house_number
    ) {
      return NextResponse.json(
        {
          error:
            'Please complete your delivery address in your profile before placing an order.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // BUILD SHIPPING ADDRESS
    // --------------------------------------------------

    const shippingAddress = [
      profile.street,
      profile.house_number,
      profile.apartment
        ? `Apt. ${profile.apartment}`
        : null,
    ]
      .filter(Boolean)
      .join(', ');

    // --------------------------------------------------
    // GET PRODUCTS
    // --------------------------------------------------

    const productIds = [
      ...new Set(
        items
          .map((item) => item.id)
          .filter(Boolean)
      ),
    ];

    const {
      data: products,
      error: productsError,
    } = await supabaseAdmin
      .from('products')
      .select(
        'id, name, sku, price, sale_price, stock'
      )
      .in('id', productIds);

    if (productsError) {
      console.error(
        'Products error:',
        productsError
      );

      return NextResponse.json(
        {
          error: 'Failed to load products.',
        },
        { status: 500 }
      );
    }

    if (
      !products ||
      products.length !== productIds.length
    ) {
      return NextResponse.json(
        {
          error:
            'One or more products no longer exist.',
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // PREPARE ORDER ITEMS
    // --------------------------------------------------

    const orderItems = [];

    let subtotal = 0;

    for (const item of items) {
      const product = products.find(
        (p) => p.id === item.id
      );

      if (!product) {
        return NextResponse.json(
          {
            error: `Product ${item.id} not found.`,
          },
          { status: 400 }
        );
      }

      const quantity = Number(
        item.quantity
      );

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return NextResponse.json(
          {
            error: `Invalid quantity for ${product.name}.`,
          },
          { status: 400 }
        );
      }

      // Stock check
      if (
        typeof product.stock === 'number' &&
        quantity > product.stock
      ) {
        return NextResponse.json(
          {
            error: `${product.name} has only ${product.stock} items in stock.`,
          },
          { status: 400 }
        );
      }

      const unitPrice =
        product.sale_price !== null &&
        product.sale_price !== undefined &&
        Number(product.sale_price) > 0
          ? Number(product.sale_price)
          : Number(product.price);

      const totalPrice =
        unitPrice * quantity;

      subtotal += totalPrice;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        size: item.size || null,
        color: item.color || null,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
      });
    }

    // --------------------------------------------------
    // GENERATE ORDER NUMBER
    // --------------------------------------------------

    const orderNumber =
      `GF-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`;

    // --------------------------------------------------
    // CREATE ORDER
    // --------------------------------------------------

    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,

        // IMPORTANT
        user_id: user.id,

        customer_name:
          profile.full_name?.trim() ||
          customer_name.trim(),

        customer_email:
          user.email ||
          customer_email.trim(),

        customer_phone:
          profile.phone?.trim() ||
          customer_phone.trim(),

        // DELIVERY DATA FROM PROFILE
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

        order_status: 'pending',

        shipping_method: null,

        tracking_number: null,

        notes:
          profile.delivery_notes?.trim() ||
          notes?.trim() ||
          null,
      })
      .select(
        'id, order_number, total'
      )
      .single();

    if (orderError || !order) {
      console.error(
        'Order creation error:',
        orderError
      );

      return NextResponse.json(
        {
          error:
            orderError?.message ||
            'Failed to create order.',
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // CREATE ORDER ITEMS
    // --------------------------------------------------

    const itemsToInsert =
      orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

    const {
      error: orderItemsError,
    } = await supabaseAdmin
      .from('order_items')
      .insert(itemsToInsert);

    if (orderItemsError) {
      console.error(
        'Order items creation error:',
        orderItemsError
      );

      // Delete order if items failed
      await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', order.id);

      return NextResponse.json(
        {
          error:
            'Failed to create order items.',
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      order: {
        id: order.id,
        order_number:
          order.order_number,
        total: order.total,
      },

      shipping: {
        country: profile.country,
        city: profile.city,
        address: shippingAddress,
        postal_code:
          profile.postal_code,
      },
    });
  } catch (error) {
    console.error(
      'Create order error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Internal server error.',
      },
      { status: 500 }
    );
  }
}