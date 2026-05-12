'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { voicesContent } from '@/config/siteContent';

const reviews = voicesContent.reviews;
const stats = voicesContent.stats;
const AUTOPLAY_MS = 3400;

function wrapIndex(index: number, total: number) {
  return (index + total) % total;
}

function getRelativeOffset(index: number, activeIndex: number, total: number) {
  const forward = wrapIndex(index - activeIndex, total);
  const backward = forward - total;
  return Math.abs(forward) <= Math.abs(backward) ? forward : backward;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-xs sm:text-sm ${i < rating ? 'text-amber-400' : 'text-blue-200/30'}`}>★</span>
      ))}
    </div>
  );
}

export default function VoicesSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeReview = reviews[selectedIndex];

  useEffect(() => {
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      setSelectedIndex((current) => wrapIndex(current + 1, reviews.length));
    }, AUTOPLAY_MS);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  return (
    <section
      id="reviews"
      className="relative flex min-h-svh flex-col overflow-x-hidden overflow-y-visible py-8 sm:py-10 lg:py-12"
      style={{
        background:
          'radial-gradient(circle at top right, rgba(255,255,255,0.7), transparent 24%), linear-gradient(165deg, #FFFBF0 0%, #FFF4DE 30%, #FFEBCF 60%, #FFE0BB 85%, #FFD7A8 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -right-20 top-[-5rem] h-[24rem] w-[24rem] rounded-full blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.3, 0.18] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.24), transparent 72%)' }}
        />
        <motion.div
          className="absolute -left-24 bottom-[-7rem] h-[26rem] w-[26rem] rounded-full blur-3xl"
          animate={{ scale: [1.05, 0.9, 1.05], opacity: [0.14, 0.24, 0.14] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(255,20,147,0.2), transparent 72%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'linear-gradient(180deg, transparent, white 18%, white 82%, transparent)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-3 sm:px-5 lg:px-7">
        <div className="mx-auto grid w-full max-w-[1240px] grid-rows-[auto_auto_auto_auto] place-items-center gap-5 rounded-[32px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0.2))] px-4 py-8 shadow-[0_32px_120px_rgba(171,100,12,0.10)] backdrop-blur-[18px] sm:gap-6 sm:px-6 sm:py-10 lg:gap-7 lg:px-8 lg:py-12 xl:px-10">
          <motion.div
            className="flex w-full max-w-4xl flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span
              className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-label text-[10px] font-extrabold uppercase tracking-widest sm:mb-4 sm:text-xs"
              style={{
                color: '#F59E0B',
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(245,158,11,0.22)',
                boxShadow: '0 12px 32px rgba(245,158,11,0.10)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              {voicesContent.badge}
            </span>
            <h2 className="mx-auto max-w-[16ch] font-display text-[2rem] font-black uppercase leading-[0.92] tracking-tight sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.3rem] xl:text-[3.75rem]">
              <span
                style={{
                  background: 'linear-gradient(180deg, #0B2E5B 0%, #1E5EA5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {voicesContent.heading}{' '}
              </span>
              <span className="hero-line-script" style={{ textTransform: 'none' }}>
                {voicesContent.headingAccent}
              </span>
            </h2>
            <p className="mt-4 max-w-xl font-body text-sm font-bold leading-relaxed text-blue-950/72 sm:mt-5 sm:text-base md:text-lg">
              {voicesContent.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 md:gap-5"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.35 }}
                whileHover={{ y: -3, scale: 1.03 }}
                className="flex cursor-default flex-col items-center gap-2 rounded-2xl px-3 py-4 sm:gap-2.5 sm:px-4 sm:py-5 md:py-6"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 4px 24px rgba(245,158,11,0.06), inset 0 0 0 1px rgba(255,255,255,0.5)',
                }}
              >
                <span className="text-xl sm:text-2xl md:text-3xl">{s.icon}</span>
                <span className="font-display text-xl font-black leading-none text-blue-950 sm:text-2xl md:text-3xl">{s.value}</span>
                <span className="font-label text-[8px] font-extrabold uppercase tracking-wider text-blue-800/55 sm:text-[10px]">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-6 self-stretch sm:gap-7 lg:gap-8">
            <motion.p
              className="font-cursive text-lg font-bold md:text-xl"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              {voicesContent.reviewsLabel}
            </motion.p>

            <div
              className="relative w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="absolute left-1/2 top-[48%] h-32 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.2),transparent_70%)] blur-3xl" />
              <div className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center gap-7 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
                <motion.div
                  key={activeReview.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45 }}
                  className="relative z-20 order-1 flex w-full max-w-xl flex-col items-center text-center lg:items-start lg:text-left"
                >
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/55 px-3 py-1.5 font-label text-[10px] font-extrabold tracking-[0.2em] text-blue-950/65 shadow-[0_12px_28px_rgba(245,158,11,0.12)] sm:text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: activeReview.color }} />
                    {activeReview.tag}
                  </div>
                  <h3 className="max-w-[12ch] font-display text-[1.7rem] font-black uppercase leading-[0.92] tracking-tight text-blue-950 sm:text-[2.1rem] lg:text-[3rem]">
                    {activeReview.role}
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl">{activeReview.avatar}</span>
                    <StarRating rating={activeReview.rating} />
                  </div>
                  <p className="mt-3 max-w-[34ch] font-body text-sm font-semibold leading-relaxed text-blue-950/70 sm:text-base md:text-lg">
                    &ldquo;{activeReview.text}&rdquo;
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/75 px-3 py-1.5">
                    <span className="text-xs">✅</span>
                    <span className="font-label text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">{voicesContent.verifiedLabel}</span>
                  </div>

                  <div className="mt-5 flex items-center gap-3 sm:mt-6">
                    <button
                      type="button"
                      onClick={() => setSelectedIndex((current) => wrapIndex(current - 1, reviews.length))}
                      className="rounded-full border border-white/55 bg-white/55 p-3 text-blue-950 shadow-[0_14px_30px_rgba(245,158,11,0.12)] transition-transform duration-200 hover:scale-105"
                      aria-label="Previous review"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedIndex((current) => wrapIndex(current + 1, reviews.length))}
                      className="rounded-full border border-amber-300/60 bg-[linear-gradient(135deg,#F59E0B,#FBBF24)] p-3 text-white shadow-[0_18px_34px_rgba(245,158,11,0.25)] transition-transform duration-200 hover:scale-105"
                      aria-label="Next review"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                    </button>
                    <div className="ml-2 flex items-center gap-2">
                      {reviews.map((review, index) => (
                        <button
                          key={review.role}
                          type="button"
                          onClick={() => setSelectedIndex(index)}
                          className="transition-transform duration-200 hover:scale-110"
                          aria-label={`Show ${review.role}`}
                        >
                          <span
                            className="block rounded-full"
                            style={{
                              width: index === selectedIndex ? '34px' : '8px',
                              height: index === selectedIndex ? '10px' : '8px',
                              background: index === selectedIndex ? activeReview.color : 'rgba(11,46,91,0.18)',
                              boxShadow:
                                index === selectedIndex ? `0 0 0 1px ${activeReview.color}22, 0 8px 24px ${activeReview.color}30` : 'none',
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <div className="order-2 w-full">
                  <div className="relative mx-auto h-[21rem] w-full max-w-[36rem] overflow-visible [perspective:1800px] sm:h-[23.5rem] sm:max-w-[38rem] md:h-[26rem] lg:max-w-[40rem]">
                    {reviews.map((review, index) => {
                      const offset = getRelativeOffset(index, selectedIndex, reviews.length);
                      const distance = Math.abs(offset);
                      const isActive = offset === 0;
                      const translateX = distance === 0 ? 0 : distance === 1 ? offset * 108 : offset * 132;
                      const scale = isActive ? 0.96 : distance === 1 ? 0.82 : 0.7;
                      const opacity = isActive ? 1 : distance === 1 ? 0.72 : 0.26;
                      const rotateY = offset * -24;
                      const y = distance === 0 ? 0 : distance === 1 ? 18 : 34;

                      return (
                        <motion.button
                          key={review.role}
                          type="button"
                          initial={false}
                          animate={{
                            x: translateX,
                            y,
                            scale,
                            opacity,
                            rotateY,
                            rotateX: distance === 0 ? 0 : distance * 2,
                            z: isActive ? 140 : distance === 1 ? 20 : -80,
                          }}
                          transition={{ type: 'spring', stiffness: 210, damping: 20, mass: 0.82 }}
                          className="absolute left-1/2 top-1/2 h-[17rem] w-[14.5rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-[1.8rem] text-left sm:h-[19rem] sm:w-[16.4rem] md:h-[21rem] md:w-[18.4rem] lg:h-[22rem] lg:w-[19.25rem]"
                          style={{
                            zIndex: 20 - distance,
                            transformStyle: 'preserve-3d',
                            filter: distance > 1 ? 'blur(4px)' : distance === 1 ? 'blur(1px)' : 'blur(0px)',
                          }}
                          onClick={() => setSelectedIndex(index)}
                          aria-label={`Focus ${review.role} review`}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              background: 'linear-gradient(160deg, rgba(255,255,255,0.97), rgba(255,247,236,0.86))',
                              border: '1px solid rgba(255,255,255,0.82)',
                              boxShadow: `0 42px 100px ${review.color}26, inset 0 1px 0 rgba(255,255,255,0.9)`,
                              backdropFilter: 'blur(24px)',
                            }}
                          />

                          <div className="absolute inset-x-0 top-0 h-[44%] overflow-hidden rounded-t-[1.8rem]">
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `linear-gradient(135deg, ${review.color}15 0%, ${review.color}08 100%)`,
                              }}
                            />
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0.95) 100%)`,
                              }}
                            />
                            <span
                              className="absolute right-3 top-3 rounded-full px-2.5 py-1 font-label text-[8px] font-extrabold uppercase tracking-wider"
                              style={{ color: review.color, background: `${review.color}18`, border: `1px solid ${review.color}25` }}
                            >
                              {review.tag}
                            </span>
                          </div>

                          <div className="absolute inset-x-4 bottom-4 top-[42%] flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="flex h-10 w-10 items-center justify-center rounded-full text-base"
                                  style={{ background: `${review.color}14`, boxShadow: `0 0 0 2px ${review.color}22` }}
                                >
                                  {review.avatar}
                                </div>
                                <div>
                                  <p className="font-display text-sm font-black text-blue-950">{review.role}</p>
                                  <StarRating rating={review.rating} />
                                </div>
                              </div>
                              <p className="mt-3 line-clamp-4 font-body text-[11px] font-semibold leading-relaxed text-blue-950/74">
                                &ldquo;{review.text}&rdquo;
                              </p>
                            </div>

                            <div className="mt-3 inline-flex items-center gap-1.5">
                              <span className="text-[10px]">✅</span>
                              <span className="font-label text-[8px] font-extrabold uppercase tracking-wider text-emerald-600">{voicesContent.verifiedLabel}</span>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
