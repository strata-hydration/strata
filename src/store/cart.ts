'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/lib/types';
import { SHIPPING_FLAT_RATE_PAISE, FREE_SHIPPING_THRESHOLD_PAISE } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotalPaise: () => number;
  shippingPaise: () => number;
  totalPaise: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) => {
        let addedQty = qty;
        let finalQty = qty;
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            const nextQty = Math.min(existing.quantity + qty, 10);
            addedQty = Math.max(nextQty - existing.quantity, 0);
            finalQty = nextQty;
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: nextQty }
                  : i
              ),
            };
          }
          finalQty = qty;
          return { items: [...state.items, { ...item, quantity: qty }] };
        });

        if (addedQty > 0) {
          trackEvent('add_to_cart', {
            currency: 'INR',
            value: (item.price * addedQty) / 100,
            items: [
              {
                item_id: item.productId,
                item_name: item.name,
                price: item.price / 100,
                quantity: addedQty,
              },
            ],
            cart_item_count: get().itemCount(),
            cart_item_quantity: finalQty,
          });
        }
      },

      removeItem: (productId) => {
        const removed = get().items.find((i) => i.productId === productId);
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));

        if (removed) {
          trackEvent('remove_from_cart', {
            currency: 'INR',
            value: (removed.price * removed.quantity) / 100,
            items: [
              {
                item_id: removed.productId,
                item_name: removed.name,
                price: removed.price / 100,
                quantity: removed.quantity,
              },
            ],
            cart_item_count: get().itemCount(),
          });
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        const existing = get().items.find((i) => i.productId === productId);
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.min(quantity, 10) } : i
          ),
        }));

        if (existing) {
          const nextQty = Math.min(quantity, 10);
          trackEvent('cart_quantity_updated', {
            item_id: existing.productId,
            item_name: existing.name,
            previous_quantity: existing.quantity,
            updated_quantity: nextQty,
            cart_item_count: get().itemCount(),
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
        trackEvent('cart_cleared');
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotalPaise: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      shippingPaise: () =>
        get().subtotalPaise() >= FREE_SHIPPING_THRESHOLD_PAISE
          ? 0
          : SHIPPING_FLAT_RATE_PAISE,

      totalPaise: () => get().subtotalPaise() + get().shippingPaise(),
    }),
    {
      name: 'strata-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
