'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

const navLinks = [
  { label: 'Hydration', href: '/' },
  { label: 'Fuel', href: '/fuel' },
  { label: 'Boost', href: '/boost' },
  { label: 'Science', href: '/science' },
  { label: 'Sip', href: '/sip' },
  { label: 'Voices', href: '/voices' },
  { label: 'Refuel', href: '/refuel' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [mounted, setMounted] = useState(false);
  const lastScrollYRef = useRef(0);
  const cartCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);
      setShowNavbar(currentY < 80 || currentY < lastScrollYRef.current || mobileOpen);
      lastScrollYRef.current = currentY;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={showNavbar || mobileOpen ? { y: 0, opacity: 1 } : { y: -120, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 h-20 overflow-hidden"
        style={{
          background: scrolled
            ? 'linear-gradient(120deg, #0077FF 0%, #00C8FF 52%, #0099FF 100%)'
            : 'linear-gradient(120deg, rgba(0,119,255,0.96) 0%, rgba(0,200,255,0.94) 50%, rgba(0,153,255,0.96) 100%)',
          backdropFilter: scrolled ? 'blur(20px)' : undefined,
          boxShadow: scrolled ? '0 4px 30px rgba(0,119,255,0.18)' : '0 2px 20px rgba(0,119,255,0.12)',
        }}
      >
        {/* ── Navbar bubbles ── */}
        {[
          { size: 12, left: '8%', delay: 0, dur: 4 },
          { size: 8, left: '22%', delay: 1.5, dur: 3.5 },
          { size: 16, left: '42%', delay: 0.8, dur: 5 },
          { size: 10, left: '58%', delay: 2.2, dur: 4.2 },
          { size: 14, left: '72%', delay: 0.3, dur: 4.8 },
          { size: 6, left: '88%', delay: 1, dur: 3 },
          { size: 10, left: '35%', delay: 2.8, dur: 3.8 },
          { size: 8, left: '95%', delay: 1.8, dur: 4.5 },
        ].map((b, i) => (
          <motion.div
            key={`nav-bubble-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              bottom: '-4px',
              background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.55), rgba(255,255,255,0.15) 50%, transparent 70%)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 0 6px rgba(0,200,255,0.25)',
            }}
            animate={{
              y: [0, -(50 + i * 8)],
              x: [0, (i % 2 === 0 ? 1 : -1) * (5 + i * 2)],
              opacity: [0, 0.8, 0.5, 0],
              scale: [0.5, 1, 0.9],
            }}
            transition={{
              duration: b.dur,
              repeat: Infinity,
              delay: b.delay,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* ── Sparkle dots in navbar ── */}
        {[
          { top: '25%', left: '18%', delay: 0.5 },
          { top: '60%', left: '48%', delay: 2 },
          { top: '35%', left: '78%', delay: 1 },
          { top: '50%', left: '92%', delay: 3 },
        ].map((s, i) => (
          <motion.div
            key={`nav-sparkle-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 3,
              height: 3,
              top: s.top,
              left: s.left,
              background: 'white',
              boxShadow: '0 0 4px 1px rgba(255,255,255,0.5)',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: s.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* ── Water splash wave at bottom edge ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '6px' }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(0,220,255,0.5), rgba(255,255,255,0.4), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* ── Subtle top shimmer ── */}
        <div className="absolute top-0 left-0 right-0 h-full pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 70%, rgba(0,200,255,0.08) 100%)' }} />

        {/* Mobile layout: flex | Desktop: 3-col grid */}
        <div className="relative z-10 h-full w-full px-6 sm:px-10 lg:px-12 flex md:grid md:grid-cols-[1fr_2fr_1fr] items-center gap-4">

          {/* Mobile hamburger — leftmost on mobile */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden order-first w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50 shrink-0">
            {[0,1,2].map(i => (
              <motion.span key={i}
                animate={mobileOpen ? (i === 1 ? { opacity: 0 } : { rotate: i === 0 ? 45 : -45, y: i === 0 ? 6 : -6 }) : { rotate: 0, y: 0, opacity: 1 }}
                className="w-6 h-0.5 rounded-full bg-white" />
            ))}
          </button>

          {/* Logo — centered on mobile, left on desktop */}
          <div className="flex-1 md:flex-none flex items-center justify-center md:justify-center">
            <motion.a
              href="/"
              whileHover={{ scale: 1.04 }}
            >
              <Image
                src="/logo.png"
                alt="Strata Hydration"
                width={400}
                height={100}
                className="h-[5rem] w-auto object-contain"
                priority
              />
            </motion.a>
          </div>

          {/* Center — Nav links (desktop only) */}
          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
            {navLinks.map(link => (
              <motion.a key={link.label} href={link.href}
                className="font-display text-lg lg:text-xl font-black italic text-white uppercase tracking-[0.08em] leading-none hover:text-white/75 transition-colors relative group"
                whileHover={{ y: -1 }}>
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* Right — cart + account + shop */}
          <div className="flex items-center justify-end md:justify-center gap-5 md:gap-7 shrink-0">
            {/* Cart icon hidden from the main UI */}
            {/* <Link href="/cart">
              <motion.div
                className="relative text-white/90 hover:text-white transition-colors"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-[20px] md:h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </motion.div>
            </Link> */}
            <Link href="/products">
              <motion.div
                className="px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider bg-white/15 text-white hover:bg-white hover:text-blue-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Shop Now
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      <div className="h-20 w-full" aria-hidden="true" />

      {/* Mobile sidebar — creative water-themed */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
            className="fixed inset-y-0 left-0 z-40 w-[80vw] max-w-[320px] flex flex-col overflow-hidden md:hidden"
            style={{ background: 'linear-gradient(120deg, #0077FF 0%, #00C8FF 52%, #0099FF 100%)' }}
          >
            {/* ── Visible rising bubbles ── */}
            {[
              { size: 40, left: '15%', delay: 0, dur: 6 },
              { size: 24, left: '55%', delay: 1.2, dur: 5 },
              { size: 32, left: '75%', delay: 2.5, dur: 7 },
              { size: 18, left: '30%', delay: 0.8, dur: 4.5 },
              { size: 28, left: '65%', delay: 3, dur: 5.5 },
              { size: 14, left: '45%', delay: 1.8, dur: 4 },
              { size: 36, left: '85%', delay: 0.5, dur: 6.5 },
              { size: 20, left: '10%', delay: 2, dur: 5 },
              { size: 16, left: '50%', delay: 3.5, dur: 4.2 },
              { size: 22, left: '25%', delay: 1.5, dur: 5.8 },
            ].map((b, i) => (
              <motion.div
                key={`bubble-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: b.size,
                  height: b.size,
                  left: b.left,
                  bottom: '-8%',
                  background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.5), rgba(255,255,255,0.15) 50%, transparent 70%)',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  boxShadow: '0 0 8px rgba(0,200,255,0.3), inset 0 -4px 8px rgba(255,255,255,0.1)',
                }}
                animate={{
                  y: [0, -(600 + i * 40)],
                  x: [0, (i % 2 === 0 ? 1 : -1) * (15 + i * 4)],
                  opacity: [0, 0.85, 0.7, 0],
                  scale: [0.6, 1, 1.05, 0.9],
                }}
                transition={{
                  duration: b.dur,
                  repeat: Infinity,
                  delay: b.delay,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* ── Floating sparkle dots ── */}
            {[
              { top: '20%', left: '80%', delay: 0.5 },
              { top: '45%', left: '70%', delay: 1.5 },
              { top: '65%', left: '85%', delay: 2.5 },
              { top: '30%', left: '90%', delay: 0 },
              { top: '80%', left: '60%', delay: 3 },
            ].map((s, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 4,
                  height: 4,
                  top: s.top,
                  left: s.left,
                  background: 'white',
                  boxShadow: '0 0 6px 2px rgba(255,255,255,0.6)',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: s.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* ── Glowing water ripple ring ── */}
            <motion.div
              className="absolute pointer-events-none rounded-full"
              style={{
                width: 180,
                height: 180,
                bottom: '-30px',
                right: '-40px',
                border: '2px solid rgba(255,255,255,0.15)',
                boxShadow: '0 0 40px rgba(0,200,255,0.2), 0 0 80px rgba(0,200,255,0.1)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute pointer-events-none rounded-full"
              style={{
                width: 120,
                height: 120,
                top: '15%',
                right: '-30px',
                border: '1.5px solid rgba(255,255,255,0.1)',
                boxShadow: '0 0 30px rgba(0,200,255,0.15)',
              }}
              animate={{
                scale: [1.1, 0.9, 1.1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* ── Top gradient glow ── */}
            <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(0,220,255,0.3) 0%, rgba(0,150,255,0.1) 50%, transparent 100%)' }} />

            {/* ── Bottom ocean floor glow ── */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{ background: 'linear-gradient(0deg, rgba(0,100,200,0.4) 0%, rgba(0,180,255,0.15) 40%, transparent 100%)' }} />

            {/* ── Content ── */}
            <div className="relative z-10 flex flex-col h-full" style={{ paddingTop: '7.5rem', paddingLeft: '2.5rem', paddingRight: '1rem' }}>

              {/* Water drop icon */}
              <motion.div
                className="mb-6"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="rgba(255,255,255,0.5)" />
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
                </svg>
              </motion.div>

              {/* Nav links */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, ease: [0.25, 0.8, 0.25, 1] }}
                    onClick={() => setMobileOpen(false)}
                    className="group relative font-display text-[1.75rem] font-black italic text-white uppercase tracking-[0.08em] hover:text-white transition-all duration-300 py-4 pl-4 pr-4 rounded-2xl hover:bg-white/10"
                  >
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                    <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ boxShadow: 'inset 0 0 20px rgba(0,200,255,0.15)' }} />
                  </motion.a>
                ))}
              </div>

              {/* Bottom decoration */}
              <div className="mt-auto pr-2 pb-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 text-white/30"
                >
                  <div className="h-px flex-1 bg-white/15" />
                  <motion.svg
                    width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </motion.svg>
                  <div className="h-px flex-1 bg-white/15" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center text-white/25 text-xs mt-3 tracking-widest uppercase"
                >
                  Stay Hydrated
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 md:hidden bg-black/30"
          />
        )}
      </AnimatePresence>
    </>
  );
}
