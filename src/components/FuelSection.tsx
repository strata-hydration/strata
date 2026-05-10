'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getActiveFlavors } from '@/config/flavors';
import { hydrationContent } from '@/config/siteContent';

export default function FuelSection() {
  const flavors = getActiveFlavors();
  const availableFlavors = flavors.filter((f) => f.badge !== hydrationContent.comingSoonLabel);
  const comingSoonFlavors = flavors.filter((f) => f.badge === hydrationContent.comingSoonLabel);
  const allDisplay = [...availableFlavors, ...comingSoonFlavors];
  const orderedDisplay = [...allDisplay].sort((a, b) => {
    const order: Record<string, number> = {
      'zesty-orange': 0,
      'citrus-lime': 1,
      'pineapple-punch': 2,
    };
    return (order[a.id] ?? 99) - (order[b.id] ?? 99);
  });
  const [selectedId, setSelectedId] = useState(availableFlavors[0]?.id ?? flavors[0]?.id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageFallbackMap, setImageFallbackMap] = useState<Record<string, string>>({});

  const selected = flavors.find((f) => f.id === selectedId) ?? flavors[0];
  const isComingSoon = selected.badge === hydrationContent.comingSoonLabel;

  const imageSlides =
    selected.id === 'citrus-lime'
      ? [
          { label: 'Pack', src: '/pack.png' },
          { label: 'Lime 1', src: '/lime-1.png' },
          { label: 'Lime 3', src: '/lime-3.jpg' },
        ]
      : [{ label: 'Pack', src: '/pack.png' }];

  const activeSlide = imageSlides[selectedImageIndex] ?? imageSlides[0];
  const slideCount = imageSlides.length;
  const getSafeImageSrc = (src: string) => imageFallbackMap[src] ?? src;

  const goToPreviousImage = () => {
    if (slideCount <= 1) return;
    setSelectedImageIndex((current) => (current - 1 + slideCount) % slideCount);
  };

  const goToNextImage = () => {
    if (slideCount <= 1) return;
    setSelectedImageIndex((current) => (current + 1) % slideCount);
  };

  const handleImageError = (src: string) => {
    setImageFallbackMap((prev) => {
      if (prev[src]) return prev;
      return { ...prev, [src]: '/pack.png' };
    });
  };

  useEffect(() => {
    setSelectedImageIndex(0);
    setImageFallbackMap({});
  }, [selectedId]);

  const stats = [
    { value: '550mg', label: 'Sodium' },
    { value: '140mg', label: 'Potassium' },
    { value: '50mg', label: 'Magnesium' },
    { value: '571mg', label: 'FOS Fibre' },
  ];

  return (
    <section
      id="fuel"
      className="relative flex min-h-svh flex-col overflow-hidden sm:h-[92svh] sm:min-h-0"
      style={{ background: 'linear-gradient(165deg, #EDF9FF 0%, #DDF1FF 30%, #C2E4FF 60%, #A5D2F7 85%, #8CC2EC 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -right-32 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,180,245,0.18), transparent 72%)' }}
        />
        <div
          className="absolute bottom-10 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(30,140,235,0.18), transparent 72%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-3 py-0 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="mx-auto grid h-[calc(100%-1rem)] w-full max-w-[1240px] grid-rows-[auto_auto_minmax(0,1fr)] place-items-center gap-2.5 rounded-[28px] border border-white/35 bg-white/14 px-4 py-0 shadow-[0_24px_80px_rgba(16,86,156,0.10)] backdrop-blur-[10px] sm:h-[calc(100%-1.25rem)] sm:gap-3 sm:px-6 sm:py-5 lg:h-[calc(100%-1.5rem)] lg:gap-3.5 lg:px-8 lg:py-6 xl:px-10">
          <motion.div
            className="flex w-full max-w-4xl flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-label text-[10px] font-extrabold uppercase tracking-widest sm:mb-4 sm:text-xs"
              style={{ color: '#00D4FF', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Hydration Lab
            </span>
            <h2 className="mx-auto max-w-[16ch] font-display text-[2rem] font-black uppercase tracking-tight leading-[0.92] sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.3rem] xl:text-[3.75rem]">
              <span
                style={{
                  background: 'linear-gradient(180deg, #0B2E5B 0%, #1E5EA5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {hydrationContent.heading}{' '}
              </span>
              <span className="hero-line-script" style={{ textTransform: 'none' }}>
                {hydrationContent.headingAccent}
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="flex w-full justify-center"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              className="flex w-full max-w-4xl flex-wrap items-center justify-center gap-2.5 rounded-[2rem] p-3 pr-4 overflow-visible sm:gap-3 sm:p-3.5 sm:pr-5"
              style={{ background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(11,78,135,0.12)' }}
            >
              {orderedDisplay.map((flavor) => {
                const isActive = flavor.id === selectedId;
                const isSoon = flavor.badge === hydrationContent.comingSoonLabel;
                return (
                  <motion.button
                    key={flavor.id}
                    onClick={() => setSelectedId(flavor.id)}
                    className="relative z-0 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 transition-all cursor-pointer whitespace-nowrap overflow-visible sm:min-h-[3.25rem] sm:px-7 sm:py-3.5 hover:z-10"
                    style={{
                      background: isActive ? `${flavor.color}28` : 'rgba(255,255,255,0.22)',
                      border: isActive ? `1.5px solid ${flavor.color}60` : '1.5px solid transparent',
                      boxShadow: isActive ? `inset 0 0 0 1px ${flavor.color}22` : 'none',
                      opacity: isSoon && !isActive ? 0.6 : 1,
                    }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                  >
                    <div
                      className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        border: `2px solid ${isActive ? flavor.color : isSoon ? 'rgba(11,46,91,0.22)' : 'rgba(11,46,91,0.34)'}`,
                        background: isActive ? `${flavor.color}15` : 'transparent',
                      }}
                    >
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                            style={{ background: flavor.color, boxShadow: `0 0 8px ${flavor.color}80` }}
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    <span className={`text-sm sm:text-base ${isSoon && !isActive ? 'grayscale' : ''}`}>{flavor.emoji}</span>

                    <span
                      className="inline-block font-display text-[10px] font-bold uppercase tracking-[0.07em] leading-[1.15] sm:text-[11px]"
                      style={{ color: isActive ? flavor.color : isSoon ? 'rgba(11,46,91,0.42)' : 'rgba(11,46,91,0.72)' }}
                    >
                      {flavor.name}
                    </span>

                    <span aria-hidden="true" className="block w-4 shrink-0 sm:w-5" />

                    {isSoon && !isActive && (
                      <span
                        className="hidden md:inline font-label text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold"
                        style={{ color: 'rgba(11,46,91,0.42)', background: 'rgba(11,46,91,0.05)' }}
                      >
                        Soon
                      </span>
                    )}

                    {isActive && (
                      <motion.div
                        layoutId="flavor-glow"
                        className="absolute inset-0 rounded-full -z-10"
                        style={{ boxShadow: `0 0 20px ${flavor.color}25` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <div className="grid h-full min-h-0 w-full items-stretch justify-items-center gap-2.5 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-5 xl:gap-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative flex h-full min-h-[17rem] w-full items-center justify-center self-stretch sm:min-h-[19rem] lg:min-h-[27rem]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                className="absolute h-60 w-60 rounded-full sm:h-80 sm:w-80 md:h-[24rem] md:w-[24rem] lg:h-[27rem] lg:w-[27rem]"
                style={{ border: `1.5px solid ${selected.color}18` }}
              />

              <div
                className="absolute h-80 w-80 rounded-full blur-3xl sm:h-[26rem] sm:w-[26rem] lg:h-[32rem] lg:w-[32rem]"
                style={{ background: `radial-gradient(circle, ${selected.color}18 0%, transparent 72%)` }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selected.id}-${selectedImageIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                    y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="relative z-10 aspect-[3/4] h-[17rem] sm:h-[20rem] md:h-[23rem] lg:h-[27rem] xl:h-[29rem]"
                  style={{ filter: isComingSoon ? 'grayscale(0.7) opacity(0.5)' : 'none' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getSafeImageSrc(activeSlide.src)}
                    alt={`${selected.name} ${activeSlide.label}`}
                    onError={() => handleImageError(activeSlide.src)}
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </motion.div>
              </AnimatePresence>

              {imageSlides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
                  <button
                    type="button"
                    onClick={goToPreviousImage}
                    className="rounded-full border border-white/55 bg-white/70 p-2 text-blue-950 shadow-[0_10px_24px_rgba(0,119,255,0.12)] transition-transform duration-200 hover:scale-105"
                    aria-label="Previous product image"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                  </button>

                  {imageSlides.map((slide, index) => (
                    <motion.button
                      key={slide.label}
                      onClick={() => setSelectedImageIndex(index)}
                      type="button"
                      aria-label={`View ${slide.label}`}
                      className="rounded-full transition-all"
                      style={{
                        width: index === selectedImageIndex ? '34px' : '8px',
                        height: index === selectedImageIndex ? '10px' : '8px',
                        background: index === selectedImageIndex ? selected.color : 'rgba(11,46,91,0.18)',
                        boxShadow:
                          index === selectedImageIndex
                            ? `0 0 0 1px ${selected.color}22, 0 8px 24px ${selected.color}30`
                            : 'none',
                      }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={goToNextImage}
                    className="rounded-full border border-white/55 bg-white/70 p-2 text-blue-950 shadow-[0_10px_24px_rgba(0,119,255,0.12)] transition-transform duration-200 hover:scale-105"
                    aria-label="Next product image"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                    </svg>
                  </button>
                </div>
              )}

              {isComingSoon && (
                <div
                  className="absolute z-20 font-display text-sm sm:text-base font-black uppercase tracking-widest px-5 py-2 rounded-full"
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Coming Soon
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mx-auto flex w-full max-w-[29rem] flex-col items-center justify-center gap-3 rounded-[24px] border border-white/45 bg-white/48 px-4 py-3.5 text-center shadow-[0_18px_55px_rgba(16,86,156,0.08)] backdrop-blur-[14px] sm:px-5 sm:py-4 lg:max-w-[28rem] lg:gap-3.5 lg:px-6 lg:py-4.5"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <h3 className="font-display text-[1.55rem] font-black uppercase tracking-tight leading-none text-blue-950 sm:text-[1.9rem] md:text-[2.2rem] lg:text-[2.45rem]">
                      {selected.name}
                    </h3>
                    {!isComingSoon && (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-label font-extrabold uppercase tracking-wider"
                        style={{ color: selected.color, background: `${selected.color}12`, border: `1px solid ${selected.color}25` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: selected.color }} />
                        Live
                      </span>
                    )}
                  </div>
                  <p className="font-cursive text-base font-bold sm:text-lg md:text-xl lg:text-2xl" style={{ color: isComingSoon ? 'rgba(255,255,255,0.3)' : selected.color }}>
                    {selected.tagline}
                  </p>
                </motion.div>
              </AnimatePresence>

              <p className="max-w-[34ch] font-body text-[13px] font-medium leading-5 text-blue-950/70 sm:text-sm sm:leading-6 lg:text-[14px] lg:leading-6">
                {selected.description}
              </p>

              <Link href={isComingSoon ? '/products' : `/products/${selected.id}`}>
                <motion.span
                  className="mt-1 inline-flex items-center justify-center rounded-full px-6 py-2.5 font-label text-[11px] font-extrabold uppercase tracking-widest text-white"
                  style={{
                    background: isComingSoon
                      ? 'linear-gradient(120deg, rgba(11,46,91,0.35) 0%, rgba(11,46,91,0.55) 100%)'
                      : `linear-gradient(120deg, ${selected.color}cc 0%, ${selected.color} 100%)`,
                    boxShadow: isComingSoon
                      ? '0 10px 26px rgba(11,46,91,0.16)'
                      : `0 10px 26px ${selected.color}35`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isComingSoon
                    ? `Preview in Shop · ${hydrationContent.comingSoonLabel}`
                    : `${hydrationContent.ctaPrefix} ${selected.name} ${hydrationContent.ctaSuffix}`}
                </motion.span>
              </Link>

              <div className="grid w-full max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-2.5">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
                    className="flex min-h-[4.5rem] flex-col items-center justify-center rounded-2xl px-2.5 py-2.5 text-center"
                    style={{ background: 'rgba(255,255,255,0.34)', border: '1px solid rgba(11,78,135,0.08)' }}
                  >
                    <span className="font-display text-sm sm:text-base md:text-lg font-black text-blue-950 leading-none">{stat.value}</span>
                    <span className="font-label text-[8px] sm:text-[10px] text-blue-800/65 font-bold uppercase tracking-wider">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div
        className="relative z-20 w-full overflow-hidden hero-ticker shrink-0"
        style={{
          background: `linear-gradient(120deg, ${selected.color}${isComingSoon ? '40' : ''} 0%, ${selected.color}${isComingSoon ? '30' : 'cc'} 52%, ${selected.color}${isComingSoon ? '40' : ''} 100%)`,
        }}
      >
        <motion.div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '2px' }}>
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), rgba(255,255,255,0.7), rgba(255,255,255,0.5), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        <div className="ticker-track relative z-10">
          {[0, 1, 2, 3].map((set) => (
            <div key={set} className="ticker-content" aria-hidden={set > 0}>
              {hydrationContent.ticker.map((item, i) => (
                <span key={`${set}-${i}`} className="ticker-item">
                  <span className="ticker-dot" style={{ background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.7)' }} />
                  <span className="ticker-text" style={{ color: '#fff', fontWeight: 800, textShadow: '0 0 6px rgba(255,255,255,0.4)' }}>{item}</span>
                  <span className="ticker-sep" style={{ color: 'rgba(255,255,255,0.6)' }}>*</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
