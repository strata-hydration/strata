'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';

const thoughts = [
  { text: 'bestie your body is literally 60% water, hydrate or cry about it 💧', speak: 'bestie your body is literally sixty percent water, hydrate or cry about it' },
  { text: 'sugar drinks are giving delulu energy, STRATA is giving real science 🧪', speak: 'sugar drinks are giving delulu energy, STRATA is giving real science' },
  { text: 'not me losing 25% focus cuz I forgot to drink water again 😵‍💫', speak: 'not me losing twenty five percent focus cuz I forgot to drink water again' },
  { text: 'no added sugar, zero cap, just electrolytes doing their thing ⚡', speak: 'no added sugar, zero cap, just electrolytes doing their thing' },
  { text: 'your brain is 75% water, no wonder you can\'t think straight rn 🧠', speak: 'your brain is seventy five percent water, no wonder you can\'t think straight right now' },
  { text: 'sodium + potassium + magnesium = the holy trinity of hydration 🧬', speak: 'sodium plus potassium plus magnesium equals the holy trinity of hydration' },
  { text: 'energy drinks are so last gen, we doing electrolytes now 💪', speak: 'energy drinks are so last gen, we doing electrolytes now' },
  { text: 'skin looking rough? that\'s dehydration tea sis, not skincare ✨', speak: 'skin looking rough? that\'s dehydration tea sis, not skincare' },
  { text: 'STRATA hydrates 3x better than plain water, that\'s not opinion that\'s math 📐', speak: 'STRATA hydrates three times better than plain water, that\'s not opinion that\'s math' },
  { text: 'dehydration out here wrecking your mood, gains AND glow-up 😤', speak: 'dehydration out here wrecking your mood, gains AND glow up' },
  { text: 'vegan, gluten-free, no added sugar — clean formula only no cap 🍃', speak: 'vegan, gluten free, no added sugar, clean formula only no cap' },
  { text: 'sipping STRATA at the gym is giving main character energy 🏆', speak: 'sipping STRATA at the gym is giving main character energy' },
  { text: 'fun fact: muscles literally can\'t fire without electrolytes 🔥', speak: 'fun fact, muscles literally can\'t fire without electrolytes' },
  { text: 'if you\'re thirsty you\'re already 2% dehydrated, that\'s an L 🚰', speak: 'if you\'re thirsty you\'re already two percent dehydrated, that\'s an L' },
  { text: 'sugar crashes are giving flop era, electrolytes are giving slay era 🔬', speak: 'sugar crashes are giving flop era, electrolytes are giving slay era' },
  { text: 'hydration is the og performance hack, everything else is marketing 🎯', speak: 'hydration is the oh gee performance hack, everything else is marketing' },
  { text: 'STRATA said clean ingredients or nothing, we don\'t do artificial 🌱', speak: 'STRATA said clean ingredients or nothing, we don\'t do artificial' },
  { text: 'coffee girlies hear me out — electrolytes hit different before noon ☀️', speak: 'coffee girlies hear me out, electrolytes hit different before noon' },
  { text: 'your kidneys are working overtime rn and you won\'t even hydrate? 💀', speak: 'your kidneys are working overtime right now and you won\'t even hydrate?' },
  { text: 'low-key dehydration is why your headache won\'t go away 🤕', speak: 'lowkey dehydration is why your headache won\'t go away' },
  { text: 'STRATA = that girl energy but make it hydration 💅', speak: 'STRATA equals that girl energy but make it hydration' },
  { text: 'imagine performing at 100% — that\'s hydrated you, unhinged 🚀', speak: 'imagine performing at a hundred percent, that\'s hydrated you, unhinged' },
  { text: 'electrolytes literally regulate your heartbeat, kinda important ngl 💓', speak: 'electrolytes literally regulate your heartbeat, kinda important not gonna lie' },
  { text: 'drop the sugary mid drinks and level up fr fr 📈', speak: 'drop the sugary mid drinks and level up for real for real' },
  { text: 'STRATA is giving hydration meets hustle meets science era 🧊', speak: 'STRATA is giving hydration meets hustle meets science era' },
];

