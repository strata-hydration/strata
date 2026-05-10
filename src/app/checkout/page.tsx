'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

function normalizeExternalUrl(raw?: string): string {
  if (!raw) return '';
  const value = raw.trim();
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.toString();
  } catch {
    return '';
  }
}

const BUY_LINKS = {
  amazon: normalizeExternalUrl(process.env.NEXT_PUBLIC_AMAZON_BUY_LINK),
  zepto: normalizeExternalUrl(process.env.NEXT_PUBLIC_ZEPTO_BUY_LINK),
} as const;

export default function CheckoutPage() {
  const [mode, setMode] = useState<'explore' | 'cart'>('explore');
  const [launchingMarketplace, setLaunchingMarketplace] = useState<'Amazon' | 'Zepto' | null>(null);
  const items = useCartStore((s) => s.items);

  const handleMarketplaceClick = (name: 'Amazon' | 'Zepto', url: string) => {
    trackEvent('checkout_marketplace_click', {
      marketplace: name.toLowerCase(),
      context: 'checkout_explore',
      destination_configured: Boolean(url),
      item_count: items.length,
    });

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    trackEvent('checkout_marketplace_launching_soon_viewed', {
      marketplace: name.toLowerCase(),
      context: 'checkout_explore',
    });
    setLaunchingMarketplace(name);
  };

  if (items.length === 0) {
    return (
      <section className="min-h-[74vh] flex items-center justify-center px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(155deg,#ffffff,#edf7ff)] p-8 sm:p-10 text-center shadow-[0_24px_70px_rgba(0,105,190,0.12)]"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-52 w-52 rounded-full bg-blue-300/20 blur-3xl" />
          <span className="mb-6 block text-6xl sm:text-7xl">🛒</span>
          <h1 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 mb-3">Cart Empty</h1>
          <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_12px_28px_rgba(0,138,230,0.32)] hover:scale-[1.02] transition-transform">
            View Products <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-28 pt-12 sm:pt-16 lg:pt-24 pb-24 sm:pb-28 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 sm:mb-16 lg:mb-20 text-center">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900">Checkout</h1>
          <div className="mx-auto mt-8 inline-flex w-full max-w-md rounded-full border border-slate-200/80 bg-white/80 p-2 shadow-sm backdrop-blur">
            <button
              type="button"
              onClick={() => setMode('explore')}
              className={`flex-1 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                mode === 'explore'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Explore
            </button>
            <button
              type="button"
              onClick={() => setMode('cart')}
              className={`flex-1 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                mode === 'cart'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Cart
            </button>
          </div>
        </motion.div>

        {mode === 'explore' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 grid min-h-[66vh] items-stretch gap-10 sm:gap-12 lg:gap-14 lg:grid-cols-3"
          >
            <motion.button
              type="button"
              onClick={() => handleMarketplaceClick('Amazon', BUY_LINKS.amazon)}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative isolate overflow-hidden rounded-[1.75rem] border border-amber-200/80 bg-white/60 p-9 text-left sm:p-10 lg:p-11 backdrop-blur-xl shadow-[0_16px_44px_rgba(245,158,11,0.18)] min-h-[22rem] sm:min-h-[24rem]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,250,240,0.9),rgba(255,243,214,0.85))]" />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -left-20 top-0 hidden h-full w-20 rotate-[18deg] transform-gpu bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] sm:block"
                animate={{ x: ['-10%', '520%'] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
              />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/20 text-4xl font-black text-amber-800">A</div>
                <h3 className="font-display text-2xl font-black uppercase text-slate-900">Amazon</h3>
                <p className="mt-2 text-sm font-semibold text-slate-700">Premium marketplace checkout</p>
                <div className="mt-auto pt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  Open Amazon <span aria-hidden>→</span>
                </div>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => handleMarketplaceClick('Zepto', BUY_LINKS.zepto)}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative isolate overflow-hidden rounded-[1.75rem] border border-violet-200/80 bg-white/60 p-9 text-left sm:p-10 lg:p-11 backdrop-blur-xl shadow-[0_16px_44px_rgba(124,58,237,0.18)] min-h-[22rem] sm:min-h-[24rem]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(248,245,255,0.9),rgba(237,232,255,0.86))]" />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -left-20 top-0 hidden h-full w-20 rotate-[18deg] transform-gpu bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] sm:block"
                animate={{ x: ['-10%', '520%'] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut', delay: 0.35 }}
              />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-400/20 text-4xl font-black text-violet-800">Z</div>
                <h3 className="font-display text-2xl font-black uppercase text-slate-900">Zepto</h3>
                <p className="mt-2 text-sm font-semibold text-slate-700">Fast quick-commerce checkout</p>
                <div className="mt-auto pt-6 inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-800">
                  Open Zepto <span aria-hidden>→</span>
                </div>
              </div>
            </motion.button>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/60 p-9 sm:p-10 lg:p-11 opacity-75 backdrop-blur-xl shadow-[0_16px_44px_rgba(100,116,139,0.14)] min-h-[22rem] sm:min-h-[24rem]">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(247,247,248,0.92),rgba(236,239,242,0.9))]" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-300/25 text-4xl font-black text-slate-700">S</div>
                <h3 className="font-display text-2xl font-black uppercase text-slate-700">Website</h3>
                <p className="mt-2 text-sm font-semibold text-slate-600">Direct cart checkout service</p>
                <div className="mt-auto pt-6 inline-flex items-center rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Coming Soon
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto h-fit w-full max-w-3xl rounded-3xl border border-white/60 bg-white/75 p-8 sm:p-10 shadow-[0_12px_36px_rgba(15,23,42,0.08)] backdrop-blur-sm"
          >
            <div className="mb-3 inline-flex rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Cart Mode Coming Soon
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 pointer-events-none opacity-65 grayscale-[0.4] select-none">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 text-sm rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}1a` }}>
                    {item.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-4 h-px bg-slate-200" />

            <div className="text-center pointer-events-none opacity-65 select-none">
              <p className="text-slate-600 text-sm">Cart checkout coming soon</p>
            </div>
          </motion.aside>
        )}

        <AnimatePresence>
          {launchingMarketplace && (
            <motion.div
              className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLaunchingMarketplace(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-3xl border border-white/60 bg-[linear-gradient(165deg,#ffffff,#edf6ff)] p-8 sm:p-9 shadow-[0_26px_70px_rgba(15,23,42,0.2)]"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/12 text-3xl">🚀</div>
                <h3 className="font-display text-2xl font-black uppercase tracking-tight text-slate-900">Launching Soon</h3>
                <p className="mt-3 text-sm leading-6 font-semibold text-slate-600">
                  We are launching our {launchingMarketplace} checkout experience soon.
                </p>
                <div className="mt-7 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLaunchingMarketplace(null)}
                    className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <Link
                    href="/products"
                    className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_24px_rgba(0,138,230,0.32)]"
                    onClick={() => setLaunchingMarketplace(null)}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
