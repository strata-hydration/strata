// ═══ Commerce Domain Types ═══

export interface Product {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  color: string;
  price: number;          // in paise (INR smallest unit)
  comparePrice: number;   // MRP / strikethrough price in paise
  stock: number;
  categoryTag: string;
  stat: string;
  benefit: string;
  badge: string;
  tagline: string;
  description: string;
  imageUrl: string;
  available: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  emoji: string;
  color: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type OrderStatus =
  | 'pending'
  | 'payment_initiated'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  customerId: string | null;
  guestEmail: string | null;
  totalPaise: number;
  shippingPaise: number;
  status: OrderStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  pricePaise: number;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  eventId: string;
  eventType: string;
  payload: string;
  processedAt: string | null;
  createdAt: string;
}

// ── API request/response shapes ──

export interface ApiError {
  error: string;
  details?: Record<string, string>;
}

export interface ApiSuccess<T> {
  data: T;
}

export interface CheckoutRequest {
  items: { productId: string; quantity: number }[];
  shippingAddress: Address;
  email: string;
  customerId?: string;
}

export interface RazorpayVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ── Shipping ──

export const SHIPPING_FLAT_RATE_PAISE = 4900; // ₹49
export const FREE_SHIPPING_THRESHOLD_PAISE = 49900; // Free above ₹499
