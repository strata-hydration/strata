import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';
import { env } from '@/lib/env';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', env.razorpayWebhookSecret())
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event ?? `unknown-${Date.now()}`;
    const eventType = event.event;

    const db = getDb();

    // Idempotency check
    const existing = db.prepare('SELECT id FROM webhook_events WHERE event_id = ?').get(eventId);
    if (existing) {
      return NextResponse.json({ data: { received: true, duplicate: true } });
    }

    // Store event
    db.prepare(
      'INSERT INTO webhook_events (id, event_id, event_type, payload) VALUES (?, ?, ?, ?)'
    ).run(uuid(), eventId, eventType, rawBody);

    // Process payment events
    if (eventType === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) {
        db.prepare(
          `UPDATE orders SET status = 'paid', razorpay_payment_id = ?, updated_at = datetime('now')
           WHERE razorpay_order_id = ? AND status IN ('payment_initiated', 'pending')`
        ).run(payment.id, payment.order_id);
      }
    } else if (eventType === 'payment.failed') {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) {
        // Restore stock on failure
        const order = db.prepare('SELECT id FROM orders WHERE razorpay_order_id = ?').get(payment.order_id) as { id: string } | undefined;
        if (order) {
          const orderItems = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?').all(order.id) as { product_id: string; quantity: number }[];
          const restoreStock = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
          for (const oi of orderItems) {
            restoreStock.run(oi.quantity, oi.product_id);
          }
          db.prepare(`UPDATE orders SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?`).run(order.id);
        }
      }
    } else if (eventType === 'refund.created') {
      const refund = event.payload?.refund?.entity;
      if (refund?.payment_id) {
        db.prepare(
          `UPDATE orders SET status = 'refunded', updated_at = datetime('now')
           WHERE razorpay_payment_id = ?`
        ).run(refund.payment_id);
      }
    }

    // Mark processed
    db.prepare(`UPDATE webhook_events SET processed_at = datetime('now') WHERE event_id = ?`).run(eventId);

    return NextResponse.json({ data: { received: true } });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
