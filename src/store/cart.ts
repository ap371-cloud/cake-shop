import { create } from "zustand";
import type { CartItem, Product, ProductVariant } from "@/types";
import { PRODUCTS } from "@/lib/data";

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clear: () => void;
  hydrate: () => void;
}

function findProduct(slugOrId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === slugOrId || p.slug === slugOrId);
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isHydrated: false,

  addItem: (product, variant, quantity = 1) => {
    set((state) => {
      const key = variant ? `${product.id}::${variant.id}` : product.id;
      const existing = state.items.find(
        (i) => (i.variant ? `${i.product.id}::${i.variant.id}` : i.product.id) === key
      );
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          (i.variant ? `${i.product.id}::${i.variant.id}` : i.product.id) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        items = [...state.items, { product, variant, quantity }];
      }
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("cc_cart", JSON.stringify(items));
        } catch {
          /* ignore */
        }
      }
      return { items };
    });
  },

  removeItem: (productId, variantId) => {
    set((state) => {
      const key = variantId ? `${productId}::${variantId}` : productId;
      const items = state.items.filter(
        (i) => (i.variant ? `${i.product.id}::${i.variant.id}` : i.product.id) !== key
      );
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("cc_cart", JSON.stringify(items));
        } catch {
          /* ignore */
        }
      }
      return { items };
    });
  },

  updateQuantity: (productId, quantity, variantId) => {
    const key = variantId ? `${productId}::${variantId}` : productId;
    set((state) => {
      const items =
        quantity <= 0
          ? state.items.filter(
              (i) =>
                (i.variant ? `${i.product.id}::${i.variant.id}` : i.product.id) !== key
            )
          : state.items.map((i) =>
              (i.variant ? `${i.product.id}::${i.variant.id}` : i.product.id) === key
                ? { ...i, quantity }
                : i
            );
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("cc_cart", JSON.stringify(items));
        } catch {
          /* ignore */
        }
      }
      return { items };
    });
  },

  clear: () => {
    set({ items: [] });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("cc_cart");
      } catch {
        /* ignore */
      }
    }
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("cc_cart");
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      const resolved: CartItem[] = parsed
        .map((item) => {
          const product = findProduct(item.product?.slug || item.product?.id);
          if (!product) return null;
          const variant = product.variants?.find((v) => v.id === item.variant?.id);
          return { product, variant: variant ?? item.variant, quantity: item.quantity };
        })
        .filter((x): x is CartItem => x !== null);
      set({ items: resolved, isHydrated: true });
    } catch {
      /* ignore */
    }
  },
}));

export function useCartSubtotal() {
  return useCartStore((s) =>
    s.items.reduce((sum, i) => sum + (i.variant ? i.variant.price : i.product.price) * i.quantity, 0)
  );
}

export function useCartCount() {
  return useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
}

export function useCartItems() {
  return useCartStore((s) => s.items);
}