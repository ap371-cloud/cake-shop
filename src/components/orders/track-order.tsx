"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Order, OrderStatus } from "@/types";
import { getOrderByNumber } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const steps: { status: OrderStatus; label: string; icon: string; note: string }[] = [
  { status: "pending", label: "Order placed", icon: "receipt_long", note: "Confirmed instantly" },
  { status: "confirmed", label: "Baker accepted", icon: "check", note: "Reviewed by the kitchen" },
  { status: "baking", label: "Baking & chilling", icon: "skillet", note: "In the oven and blast chiller" },
  { status: "dispatched", label: "Out for delivery", icon: "local_shipping", note: "In a refrigerated van" },
  { status: "delivered", label: "Handover complete", icon: "door_front", note: "Cash / UPI on receipt" },
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

export function TrackOrder() {
  const params = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [number, setNumber] = useState(params.get("number") ?? "");

  const lookup = useCallback(async (orderNumber: string, phone: string) => {
    if (!orderNumber.trim()) {
      setError("Enter the order number from your confirmation.");
      return;
    }

    setPending(true);
    setError("");
    const found = await getOrderByNumber(orderNumber.trim(), phone.trim() || undefined);
    setPending(false);

    if (!found) {
      setOrder(null);
      setError(
        phone.trim()
          ? "No order matches that number and phone. Check both and try again."
          : "No order matches that number. Add the phone used at checkout."
      );
      return;
    }

    setOrder(found);
  }, []);

  useEffect(() => {
    const preset = params.get("number");
    if (!preset) return;

    // A guest who just placed this order has no session to look it up with, so
    // fall back to the copy the checkout page left in browser storage.
    try {
      const raw = sessionStorage.getItem("crumble-last-order");
      if (raw) {
        const cached = JSON.parse(raw) as Order;
        if (cached.orderNumber === preset) {
          setOrder(cached);
          return;
        }
      }
    } catch {
      // storage blocked — the API lookup below still works with a phone number
    }

    void lookup(preset, "");
  }, [params, lookup]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void lookup(String(form.get("number") ?? ""), String(form.get("phone") ?? ""));
  }

  const currentIndex = order ? steps.findIndex((step) => step.status === order.status) : -1;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center">
        <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
          Live patisserie dispatch
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
          Track your order
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-body text-on-surface-variant">
          Follow your bakes from the hearth to your doorstep. Signed in? Your recent orders are also
          in your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        noValidate
      >
        <Field label="Order number" htmlFor="number" required>
          <Input
            id="number"
            name="number"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            placeholder="CRB-2610-01001"
            autoComplete="off"
          />
        </Field>
        <Field label="Registered phone" htmlFor="phone" hint="Not needed if you're signed in.">
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="98765 43210"
            autoComplete="tel"
          />
        </Field>
        <Button type="submit" loading={pending} className="sm:mb-0.5">
          Locate order
        </Button>
      </form>

      {error && (
        <p
          role="alert"
          className="mx-auto mt-4 max-w-2xl rounded-xl bg-error-container px-4 py-3 text-body-sm text-error"
        >
          {error}
        </p>
      )}

      {order && (
        <div className="mt-8 space-y-6">
          <section className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-label-md uppercase tracking-[0.14em] text-on-surface-variant">
                  Order
                </p>
                <p className="font-display text-2xl font-semibold text-primary">{order.orderNumber}</p>
                <p className="mt-1 text-body-sm text-on-surface-variant">
                  Booked on {formatDate(order.createdAt)} · {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="rounded-xl bg-surface-container-low px-4 py-3">
                <p className="text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                  Estimated delivery
                </p>
                <p className="mt-1 text-body font-medium text-primary">
                  {formatDate(order.deliveryDate)} · {order.deliverySlot}
                </p>
              </div>
            </div>

            <ol className="mt-6 space-y-4">
              {steps.map((step, index) => {
                const done = currentIndex >= index && order.status !== "cancelled";
                const active = currentIndex === index && order.status !== "cancelled";
                return (
                  <li key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid size-9 place-items-center rounded-full ${
                          done ? "bg-primary text-on-primary" : "bg-surface-container text-outline"
                        }`}
                      >
                        <span aria-hidden className="material-symbols-outlined text-[18px]">
                          {step.icon}
                        </span>
                      </span>
                      {index < steps.length - 1 && (
                        <span
                          className={`mt-1 w-px flex-1 ${done ? "bg-primary/40" : "bg-outline-variant"}`}
                        />
                      )}
                    </div>
                    <div className="pb-1">
                      <p
                        className={`text-title-lg ${
                          active ? "text-primary" : done ? "text-on-surface" : "text-on-surface-variant"
                        }`}
                      >
                        {step.label}
                        {active && <span className="ml-2 text-label-md text-secondary">In progress</span>}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">{step.note}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {order.status === "cancelled" && (
              <p className="mt-4 rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
                This order was cancelled. Call the atelier if that was not expected.
              </p>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <section className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
              <h2 className="font-display text-xl font-semibold text-primary">
                Bakes in this order
              </h2>
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
                  <dt className="text-on-surface-variant">Subtotal</dt>
                  <dd className="font-medium text-on-surface">
                    ₹{order.subtotal.toLocaleString("en-IN")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-on-surface-variant">Delivery</dt>
                  <dd className="font-medium text-on-surface">
                    {order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-outline-variant/60 pt-3">
                  <dt className="font-semibold text-primary">Total</dt>
                  <dd className="font-price-lg text-primary">
                    ₹{order.total.toLocaleString("en-IN")}
                  </dd>
                </div>
              </dl>
            </section>

            <div className="space-y-4">
              <section className="rounded-[var(--radius-card)] bg-surface-container-low p-6">
                <h2 className="text-title-lg text-primary">
                  {order.deliveryMethod === "delivery" ? "Delivering to" : "Pickup at the atelier"}
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
                    Freeganj boutique — collect boxed and chilled.
                  </p>
                )}
              </section>

              <section className="rounded-[var(--radius-card)] border border-secondary-container/60 bg-secondary-container/20 p-6">
                <p className="flex items-center gap-2 text-title-lg text-primary">
                  <span aria-hidden className="material-symbols-outlined text-[20px] text-secondary">
                    ac_unit
                  </span>
                  Unbroken cold chain
                </p>
                <p className="mt-1 text-body-sm text-on-surface-variant">
                  Cakes rest in 4°C blast chillers before loading into thermal lockboxes.
                </p>
              </section>

              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Something wrong? Talk to the atelier</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
