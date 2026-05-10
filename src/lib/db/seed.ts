import { getDb } from './index';
import { v4 as uuid } from 'uuid';

const PRODUCTS = [
  {
    id: uuid(),
    name: 'Citrus Lime',
    slug: 'citrus-lime',
    emoji: '🍋‍🟩',
    color: '#7CCF00',
    price_paise: 29900,       // ₹299
    compare_price_paise: 39900, // ₹399 MRP
    stock: 200,
    category_tag: 'hydration',
    stat: '1540 mg',
    benefit: 'Clean, crisp everyday hydration',
    badge: 'Bestseller',
    tagline: 'Sharp. Clean. Refreshing.',
    description: 'Zesty citrus-lime with a clean electrolyte finish. Crisp hydration, no added sugar. Pack of 30 sachets.',
    image_url: '/pack.png',
    available: 1,
  },
  {
    id: uuid(),
    name: 'Tropical Punch',
    slug: 'tropical-punch',
    emoji: '🥭',
    color: '#FFD700',
    price_paise: 29900,
    compare_price_paise: 39900,
    stock: 150,
    category_tag: 'hydration',
    stat: '1540 mg',
    benefit: 'Daily energy without the crash',
    badge: 'New',
    tagline: 'Island vibes, no added sugar',
    description: 'Mango-pineapple fusion packed with potassium. Your daily energy ritual. Pack of 30 sachets.',
    image_url: '/pack.png',
    available: 1,
  },
  {
    id: uuid(),
    name: 'Berry Blast',
    slug: 'berry-blast',
    emoji: '🫐',
    color: '#8B5CF6',
    price_paise: 34900,       // ₹349
    compare_price_paise: 44900,
    stock: 120,
    category_tag: 'hydration',
    stat: '1540 mg',
    benefit: 'Antioxidant-rich recovery blend',
    badge: 'Premium',
    tagline: 'Recovery tastes this good',
    description: 'Mixed berry antioxidant blend. Tastes like dessert, works like science. Pack of 30 sachets.',
    image_url: '/pack.png',
    available: 1,
  },
];

export function seedProducts() {
  const db = getDb();

  const existing = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (existing.count > 0) {
    console.log('Products already seeded, skipping.');
    return;
  }

  const insert = db.prepare(`
    INSERT INTO products (id, name, slug, emoji, color, price_paise, compare_price_paise, stock, category_tag, stat, benefit, badge, tagline, description, image_url, available)
    VALUES (@id, @name, @slug, @emoji, @color, @price_paise, @compare_price_paise, @stock, @category_tag, @stat, @benefit, @badge, @tagline, @description, @image_url, @available)
  `);

  const tx = db.transaction(() => {
    for (const product of PRODUCTS) {
      insert.run(product);
    }
  });

  tx();
  console.log(`Seeded ${PRODUCTS.length} products.`);
}

// Run directly with: npx tsx src/lib/db/seed.ts
if (require.main === module) {
  seedProducts();
}
