import type { Product } from '@/lib/types';
import { getActiveFlavors } from '@/config/flavors';

function mapFlavorProduct(compareMultiplier = 1.33): Product[] {
  const createdAt = new Date().toISOString();

  return getActiveFlavors().map((flavor, index) => {
    const price = Math.round(flavor.price * 100);
    const comparePrice = Math.round(price * compareMultiplier);

    return {
      id: flavor.id,
      name: flavor.name,
      slug: flavor.id,
      emoji: flavor.emoji,
      color: flavor.color,
      price,
      comparePrice,
      stock: flavor.badge.toLowerCase() === 'coming soon' ? 0 : 100,
      categoryTag: 'hydration',
      stat: flavor.stat,
      benefit: flavor.benefit,
      badge: flavor.badge,
      tagline: flavor.tagline,
      description: flavor.description,
      imageUrl: '/pack.png',
      available: flavor.available,
      createdAt: new Date(Date.now() - index).toISOString() ?? createdAt,
    };
  });
}

export function getProducts(): Product[] {
  return mapFlavorProduct();
}

export function getProductBySlug(slug: string): Product | null {
  return getProducts().find((product) => product.slug === slug) ?? null;
}