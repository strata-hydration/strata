'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getActiveFlavors, BRAND } from '@/config/flavors';
import { footerContent } from '@/config/siteContent';

const exploreLinks = footerContent.columns.explore.links;

export default function Footer() {
  const flavors = getActiveFlavors();

  const connectLinks = [
    { label: 'Email Us', href: '/refuel' },
    { label: 'Instagram', href: process.env.NEXT_PUBLIC_INSTAGRAM_LINK || '#' },
    { label: 'WhatsApp', href: process.env.NEXT_PUBLIC_WHATSAPP_LINK || '#' },
    { label: 'Twitter / X', href: process.env.NEXT_PUBLIC_TWITTER_LINK || '#' },
  ];

  const flavorLinks = flavors.slice(0, 6).map(f => ({ label: f.name, href: '/fuel' }));

  const columns = [
    { title: footerContent.columns.explore.title, hoverColor: footerContent.columns.explore.hoverColor, links: exploreLinks },
    { title: footerContent.columns.flavors.title, hoverColor: footerContent.columns.flavors.hoverColor, links: flavorLinks },
    { title: footerContent.columns.connect.title, hoverColor: footerContent.columns.connect.hoverColor, links: connectLinks },
  ];

  return (
    <footer className="relative overflow-hidden w-full"
      style={{ background: 'linear-gradient(160deg, #003E8A 0%, #0066DD 35%, #00A8E8 70%, #0077FF 100%)' }}>

      {/* Subtle texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* ── Water bubbles ── */}
      {[
        { size: 14, left: '6%', delay: 0, dur: 5 },
        { size: 8, left: '18%', delay: 1.2, dur: 4 },
        { size: 18, left: '32%', delay: 0.6, dur: 6 },
        { size: 10, left: '48%', delay: 2, dur: 4.5 },
        { size: 16, left: '62%', delay: 0.3, dur: 5.5 },
        { size: 6, left: '76%', delay: 1.8, dur: 3.5 },
        { size: 12, left: '88%', delay: 2.5, dur: 4.8 },
      ].map((b, i) => (
        <motion.div
          key={`footer-bubble-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: b.size, height: b.size, left: b.left, bottom: '10%',
            background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.45), rgba(255,255,255,0.12) 50%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
          animate={{ y: [0, -(120 + i * 20)], x: [0, (i % 2 === 0 ? 1 : -1) * (8 + i * 3)], opacity: [0, 0.7, 0.4, 0], scale: [0.5, 1, 0.8] }}
          transition={{ duration: b.dur, repeat: Infinity, delay: b.delay, ease: 'easeOut' }}
        />
      ))}

      {/* ── Shimmer wave at top ── */}
      <motion.div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '4px' }}>
        <motion.div className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), rgba(0,220,255,0.4), rgba(255,255,255,0.3), transparent)', backgroundSize: '200% 100%' }}
          animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
      </motion.div>

      {/* ════════════════ HERO STATEMENT ════════════════ */}
      <div className="relative z-10 flex items-center justify-center px-3 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-7 lg:py-12">
        <div className="w-full max-w-[1240px] mx-auto flex flex-col items-center justify-center text-center px-2">
          <motion.h2
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight leading-[0.95]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <span className="text-white">{footerContent.heroStatement.heading}</span>
            <br />
            <span style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
              {footerContent.heroStatement.headingOutline}
            </span>
          </motion.h2>
          <motion.p
            className="font-body text-base sm:text-lg md:text-xl lg:text-[1.1rem] text-white/80 font-bold mt-6 md:mt-8 lg:mt-10 max-w-2xl leading-relaxed px-2 sm:px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}>
            {BRAND.subTagline}
          </motion.p>
          <motion.p
            className="font-cursive text-xs sm:text-sm md:text-base lg:text-lg text-white/50 font-bold mt-4 md:mt-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            {BRAND.antiSugar}
          </motion.p>
        </div>
      </div>

      {/* ════════════════ STATS + BRAND ════════════════ */}
      <motion.div
        className="relative z-10 flex items-center justify-center px-3 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-7 lg:py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="w-full max-w-[1240px] mx-auto flex flex-col items-center justify-center px-2">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 mb-8 md:mb-10 lg:mb-12">
            {[
              { value: BRAND.stats.electrolytes, label: 'Electrolytes' },
              { value: BRAND.stats.sugar, label: 'Sugar' },
              { value: BRAND.stats.calories, label: 'Calories' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-black tracking-tight">{stat.value}</span>
                <span className="font-label text-[10px] sm:text-xs md:text-sm text-white/45 font-extrabold uppercase tracking-widest mt-2">{stat.label}</span>
              </div>
            ))}
            <div className="hidden md:block w-px h-16 md:h-20 bg-white/15" />
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5">
              <a href="/" className="flex-shrink-0">
                <Image src="/logo.png" alt={BRAND.name} width={120} height={120}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" />
              </a>
              <p className="font-body text-xs sm:text-sm md:text-base text-white/70 font-semibold leading-snug max-w-xs text-center md:text-left">{BRAND.positioning}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ════════════════ DIVIDER ════════════════ */}
      <div className="relative z-10 flex items-center justify-center px-3 sm:px-5 md:px-6 lg:px-7">
        <div className="w-full max-w-[1240px] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
      </div>

      {/* ════════════════ LINK GRID ════════════════ */}
      <div className="relative z-10 flex items-center justify-center px-3 py-8 sm:px-5 sm:py-10 md:px-6 md:py-12 lg:px-7 lg:py-16">
        <div className="w-full max-w-[1240px] mx-auto">
          <div className="w-full grid grid-cols-3 gap-8 sm:gap-12 md:gap-16 lg:gap-20 px-2 sm:px-4">
            {columns.map((col, i) => (
              <motion.div
                key={col.title}
                className="flex flex-col items-center text-center justify-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}>
                <h4 className="font-display text-xs sm:text-sm md:text-base lg:text-lg text-white font-black uppercase tracking-widest mb-6 md:mb-8 lg:mb-10">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 sm:space-y-3 md:space-y-3.5 lg:space-y-4 w-full">
                  {col.links.map((link) => (
                    <li key={link.label} className="flex justify-center">
                      <motion.a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-body text-xs sm:text-sm md:text-base text-white/70 font-semibold transition-all duration-200 hover:text-white"
                        whileHover={{ color: col.hoverColor, scale: 1.08 }}>
                        {link.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════ BOTTOM DIVIDER ════════════════ */}
      <div className="relative z-10 flex items-center justify-center px-3 sm:px-5 md:px-6 lg:px-7">
        <div className="w-full max-w-[1240px] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
      </div>

      {/* ════════════════ BOTTOM BAR ════════════════ */}
      <motion.div
        className="relative z-10 flex items-center justify-center px-3 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-7 lg:py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="w-full max-w-[1240px] mx-auto flex flex-col items-center justify-center gap-4 md:gap-6 px-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 md:gap-8">
            <p className="font-body text-[11px] sm:text-xs md:text-sm text-white/40 font-medium text-center">
              &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
            <span className="hidden sm:block text-white/15 text-xs md:text-sm">|</span>
            <p className="font-body text-[11px] sm:text-xs md:text-sm text-white/30 font-medium italic hidden md:block text-center">{BRAND.science}</p>
            <span className="hidden md:block text-white/15">|</span>
          </div>
          <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10">
            {[footerContent.bottomBar.privacyLabel, footerContent.bottomBar.termsLabel].map((lbl) => (
              <motion.a key={lbl} href="#"
                className="font-body text-[10px] sm:text-xs md:text-sm text-white/40 font-semibold uppercase tracking-widest transition-colors duration-200"
                whileHover={{ color: '#ffffff' }}>
                {lbl}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}