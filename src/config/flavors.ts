/**
 * STRATA Flavors Configuration
 * 
 * To add a new flavor:
 * 1. Add a new entry to the FLAVORS array below
 * 2. That's it — all components auto-populate from this config
 */

export interface Flavor {
  id: string;
  name: string;
  emoji: string;
  color: string;
  stat: string;         // electrolyte content
  benefit: string;      // one-liner benefit
  badge: string;        // product badge label
  price: number;        // price per pack
  tagline: string;      // short creative tagline
  description: string;  // longer description for detail views
  available: boolean;   // toggle on/off without removing
}

export const FLAVORS: Flavor[] = [
  {
    id: 'citrus-lime',
    name: 'Citrus Lime',
    emoji: '🍋‍🟩',
    color: '#7CCF00',
    stat: '1540 mg',
    benefit: 'Clean, crisp everyday hydration',
    badge: 'Available Now',
    price: 15,
    tagline: 'Sharp. Clean. Refreshing.',
    description: 'Zesty citrus-lime with a clean electrolyte finish. Crisp hydration, no added sugar.',
    available: true,
  },
  {
    id: 'zesty-orange',
    name: 'Zesty Orange',
    emoji: '🍊',
    color: '#FF8C00',
    stat: '1540 mg',
    benefit: 'Vitamin C boost and crisp refreshment',
    badge: 'Coming Soon',
    price: 15,
    tagline: 'Bright. Bold. Revitalizing.',
    description: 'Pure orange zest with a premium electrolyte blend. Maximum vitamin C, no added sugar.',
    available: true,
  },
  {
    id: 'pineapple-punch',
    name: 'Pineapple Punch',
    emoji: '🍍',
    color: '#FFD700',
    stat: '1540 mg',
    benefit: 'Tropical energy with instant refresh',
    badge: 'Coming Soon',
    price: 15,
    tagline: 'Tropical. Punchy. Zero guilt.',
    description: 'Golden pineapple with premium electrolytes. Pure tropical energy without the sugar crash.',
    available: true,
  },
];

/** Only flavors marked available */
export const getActiveFlavors = () => FLAVORS.filter(f => f.available);

/** Brand constants */
export const BRAND = {
  name: 'STRATA',
  tagline: 'Hydrate Properly.',
  subTagline: "You're not tired. You're dehydrated.",
  antiSugar: "Sugar isn't energy. It's drama.",
  science: 'Water is the base. Electrolytes lock it in.',
  positioning: 'Daily hydration that restores baseline performance. No added sugar. No crashes. Just science.',
  stats: {
    electrolytes: '1540 mg',
    sugar: 'No Added',
    calories: '5 kcal',
  },
} as const;
