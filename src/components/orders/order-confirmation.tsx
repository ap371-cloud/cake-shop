"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";

const nextSteps = [
  {
    icon: "check",
    title: "Order received",
    body: "Logged in the kitchen system and ingredients reserved for your batch.",
  },
  {
    icon: "sync",
    title: "Chef call confirmation",
    body: "Our concierge calls within 30 minutes to confirm flavour, slot and payment.",
  },
  {
    icon: "skillet",
    title: "Baking & chilling",
    body: "Your bake leaves the oven in the next scheduled drop and rests in the blast chiller.",
  },
  {
    icon: "local_shipping",
    title: "Chilled handover",
    body: "Delivered in an insulated box. Inspect it first, then pay by cash or UPI.",
  },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function OrderConfirmation() {
  const params = useSearchParams();
  const number = params.get("number");
  const [order, setOrder] = useState<Order | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("crumble-last-order");
      if (raw) {
        const stored = JSON.parse(raw) as Order;
        if (!number || stored.orderNumber === number) setOrder(stored);
      }
    } catch {
      // storage can be blocked — the fallback below still works
    }
    setChecked(true);
  }, [number]);

  if (!checked) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20">
        <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6">
        <span aria-hidden className="material-symbols-outlined text-[44px] text-outline">
          receipt_long
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-primary">
          {number ? `Order ${number}` : "No order to show"}
        </h1>
        <p className="mt-2 text-body text-on-surface-variant">
          Open the order from this device, or track it with the order number and the phone used at
          checkout.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={number ? `/track-order?number=${encodeURIComponent(number)}` : "/track-order"}>
              Track this order
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-enter mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center">
        <span aria-hidden className="material-symbols-outlined text-[52px] text-sage">
          check_circle
        </span>
        <p className="mt-3 text-label-md uppercase tracking-[0.18em] text-secondary">
          Atelier order confirmed
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
          Your sweet moments are on their way
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-body text-on-surface-variant">
          Thank you, {order.customerName.split(" ")[0]}. Our bakers are already weighing the cultured
          butter and preparing your batch.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Order reference", value: order.orderNumber },
          { label: "Placed on", value: formatDate(order.createdAt) },
          { label: "Status", value: order.status.replace("_", " ") },
          {
            label: "Payment",
            value: order.paymentMethod === "cash_on_delivery" ? "Cash on delivery" : "UPI on delivery",
          },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-surface-container-low p-4">
            <p className="text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
              {item.label}
            </p>
            <p className="mt-1 text-title-lg capitalize text-primary">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <section className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
          <h2 className="font-display text-xl font-semibold text-primary">Fresh bake basket</h2>
          <ul className="mt-4 divide-y divide-outline-variant/50">
            {order.items.map((item, index) => (
              <li key={`${item.slug ?? item.name}-${index}`} className="flex justify-between gap-4 py-3">
                <div>
                  <p className="text-body font-medium text-on-surface">{item.name}</p>
                  <p className="text-label-md text-on-surface-variant">
                    {item.variant ? `${item.variant} · ` : ""}Qty {item.quantity}
                  </p>
                </div>
                <span className="text-body font-semibold text-primary">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-outline-variant/60 pt-4 text-body-sm">
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Items subtotal</dt>
              <dd className="font-medium text-on-surface">₹{order.subtotal.toLocaleString("en-IN")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Chilled transit</dt>
              <dd className="font-medium text-on-surface">
                {order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`}
              </dd>
            </div>
            <div className="flex justify-between border-t border-outline-variant/60 pt-3">
              <dt className="font-semibold text-primary">Total payable</dt>
              <dd className="font-price-lg text-primary">₹{order.total.toLocaleString("en-IN")}</dd>
            </div>
          </dl>

          {order.deliveryNotes && (
            <div className="mt-4 rounded-xl bg-surface-container-low p-4">
              <p className="text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                Note for the head baker
              </p>
              <p className="mt-1 text-body-sm text-on-surface">“{order.deliveryNotes}”</p>
            </div>
          )}
        </section>

        <div className="space-y-4">
          <section className="rounded-[var(--radius-card)] bg-surface-container-low p-6">
            <h2 className="text-title-lg text-primary">
              {order.deliveryMethod === "delivery" ? "Delivery address" : "Atelier pickup"}
            </h2>
            {order.deliveryMethod === "delivery" ? (
              <address className="mt-2 not-italic text-body-sm text-on-surface-variant">
                <span className="block font-medium text-on-surface">{order.customerName}</span>
                <span className="block">{order.phone}</span>
                <span className="mt-1 block">
                  {order.addressLine1}
                  {order.addressLine2 ? `, ${order.addressLine2}` : ""}
                </span>
                <span className="block">
                  {order.city}, {order.state} {order.pinCode}
                </span>
              </address>
            ) : (
              <p className="mt-2 text-body-sm text-on-surface-variant">
                Collect from the Freeganj boutique, boxed and chilled.
              </p>
            )}

            <div className="mt-4 border-t border-outline-variant/60 pt-4">
              <p className="text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                Estimated window
              </p>
              <p className="mt-1 text-body font-medium text-on-surface">
                {formatDate(order.deliveryDate)} · {order.deliverySlot}
              </p>
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-secondary-container/60 bg-secondary-container/20 p-6">
            <p className="flex items-center gap-2 text-title-lg text-primary">
              <span aria-hidden className="material-symbols-outlined text-[20px] text-secondary">
                phonelink_ring
              </span>
              No upfront payment
            </p>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Hand over cash or scan the rider’s UPI code only after you have inspected the box.
            </p>
          </section>
        </div>
      </div>

      <section className="mt-8 rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
        <h2 className="font-display text-xl font-semibold text-primary">What happens next</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nextSteps.map((step, index) => (
            <li key={step.title} className="rounded-xl bg-surface-container-low p-4">
              <span aria-hidden className="material-symbols-outlined text-[22px] text-secondary">
                {step.icon}
              </span>
              <p className="mt-2 text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                Step {index + 1}
              </p>
              <p className="mt-1 text-body font-medium text-primary">{step.title}</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href={`/track-order?number=${encodeURIComponent(order.orderNumber)}`}>
            Track this order
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
