import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id) as Record<string, unknown>[];

    return NextResponse.json({
      data: {
        id: order.id,
        customerId: order.customer_id,
        guestEmail: order.guest_email,
        totalPaise: order.total_paise,
        shippingPaise: order.shipping_paise,
        status: order.status,
        razorpayOrderId: order.razorpay_order_id,
        razorpayPaymentId: order.razorpay_payment_id,
        shippingAddress: JSON.parse(order.shipping_address as string),
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: orderItems.map((oi) => ({
          id: oi.id,
          productId: oi.product_id,
          productName: oi.product_name,
          quantity: oi.quantity,
          pricePaise: oi.price_paise,
        })),
      },
    });
  } catch (err) {
    console.error('GET /api/orders/[id] error:', err);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
