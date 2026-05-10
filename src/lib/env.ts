// Runtime env validation — import on server side only
function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  // Razorpay
  razorpayKeyId: () => required('RAZORPAY_KEY_ID'),
  razorpayKeySecret: () => required('RAZORPAY_KEY_SECRET'),
  razorpayWebhookSecret: () => required('RAZORPAY_WEBHOOK_SECRET'),

  // Auth
  jwtSecret: () => required('JWT_SECRET'),

  // Email
  gmailUser: () => optional('GMAIL_USER', ''),
  gmailPassword: () => optional('GMAIL_APP_PASSWORD', ''),

  // App
  baseUrl: () => optional('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),
  nodeEnv: () => optional('NODE_ENV', 'development'),
} as const;

// Public (safe to expose to client)
export const publicEnv = {
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '',
} as const;
