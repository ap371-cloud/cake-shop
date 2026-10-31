import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation } from "@/components/orders/order-confirmation";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Crumble & Co. order has been received. Here is what happens next.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-4 py-20">
          <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
        </div>
      }
    >
      <OrderConfirmation />
    </Suspense>
  );
}
