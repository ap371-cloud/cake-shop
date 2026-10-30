"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantLabel: string | null;
  unitPrice: number;
  image: string;
  quantity: number;
  stock: number;
};

type CartState = {
  lines: CartLine[];
  hydrated: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (productId: string, variantId: string | null) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clear: () => void;
  hydrate: () => void;
};

const sameLine = (a: CartLine, productId: string, variantId: string | null) =>
  a.productId === productId && a.variantId === variantId;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,

      add: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => sameLine(l, line.productId, line.variantId));
          if (existing) {
            const next = Math.min(existing.quantity + quantity, line.stock);
            return {
              lines: state.lines.map((l) =>
                sameLine(l, line.productId, line.variantId) ? { ...l, quantity: next, unitPrice: line.unitPrice } : l
              ),
            };
          }
          return { lines: [...state.lines, { ...line, quantity: Math.min(quantity, line.stock) }] };
        }),

      remove: (productId, variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => !sameLine(l, productId, variantId)) })),

      setQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              sameLine(l, productId, variantId)
                ? { ...l, quantity: Math.max(0, Math.min(quantity, l.stock)) }
                : l
            )
            .filter((l) => l.quantity > 0),
        })),

      clear: () => set({ lines: [] }),

      // persist rehydrates on import in the browser; this exists for callers that
      // need to force a re-read (e.g. after another tab changes the cart).
      hydrate: () => {
        void useCart.persist.rehydrate();
      },
    }),
    {
      name: "crumble-cart",
      partialize: (state) => ({ lines: state.lines }),
      onRehydrateStorage: () => (state) => {
        // Cart lives in localStorage, so the first paint must not read it —
        // otherwise server and client markup disagree.
        if (state) state.hydrated = true;
      },
    }
  )
);

export const useCartStore = useCart;

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}
