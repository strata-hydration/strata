import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

function stripPrices(product: any) {
  const { price, comparePrice, ...rest } = product;
  return rest;
}

export async function GET() {
  try {
    const products = getProducts();
    const productsWithoutPrices = products.map(stripPrices);
    return NextResponse.json({ data: productsWithoutPrices });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
