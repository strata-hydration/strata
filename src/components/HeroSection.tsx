'use client';

import { motion } from 'framer-motion';
import { getActiveFlavors, BRAND } from '@/config/flavors';
import { heroContent } from '@/config/siteContent';

export default function HeroSection() {
  const flavors = getActiveFlavors();

  return (
    <section id="home" className="relative w-full h-svh flex flex-col overflow-hidden wave-divider pt-4 sm:pt-20 md:pt-32 lg:pt-40 pb-0 sm:pb-28 md:pb-40 lg:pb-48 px-4 sm:px-10 md:px-16 lg:px-20"
      style={{ background: 'linear-gradient(165deg, #ECF8FF 0%, #DDF1FF 35%, #C7E7FF 60%, #AAD9FF 85%, #93CEFA 100%)' }}>
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 md:top-0 -right-20 md:-right-40 w-80 md:w-[600px] h-80 md:h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.2), transparent 70%)' }} />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-0 md:bottom-20 -left-20 md:-left-40 w-80 md:w-[600px] h-80 md:h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,200,255,0.15), transparent 70%)' }} />
        <div className="absolute inset-x-0 top-0 h-40 md:h-56" style={{ background: 'linear-gradient(180deg, rgba(0,94,163,0.22), transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-36 md:h-48" style={{ background: 'linear-gradient(0deg, rgba(0,120,191,0.18), transparent)' }} />
      </div>

      <div className="relative z-10 w-full flex-1 flex items-center min-h-0">
        <div className="section-inner w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 sm:gap-8 md:gap-12 lg:gap-16 items-center">
            
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="w-full flex flex-col gap-0 sm:gap-4 md:gap-5 lg:gap-7 px-1 sm:px-0">
            
            {/* Hero Motivational Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}>
              <div className="flex items-center gap-3 mb-1 md:mb-3">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
                  className="hero-accent-line origin-left" />
                <span className="hero-line-top text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold" style={{ color: '#FFB347' }}>
                  {heroContent.accentLine}
                </span>
              </div>
              <h1 className="leading-[0.9]">
                <span className="hero-line-main block text-5xl sm:text-8xl md:text-9xl lg:text-[10rem]">
                  {heroContent.headingMain.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.5, ease: 'easeOut' }}>
                      {char}
                    </motion.span>
                  ))}
                </span>
                <span className="hero-line-script block text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-1 sm:mt-3 ml-1 sm:ml-2">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0, duration: 0.7, ease: 'easeOut' }}>
                    {heroContent.headingScript}
                  </motion.span>
                </span>
              </h1>
            </motion.div>

            {/* Mobile-only product image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
              className="lg:hidden relative h-[24rem] sm:h-[30rem] flex items-center justify-center -my-10 sm:-my-6">
              {/* Outer rotating glow ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="absolute w-60 h-60 sm:w-[20rem] sm:h-[20rem] rounded-full opacity-20"
                style={{ background: 'conic-gradient(from 0deg, #0077FF, #FF1493, #FF8C00, #0077FF)' }} />
              {/* Inner counter-rotating ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full opacity-15"
                style={{ background: 'conic-gradient(from 180deg, #00D4FF, transparent 40%, #FF8C00, transparent 80%, #00D4FF)' }} />
              {/* Pulsing radial glow */}
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,180,255,0.18) 0%, transparent 70%)' }} />
              {/* Orbiting particles (4 on mobile) */}
              {[0, 1, 2, 3].map(i => (
                <motion.div key={`mob-particle-${i}`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'linear', delay: i * 0.8 }}
                  className="absolute" style={{ width: 160 + i * 20, height: 160 + i * 20 }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{ width: i % 2 === 0 ? 5 : 4, height: i % 2 === 0 ? 5 : 4, background: i % 2 === 0 ? '#00D4FF' : '#FF8C00', boxShadow: `0 0 8px ${i % 2 === 0 ? '#00D4FF' : '#FF8C00'}` }} />
                </motion.div>
              ))}
              <div
                className="relative w-[26rem] sm:w-[30rem] h-[30rem] sm:h-[32rem] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/product.png" alt={heroContent.productAlt}
                  className="w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(0,180,255,0.35)]" />
              </div>
              {/* Reflection glow */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-6 rounded-full opacity-30"
                style={{ background: 'radial-gradient(ellipse, rgba(0,180,255,0.5) 0%, transparent 80%)' }} />
            </motion.div>

            {/* Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}>
              <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-blue-900/80 max-w-md leading-relaxed font-bold">
                {BRAND.science} {heroContent.subtitle}
              </p>
            </motion.div>

            {/* CTA — editorial text links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex items-center gap-6 sm:gap-8 mt-1 sm:mt-5 md:mt-6">
              
              {/* Primary — clean underline-reveal link */}
              <motion.a href={heroContent.cta.primary.href}
                className="group relative font-display text-base sm:text-lg font-black uppercase tracking-[0.1em] overflow-hidden"
                style={{ color: '#00D4FF' }}
                whileTap={{ scale: 0.97 }}>
                <span className="flex items-center gap-2.5">
                  {heroContent.cta.primary.label}
                  <motion.svg
                    className="w-5 h-5"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </motion.svg>
                </span>
                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2.5px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, #00D4FF, #00E5FF)' }}
                  initial={{ width: '30%' }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }} />
              </motion.a>

              <span className="text-blue-400/40 text-sm select-none">/</span>

              {/* Secondary — subtle text link */}
              <motion.a href="#benefits"
                className="group relative font-display text-base sm:text-lg font-bold uppercase tracking-[0.08em] text-blue-800/70 hover:text-blue-900 transition-colors cursor-pointer"
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.preventDefault(); document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="flex items-center gap-2">
                  {heroContent.cta.secondary.label}
                </span>
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-blue-300/30 rounded-full"
                  initial={{ width: '0%' }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }} />
              </motion.a>
            </motion.div>

            </motion.div>

            {/* Right: Product visualization (desktop only) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="hidden lg:flex relative lg:h-[620px] xl:h-[700px] items-center justify-center">
            
            {/* Outer slow rotating glow ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[520px] h-[520px] xl:w-[600px] xl:h-[600px] rounded-full opacity-15"
              style={{
                background: 'conic-gradient(from 0deg, #00D4FF, transparent, #0077FF, transparent, #00D4FF)',
              }} />

            {/* Inner counter-rotating glow ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[440px] h-[440px] xl:w-[500px] xl:h-[500px] rounded-full opacity-20"
              style={{
                background: 'conic-gradient(from 180deg, #0077FF, #FF1493, #FF8C00, #0077FF)',
              }} />

            {/* Pulsing radial glow */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.18, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[500px] h-[500px] xl:w-[560px] xl:h-[560px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)' }} />

            {/* Orbiting particles */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#00D4FF' : '#FFB347',
                  boxShadow: `0 0 8px ${i % 2 === 0 ? 'rgba(0,212,255,0.6)' : 'rgba(255,179,71,0.6)'}`,
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [Math.cos(i * 60 * Math.PI / 180) * 220, Math.cos((i * 60 + 360) * Math.PI / 180) * 220],
                  y: [Math.sin(i * 60 * Math.PI / 180) * 220, Math.sin((i * 60 + 360) * Math.PI / 180) * 220],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{ duration: 8 + i * 0.5, repeat: Infinity, ease: 'linear', delay: i * 0.6 }}
              />
            ))}

            {/* Floating micro sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{
                  left: `${15 + (i * 10)}%`,
                  top: `${10 + (i * 11) % 80}%`,
                  boxShadow: '0 0 4px rgba(255,255,255,0.8)',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 2 + (i * 0.3),
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: 'easeInOut',
                }}
              />
            ))}
            
            {/* Product image — larger */}
            <div
              className="relative w-[40rem] lg:w-[46rem] xl:w-[50rem] h-[40rem] lg:h-[46rem] xl:h-[50rem] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/product.png"
                alt={heroContent.productAlt}
                className="w-full h-full object-contain drop-shadow-[0_20px_80px_rgba(0,180,255,0.35)]"
              />
              
              {/* Reflection glow under product */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/5 h-8 rounded-full blur-xl"
                style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.3), transparent)' }} />
            </div>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Broadcast Ticker Bar — matches navbar style */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden hero-ticker"
        style={{
          background: 'linear-gradient(120deg, #0077FF 0%, #00C8FF 52%, #0099FF 100%)',
          boxShadow: '0 -4px 30px rgba(0,119,255,0.18)',
        }}>

        {/* Bubbles — same as navbar */}
        {[
          { size: 10, left: '6%', delay: 0, dur: 4 },
          { size: 7, left: '18%', delay: 1.5, dur: 3.5 },
          { size: 14, left: '34%', delay: 0.8, dur: 5 },
          { size: 9, left: '50%', delay: 2.2, dur: 4.2 },
          { size: 12, left: '66%', delay: 0.3, dur: 4.8 },
          { size: 6, left: '80%', delay: 1, dur: 3 },
          { size: 8, left: '92%', delay: 2.8, dur: 3.8 },
        ].map((b, i) => (
          <motion.div
            key={`ticker-bubble-${i}`}
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
              y: [0, -(30 + i * 5)],
              x: [0, (i % 2 === 0 ? 1 : -1) * (4 + i * 2)],
              opacity: [0, 0.7, 0.4, 0],
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

        {/* Sparkle dots — same as navbar */}
        {[
          { top: '20%', left: '12%', delay: 0.5 },
          { top: '55%', left: '38%', delay: 2 },
          { top: '30%', left: '62%', delay: 1 },
          { top: '45%', left: '85%', delay: 3 },
        ].map((s, i) => (
          <motion.div
            key={`ticker-sparkle-${i}`}
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

        {/* Water shimmer at top edge */}
        <motion.div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: '4px' }}>
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(0,220,255,0.5), rgba(255,255,255,0.4), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Subtle shimmer overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(0deg, rgba(0,200,255,0.08) 0%, transparent 40%, transparent 70%, rgba(255,255,255,0.06) 100%)' }} />

        {/* Scrolling marquee */}
        <div className="ticker-track relative z-10">
          {[0, 1, 2, 3].map((set) => (
            <div key={set} className="ticker-content" aria-hidden={set > 0}>
              {heroContent.ticker.map((item, i) => (
                <span key={`${set}-${i}`} className="ticker-item">
                  <span className="ticker-dot" style={{ background: 'rgba(255,255,255,0.7)', boxShadow: '0 0 6px rgba(255,255,255,0.4)' }} />
                  <span className="ticker-text" style={{ color: 'white' }}>{item}</span>
                  <span className="ticker-sep" style={{ color: 'rgba(255,255,255,0.35)' }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}