'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Product } from '@/lib/types';

import { useCartStore } from '@/store/cart';
import { useToastStore } from '@/components/Toast';
import { getActiveFlavors } from '@/config/flavors';
import { hydrationContent } from '@/config/siteContent';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const [addedId, setAddedId] = useState<string | null>(null);
  const comingSoonSlugs = new Set(
    getActiveFlavors()
      .filter((f) => f.badge === hydrationContent.comingSoonLabel)
      .map((f) => f.id)
  );

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((res) => setProducts(res.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (p: Product) => {
    addItem({
      productId: p.id,
      name: p.name,
      slug: p.slug,
      emoji: p.emoji,
      color: p.color,
      price: p.price,
      imageUrl: p.imageUrl,
    });
    addToast(`${p.emoji} ${p.name} added to cart`);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleBuyNow = (p: Product) => {
    const exists = cartItems.some((item) => item.productId === p.id);
    if (!exists) {
      handleAdd(p);
    }
    router.push('/checkout');
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryTag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen px-4 pt-10 pb-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl text-center mb-12"
      >
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest mb-4 sm:text-xs"
          style={{ color: '#0077FF', background: 'rgba(0,119,255,0.07)', border: '1px solid rgba(0,119,255,0.15)' }}>
          💧 Shop
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight"
          style={{ background: 'linear-gradient(180deg, #0B2E5B 0%, #1E5EA5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Hydration Lab
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-md mx-auto">
          Science-backed electrolyte blends. No added sugar. Maximum hydration.
        </p>

        {/* Search bar */}
        <div className="mt-6 mx-auto max-w-md relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search flavors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200/60 bg-white/60 backdrop-blur-sm pl-11 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <div className="mx-auto max-w-7xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[420px] rounded-3xl bg-white/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-7xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-16">
              <span className="text-4xl mb-3 block">🔍</span>
              <p className="text-slate-500 text-sm">No products match &quot;{search}&quot;</p>
              <button onClick={() => setSearch('')} className="mt-2 text-blue-500 text-sm hover:underline">Clear search</button>
            </div>
          ) : (
          filtered.map((product, i) => {
            const isComingSoon =
              product.badge?.toLowerCase() === hydrationContent.comingSoonLabel.toLowerCase() ||
              comingSoonSlugs.has(product.slug);

            return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`group relative flex flex-col rounded-3xl border border-white/50 bg-white/60 backdrop-blur-sm overflow-hidden shadow-[0_8px_40px_rgba(0,80,160,0.08)] hover:shadow-[0_16px_60px_rgba(0,80,160,0.14)] transition-shadow ${
                isComingSoon ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: isComingSoon ? '#64748b' : product.color }}>
                  {isComingSoon ? hydrationContent.comingSoonLabel : product.badge}
                </span>
              )}

              {/* Product Image */}
              {isComingSoon ? (
                <div className="relative flex items-center justify-center h-56 overflow-hidden">
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle, ${product.color}15 0%, transparent 70%)` }} />
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    className="relative z-10 h-44 w-auto object-contain drop-shadow-md grayscale"
                  />
                </div>
              ) : (
                <Link href={`/products/${product.slug}`} className="relative flex items-center justify-center h-56 overflow-hidden">
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle, ${product.color}15 0%, transparent 70%)` }} />
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    className="relative z-10 h-44 w-auto object-contain drop-shadow-md"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                </Link>
              )}

              {/* Info */}
              <div className="flex flex-1 flex-col px-5 pb-5 pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{product.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.stat}</span>
                </div>

                {isComingSoon ? (
                  <h3 className="font-display text-lg font-bold text-slate-400">
                    {product.name}
                  </h3>
                ) : (
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-display text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                )}

                <p className="mt-1 text-xs text-slate-500 line-clamp-2 flex-1">{product.tagline}</p>

                {/* Buy Now Button */}
                <motion.button
                  onClick={() => handleBuyNow(product)}
                  disabled={product.stock === 0 || isComingSoon}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: product.stock > 0 && !isComingSoon ? product.color : '#94a3b8' }}
                  whileHover={product.stock > 0 && !isComingSoon ? { scale: 1.05 } : undefined}
                  whileTap={product.stock > 0 && !isComingSoon ? { scale: 0.95 } : undefined}
                >
                  {addedId === product.id ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1"
                    >
                      Redirecting...
                    </motion.span>
                  ) : isComingSoon ? (
                    hydrationContent.comingSoonLabel
                  ) : product.stock > 0 ? (
                    'Buy Now'
                  ) : (
                    'Out of Stock'
                  )}
                </motion.button>

                {/* Stock indicator */}
                {!isComingSoon && product.stock > 0 && product.stock <= 20 && (
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-orange-500">
                    Only {product.stock} left
                  </p>
                )}
              </div>
            </motion.div>
            );
          })
          )}
        </div>
      )}

      {/* Free shipping banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-auto mt-12 max-w-xl rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-center"
      >
        <p className="text-sm text-blue-700 font-medium">
          🚚 Free shipping on orders above ₹499
        </p>
      </motion.div>
    </section>
  );
}
