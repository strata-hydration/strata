'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatINR, shortOrderId } from '@/lib/utils';
import GoogleSignIn from '@/components/GoogleSignIn';

interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

interface OrderSummary {
  id: string;
  status: string;
  totalPaise: number;
  createdAt: string;
  items: { productName: string; quantity: number }[];
}

function pickFirstFieldError(details?: Record<string, string[] | undefined>): string | null {
  if (!details) return null;
  for (const key of Object.keys(details)) {
    const msg = details[key]?.[0];
    if (msg) return msg;
  }
  return null;
}

export default function AccountOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'signupOtp' | 'forgotPassword' | 'forgotOtp'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', otp: '', newPassword: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'me' }),
      });
      const data = await res.json();
      if (data.data) {
        setUser(data.data);
        return data.data;
      }
    } catch { /* no session */ }
    return null;
  };

  useEffect(() => {
    fetchUser().then((u) => {
      if (!u) {
        setShowAuth(true);
        setLoading(false);
      } else {
        setShowAuth(false);
        // Fetch orders — using a simple search by customer
        fetch(`/api/orders?customerId=${u.id}`)
          .then((r) => r.json())
          .then((res) => setOrders(res.data ?? []))
          .catch(() => {})
          .finally(() => setLoading(false));
      }
    });
  }, []);

  const handleAuth = async () => {
    setAuthError('');
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password;
    const name = authForm.name.trim();
    const otp = authForm.otp.trim();
    const newPassword = authForm.newPassword;

    if (!email) {
      setAuthError('Email is required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setAuthError('Please enter a valid email address');
      return;
    }
    if (authMode === 'login' || authMode === 'signup') {
      if (!password) {
        setAuthError('Password is required');
        return;
      }
    }

    if (authMode === 'signup') {
      if (name.length < 2) {
        setAuthError('Name must be at least 2 characters');
        return;
      }
      if (password.length < 8) {
        setAuthError('Password must be at least 8 characters');
        return;
      }
    }

    if (authMode === 'signupOtp' || authMode === 'forgotOtp') {
      if (!/^\d{6}$/.test(otp)) {
        setAuthError('Please enter a valid 6-digit OTP');
        return;
      }
    }

    if (authMode === 'forgotOtp') {
      if (newPassword.length < 8) {
        setAuthError('New password must be at least 8 characters');
        return;
      }
    }

    setAuthLoading(true);
    try {
      let body: Record<string, string>;
      if (authMode === 'login') {
        body = { action: 'login', email, password };
      } else if (authMode === 'signup') {
        body = { action: 'signup_request_otp', email, password, name };
      } else if (authMode === 'signupOtp') {
        body = { action: 'signup_verify_otp', email, otp };
      } else if (authMode === 'forgotPassword') {
        body = { action: 'forgot_password_request_otp', email };
      } else {
        body = { action: 'forgot_password_verify_otp', email, otp, newPassword };
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(pickFirstFieldError(data.details) || data.error || 'Authentication failed');
      } else {
        if (authMode === 'signup') {
          setAuthMode('signupOtp');
          setAuthError('');
        } else if (authMode === 'forgotPassword') {
          setAuthMode('forgotOtp');
          setAuthError('');
        } else {
          setUser(data.data);
          setShowAuth(false);
          router.refresh();
        }
      }
    } catch {
      setAuthError('Something went wrong');
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUser(null);
    setOrders([]);
    setShowAuth(true);
  };

  const statusColors: Record<string, string> = {
    paid: '#22c55e', processing: '#3b82f6', shipped: '#8b5cf6',
    delivered: '#22c55e', cancelled: '#ef4444', refunded: '#f59e0b',
    pending: '#94a3b8', payment_initiated: '#f59e0b',
  };

  // Auth overlay
  if (showAuth) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-6 shadow-sm"
        >
          <h1 className="font-display text-xl font-bold text-slate-800 mb-1 text-center">
            {authMode === 'login' && 'Welcome Back'}
            {authMode === 'signup' && 'Create Account'}
            {authMode === 'signupOtp' && 'Verify Your Email'}
            {authMode === 'forgotPassword' && 'Forgot Password'}
            {authMode === 'forgotOtp' && 'Reset Password'}
          </h1>
          <p className="text-xs text-slate-500 text-center mb-5">
            {authMode === 'login' && 'Sign in to view your orders'}
            {authMode === 'signup' && 'Sign up for order tracking & faster checkout'}
            {authMode === 'signupOtp' && `Enter the OTP sent to ${authForm.email}`}
            {authMode === 'forgotPassword' && 'Enter your email to get a reset OTP'}
            {authMode === 'forgotOtp' && `Enter OTP and set new password for ${authForm.email}`}
          </p>

          {/* Google SSO */}
          {authMode === 'login' && (
            <>
              <GoogleSignIn
                onSuccess={(userData) => {
                  setUser(userData as User);
                  setShowAuth(false);
                  router.refresh();
                }}
                onError={(err) => setAuthError(err)}
              />

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            </>
          )}

          <div className="space-y-3">
            {authMode === 'signup' && (
              <input
                placeholder="Full name"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              disabled={authMode === 'signupOtp' || authMode === 'forgotOtp'}
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {(authMode === 'login' || authMode === 'signup') && (
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            )}
            {(authMode === 'signupOtp' || authMode === 'forgotOtp') && (
              <input
                placeholder="6-digit OTP"
                value={authForm.otp}
                onChange={(e) => setAuthForm({ ...authForm, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all tracking-[0.35em] font-mono"
              />
            )}
            {authMode === 'forgotOtp' && (
              <input
                type="password"
                placeholder="New password (min 8 chars)"
                value={authForm.newPassword}
                onChange={(e) => setAuthForm({ ...authForm, newPassword: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            )}
          </div>

          {authError && (
            <p className="mt-3 text-xs text-red-500 text-center">{authError}</p>
          )}

          <button
            onClick={handleAuth}
            disabled={authLoading}
            className="mt-5 w-full rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:shadow-lg transition-all disabled:opacity-60"
          >
            {authLoading
              ? 'Please wait...'
              : authMode === 'login'
                ? 'Sign In'
                : authMode === 'signup'
                  ? 'Send OTP'
                  : authMode === 'signupOtp'
                    ? 'Verify & Create Account'
                    : authMode === 'forgotPassword'
                      ? 'Send Reset OTP'
                      : 'Reset Password'}
          </button>

          <p className="mt-4 text-xs text-slate-500 text-center">
            {(authMode === 'login' || authMode === 'signup') && (
              <>
                {authMode === 'login' ? (
                  <>Don&apos;t have an account? <button onClick={() => { setAuthMode('signup'); setAuthError(''); }} className="text-blue-500 hover:underline">Sign up</button></>
                ) : (
                  <>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-blue-500 hover:underline">Sign in</button></>
                )}
                <span className="mx-2 text-slate-300">·</span>
                <button onClick={() => { setAuthMode('forgotPassword'); setAuthError(''); }} className="text-blue-500 hover:underline">Forgot password?</button>
              </>
            )}
            {(authMode === 'signupOtp' || authMode === 'forgotPassword' || authMode === 'forgotOtp') && (
              <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-blue-500 hover:underline">Back to sign in</button>
            )}
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 pt-10 pb-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-black text-slate-800">My Orders</h1>
            {user && <p className="text-sm text-slate-500 mt-0.5">Hello, {user.name} 👋</p>}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider font-bold"
          >
            Sign Out
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/40 animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">📦</span>
            <h2 className="font-display text-lg font-bold text-slate-800 mb-2">No orders yet</h2>
            <p className="text-sm text-slate-500 mb-4">Time to hydrate!</p>
            <Link href="/products" className="text-sm text-blue-500 hover:underline">Browse products →</Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {orders.map((order, i) => {
                const color = statusColors[order.status] ?? '#94a3b8';
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/order/${order.id}`}
                      className="block rounded-2xl border border-white/50 bg-white/60 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-slate-600">#{shortOrderId(order.id)}</span>
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{ color, background: `${color}12`, border: `1px solid ${color}30` }}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600 truncate max-w-[60%]">
                          {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ')}
                        </p>
                        <span className="font-bold text-slate-800">{formatINR(order.totalPaise)}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
