import { z } from 'zod';

// ── Address ──
export const addressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile required'),
  line1: z.string().min(3).max(200),
  line2: z.string().max(200).optional().default(''),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit pincode required'),
  country: z.string().default('IN'),
});

// ── Checkout ──
export const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
  })).min(1).max(20),
  shippingAddress: addressSchema,
  email: z.string().email().max(254),
  customerId: z.string().uuid().optional(),
});

// ── Auth ──
export const signupSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(100),
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

export const requestSignupOtpSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(100),
});

export const verifySignupOtpSchema = z.object({
  email: z.string().email().max(254),
  otp: z.string().regex(/^\d{6}$/),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email().max(254),
});

export const forgotPasswordVerifySchema = z.object({
  email: z.string().email().max(254),
  otp: z.string().regex(/^\d{6}$/),
  newPassword: z.string().min(8).max(128),
});

// ── Razorpay verification ──
export const razorpayVerifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// ── Contact (existing) ──
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  message: z.string().min(1).max(2000),
});
