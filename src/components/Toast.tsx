'use client';

import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).slice(2, 9);
    set((s) => ({ toasts: [...s.toasts.slice(-4), { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

const colorMap: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: '✓' },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '✕' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'ℹ' },
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastStore();
  const c = colorMap[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`flex items-center gap-3 rounded-2xl border ${c.border} ${c.bg} px-4 py-3 shadow-lg backdrop-blur-md cursor-pointer`}
      onClick={() => removeToast(toast.id)}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
          toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}
      >
        {c.icon}
      </span>
      <p className={`text-sm font-semibold ${c.text}`}>{toast.message}</p>
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  // Suppress hydration mismatch — only render on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-xs">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
