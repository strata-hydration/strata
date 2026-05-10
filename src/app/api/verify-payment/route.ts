import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { razorpayVerifySchema } from '@/lib/validation';
import { sendOrderConfirmationEmail } from '@/lib/email';
import crypto from 'crypto';
import { env } from '@/lib/env';

async function sendConfirmation(orderId: string) {
  try {
    const db = getDb();
    const order = db
      .prepare(
        `SELECT o.id, o.subtotal_paise, o.shipping_paise, o.total_paise,
                c.email, c.name AS customer_name,
                a.full_name, a.line1, a.line2, a.city, a.state, a.pincode
         FROM orders o
         JOIN customers c ON o.customer_id = c.id
         JOIN addresses a ON o.shipping_address_id = a.id
         WHERE o.id = ?`
      )
      .get(orderId) as Record<string, unknown> | undefined;
    if (!order) return;

    const items = db
      .prepare(
        `SELECT oi.quantity, oi.unit_price_paise AS pricePaise, p.name AS productName
         FROM order_items oi JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`
      )
      .all(orderId) as Record<string, unknown>[];

    await sendOrderConfirmationEmail({
      orderId: order.id as string,
      email: order.email as string,
      customerName: order.customer_name as string,
      items: items.map((i) => ({
        productName: i.productName as string,
        quantity: i.quantity as number,
        pricePaise: i.pricePaise as number,
      })),
      subtotalPaise: order.subtotal_paise as number,
      shippingPaise: order.shipping_paise as number,
      totalPaise: order.total_paise as number,
      shippingAddress: {
        fullName: order.full_name as string,
        line1: order.line1 as string,
        line2: (order.line2 as string) || undefined,
        city: order.city as string,
        state: order.state as string,
        pincode: order.pincode as string,
      },
    });
  } catch (err) {
    console.error('Failed to send order confirmation email:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = razorpayVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid verification data' }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

    // Verify signature HMAC
    const expectedSignature = crypto
      .createHmac('sha256', env.razorpayKeySecret())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const db = getDb();

    // Update order status atomically
    const result = db
      .prepare(
        `UPDATE orders SET status = 'paid', razorpay_payment_id = ?, updated_at = datetime('now')
         WHERE razorpay_order_id = ? AND status = 'payment_initiated'`
      )
      .run(razorpay_payment_id, razorpay_order_id);

    if (result.changes === 0) {
      // Might be already paid (idempotent) or order not found
      const existing = db
        .prepare('SELECT status FROM orders WHERE razorpay_order_id = ?')
        .get(razorpay_order_id) as { status: string } | undefined;

      if (existing?.status === 'paid') {
        const order = db.prepare('SELECT id FROM orders WHERE razorpay_order_id = ?').get(razorpay_order_id) as { id: string };
        return NextResponse.json({ data: { orderId: order.id, status: 'paid', alreadyProcessed: true } });
      }
      return NextResponse.json({ error: 'Order not found or invalid state' }, { status: 404 });
    }

    const order = db.prepare('SELECT id FROM orders WHERE razorpay_order_id = ?').get(razorpay_order_id) as { id: string };

    // Fire-and-forget: send confirmation email (don't block payment response)
    sendConfirmation(order.id);

    return NextResponse.json({ data: { orderId: order.id, status: 'paid' } });
  } catch (err) {
    console.error('POST /api/verify-payment error:', err);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
