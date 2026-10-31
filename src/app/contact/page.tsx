import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { getStoreSettings } from "@/lib/server/orders";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about a bake, a custom celebration cake or a delivery? Reach the Crumble & Co. atelier in Freeganj, Ujjain — phone, WhatsApp, email or the form.",
};

const rhythm = [
  {
    icon: "store",
    title: "Monday to Sunday",
    detail: "8:00 AM – 10:00 PM",
    note: "Open for walk-ins, tastings and the espresso counter",
  },
  {
    icon: "bakery_dining",
    title: "Fresh oven drops",
    detail: "9:00 AM & 4:00 PM daily",
    note: "Warm sourdough loaves, cruffins and brioche",
  },
  {
    icon: "local_shipping",
    title: "Refrigerated delivery",
    detail: "11:00 AM – 9:00 PM",
    note: "Temperature-controlled multi-tier cake transit",
  },
];

export default async function ContactPage() {
  const settings = await getStoreSettings();

  const channels = [
    {
      icon: "call",
      label: "Direct dial",
      value: settings.phone,
      note: "Phone concierge",
      href: `tel:${settings.phone.replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: "mark_email_read",
      label: "Written desk",
      value: settings.email,
      note: "Responses within 2 hours",
      href: `mailto:${settings.email}`,
    },
    {
      icon: "storefront",
      label: "Flagship counter",
      value: settings.address,
      note: "Valet parking available",
    },
  ];

  return (
    <div className="animate-page-enter">
      <section className="border-b border-outline-variant/60 bg-surface-container-low">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
            Atelier concierge
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
            We’d love to hear from you
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg text-on-surface-variant">
            Questions about our bakes, a custom celebration order, or just a sweet hello? Reach the
            atelier team — a real pastry chef answers, not a ticket queue.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {channels.map((channel) => (
            <div
              key={channel.label}
              className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1"
            >
              <span aria-hidden className="material-symbols-outlined text-[26px] text-secondary">
                {channel.icon}
              </span>
              <p className="mt-4 text-label-md uppercase tracking-[0.14em] text-on-surface-variant">
                {channel.label}
              </p>
              {channel.href ? (
                <a
                  href={channel.href}
                  className="mt-1 block font-display text-xl font-semibold text-primary hover:text-primary-container"
                >
                  {channel.value}
                </a>
              ) : (
                <p className="mt-1 font-display text-xl font-semibold text-primary">
                  {channel.value}
                </p>
              )}
              <p className="mt-2 text-body-sm text-on-surface-variant">{channel.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-primary sm:text-3xl">
              Send an atelier note
            </h2>
            <p className="mt-2 text-body text-on-surface-variant">
              Tell us the date, the occasion and any flavour ideas. We reply with specifications,
              pricing and timelines.
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-primary">Atelier rhythm</h2>
            {rhythm.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-[var(--radius-card)] bg-surface-container-low p-5"
              >
                <span aria-hidden className="material-symbols-outlined text-[24px] text-secondary">
                  {item.icon}
                </span>
                <div>
                  <p className="text-title-lg text-primary">{item.title}</p>
                  <p className="text-body-sm font-medium text-on-surface">{item.detail}</p>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{item.note}</p>
                </div>
              </div>
            ))}

            <div className="rounded-[var(--radius-card)] border border-outline-variant/60 p-5">
              <p className="text-title-lg text-primary">Quick questions?</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Eggless options, shelf life, delivery radius — most answers live in the FAQ.
              </p>
              <Link
                href="/faq"
                className="mt-3 inline-flex items-center gap-1 text-label-lg text-secondary hover:text-primary"
              >
                Read the FAQ
                <span aria-hidden className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
