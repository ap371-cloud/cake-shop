import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackOrder } from "@/components/orders/track-order";

export const metadata: Metadata = {
  title: "Track Order",
  description:
    "Follow your Crumble & Co. order from the oven to your doorstep with the order number and the phone used at checkout.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-4 py-20">
          <div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
        </div>
      }
    >
      <TrackOrder />
    </Suspense>
  );
}
