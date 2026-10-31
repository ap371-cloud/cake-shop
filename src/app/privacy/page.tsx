import type { Metadata } from "next";
import { STORE_SETTINGS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Crumble & Co. collects when you order a bake — contact details, delivery address and order history — and how long it is kept.",
};

const sections = [
  {
    title: "What we collect",
    body: [
      "Your name, phone number and email address, because our baker calls to confirm the slot and the digital receipt goes to that inbox.",
      "The delivery address, landmark and any notes you add at checkout, so the rider reaches the right door.",
      "Your order history, so we can look up a past bake, handle a replacement and let you reorder in one tap.",
    ],
  },
  {
    title: "What we never collect",
    body: [
      "No card numbers, CVV, UPI PIN or net-banking credentials. Payment happens in person, in cash or by scanning the rider's UPI code.",
      "No advertising trackers, no third-party analytics pixels, no data sold to anyone.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "Orders and their delivery details are kept for accounting and warranty purposes for 24 months, then archived or deleted.",
      "Accounts stay until you ask us to delete them. Custom cake briefs are kept for 12 months so a repeat design can be rebuilt.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can ask for a copy of your data, a correction, or full deletion by writing to the atelier. We respond within seven working days.",
      "Clearing cookies in your browser signs you out. The cart is stored in your browser, not on our servers, until you place an order.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <p className="text-label-md uppercase tracking-[0.18em] text-secondary">Atelier policy</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
        Privacy policy
      </h1>
      <p className="mt-3 text-body text-on-surface-variant">
        Short version: we keep only what a bakery needs to bake and deliver your order, and nothing
        leaves this atelier.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-xl font-semibold text-primary">{section.title}</h2>
            <div className="mt-2 space-y-3 text-body text-on-surface-variant">
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-[var(--radius-card)] bg-surface-container-low p-6">
        <p className="text-title-lg text-primary">Questions about your data?</p>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Write to{" "}
          <a href={`mailto:${STORE_SETTINGS.email}`} className="text-secondary hover:text-primary">
            {STORE_SETTINGS.email}
          </a>{" "}
          or call {STORE_SETTINGS.phone}. Last updated October 2026.
        </p>
      </div>
    </div>
  );
}