export default function Mascot() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const [blink, setBlink] = useState(false);
  const [currentThought, setCurrentThought] = useState<typeof thoughts[0] | null>(null);
  const lastIndex = useRef(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback(() => {
    // Pick a random thought different from last one
    let idx: number;
    do {
      idx = Math.floor(Math.random() * thoughts.length);
    } while (idx === lastIndex.current && thoughts.length > 1);
    lastIndex.current = idx;

    const thought = thoughts[idx];
    setCurrentThought(thought);

    // Speak it with alternating male/female energetic voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(thought.speak);
      
      const voices = window.speechSynthesis.getVoices();
      const enVoices = voices.filter(v => /en/i.test(v.lang));
      const femaleVoices = enVoices.filter(v => /zira|aria|jenny|hazel|sonia|samantha|karen|fiona|female/i.test(v.name));
      const maleVoices = enVoices.filter(v => /david|mark|guy|daniel|james|george|male/i.test(v.name));
      
      // Alternate between male and female based on index
      const useFemale = idx % 2 === 0;
      const pool = useFemale ? femaleVoices : maleVoices;
      const fallback = useFemale ? maleVoices : femaleVoices;
      const picked = pool.length > 0
        ? pool[Math.floor(Math.random() * pool.length)]
        : fallback.length > 0
          ? fallback[Math.floor(Math.random() * fallback.length)]
          : enVoices[Math.floor(Math.random() * enVoices.length)] || null;
      if (picked) utterance.voice = picked;
      
      utterance.rate = 0.9 + Math.random() * 0.1;
      utterance.pitch = useFemale ? 1.3 + Math.random() * 0.2 : 0.9 + Math.random() * 0.2;
      utterance.volume = 1;
      utterance.onend = () => setCurrentThought(null);
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback if no speech synthesis
      setTimeout(() => setCurrentThought(null), 5000);
    }
  }, []);

  return (
    <motion.div
      style={{ y }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-30"
    >
      {/* ── Speech bubble ── */}
      <AnimatePresence>
        {currentThought && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="absolute bottom-full right-0 mb-3 w-[280px] sm:w-[320px] px-6 py-5 rounded-2xl pointer-events-none flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f0f8ff 100%)',
              boxShadow: '0 8px 32px rgba(0,100,255,0.15), 0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 1.5px rgba(0,180,255,0.15)',
            }}
          >
            <p className="font-body text-[11px] sm:text-xs font-semibold text-blue-950 leading-relaxed text-center break-words whitespace-normal"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {currentThought.text}
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 rotate-45 rounded-sm"
              style={{ background: '#f5fbff', boxShadow: '2px 2px 4px rgba(0,100,255,0.08)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        onClick={handleClick}
        className="cursor-pointer pointer-events-auto scale-[0.6] sm:scale-75 lg:scale-100 origin-bottom-right"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="100" height="150" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">

          {/* ── Water-drop body ── */}
          <path
            d="M50 8C50 8 18 50 18 72C18 90 32 104 50 104C68 104 82 90 82 72C82 50 50 8 50 8Z"
            fill="url(#waterBody)"
            stroke="rgba(0,180,255,0.5)"
            strokeWidth="1.2"
          />
          {/* Body highlight */}
          <ellipse cx="38" cy="58" rx="10" ry="16" fill="rgba(255,255,255,0.15)" />

          {/* ── Sunglasses ── */}
          {/* Frame */}
          <path d="M22 64 Q50 60 78 64" stroke="#1a1a2e" strokeWidth="2.5" fill="none" />
          {/* Left lens */}
          <path d="M24 64 C24 58 34 56 40 58 C46 60 46 72 40 74 C34 76 24 72 24 64Z"
            fill="#1a1a2e" stroke="#111" strokeWidth="1.5" />
          <path d="M26 64 C26 60 34 58 39 60 C44 62 44 70 39 72 C34 74 26 70 26 64Z"
            fill="rgba(20,20,40,0.85)" />
          {/* Right lens */}
          <path d="M60 58 C66 56 76 58 76 64 C76 72 66 76 60 74 C54 72 54 60 60 58Z"
            fill="#1a1a2e" stroke="#111" strokeWidth="1.5" />
          <path d="M61 60 C66 58 74 60 74 64 C74 70 66 74 61 72 C56 70 56 62 61 60Z"
            fill="rgba(20,20,40,0.85)" />
          {/* Bridge */}
          <path d="M40 66 Q50 62 60 66" stroke="#1a1a2e" strokeWidth="2.5" fill="none" />
          {/* Lens glare */}
          <ellipse cx="32" cy="63" rx="4" ry="2" fill="rgba(255,255,255,0.15)" />
          <ellipse cx="66" cy="63" rx="4" ry="2" fill="rgba(255,255,255,0.15)" />

          {/* Smile */}
          <path d="M42 80 Q50 88 58 80" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Cheek blush */}
          <ellipse cx="28" cy="78" rx="4" ry="2.5" fill="rgba(255,140,200,0.25)" />
          <ellipse cx="72" cy="78" rx="4" ry="2.5" fill="rgba(255,140,200,0.25)" />

          {/* ── Left arm + hand ── */}
          <path d="M18 78 C10 82 6 88 8 92" stroke="url(#waterBody)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="8" cy="92" r="4" fill="url(#waterBody)" stroke="rgba(0,180,255,0.5)" strokeWidth="0.8" />
          <path d="M5 89 L3 87" stroke="url(#waterBody)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M6 91 L3 90" stroke="url(#waterBody)" strokeWidth="2.5" strokeLinecap="round" />

          {/* ── Right arm + hand (waving) ── */}
          <motion.g
            animate={{ rotate: [0, 15, 0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '82px 78px' }}
          >
            <path d="M82 78 C90 74 94 68 92 64" stroke="url(#waterBody)" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="92" cy="64" r="4" fill="url(#waterBody)" stroke="rgba(0,180,255,0.5)" strokeWidth="0.8" />
            <path d="M95 61 L97 59" stroke="url(#waterBody)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M94 63 L97 62" stroke="url(#waterBody)" strokeWidth="2.5" strokeLinecap="round" />
          </motion.g>

          {/* ── Left leg ── */}
          <path d="M38 102 L32 120" stroke="url(#waterBody)" strokeWidth="5.5" strokeLinecap="round" />

          {/* ── Right leg ── */}
          <path d="M62 102 L68 120" stroke="url(#waterBody)" strokeWidth="5.5" strokeLinecap="round" />

          {/* ── Left sporting boot ── */}
          <path d="M32 118 L32 126 C32 130 24 132 20 130 C18 129 18 126 22 125 L30 124 L30 118Z"
            fill="#1a1a2e" stroke="#2a2a4e" strokeWidth="0.8" />
          <path d="M20 130 C24 132 32 130 32 128" stroke="#FF4500" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="120" x2="33" y2="121" stroke="white" strokeWidth="0.8" />
          <line x1="30" y1="122" x2="33" y2="123" stroke="white" strokeWidth="0.8" />
          <path d="M24 127 Q27 125 31 126" stroke="#FF4500" strokeWidth="1" fill="none" />

          {/* ── Right sporting boot ── */}
          <path d="M68 118 L68 126 C68 130 76 132 80 130 C82 129 82 126 78 125 L70 124 L70 118Z"
            fill="#1a1a2e" stroke="#2a2a4e" strokeWidth="0.8" />
          <path d="M80 130 C76 132 68 130 68 128" stroke="#FF4500" strokeWidth="2" strokeLinecap="round" />
          <line x1="70" y1="120" x2="67" y2="121" stroke="white" strokeWidth="0.8" />
          <line x1="70" y1="122" x2="67" y2="123" stroke="white" strokeWidth="0.8" />
          <path d="M76 127 Q73 125 69 126" stroke="#FF4500" strokeWidth="1" fill="none" />

          <defs>
            <linearGradient id="waterBody" x1="50" y1="8" x2="50" y2="104" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="40%" stopColor="#38BEFF" />
              <stop offset="75%" stopColor="#0099DD" />
              <stop offset="100%" stopColor="#0077CC" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
}
