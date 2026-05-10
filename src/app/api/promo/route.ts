import { NextRequest, NextResponse } from 'next/server';

// Simple promo code system — extend with DB-backed codes later
const PROMO_CODES: Record<string, { discountPercent: number; minOrderPaise: number; description: string }> = {
  HYDRATE10: { discountPercent: 10, minOrderPaise: 0, description: '10% off your order' },
  STRATA20: { discountPercent: 20, minOrderPaise: 49900, description: '20% off orders above ₹499' },
  WELCOME15: { discountPercent: 15, minOrderPaise: 29900, description: '15% off orders above ₹299' },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = (body.code || '').toString().trim().toUpperCase();
    const subtotalPaise = Number(body.subtotalPaise) || 0;

    if (!code) {
      return NextResponse.json({ error: 'Please enter a promo code' }, { status: 400 });
    }

    const promo = PROMO_CODES[code];
    if (!promo) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
    }

    if (subtotalPaise < promo.minOrderPaise) {
      return NextResponse.json({
        error: `Minimum order of ₹${(promo.minOrderPaise / 100).toFixed(0)} required for this code`,
      }, { status: 400 });
    }

    const discountPaise = Math.round(subtotalPaise * (promo.discountPercent / 100));

    return NextResponse.json({
      data: {
        code,
        discountPercent: promo.discountPercent,
        discountPaise,
        description: promo.description,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
