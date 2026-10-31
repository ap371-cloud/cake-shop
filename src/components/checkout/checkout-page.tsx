"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cartSubtotal, useCart } from "@/store/cart";
import { useStoreSettings } from "@/store/settings";
import { useAuth } from "@/components/auth-provider";
import { createOrder } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";

const slots = [
  "9:00 AM – 1:00 PM",
  "1:00 PM – 5:00 PM",
  "5:00 PM – 8:00 PM",
  "8:00 PM – 10:00 PM",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { lines, clear } = useCart();
  const { settings } = useStoreSettings();

  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = useState<"cash_on_delivery" | "upi_on_delivery">(
    "cash_on_delivery"
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const subtotal = useMemo(() => cartSubtotal(lines), [lines]);
  const deliveryFee =
    method === "delivery" && lines.length > 0 && subtotal < settings.freeDeliveryThreshold
      ? settings.deliveryFee
      : 0;
  const total = subtotal + deliveryFee;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");

    try {
      const order = await createOrder({
        customerName: String(form.get("customerName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? "") || undefined,
        addressLine1: String(form.get("addressLine1") ?? ""),
        addressLine2: String(form.get("addressLine2") ?? ""),
        landmark: String(form.get("landmark") ?? "") || undefined,
        city: String(form.get("city") ?? ""),
        state: String(form.get("state") ?? ""),
        pinCode: String(form.get("pinCode") ?? ""),
        deliveryMethod: method,
        deliveryDate: String(form.get("deliveryDate") ?? ""),
        deliverySlot: String(form.get("deliverySlot") ?? ""),
        deliveryNotes: String(form.get("deliveryNotes") ?? "") || undefined,
        paymentMethod: payment,
        items: lines.map((line) => ({
          name: line.name,
          price: line.unitPrice,
          quantity: line.quantity,
          slug: line.slug,
          variant: line.variantLabel ?? undefined,
          variantId: line.variantId ?? undefined,
        })),
      });

      clear();
      // The confirmation page is client-side; a guest has no session to read the
      // order back with, so the freshly created order is handed over in storage.
      sessionStorage.setItem("crumble-last-order", JSON.stringify(order));
      router.push(`/order-confirmation?number=${encodeURIComponent(order.orderNumber)}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not place the order."
      );
      setPending(false);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-container" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-96 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
          <div className="h-72 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
        <span aria-hidden className="material-symbols-outlined text-[44px] text-outline">
          shopping_bag
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-primary">
          Your pastry bag is empty
        </h1>
        <p className="mt-2 text-body text-on-surface-variant">
          Add a bake before heading to checkout.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Browse the bakes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-label-md text-on-surface-variant">
        <Link href="/cart" className="hover:text-primary">
          Cart
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Delivery details</span>
      </nav>

      <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
        Delivery details
      </h1>
      <p className="mt-2 text-body text-on-surface-variant">
        A few details before our bakers start handcrafting your order.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start"
        noValidate
      >
        <div className="space-y-8">
          <section className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
            <h2 className="flex items-center gap-2 text-title-lg text-primary">
              <span aria-hidden className="material-symbols-outlined text-[22px] text-secondary">
                person
              </span>
              Customer information
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="customerName" required>
                <Input
                  id="customerName"
                  name="customerName"
                  autoComplete="name"
                  required
                  defaultValue={user?.name ?? ""}
                  placeholder="Rhea Sharma"
                />
              </Field>
              <Field
                label="Phone number"
                htmlFor="phone"
                required
                hint="Our baker calls this number to confirm the slot."
              >
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  defaultValue={user?.phone ?? ""}
                  placeholder="98765 43210"
                />
              </Field>
            </div>

            <Field label="Email address" htmlFor="email" hint="Optional, for the digital receipt.">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={user?.email ?? ""}
                placeholder="you@example.com"
              />
            </Field>
          </section>

          <section className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
            <h2 className="flex items-center gap-2 text-title-lg text-primary">
              <span aria-hidden className="material-symbols-outlined text-[22px] text-secondary">
                local_shipping
              </span>
              Fulfilment preference
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMethod("delivery")}
                aria-pressed={method === "delivery"}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  method === "delivery"
                    ? "border-primary-container bg-surface-container-low"
                    : "border-outline-variant hover:border-primary-container/60"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="text-title-lg text-primary">Refrigerated doorstep</span>
                  <span className="text-label-lg text-secondary">
                    ₹{subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee}
                  </span>
                </span>
                <span className="mt-1 block text-body-sm text-on-surface-variant">
                  Cold-chain insulated vans, mousse and ganache intact.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("pickup")}
                aria-pressed={method === "pickup"}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  method === "pickup"
                    ? "border-primary-container bg-surface-container-low"
                    : "border-outline-variant hover:border-primary-container/60"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="text-title-lg text-primary">Atelier pickup</span>
                  <span className="text-label-lg text-secondary">Free</span>
                </span>
                <span className="mt-1 block text-body-sm text-on-surface-variant">
                  Collect boxed and chilled from the Freeganj boutique.
                </span>
              </button>
            </div>

            {method === "delivery" && (
              <div className="mt-6 space-y-5">
                <Field label="House / flat & building" htmlFor="addressLine1" required>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    autoComplete="address-line1"
                    required
                    placeholder="Flat 402, Royal Palms Residency"
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Street / locality" htmlFor="addressLine2">
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      autoComplete="address-line2"
                      placeholder="Mahakal Van Marg"
                    />
                  </Field>
                  <Field label="Landmark" htmlFor="landmark" hint="Optional">
                    <Input id="landmark" name="landmark" placeholder="Opposite Circuit House" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="PIN code" htmlFor="pinCode" required>
                    <Input
                      id="pinCode"
                      name="pinCode"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      required
                      placeholder="456001"
                    />
                  </Field>
                  <Field label="City" htmlFor="city" required>
                    <Input id="city" name="city" defaultValue="Ujjain" required />
                  </Field>
                  <Field label="State" htmlFor="state" required>
                    <Input id="state" name="state" defaultValue="Madhya Pradesh" required />
                  </Field>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
            <h2 className="flex items-center gap-2 text-title-lg text-primary">
              <span aria-hidden className="material-symbols-outlined text-[22px] text-secondary">
                calendar_clock
              </span>
              Fulfilment schedule
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field
                label="Preferred date"
                htmlFor="deliveryDate"
                required
                hint="Bakes leave the oven at 7:00 AM and 3:00 PM."
              >
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  required
                  min={today()}
                  defaultValue={today()}
                />
              </Field>
              <Field label="Preferred slot" htmlFor="deliverySlot" required>
                <Select id="deliverySlot" name="deliverySlot" defaultValue={slots[0]} required>
                  {slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field
              label="Delivery instructions & cake notes"
              htmlFor="deliveryNotes"
              hint="Gate passes, doorbell preferences, inscription wording."
            >
              <Textarea
                id="deliveryNotes"
                name="deliveryNotes"
                rows={3}
                maxLength={600}
                placeholder="Please deliver chilled and call on arrival."
              />
            </Field>
          </section>

          <section className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
            <h2 className="flex items-center gap-2 text-title-lg text-primary">
              <span aria-hidden className="material-symbols-outlined text-[22px] text-secondary">
                payments
              </span>
              Payment on handover
            </h2>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              No online gateway, no advance payment. Pay only once the box is in your hands.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { value: "cash_on_delivery" as const, title: "Cash on delivery", note: "Pay the rider in cash" },
                { value: "upi_on_delivery" as const, title: "UPI on delivery", note: "Scan the rider's QR code" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPayment(option.value)}
                  aria-pressed={payment === option.value}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    payment === option.value
                      ? "border-primary-container bg-surface-container-low"
                      : "border-outline-variant hover:border-primary-container/60"
                  }`}
                >
                  <span className="block text-title-lg text-primary">{option.title}</span>
                  <span className="mt-1 block text-body-sm text-on-surface-variant">
                    {option.note}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
            <h2 className="font-display text-xl font-semibold text-primary">Order summary</h2>

            <ul className="mt-4 space-y-3">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.variantId ?? "base"}`} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-medium text-on-surface">{line.name}</p>
                    <p className="text-label-md text-on-surface-variant">
                      {line.variantLabel ? `${line.variantLabel} · ` : ""}Qty {line.quantity}
                    </p>
                  </div>
                  <span className="text-body-sm font-semibold text-primary">
                    ₹{(line.unitPrice * line.quantity).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-outline-variant/60 pt-4 text-body-sm">
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Subtotal</dt>
                <dd className="font-medium text-on-surface">
                  ₹{subtotal.toLocaleString("en-IN")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">
                  {method === "delivery" ? "Chilled transit" : "Atelier pickup"}
                </dt>
                <dd className="font-medium text-on-surface">
                  {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                </dd>
              </div>
              <div className="flex justify-between border-t border-outline-variant/60 pt-3 text-base">
                <dt className="font-semibold text-primary">Total payable</dt>
                <dd className="font-price-lg text-primary">₹{total.toLocaleString("en-IN")}</dd>
              </div>
            </dl>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-5 w-full" loading={pending}>
              Place order
            </Button>
            <p className="mt-3 text-center text-label-md text-on-surface-variant">
              Pay on arrival via cash or UPI. No upfront payment.
            </p>
          </div>

          <div className="mt-4 rounded-[var(--radius-card)] bg-surface-container-low p-5">
            <p className="flex items-center gap-2 text-title-lg text-primary">
              <span aria-hidden className="material-symbols-outlined text-[20px] text-secondary">
                support_agent
              </span>
              Personal patissier call
            </p>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              We call within 30 minutes to confirm flavour nuances, slot and payment arrangement.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
