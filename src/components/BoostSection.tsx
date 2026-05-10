'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { boostContent } from '@/config/siteContent';

const { moments } = boostContent;

const AUTOPLAY_MS = 3200;

type TiltState = {
  rotateX: number;
  rotateY: number;
};

function renderThemeAccent(title: string, color: string, isActive: boolean) {
  if (!isActive) return null;

  if (title === 'Morning Reset') {
    return (
      <>
        <motion.div
          className="absolute left-1/2 top-[16%] h-20 w-20 -translate-x-1/2 rounded-full"
          animate={{ scale: [1, 1.34, 1], opacity: [0.28, 0.62, 0.28] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
          style={{ border: `1px solid ${color}70`, boxShadow: `0 0 36px ${color}35` }}
        />
        <motion.div
          className="absolute left-1/2 top-[15%] h-32 w-32 -translate-x-1/2 rounded-full"
          animate={{ scale: [0.88, 1.12, 0.88], opacity: [0.18, 0.38, 0.18] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ border: `1px solid ${color}40`, boxShadow: `0 0 48px ${color}18 inset` }}
        />
        <motion.div
          className="absolute left-1/2 top-[10%] h-14 w-28 -translate-x-1/2 rounded-[999px]"
          animate={{ y: [0, -10, 0], opacity: [0.22, 0.58, 0.22], scaleX: [0.9, 1.12, 0.9] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `radial-gradient(circle, ${color}66, transparent 70%)`, filter: 'blur(8px)' }}
        />
      </>
    );
  }

  if (title === 'Pre-Workout') {
    return (
      <>
        <motion.div
          className="absolute left-6 top-[32%] h-[3px] w-20 rounded-full"
          animate={{ x: [0, 26, 0], opacity: [0.4, 1, 0.4], scaleX: [0.75, 1.2, 0.75] }}
          transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
        <motion.div
          className="absolute right-6 top-[41%] h-[3px] w-24 rounded-full"
          animate={{ x: [0, -30, 0], opacity: [0.38, 1, 0.38], scaleX: [0.7, 1.18, 0.7] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
        <motion.div
          className="absolute left-1/2 top-[26%] h-24 w-24 -translate-x-1/2 rounded-full"
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.1, 0.24, 0.1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `radial-gradient(circle, ${color}45, transparent 72%)` }}
        />
      </>
    );
  }

  if (title === 'Deep Work') {
    return (
      <>
        <motion.div
          className="absolute left-4 top-[26%] h-14 w-14 rounded-full"
          animate={{ y: [0, -12, 0], opacity: [0.24, 0.48, 0.24], scale: [0.92, 1.12, 0.92] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `radial-gradient(circle, ${color}35, transparent 72%)` }}
        />
        <motion.div
          className="absolute right-4 top-[26%] h-14 w-14 rounded-full"
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.44, 0.2], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
          style={{ background: `radial-gradient(circle, ${color}32, transparent 72%)` }}
        />
        <motion.div
          className="absolute left-1/2 top-[30%] h-[3px] w-32 -translate-x-1/2 rounded-full"
          animate={{ scaleX: [0.6, 1.25, 0.6], opacity: [0.32, 0.85, 0.32] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
        <motion.div
          className="absolute left-1/2 top-[38%] h-[2px] w-20 -translate-x-1/2 rounded-full"
          animate={{ scaleX: [0.8, 1.35, 0.8], opacity: [0.18, 0.64, 0.18] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        className="absolute left-6 top-[22%] h-10 w-10 rounded-full"
        animate={{ y: [0, 16, 0], opacity: [0.24, 0.56, 0.24], scale: [0.9, 1.14, 0.9] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: `radial-gradient(circle, ${color}50, transparent 68%)` }}
      />
      <motion.div
        className="absolute right-6 top-[18%] h-12 w-12 rounded-full"
        animate={{ y: [0, 18, 0], x: [0, -10, 0], opacity: [0.18, 0.44, 0.18], scale: [0.9, 1.16, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: `radial-gradient(circle, ${color}42, transparent 70%)` }}
      />
      <motion.div
        className="absolute bottom-[22%] left-1/2 h-[3px] w-28 -translate-x-1/2 rounded-full"
        animate={{ scaleX: [0.55, 1.2, 0.55], opacity: [0.24, 0.72, 0.24] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </>
  );
}

function wrapIndex(index: number, total: number) {
  return (index + total) % total;
}

function getRelativeOffset(index: number, activeIndex: number, total: number) {
  const forward = wrapIndex(index - activeIndex, total);
  const backward = forward - total;
  return Math.abs(forward) <= Math.abs(backward) ? forward : backward;
}

export default function BoostSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      setSelectedIndex((current) => wrapIndex(current + 1, moments.length));
    }, AUTOPLAY_MS);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const activeMoment = moments[selectedIndex];

  return (
    <section
      id="how-it-works"
      className="relative flex min-h-0 flex-col overflow-hidden sm:h-[92svh] sm:min-h-0"
      style={{
        background:
          'radial-gradient(circle at top right, rgba(255,255,255,0.8), transparent 24%), linear-gradient(165deg, #EDF9FF 0%, #DDF1FF 30%, #C2E4FF 60%, #A5D2F7 85%, #8CC2EC 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-16 right-[8%] h-[22rem] w-[22rem] rounded-full blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.34, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.30), transparent 70%)' }}
        />
        <motion.div
          className="absolute bottom-[-8rem] left-[-4rem] h-[24rem] w-[24rem] rounded-full blur-3xl"
          animate={{ scale: [1.05, 0.92, 1.05], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(255,20,147,0.22), transparent 72%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'linear-gradient(180deg, transparent, white 18%, white 82%, transparent)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 items-start justify-center px-3 py-0 sm:items-center sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="mx-auto grid h-full w-full max-w-[1240px] grid-rows-[auto_1fr_auto] place-items-center gap-5 rounded-[32px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.44),rgba(255,255,255,0.18))] px-4 py-0 shadow-[0_32px_120px_rgba(15,83,154,0.16)] backdrop-blur-[18px] sm:h-[calc(100%-1.25rem)] sm:gap-6 sm:px-6 sm:py-8 lg:h-[calc(100%-1.5rem)] lg:gap-8 lg:px-8 lg:py-10 xl:px-10">
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
                color: '#00B8FF',
                background: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(0,184,255,0.26)',
                boxShadow: '0 12px 32px rgba(0,184,255,0.10)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {boostContent.badge}
            </span>
            <h2 className="mx-auto max-w-[16ch] font-display text-[2rem] font-black uppercase leading-[0.92] tracking-tight sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.3rem] xl:text-[3.75rem]">
              <span
                style={{
                  background: 'linear-gradient(180deg, #0B2E5B 0%, #1E5EA5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {boostContent.heading}{' '}
              </span>
              <span className="hero-line-script" style={{ textTransform: 'none' }}>
                {boostContent.headingAccent}
              </span>
            </h2>
            <p className="mt-4 max-w-xl font-body text-sm font-bold leading-relaxed text-blue-950/72 sm:mt-5 sm:text-base md:text-lg">
              {boostContent.subtitle}
            </p>
          </motion.div>

          <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-4 self-stretch sm:gap-5 lg:gap-6">
            <motion.div
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              <p
                className="font-cursive text-lg font-bold md:text-xl"
                style={{
                  background: 'linear-gradient(135deg, #00D4FF 0%, #0077FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {boostContent.momentsLabel}
              </p>
            </motion.div>

            <div
              className="relative w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => {
                setIsPaused(false);
                setTilt({ rotateX: 0, rotateY: 0 });
              }}
            >
              <div className="absolute left-1/2 top-[48%] h-32 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(17,124,224,0.18),transparent_70%)] blur-3xl" />
              <div className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center gap-5 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
                <motion.div
                  key={activeMoment.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45 }}
                  className="order-1 flex w-full max-w-xl flex-col items-center text-center lg:order-1 lg:items-start lg:text-left"
                >
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/50 px-3 py-1.5 font-label text-[10px] font-extrabold tracking-[0.2em] text-blue-950/65 shadow-[0_12px_28px_rgba(0,119,255,0.08)] sm:text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: activeMoment.color }} />
                    {activeMoment.when}
                  </div>
                  <h3 className="max-w-[11ch] font-display text-[1.7rem] font-black uppercase leading-[0.92] tracking-tight text-blue-950 sm:text-[2.15rem] lg:text-[3.1rem]">
                    {activeMoment.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] font-body text-sm font-semibold leading-relaxed text-blue-950/70 sm:mt-4 sm:text-base md:text-lg">
                    {activeMoment.sub}
                  </p>

                  <div className="mt-5 flex items-center gap-3 sm:mt-6">
                    <button
                      type="button"
                      onClick={() => setSelectedIndex((current) => wrapIndex(current - 1, moments.length))}
                      className="rounded-full border border-white/55 bg-white/55 p-3 text-blue-950 shadow-[0_14px_30px_rgba(0,119,255,0.10)] transition-transform duration-200 hover:scale-105"
                      aria-label="Previous card"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedIndex((current) => wrapIndex(current + 1, moments.length))}
                      className="rounded-full border border-cyan-300/60 bg-[linear-gradient(135deg,#0077FF,#00D4FF)] p-3 text-white shadow-[0_18px_34px_rgba(0,119,255,0.24)] transition-transform duration-200 hover:scale-105"
                      aria-label="Next card"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                    </button>
                    <div className="ml-2 flex items-center gap-2">
                      {moments.map((moment, index) => (
                        <button
                          key={moment.title}
                          type="button"
                          onClick={() => setSelectedIndex(index)}
                          className="transition-transform duration-200 hover:scale-110"
                          aria-label={`Show ${moment.title}`}
                        >
                          <span
                            className="block rounded-full"
                            style={{
                              width: index === selectedIndex ? '34px' : '8px',
                              height: index === selectedIndex ? '10px' : '8px',
                              background: index === selectedIndex ? activeMoment.color : 'rgba(11,46,91,0.18)',
                              boxShadow:
                                index === selectedIndex ? `0 0 0 1px ${activeMoment.color}22, 0 8px 24px ${activeMoment.color}30` : 'none',
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <div className="order-2 w-full lg:order-2">
                  <div className="relative mx-auto h-[19.5rem] w-full max-w-[36rem] [perspective:1800px] sm:h-[22rem] sm:max-w-[38rem] md:h-[25rem] lg:max-w-[40rem]">
                    {moments.map((moment, index) => {
                      const offset = getRelativeOffset(index, selectedIndex, moments.length);
                      const distance = Math.abs(offset);
                      const isActive = offset === 0;
                      const translateX = distance === 0 ? 0 : distance === 1 ? offset * 104 : offset * 128;
                      const rotateY = isActive ? tilt.rotateY : offset * -24;
                      const rotateX = isActive ? tilt.rotateX : distance * 2;
                      const scale = isActive ? 0.96 : distance === 1 ? 0.82 : 0.7;
                      const opacity = isActive ? 1 : distance === 1 ? 0.72 : 0.28;
                      const blur = distance > 1 ? 'blur(4px)' : distance === 1 ? 'blur(1px)' : 'blur(0px)';
                      const y = distance === 0 ? 0 : distance === 1 ? 18 : 34;

                      return (
                        <motion.button
                          key={moment.title}
                          type="button"
                          initial={false}
                          animate={{
                            x: translateX,
                            y,
                            scale,
                            opacity,
                            rotateY,
                            rotateX,
                            z: isActive ? 140 : distance === 1 ? 20 : -80,
                          }}
                          transition={{ type: 'spring', stiffness: 210, damping: 20, mass: 0.82 }}
                          className="absolute left-1/2 top-1/2 h-[17rem] w-[14.5rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[1.8rem] text-center sm:h-[19rem] sm:w-[16.4rem] md:h-[21rem] md:w-[18.4rem] lg:h-[22rem] lg:w-[19.25rem]"
                          style={{
                            zIndex: 20 - distance,
                            transformStyle: 'preserve-3d',
                            filter: blur,
                          }}
                          onClick={() => setSelectedIndex(index)}
                          onMouseMove={(event) => {
                            if (!isActive) return;
                            const rect = event.currentTarget.getBoundingClientRect();
                            const x = (event.clientX - rect.left) / rect.width - 0.5;
                            const yPos = (event.clientY - rect.top) / rect.height - 0.5;
                            setTilt({ rotateX: yPos * -12, rotateY: x * 18 });
                          }}
                        >
                          <div
                            className="absolute inset-0 rounded-[1.8rem]"
                            style={{
                              background: isActive
                                ? 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(242,249,255,0.86))'
                                : 'linear-gradient(160deg, rgba(255,255,255,0.58), rgba(255,255,255,0.34))',
                              border: isActive ? '1px solid rgba(255,255,255,0.78)' : '1px solid rgba(255,255,255,0.4)',
                              boxShadow: isActive
                                ? `0 40px 90px ${moment.color}30, inset 0 1px 0 rgba(255,255,255,0.85)`
                                : `0 18px 40px ${moment.color}12`,
                              backdropFilter: 'blur(24px)',
                            }}
                          />
                          <div
                            className="absolute inset-x-5 top-4 h-16 rounded-full opacity-80 blur-2xl"
                            style={{ background: `radial-gradient(circle, ${moment.color}40, transparent 70%)` }}
                          />
                          {renderThemeAccent(moment.title, moment.color, isActive)}
                          <motion.div
                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl text-xl sm:h-11 sm:w-11 sm:text-2xl"
                            animate={isActive ? { y: [0, -12, 0], rotate: [0, -8, 0, 8, 0], scale: [1, 1.08, 1] } : { y: 0, rotate: 0, scale: 1 }}
                            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                              background: `linear-gradient(135deg, ${moment.color}22, rgba(255,255,255,0.85))`,
                              border: `1px solid ${moment.color}30`,
                              boxShadow: isActive ? `0 16px 28px ${moment.color}24` : 'none',
                            }}
                          >
                            {moment.icon}
                          </motion.div>
                          {isActive && (
                            <>
                              <motion.div
                                className="absolute left-5 top-8 h-3 w-3 rounded-full"
                                animate={{ y: [0, -18, 0], opacity: [0.46, 1, 0.46], scale: [0.9, 1.24, 0.9] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ background: moment.color, boxShadow: `0 0 18px ${moment.color}` }}
                              />
                              <motion.div
                                className="absolute bottom-10 right-8 h-2.5 w-2.5 rounded-full"
                                animate={{ y: [0, 16, 0], x: [0, -10, 0], opacity: [0.36, 0.95, 0.36], scale: [0.86, 1.22, 0.86] }}
                                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ background: '#00D4FF', boxShadow: '0 0 16px rgba(0,212,255,0.8)' }}
                              />
                              <div className="absolute inset-0 overflow-hidden rounded-[1.8rem]">
                                <motion.div
                                  className="absolute left-[-20%] top-0 h-full w-[40%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]"
                                  animate={{ x: ['0%', '330%'] }}
                                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.55, ease: 'easeInOut' }}
                                />
                              </div>
                            </>
                          )}
                          <div className="relative flex h-full flex-col items-center justify-between p-5 sm:p-6 md:p-7">
                            <div className="flex w-full justify-center">
                              <div
                                className="inline-flex rounded-full px-3 py-1.5 font-label text-[10px] font-extrabold tracking-[0.18em] sm:text-xs"
                                style={{
                                  color: moment.color,
                                  background: `${moment.color}14`,
                                  border: `1px solid ${moment.color}28`,
                                }}
                              >
                                {moment.when}
                              </div>
                            </div>
                            <div className="flex flex-col items-center space-y-3 sm:space-y-4" style={{ transform: 'translateZ(40px)' }}>
                              <div
                                className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] text-4xl sm:h-16 sm:w-16 sm:text-5xl"
                                style={{
                                  background: `linear-gradient(135deg, ${moment.color}18, rgba(255,255,255,0.82))`,
                                  border: `1px solid ${moment.color}22`,
                                }}
                              >
                                {moment.icon}
                              </div>
                              <div className="flex flex-col items-center text-center">
                                <h4 className="max-w-[10ch] font-display text-[1.25rem] font-black uppercase leading-[0.92] tracking-tight text-blue-950 sm:text-[1.5rem] md:text-[1.7rem]">
                                  {moment.title}
                                </h4>
                                <p className="mt-2 max-w-[22ch] font-body text-[0.82rem] font-semibold leading-relaxed text-blue-950/68 sm:mt-3 sm:text-[0.92rem]">
                                  {moment.sub}
                                </p>
                              </div>
                            </div>
                            <div className="flex w-full items-end justify-between">
                              <span className="font-cursive text-xl font-bold" style={{ color: moment.color }}>
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className="font-label text-[10px] font-extrabold tracking-[0.22em] text-blue-950/40 sm:text-xs">
                                Click To Focus
                              </span>
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

          <motion.div
            className="flex w-full max-w-4xl items-center justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.a
              href="#refuel"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById('refuel')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative rounded-2xl px-6 py-3 font-label text-xs font-extrabold uppercase tracking-wider sm:rounded-3xl sm:px-7 sm:py-3.5 sm:text-sm md:px-8 md:py-4 md:text-base"
              style={{
                background: 'linear-gradient(135deg, #0077FF 0%, #00B8FF 100%)',
                color: 'white',
                boxShadow: '0 8px 24px rgba(0,119,255,0.25)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(0,119,255,0.35)' }}
              whileTap={{ scale: 0.96 }}
            >
              Explore Refuel
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] rounded-full bg-white"
                initial={{ width: '0%' }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.a>

            <motion.a
              href="#science"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative rounded-2xl px-6 py-3 font-label text-xs font-extrabold uppercase tracking-wider sm:rounded-3xl sm:px-7 sm:py-3.5 sm:text-sm md:px-8 md:py-4 md:text-base"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#0B2E5B',
                border: '1.5px solid rgba(11,46,91,0.2)',
                backdropFilter: 'blur(10px)',
              }}
              whileHover={{
                background: 'rgba(255,255,255,0.25)',
                border: '1.5px solid rgba(11,46,91,0.3)',
                scale: 1.05,
              }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="flex items-center gap-2">The Science</span>
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] rounded-full bg-blue-300/30"
                initial={{ width: '0%' }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
