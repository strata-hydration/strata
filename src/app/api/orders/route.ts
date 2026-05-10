import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionCustomerId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get('customerId');
    const sessionId = await getSessionCustomerId();

    // Only allow fetching own orders
    if (!customerId || customerId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const orders = db
      .prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC')
      .all(customerId) as Record<string, unknown>[];

    const enriched = orders.map((o) => {
      const items = db
        .prepare('SELECT product_name, quantity FROM order_items WHERE order_id = ?')
        .all(o.id as string) as { product_name: string; quantity: number }[];

      return {
        id: o.id,
        status: o.status,
        totalPaise: o.total_paise,
        createdAt: o.created_at,
        items: items.map((i) => ({ productName: i.product_name, quantity: i.quantity })),
      };
    });

    return NextResponse.json({ data: enriched });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
