import type { Metadata } from "next";
import Link from "next/link";
import { STORE_SETTINGS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Ordering, lead times, delivery windows, payment on handover and our replacement guarantee at Crumble & Co.",
};

const sections = [
  {
    title: "Placing an order",
    body: "An order is confirmed once it appears in your account or you receive an order reference. We call or WhatsApp within 30 minutes during atelier hours to confirm flavour, slot and payment mode. Slot availability is first-come, first-served.",
  },
  {
    title: "Lead times",
    body: "Signature cakes and daily bakes can usually be delivered the same day if ordered before 4:00 PM. Custom, tiered and sculpted cakes need at least 48 hours, and we recommend 7–10 days for elaborate designs. Festival weeks fill up faster.",
  },
  {
    title: "Payment",
    body: "No online payment gateway is used and no advance is taken. Pay by cash or UPI when the order is handed over. Please inspect the box before paying — once accepted, the balance is due in full.",
  },
  {
    title: "Delivery & pickup",
    body: "Refrigerated delivery runs city-wide between 11:00 AM and 9:00 PM. Delivery is complimentary above the free-delivery threshold shown at checkout; a courier fee applies below it. If nobody is available at the address, the rider waits 10 minutes and the order returns to the atelier for pickup the same day.",
  },
  {
    title: "Cancellations",
    body: "Cancel free of charge up to 24 hours before the slot. Custom cakes cancelled inside 24 hours may be charged for ingredients already committed. Cancelled orders never require an online refund because nothing was paid upfront.",
  },
  {
    title: "Quality guarantee",
    body: "If the texture, freshness or taste is not exceptional, tell us the same day with a photograph and we will replace the item or refund it in full. This does not cover damage caused after handover or storage outside our instructions.",
  },
  {
    title: "Allergens",
    body: "Our kitchen handles wheat, dairy, eggs, nuts, soy and sesame. Eggless bakes are prepared in a separate chamber, but we cannot guarantee an allergen-free environment. Always read the product page and ask the concierge if you have a severe allergy.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <p className="text-label-md uppercase tracking-[0.18em] text-secondary">Atelier policy</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
        Terms &amp; conditions
      </h1>
      <p className="mt-3 text-body text-on-surface-variant">
        The practical rules behind every bake: how slots are booked, how payment works and what we
        do when something is not right.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section, index) => (
          <section key={section.title}>
            <h2 className="font-display text-xl font-semibold text-primary">
              {index + 1}. {section.title}
            </h2>
            <p className="mt-2 text-body text-on-surface-variant">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-[var(--radius-card)] bg-surface-container-low p-6">
        <p className="text-title-lg text-primary">Need to change an order?</p>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Call {STORE_SETTINGS.phone} or use the{" "}
          <Link href="/contact" className="text-secondary hover:text-primary">
            contact form
          </Link>
          . Have the order reference ready. Last updated October 2026.
        </p>
      </div>
    </div>
  );
}
