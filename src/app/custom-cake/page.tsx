import type { Metadata } from "next";
import { CustomCakeForm } from "@/components/custom-cake/custom-cake-form";

export const metadata: Metadata = {
  title: "Custom Cakes",
  description:
    "Commission a bespoke celebration cake — tiered centrepieces, vintage pipework and hand-sculpted finishes, made with cultured butter and single-origin chocolate.",
};

const perks = [
  { icon: "person_pin", text: "One-on-one consultation with the head patissier" },
  { icon: "cake", text: "Complimentary tasting box for tiered commissions" },
  { icon: "verified", text: "FSSAI certified, baked fresh to order" },
];

export default function CustomCakePage() {
  return (
    <div className="animate-page-enter">
      <section className="border-b border-outline-variant/60 bg-surface-container-low">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
              Haute pâtisserie atelier
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              Let’s create something sweet
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">
              From multi-tiered botanical centrepieces to bespoke vintage pipework, every creation is
              hand-sculpted with cultured butter and single-origin chocolate. Booking slots are open
              for the next 60 days.
            </p>

            <ul className="mt-8 space-y-3">
              {perks.map((perk) => (
                <li key={perk.text} className="flex items-center gap-3 text-body text-on-surface">
                  <span aria-hidden className="material-symbols-outlined text-[22px] text-sage">
                    {perk.icon}
                  </span>
                  {perk.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
            <p className="text-label-md uppercase tracking-[0.14em] text-secondary">
              Maison signature tier
            </p>
            <p className="mt-3 font-display text-3xl font-semibold text-primary">From ₹2,400</p>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              Handcrafted in the Freeganj atelier. Two tiers, one flavour pairing, gold leaf finish.
            </p>
            <dl className="mt-5 space-y-2 border-t border-outline-variant/60 pt-4 text-body-sm">
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Lead time</dt>
                <dd className="font-medium text-on-surface">4–7 days</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Payment</dt>
                <dd className="font-medium text-on-surface">Cash / UPI on delivery</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Delivery</dt>
                <dd className="font-medium text-on-surface">Refrigerated van</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold text-primary sm:text-3xl">
            Design your custom creation
          </h2>
          <p className="mt-2 text-body text-on-surface-variant">
            Give us as much detail as you can. Once reviewed, the chef patissier connects to finalise
            flavour profiles, weight and the aesthetic sketch.
          </p>
        </div>

        <CustomCakeForm />
      </section>
    </div>
  );
}
