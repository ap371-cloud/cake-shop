import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Crumble & Co. has been baking in small batches since 2018 — stone-ground heirloom grains, 84% cultured butter and a 36-hour cold ferment. No premixes, no shortcuts.",
};

const values = [
  {
    icon: "water_drop",
    title: "100% Cultured Butter",
    body: "Churned slow from European-style cultures for a golden lamination and an unmistakably velvety crumb.",
  },
  {
    icon: "local_fire_department",
    title: "Small-Batch Baking",
    body: "Our deck ovens are fired twice a day, at 9:00 AM and 4:00 PM, so every table gets an oven-warm bake.",
  },
  {
    icon: "eco",
    title: "Thoughtful Inclusivity",
    body: "A separate eggless chamber, organic nut flours and silk-smooth vegan ganache — never an afterthought.",
  },
  {
    icon: "award_star",
    title: "Zero-Compromise Purity",
    body: "Real Madagascar bourbon vanilla, Valrhona 70% couverture and berries sourced every week.",
  },
];

const milestones = [
  { value: "36h", label: "Cold ferment" },
  { value: "84%", label: "Butterfat minimum" },
  { value: "0%", label: "Artificial dyes" },
];

export default function AboutPage() {
  const gallery = PRODUCTS.slice(0, 3);

  return (
    <div className="animate-page-enter">
      <section className="border-b border-outline-variant/60 bg-surface-container-low">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
            Artisan atelier story
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
            Baked with love.
            <br />
            Made for your moments.
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-on-surface-variant">
            We believe the sweetest memories are forged around unhurried craft, heirloom grains and
            pure cultured butter — not around a factory line.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">Taste the collection</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/custom-cake">Design a custom cake</Link>
            </Button>
          </div>

          <dl className="mt-14 grid gap-6 border-t border-outline-variant/60 pt-8 sm:grid-cols-3">
            {milestones.map((item) => (
              <div key={item.label}>
                <dt className="font-display text-3xl font-semibold text-primary">{item.value}</dt>
                <dd className="mt-1 text-body-sm text-on-surface-variant">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
              Our story &amp; philosophy
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-primary sm:text-4xl">
              Rejecting the shortcuts, honouring the slow craft.
            </h2>

            <div className="mt-6 space-y-5 text-body text-on-surface-variant">
              <p>
                Crumble &amp; Co. began in 2018, not inside a commercial factory but around a small
                stone countertop in a sun-drenched quarter kitchen. We were tired of industrial
                bakeries masking dull flour with powdered shortening, synthetic syrups and
                high-fructose pastes.
              </p>
              <p>
                We chose the quiet path of the classical French atelier: a slow 36-hour cold
                fermentation, stone-ground heirloom wheat milled locally, and real cultured cream
                butter at a minimum of 84% butterfat. Every bake you hold has been mixed, rested,
                laminated and shaped by hands that care about the crust as much as the crumb.
              </p>
            </div>

            <blockquote className="mt-8 border-l-2 border-secondary-container pl-5 font-display text-xl italic leading-relaxed text-primary">
              “A great cake doesn’t simply decorate an occasion — it crystallises it in memory.”
            </blockquote>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {gallery.slice(0, 2).map((product) => (
              <div
                key={product.id}
                className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-surface-container shadow-level1"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
              The pillar standard
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
              Our guiding values
            </h2>
            <p className="mt-4 text-body text-on-surface-variant">
              Four non-negotiable tenets that keep every bake honest.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1"
              >
                <span aria-hidden className="material-symbols-outlined text-[28px] text-secondary">
                  {value.icon}
                </span>
                <h3 className="mt-4 text-title-lg text-primary">{value.title}</h3>
                <p className="mt-2 text-body-sm text-on-surface-variant">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
              Behind the flour dust
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
              Behind the bakes
            </h2>
            <p className="mt-4 text-body text-on-surface-variant">
              Lamination at 5:00 AM, tempering chocolate by hand, folding the last berries into a
              tart shell. Nothing here is automated, and that is the whole point.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/shop">See what came out of the oven today</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gallery.map((product, index) => (
              <div
                key={product.id}
                className={`relative overflow-hidden rounded-[var(--radius-card)] bg-surface-container shadow-level1 ${
                  index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                }`}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
