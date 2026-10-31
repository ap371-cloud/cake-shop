import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQS } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Lead times for custom cakes, eggless and vegan options, delivery radius, cold-chain transit and payment on delivery — answered by the Crumble & Co. atelier.",
};

const quickAnswers = [
  {
    icon: "schedule",
    title: "Custom cakes",
    body: "7–10 days notice for tiered and sculpted commissions.",
  },
  {
    icon: "eco",
    title: "Eggless & vegan",
    body: "Signature cakes and several daily bakes come eggless.",
  },
  {
    icon: "payments",
    title: "Payment",
    body: "Cash or UPI on delivery. Nothing upfront, ever.",
  },
  {
    icon: "ac_unit",
    title: "Cold chain",
    body: "Insulated refrigerated vans across the city.",
  },
];

export default function FaqPage() {
  return (
    <div className="animate-page-enter">
      <section className="border-b border-outline-variant/60 bg-surface-container-low">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 text-center sm:px-6 lg:py-20">
          <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
            Atelier handbook
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
            Questions, answered
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-on-surface-variant">
            Everything about lead times, ingredients, delivery and paying on handover. If something
            is still unclear, the concierge desk is one message away.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickAnswers.map((item) => (
            <div
              key={item.title}
              className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-level1"
            >
              <span aria-hidden className="material-symbols-outlined text-[24px] text-secondary">
                {item.icon}
              </span>
              <p className="mt-3 text-title-lg text-primary">{item.title}</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:pb-24">
        <h2 className="font-display text-2xl font-semibold text-primary sm:text-3xl">
          The full list
        </h2>
        <Accordion items={FAQS} className="mt-6" />

        <div className="mt-10 flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-surface-container-low p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-semibold text-primary">
              Still deciding on a design?
            </p>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Send us the occasion and date — the chef patissier will sketch something for you.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/custom-cake">Design a cake</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Ask the atelier</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
