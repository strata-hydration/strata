import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products';

function stripPrices(product: any) {
  const { price, comparePrice, ...rest } = product;
  return rest;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      data: stripPrices(product),
    });
  } catch (err) {
    console.error('GET /api/products/[slug] error:', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
