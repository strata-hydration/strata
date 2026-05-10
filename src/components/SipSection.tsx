'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { sipContent } from '@/config/siteContent';

const { steps, tips } = sipContent;

type Particle = {
  delay: number;
  duration: number;
  x: number;
  y: number;
  size: number;
};

function buildPowderParticles(): Particle[] {
  return Array.from({ length: 16 }, (_, index) => ({
    delay: index * 0.08,
    duration: 2.2 + (index % 3) * 0.3,
    x: ((index % 2 === 0 ? 1 : -1) * (6 + (index % 8))),
    y: 18 + index * 2.4,
    size: 7 + (index % 6),
  }));
}

function buildEnergyParticles(): Particle[] {
  return Array.from({ length: 20 }, (_, index) => ({
    delay: index * 0.06,
    duration: 3.2 + (index % 4) * 0.4,
    x: ((index % 2 === 0 ? 1 : -1) * (12 + (index % 10))),
    y: 8 + index * 1.8,
    size: 5 + (index % 5),
  }));
}

export default function SipSection() {
  const [activeStep, setActiveStep] = useState(0);
  const powderParticles = useMemo(() => buildPowderParticles(), []);
  const energyParticles = useMemo(() => buildEnergyParticles(), []);

  // Auto-progress through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-to-use"
      className="relative flex flex-col items-center overflow-hidden my-6 px-3 pt-6 pb-10 sm:my-8 sm:px-4 sm:pt-8 sm:pb-12 lg:my-10 lg:px-6 lg:pt-10 lg:pb-14"
      style={{
        background:
          'radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 28%), linear-gradient(165deg, #ECFDF5 0%, #D1FAE5 30%, #A7F3D0 60%, #6EE7B7 85%, #6EE7B7 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -right-32 top-[-4rem] h-[28rem] w-[28rem] rounded-full blur-3xl"
          animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent 72%)' }}
        />
        <motion.div
          className="absolute -left-28 bottom-[-6rem] h-[32rem] w-[32rem] rounded-full blur-3xl"
          animate={{ scale: [1.04, 0.88, 1.04], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15), transparent 72%)' }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-col items-center gap-3 rounded-[28px] border border-white/30 bg-white/12 px-4 py-6 shadow-[0_18px_60px_rgba(16,86,156,0.08)] backdrop-blur-[8px] sm:gap-4 sm:px-6 sm:py-7 md:gap-5 md:py-8 lg:gap-6 lg:px-8 lg:py-9">
        {/* HEADER */}
        <div className="w-full flex flex-col items-center justify-center py-1.5 sm:py-2">
          <motion.div
            className="flex w-full max-w-2xl flex-col items-center text-center gap-2 sm:gap-2.5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-label text-[9px] font-extrabold uppercase tracking-widest sm:text-[10px]"
              style={{
                color: '#10B981',
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(16,185,129,0.18)',
                boxShadow: '0 8px 20px rgba(16,185,129,0.08)',
              }}
            >
              <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
              {sipContent.badge}
            </span>
            <h2 className="font-display text-[1.55rem] font-black uppercase leading-[0.9] tracking-tight sm:text-[1.8rem] md:text-[2.15rem] lg:text-[2.5rem]">
              <span
                style={{
                  background: 'linear-gradient(180deg, #0B2E5B 0%, #1E5EA5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {sipContent.heading}{' '}
              </span>
              <span className="hero-line-script" style={{ textTransform: 'none' }}>
                {sipContent.headingAccent}
              </span>
            </h2>
            <p className="max-w-lg font-body text-[11px] font-bold leading-relaxed text-emerald-950/70 sm:text-xs md:text-sm">
              {sipContent.subtitle}
            </p>
          </motion.div>
        </div>

        {/* MAIN ANIMATION SEQUENCE */}
        <div className="w-full flex flex-col items-center justify-center py-1.5 sm:py-2 md:py-2.5">
          <div className="relative mx-auto w-full max-w-xl flex flex-col items-center gap-2.5 sm:gap-3">
            {/* Animation canvas */}
            <div className="relative mx-auto h-40 w-full max-w-[12.25rem] [perspective:1400px] sm:h-48 sm:max-w-[13.5rem] md:h-56 md:max-w-[14.5rem]">
              {activeStep === 0 && (
                <motion.div
                  key="tear-step"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                >
                  <motion.div
                    className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-2xl flex items-center justify-center overflow-hidden"
                    animate={{ rotateZ: [0, 2, -2, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.4 }}
                    style={{
                      background: 'linear-gradient(160deg, rgba(255,255,255,0.92), rgba(240,253,250,0.82))',
                      border: '1.5px solid rgba(255,255,255,0.78)',
                      boxShadow: '0 20px 48px rgba(16,185,129,0.24)',
                    }}
                  >
                    <img
                      src="/pack.png"
                      alt="STRATA Hydration pack"
                      className="h-[88%] w-[88%] object-contain drop-shadow-[0_8px_16px_rgba(16,185,129,0.25)]"
                    />
                    <div className="absolute inset-x-2 top-0 h-4 rounded-b-lg bg-white/35" />
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-6 origin-top"
                      animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8 }}
                      style={{ background: 'rgba(11,46,91,0.6)' }}
                    />
                  </motion.div>
                  <p className="font-body text-[10px] font-bold text-emerald-900/70 text-center max-w-[14ch] sm:text-xs">
                    Rip the sachet
                  </p>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="pour-step"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                >
                  {powderParticles.map((p, i) => (
                    <motion.div
                      key={`powder-${i}`}
                      className="absolute rounded-full"
                      animate={{
                        y: ['-72px', '90px'],
                        x: [0, p.x],
                        opacity: [1, 0.8, 0],
                      }}
                      transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeIn' }}
                      style={{
                        top: '-72px',
                        left: '50%',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: `linear-gradient(135deg, rgba(16,185,129,0.9), rgba(0,212,255,0.7))`,
                        boxShadow: `0 0 10px rgba(16,185,129,0.5)`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                  ))}
                  <motion.div
                    className="relative w-[4.4rem] h-28 sm:w-20 sm:h-32 rounded-2xl"
                    style={{
                      background: 'linear-gradient(160deg, rgba(255,255,255,0.95), rgba(240,253,250,0.88))',
                      border: '2px solid rgba(255,255,255,0.88)',
                      boxShadow: '0 24px 64px rgba(16,185,129,0.2)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div className="absolute inset-2 rounded-xl overflow-hidden">
                      <motion.div
                        className="absolute inset-x-0 bottom-0 w-full"
                        animate={{ height: ['30%', '60%', '30%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          background: 'linear-gradient(180deg, rgba(16,185,129,0.4), rgba(0,212,255,0.3))',
                          boxShadow: 'inset 0 -6px 18px rgba(16,185,129,0.18)',
                        }}
                      />
                    </div>
                    <motion.div
                      className="absolute left-[-20%] top-0 h-full w-[40%] rotate-[20deg]"
                      animate={{ x: ['0%', '420%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                    />
                  </motion.div>
                  <p className="font-body text-[10px] font-bold text-emerald-900/70 text-center max-w-[14ch] sm:text-xs">
                    Pour into water
                  </p>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="sip-step"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                >
                  <motion.div
                    className="relative w-[4.4rem] h-28 sm:w-20 sm:h-32 rounded-2xl"
                    animate={{ rotateZ: [-6, -6, 0], rotateX: [0, 3, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
                    style={{
                      background: 'linear-gradient(160deg, rgba(255,255,255,0.95), rgba(240,253,250,0.88))',
                      border: '2px solid rgba(255,255,255,0.88)',
                      boxShadow: '0 24px 64px rgba(16,185,129,0.2)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div className="absolute inset-2 rounded-xl overflow-hidden">
                      <motion.div
                        className="absolute inset-x-0 bottom-0 w-full"
                        animate={{ height: ['60%', '25%', '60%'] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          background: 'linear-gradient(180deg, rgba(16,185,129,0.5), rgba(0,212,255,0.4))',
                          boxShadow: 'inset 0 -6px 18px rgba(16,185,129,0.2)',
                        }}
                      />
                    </div>
                    <motion.div
                      className="absolute left-[-20%] top-0 h-full w-[40%] rotate-[20deg]"
                      animate={{ x: ['0%', '420%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
                  >
                    👄
                  </motion.div>
                  <p className="font-body text-[10px] font-bold text-emerald-900/70 text-center max-w-[14ch] sm:text-xs">
                    Sip & absorb
                  </p>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  key="energy-step"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                    {[0, 1, 2].map((ring) => (
                      <motion.div
                        key={`ring-${ring}`}
                        className="absolute rounded-full"
                        animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          delay: ring * 0.35,
                          ease: 'easeOut',
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: `2px solid rgba(16,185,129,0.6)`,
                          boxShadow: `0 0 24px rgba(16,185,129,0.4)`,
                        }}
                      />
                    ))}
                    {energyParticles.slice(0, 12).map((p, i) => (
                      <motion.div
                        key={`energy-${i}`}
                        className="absolute rounded-full"
                        animate={{
                          x: [0, Math.cos((i / 12) * Math.PI * 2) * 64, Math.cos((i / 12) * Math.PI * 2) * 96],
                          y: [0, Math.sin((i / 12) * Math.PI * 2) * 64, Math.sin((i / 12) * Math.PI * 2) * 96],
                          opacity: [1, 0.6, 0],
                          scale: [1, 0.8, 0.4],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          repeatDelay: 0.8,
                          ease: 'easeOut',
                        }}
                        style={{
                          width: `${4 + (i % 4)}px`,
                          height: `${4 + (i % 4)}px`,
                          background: `linear-gradient(135deg, rgba(16,185,129,0.9), rgba(0,212,255,0.7))`,
                          boxShadow: `0 0 10px rgba(16,185,129,0.6)`,
                        }}
                      />
                    ))}
                    <motion.div
                      className="absolute text-3xl sm:text-4xl"
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      ⚡
                    </motion.div>
                  </div>
                  <p className="font-body text-[10px] font-bold text-emerald-900/70 text-center max-w-[14ch] sm:text-xs">
                    Feel the shift
                  </p>
                </motion.div>
              )}
            </div>

            {/* Step buttons */}
            <motion.div
              className="w-full flex flex-col items-center gap-1.5 sm:gap-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl">
                {steps.map((step, index) => (
                  <motion.button
                    key={step.num}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className="group relative flex flex-col items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl cursor-pointer"
                    animate={{
                      scale: activeStep === index ? 1.08 : 1,
                      y: activeStep === index ? -4 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                    style={{
                      background:
                        activeStep === index
                          ? `linear-gradient(135deg, ${step.color}, ${step.color}dd)`
                          : `rgba(255,255,255,0.5)`,
                      border: `1.5px solid ${activeStep === index ? `${step.color}70` : `${step.color}25`}`,
                      boxShadow:
                        activeStep === index
                          ? `0 16px 40px ${step.color}28`
                          : `0 6px 16px ${step.color}10`,
                    }}
                    whileHover={{
                      scale: activeStep === index ? 1.08 : 1.05,
                      y: activeStep === index ? -4 : -1,
                    }}
                  >
                    <span className="text-base sm:text-lg">
                      {step.icon}
                    </span>
                    <span
                      className="font-display text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-none"
                      style={{ color: activeStep === index ? '#FFF' : step.color }}
                    >
                      {step.title.split(' ')[0]}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Step description */}
              <motion.div
                key={`desc-${activeStep}`}
                className="w-full max-w-[18.5rem] rounded-2xl border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0.35))] px-3 py-2 sm:max-w-[20rem] sm:px-3.5 sm:py-2.5 text-center shadow-[0_10px_24px_rgba(16,185,129,0.12)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label text-[8px] font-black tracking-widest mb-1"
                  style={{
                    color: steps[activeStep].color,
                    background: `${steps[activeStep].color}15`,
                    border: `1px solid ${steps[activeStep].color}28`,
                  }}
                >
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ background: steps[activeStep].color }}
                  />
                  Step {steps[activeStep].num}
                </span>
                <h3 className="font-display text-[13px] font-black uppercase tracking-tight text-emerald-950 sm:text-sm">
                  {steps[activeStep].title}
                </h3>
                <p className="mt-1 font-body text-[9px] font-semibold leading-snug text-emerald-900/72 sm:text-[10px]">
                  {steps[activeStep].desc}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* PRO TIPS */}
        <div className="w-full flex flex-col items-center justify-center py-1.5 sm:py-2 md:py-2.5">
          <motion.div
            className="w-full max-w-3xl flex flex-col items-center gap-2 sm:gap-2.5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <span
              className="font-display text-[10px] sm:text-xs font-black uppercase tracking-widest"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {sipContent.tipsLabel}
            </span>
            <div className="mx-auto grid w-full max-w-[980px] grid-cols-2 place-items-center gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-5">
              {tips.map((t, i) => (
                <motion.div
                  key={t.tip}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * i, duration: 0.35 }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  className="flex min-h-[2.5rem] w-full max-w-[11.5rem] items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-center sm:min-h-[2.8rem] sm:rounded-2xl sm:px-2.5 sm:py-2 cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: `0 6px 20px ${t.color}12, inset 0 0 0 1px rgba(255,255,255,0.5)`,
                  }}
                >
                  <span className="text-xs sm:text-sm flex-shrink-0">{t.icon}</span>
                  <span className="font-display text-[8px] sm:text-[9px] font-black uppercase tracking-[0.08em] text-emerald-950 leading-tight">
                    {t.tip}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* BOTTOM CTA REMOVED */}
      </div>
    </section>
  );
}
