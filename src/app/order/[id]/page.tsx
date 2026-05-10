'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatINR, shortOrderId } from '@/lib/utils';

interface OrderData {
  id: string;
  status: string;
  totalPaise: number;
  shippingPaise: number;
  guestEmail: string | null;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  items: { id: string; productName: string; quantity: number; pricePaise: number }[];
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  paid: { label: 'Payment Confirmed', color: '#22c55e', icon: '✓' },
  processing: { label: 'Processing', color: '#3b82f6', icon: '⚙' },
  shipped: { label: 'Shipped', color: '#8b5cf6', icon: '🚚' },
  delivered: { label: 'Delivered', color: '#22c55e', icon: '📦' },
  cancelled: { label: 'Cancelled', color: '#ef4444', icon: '✕' },
  refunded: { label: 'Refunded', color: '#f59e0b', icon: '↩' },
  pending: { label: 'Pending', color: '#94a3b8', icon: '⏳' },
  payment_initiated: { label: 'Awaiting Payment', color: '#f59e0b', icon: '⏳' },
};

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error) setError(res.error);
        else setOrder(res.data);
      })
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <span className="text-5xl mb-4">😞</span>
        <h1 className="font-display text-xl font-bold text-slate-800 mb-2">Order not found</h1>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <Link href="/products" className="text-sm text-blue-500 hover:underline">Continue shopping →</Link>
      </section>
    );
  }

  const status = statusConfig[order.status] ?? statusConfig.pending;
  const isPaid = ['paid', 'processing', 'shipped', 'delivered'].includes(order.status);

  return (
    <section className="min-h-screen px-4 pt-10 pb-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
      <div className="mx-auto max-w-3xl">
        {/* Success header */}
        {isPaid && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="flex flex-col items-center text-center mb-8"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4"
              style={{ background: `${status.color}15`, color: status.color }}>
              {status.icon}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-800">
              Thank you! 🎉
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Your order has been confirmed. We&apos;ll send updates to {order.guestEmail}.
            </p>
          </motion.div>
        )}

        {!isPaid && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4"
              style={{ background: `${status.color}15`, color: status.color }}>
              {status.icon}
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-800">{status.label}</h1>
          </motion.div>
        )}

        {/* Order card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-5 sm:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Order ID</p>
              <p className="font-mono text-sm font-bold text-slate-800">#{shortOrderId(order.id)}</p>
            </div>
            <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ color: status.color, background: `${status.color}12`, border: `1px solid ${status.color}30` }}>
              {status.label}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-3 mb-5">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-600">
                  {item.productName} <span className="text-slate-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-slate-800">{formatINR(item.pricePaise * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-slate-200 mb-3" />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>{order.shippingPaise === 0 ? <span className="text-green-600">Free</span> : formatINR(order.shippingPaise)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800">
              <span>Total</span>
              <span>{formatINR(order.totalPaise)}</span>
            </div>
          </div>

          {/* Address */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">Shipping to</p>
            <p className="text-sm text-slate-700">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.line1}{order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products"
            className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:shadow-lg transition-shadow">
            Continue Shopping
          </Link>
          <Link href="/account/orders"
            className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider text-slate-600 border border-slate-200 bg-white/60 hover:bg-white/80 transition-colors">
            View All Orders
          </Link>
        </div>
      </div>
    </section>
  );
}
