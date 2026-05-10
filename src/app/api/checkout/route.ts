import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkoutSchema } from '@/lib/validation';
import { v4 as uuid } from 'uuid';
import { SHIPPING_FLAT_RATE_PAISE, FREE_SHIPPING_THRESHOLD_PAISE } from '@/lib/types';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require('razorpay');
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid checkout data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { items, shippingAddress, email, customerId } = parsed.data;
    const db = getDb();

    // Validate products and stock
    let subtotalPaise = 0;
    const resolvedItems: { productId: string; productName: string; quantity: number; pricePaise: number }[] = [];

    for (const item of items) {
      const product = db
        .prepare('SELECT id, name, price_paise, stock, available FROM products WHERE id = ?')
        .get(item.productId) as Record<string, unknown> | undefined;

      if (!product || product.available !== 1) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }
      if ((product.stock as number) < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 409 }
        );
      }

      const pricePaise = product.price_paise as number;
      subtotalPaise += pricePaise * item.quantity;
      resolvedItems.push({
        productId: item.productId,
        productName: product.name as string,
        quantity: item.quantity,
        pricePaise,
      });
    }

    const shippingPaise = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : SHIPPING_FLAT_RATE_PAISE;
    const totalPaise = subtotalPaise + shippingPaise;
    const orderId = uuid();

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: env.razorpayKeyId(),
      key_secret: env.razorpayKeySecret(),
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: 'INR',
      receipt: orderId,
      notes: { email, orderId },
    });

    // Save order in DB within a transaction
    const tx = db.transaction(() => {
      db.prepare(`
        INSERT INTO orders (id, customer_id, guest_email, total_paise, shipping_paise, status, razorpay_order_id, shipping_address)
        VALUES (?, ?, ?, ?, ?, 'payment_initiated', ?, ?)
      `).run(
        orderId,
        customerId ?? null,
        customerId ? null : email,
        totalPaise,
        shippingPaise,
        razorpayOrder.id,
        JSON.stringify(shippingAddress)
      );

      const insertItem = db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price_paise)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const ri of resolvedItems) {
        insertItem.run(uuid(), orderId, ri.productId, ri.productName, ri.quantity, ri.pricePaise);
      }

      // Reserve stock
      const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
      for (const item of items) {
        const result = decrementStock.run(item.quantity, item.productId, item.quantity);
        if (result.changes === 0) {
          throw new Error(`Stock race condition for product ${item.productId}`);
        }
      }
    });

    tx();

    return NextResponse.json({
      data: {
        orderId,
        razorpayOrderId: razorpayOrder.id,
        totalPaise,
        shippingPaise,
        currency: 'INR',
      },
    });
  } catch (err) {
    console.error('POST /api/checkout error:', err);
    const message = err instanceof Error ? err.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
