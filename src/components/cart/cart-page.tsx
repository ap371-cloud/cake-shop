"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart, cartSubtotal } from "@/store/cart";
import { useStoreSettings } from "@/store/settings";
import { Button } from "@/components/ui/button";
import { CartLine } from "@/components/cart/cart-line";
import { EmptyState } from "@/components/ui/empty-state";

export function CartPage() {
  const { lines, remove, setQuantity } = useCart();
  const { settings } = useStoreSettings();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const subtotal = useMemo(() => cartSubtotal(lines), [lines]);
  const deliveryFee =
    lines.length > 0 && subtotal < settings.freeDeliveryThreshold ? settings.deliveryFee : 0;
  const total = subtotal + deliveryFee;
  const freeLeft = Math.max(0, settings.freeDeliveryThreshold - subtotal);

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded bg-surface-container" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-container-low" />
          ))}
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon="cookie"
          title="Your pastry bag is empty"
          description="Looks like you haven't added any cakes, pastries or cookies yet. Our morning ovens have just released their freshest bakes."
          action={{ label: "Explore Our Bakes", href: "/shop" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-primary">Your Cart</h1>
          <p className="mt-1 text-body-lg text-on-surface-variant">
            {lines.length} artisanal bake{lines.length > 1 ? "s" : ""} ready for fresh preparation
          </p>
        </div>
        <Link href="/shop" className="hidden text-label-lg text-primary hover:text-primary-container sm:inline-flex sm:items-center sm:gap-1">
          ← Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {subtotal > 0 && subtotal < settings.freeDeliveryThreshold && (
            <div className="mb-4 rounded-xl border border-outline-variant bg-surface-container-low p-4">
              <div className="flex items-center justify-between text-body-sm">
                <span className="font-semibold text-on-surface">
                  Add ₹{freeLeft} more for free delivery
                </span>
                <span className="text-on-surface-variant">Free delivery above ₹{settings.freeDeliveryThreshold}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full bg-primary-container transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

          <ul className="flex flex-col gap-3">
            {lines.map((line) => (
              <CartLine key={line.variantId ?? line.productId} line={line} />
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-level1">
            <h2 className="font-headline-lg font-semibold text-primary">Order Summary</h2>
            <div className="mt-4 flex flex-col gap-2.5 text-body-md">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Items Subtotal</span>
                <span className="font-numeric font-semibold text-on-surface">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Delivery</span>
                <span className="font-numeric font-semibold text-on-surface">
                  {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/60">
                <span className="font-headline-sm font-semibold text-primary">Total</span>
                <span className="font-price-lg font-bold text-primary">₹{total}</span>
              </div>
            </div>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              Pay on delivery or pickup. No advance payment gateway required.
            </p>
            <Button variant="primary" size="lg" className="mt-4 w-full" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <div className="mt-4 space-y-2 rounded-lg bg-surface-container-low p-3 text-body-sm">
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-secondary">bakery_dining</span>
                <span className="font-semibold text-primary">Fresh bake on order</span>
              </div>
              <p className="text-on-surface-variant">Never pre-frozen. Baked after phone &amp; WhatsApp confirmation.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}