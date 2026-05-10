'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { scienceContent } from '@/config/siteContent';

const { molecules } = scienceContent;

type Particle = {
  top: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
  x: number;
  y: number;
};

function buildParticles(seed: number): Particle[] {
  return Array.from({ length: 6 }, (_, index) => ({
    top: `${18 + ((seed * 19 + index * 11) % 58)}%`,
    left: `${12 + ((seed * 23 + index * 13) % 72)}%`,
    size: 8 + ((seed + index * 3) % 8),
    delay: index * 0.18,
    duration: 2.8 + ((seed + index) % 4) * 0.45,
    x: ((index % 2 === 0 ? 1 : -1) * (10 + (seed % 5) + index * 2)),
    y: 10 + index * 3,
  }));
}

function renderThemeOrbit(symbol: string, color: string) {
  if (symbol === 'Na') {
    return (
      <>
        <motion.div
          className="absolute inset-8 rounded-full border"
          animate={{ rotate: 360, scale: [0.96, 1.03, 0.96] }}
          transition={{ rotate: { duration: 14, repeat: Infinity, ease: 'linear' }, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          style={{ borderColor: `${color}40`, boxShadow: `0 0 28px ${color}22` }}
        />
        <motion.div
          className="absolute inset-14 rounded-full border border-dashed"
          animate={{ rotate: -360 }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
          style={{ borderColor: `${color}35` }}
        />
      </>
    );
  }

  if (symbol === 'K') {
    return (
      <>
        <motion.div
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ scale: [0.88, 1.12, 0.88], opacity: [0.18, 0.34, 0.18] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `radial-gradient(circle, ${color}30, transparent 68%)` }}
        />
        <motion.div
          className="absolute left-[16%] top-1/2 h-[3px] w-24 -translate-y-1/2 rounded-full"
          animate={{ x: [0, 34, 0], scaleX: [0.75, 1.24, 0.75], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
        <motion.div
          className="absolute right-[16%] top-1/2 h-[3px] w-24 -translate-y-1/2 rounded-full"
          animate={{ x: [0, -34, 0], scaleX: [0.75, 1.24, 0.75], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        className="absolute inset-10 rounded-full border"
        animate={{ scale: [1, 1.08, 1], opacity: [0.22, 0.42, 0.22] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ borderColor: `${color}38`, boxShadow: `0 0 34px ${color}18 inset` }}
      />
      <motion.div
        className="absolute left-1/2 top-[20%] h-16 w-28 -translate-x-1/2 rounded-[999px]"
        animate={{ y: [0, -14, 0], opacity: [0.16, 0.44, 0.16], scaleX: [0.82, 1.14, 0.82] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)`, filter: 'blur(8px)' }}
      />
      <motion.div
        className="absolute left-1/2 bottom-[20%] h-[3px] w-24 -translate-x-1/2 rounded-full"
        animate={{ scaleX: [0.7, 1.26, 0.7], opacity: [0.18, 0.72, 0.18] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </>
  );
}

export default function ScienceSection() {
  const [activeMolecule, setActiveMolecule] = useState(0);

  const active = molecules[activeMolecule];
  const particles = useMemo(() => buildParticles(activeMolecule + 1), [activeMolecule]);

  return (
    <section
      id="benefits"
      className="relative flex min-h-0 flex-col overflow-hidden sm:h-[92svh] sm:min-h-0"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(255,255,255,0.72), transparent 22%), linear-gradient(165deg, #FFF5F7 0%, #FFEEF4 30%, #FFE4EC 60%, #FFD9E4 85%, #FFD0DC 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -left-24 top-[-6rem] h-[24rem] w-[24rem] rounded-full blur-3xl"
          animate={{ scale: [1, 1.14, 1], opacity: [0.16, 0.28, 0.16] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(255,20,147,0.18), transparent 72%)' }}
        />
        <motion.div
          className="absolute -right-20 bottom-[-8rem] h-[26rem] w-[26rem] rounded-full blur-3xl"
          animate={{ scale: [1.04, 0.92, 1.04], opacity: [0.14, 0.26, 0.14] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.16), transparent 72%)' }}
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

      <div className="relative z-10 flex flex-1 items-start justify-center px-3 py-0 sm:items-center sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="mx-auto grid h-full w-full max-w-[1240px] grid-rows-[auto_1fr_auto] place-items-center gap-5 rounded-[32px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0.18))] px-4 py-0 shadow-[0_32px_120px_rgba(147,31,86,0.12)] backdrop-blur-[18px] sm:h-[calc(100%-1.25rem)] sm:gap-6 sm:px-6 sm:py-8 lg:h-[calc(100%-1.5rem)] lg:gap-8 lg:px-8 lg:py-10 xl:px-10">
          <motion.div
            className="flex w-full max-w-4xl flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span
              className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-label text-[10px] font-extrabold uppercase tracking-widest sm:mb-4 sm:text-xs"
              style={{
                color: '#FF1493',
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,20,147,0.18)',
                boxShadow: '0 12px 32px rgba(255,20,147,0.10)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse" />
              {scienceContent.badge}
            </span>
            <h2 className="mx-auto max-w-[16ch] font-display text-[2rem] font-black uppercase leading-[0.92] tracking-tight sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.3rem] xl:text-[3.75rem]">
              <span
                style={{
                  background: 'linear-gradient(180deg, #0B2E5B 0%, #1E5EA5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {scienceContent.heading}{' '}
              </span>
              <span className="hero-line-script" style={{ textTransform: 'none' }}>
                {scienceContent.headingAccent}
              </span>
            </h2>
            <p className="mt-4 max-w-xl font-body text-sm font-bold leading-relaxed text-blue-950/72 sm:mt-5 sm:text-base md:text-lg">
              {scienceContent.subtitle}
            </p>
          </motion.div>

          <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-4 self-stretch sm:gap-5 lg:gap-6">
            <div className="relative w-full">
              <div className="absolute left-1/2 top-[46%] h-32 w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,85,145,0.16),transparent_70%)] blur-3xl" />
              <div className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center gap-5 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
                <motion.div
                  key={active.symbol}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45 }}
                  className="order-1 flex w-full max-w-xl flex-col items-center text-center"
                >
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/55 px-3 py-1.5 font-label text-[10px] font-extrabold tracking-[0.2em] text-blue-950/65 shadow-[0_12px_28px_rgba(255,20,147,0.08)] sm:text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: active.color }} />
                    {active.tagline}
                  </div>
                  <h3 className="max-w-[11ch] font-display text-[1.8rem] font-black uppercase leading-[0.92] tracking-tight text-blue-950 sm:text-[2.2rem] lg:text-[3rem]">
                    {active.name}
                  </h3>
                  <p className="mt-3 max-w-[34ch] font-body text-sm font-semibold leading-relaxed text-blue-950/70 sm:mt-4 sm:text-base md:text-lg">
                    {active.benefits[0]}. {active.benefits[1]}. {active.benefits[2]}.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-6">
                    {molecules.map((molecule, index) => (
                      <motion.button
                        key={molecule.symbol}
                        type="button"
                        onClick={() => setActiveMolecule(index)}
                        className="rounded-full px-5 py-2.5 font-display text-xs font-black uppercase tracking-[0.12em] whitespace-nowrap sm:px-6 sm:text-sm"
                        style={{
                          color: activeMolecule === index ? 'white' : molecule.color,
                          background:
                            activeMolecule === index
                              ? `linear-gradient(135deg, ${molecule.color}, ${molecule.color}cc)`
                              : 'rgba(255,255,255,0.52)',
                          border: `1px solid ${activeMolecule === index ? `${molecule.color}55` : `${molecule.color}22`}`,
                          boxShadow: activeMolecule === index ? `0 16px 36px ${molecule.color}28` : '0 10px 24px rgba(12,53,104,0.06)',
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base sm:text-lg">{molecule.symbol}</span>
                          <span>{molecule.name}</span>
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <div className="order-2 w-full">
                  <div className="relative mx-auto h-[20rem] w-full max-w-[36rem] [perspective:1800px] sm:h-[23rem] sm:max-w-[38rem] md:h-[26rem] lg:max-w-[40rem]">
                    <motion.div
                      key={active.symbol}
                      initial={{ opacity: 0, scale: 0.95, rotateY: -8 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                      className="absolute left-1/2 top-1/2 h-[18rem] w-[15.5rem] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] sm:h-[20rem] sm:w-[17.5rem] md:h-[22rem] md:w-[19.5rem] lg:h-[23rem] lg:w-[20.5rem]"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div
                        className="absolute inset-0 rounded-[2rem]"
                        style={{
                          background: 'linear-gradient(160deg, rgba(255,255,255,0.97), rgba(247,244,250,0.86))',
                          border: '1px solid rgba(255,255,255,0.82)',
                          boxShadow: `0 42px 100px ${active.color}28, inset 0 1px 0 rgba(255,255,255,0.9)`,
                          backdropFilter: 'blur(24px)',
                        }}
                      />
                      <div
                        className="absolute inset-x-6 top-5 h-20 rounded-full opacity-85 blur-2xl"
                        style={{ background: `radial-gradient(circle, ${active.color}44, transparent 72%)` }}
                      />
                      {renderThemeOrbit(active.symbol, active.color)}
                      {particles.map((particle, index) => (
                        <motion.div
                          key={`${active.symbol}-${index}`}
                          className="absolute rounded-full"
                          animate={{ y: [0, -particle.y, 0], x: [0, particle.x, 0], opacity: [0.16, 0.8, 0.16], scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut', delay: particle.delay }}
                          style={{
                            top: particle.top,
                            left: particle.left,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            background: active.color,
                            boxShadow: `0 0 18px ${active.color}`,
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-display font-black sm:h-14 sm:w-14 sm:text-2xl"
                        animate={{ y: [0, -10, 0], rotate: [0, -6, 0, 6, 0], scale: [1, 1.08, 1] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          background: `linear-gradient(135deg, ${active.color}24, rgba(255,255,255,0.88))`,
                          border: `1px solid ${active.color}30`,
                          color: active.color,
                          boxShadow: `0 18px 30px ${active.color}20`,
                        }}
                      >
                        {active.symbol}
                      </motion.div>
                      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                        <motion.div
                          className="absolute left-[-24%] top-0 h-full w-[42%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
                          animate={{ x: ['0%', '335%'] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
                        />
                      </div>
                      <div className="relative flex h-full flex-col items-center justify-between p-6 text-center sm:p-7 md:p-8">
                        <div className="flex w-full justify-center">
                          <div
                            className="inline-flex rounded-full px-3 py-1.5 font-label text-[10px] font-extrabold tracking-[0.18em] sm:text-xs"
                            style={{ color: active.color, background: `${active.color}14`, border: `1px solid ${active.color}28` }}
                          >
                            {active.tagline}
                          </div>
                        </div>
                        <div className="flex flex-col items-center space-y-4" style={{ transform: 'translateZ(40px)' }}>
                          <div
                            className="flex h-16 w-16 items-center justify-center rounded-[1.45rem] text-4xl font-display font-black sm:h-20 sm:w-20 sm:text-5xl"
                            style={{
                              background: `linear-gradient(135deg, ${active.color}18, rgba(255,255,255,0.84))`,
                              border: `1px solid ${active.color}24`,
                              color: active.color,
                            }}
                          >
                            {active.symbol}
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <h4 className="max-w-[10ch] font-display text-[1.35rem] font-black uppercase leading-[0.92] tracking-tight text-blue-950 sm:text-[1.6rem] md:text-[1.85rem]">
                              {active.name}
                            </h4>
                            <p className="mt-2 max-w-[21ch] font-body text-[0.84rem] font-semibold leading-relaxed text-blue-950/68 sm:mt-3 sm:text-[0.95rem]">
                              {active.tagline}
                            </p>
                          </div>
                        </div>
                        <div className="grid w-full gap-2.5 text-center">
                          {active.benefits.map((benefit) => (
                            <div
                              key={benefit}
                              className="rounded-2xl px-3 py-2.5 font-body text-[0.74rem] font-semibold leading-relaxed text-blue-950/70 sm:text-[0.82rem]"
                              style={{ background: 'rgba(255,255,255,0.48)', border: `1px solid ${active.color}16` }}
                            >
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
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
