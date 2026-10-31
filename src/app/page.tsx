import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductRail } from "@/components/home/product-rail";
import { CATEGORIES, PRODUCTS, STORE_SETTINGS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Freshly Baked, Happier Days",
  description:
    "Small-batch cakes, laminated pastries and slow-fermented breads from Crumble & Co. in Freeganj, Ujjain. Fresh bake drops twice a day, cash or UPI on delivery.",
};

const promises = [
  { icon: "oven_gen", title: "Fresh batch ready", body: "Baked fresh today at 7:00 AM" },
  { icon: "eco", title: "Fresh ingredients", body: "Always fresh & premium sourced" },
  { icon: "cake", title: "Bespoke moments", body: "For your special celebrations" },
  { icon: "room_service", title: "Local delivery", body: "Chilled right to your doorstep" },
  { icon: "verified_user", title: "Hygienic & safe", body: "Crafted with artisan care" },
];

const testimonials = [
  {
    quote:
      "The Chocolate Truffle cake was the star of my sister's 25th birthday! Rich, not overly sweet, and the delivery arrived right on time in pristine condition.",
    name: "Priya S.",
    bought: "Chocolate Truffle Cake, 1 kg",
  },
  {
    quote:
      "Crumble & Co. made our wedding anniversary cake. The customised floral piping was breathtaking, and the eggless red velvet sponge melted in our mouths!",
    name: "Rohan & Ananya M.",
    bought: "Custom 2-tier floral cake",
  },
  {
    quote:
      "Hands down the best sourdough and blueberry cheesecake in town. The offline order confirmation was smooth, personal and delightfully attentive.",
    name: "Devika K.",
    bought: "Blueberry Cheesecake & Sourdough",
  },
];

const orderingSteps = [
  {
    icon: "shopping_bag",
    title: "Pick your bakes",
    body: "Browse the collection and add what you love to the pastry bag.",
  },
  {
    icon: "call",
    title: "We call to confirm",
    body: "A baker rings or WhatsApps within 30 minutes to lock the slot and payment mode.",
  },
  {
    icon: "door_front",
    title: "Pay on handover",
    body: "Inspect the box, then hand over cash or scan the rider's UPI code.",
  },
];

export default function HomePage() {
  const bestsellers = PRODUCTS.filter((product) => product.bestseller).slice(0, 4);
  const hero = PRODUCTS.find((product) => product.featured) ?? PRODUCTS[0];
  const dailyBakes = PRODUCTS.filter(
    (product) => product.category === "Pastries" || product.category === "Breads"
  ).slice(0, 4);

  return (
    <div className="animate-page-enter">
      <section className="relative overflow-hidden border-b border-outline-variant/60 bg-surface-container-low">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <p className="flex items-center gap-2 text-label-md uppercase tracking-[0.18em] text-secondary">
              <span aria-hidden className="material-symbols-outlined text-[18px]">
                local_florist
              </span>
              Handcrafted with love
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-primary sm:text-5xl lg:text-6xl">
              Freshly baked,
              <br />
              happier days.
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">
              Cakes, pastries and bakes made with love for every occasion. Crafted daily in small
              batches with pure cultured cream butter, organic heirloom flour and Belgian
              single-origin chocolate.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/shop">Order now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/shop">Explore our menu</Link>
              </Button>
            </div>

            <dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-outline-variant/60 pt-6">
              <div className="flex items-center gap-2">
                <span aria-hidden className="material-symbols-outlined text-[20px] text-secondary">
                  star
                </span>
                <dt className="sr-only">Rating</dt>
                <dd className="text-body-sm text-on-surface">
                  <span className="font-semibold text-primary">4.9</span> rating
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden className="material-symbols-outlined text-[20px] text-secondary">
                  celebration
                </span>
                <dd className="text-body-sm text-on-surface">
                  <span className="font-semibold text-primary">1,200+</span> happy celebrations
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden className="material-symbols-outlined text-[20px] text-secondary">
                  verified
                </span>
                <dd className="text-body-sm text-on-surface">100% pure butter bakes</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-surface-container shadow-level3 lg:aspect-[5/4]">
              <Image
                src={hero.images[0]}
                alt={hero.name}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-2xl bg-surface-container-lowest px-5 py-3 shadow-level2 sm:left-8">
              <p className="text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                Today&apos;s favourite
              </p>
              <p className="text-body font-medium text-primary">{hero.name}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-outline-variant/60 bg-surface-container-lowest">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
          {promises.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span aria-hidden className="material-symbols-outlined text-[22px] text-secondary">
                {item.icon}
              </span>
              <div>
                <p className="text-body-sm font-medium text-primary">{item.title}</p>
                <p className="text-label-md text-on-surface-variant">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
              Patisserie favourites
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
              Our bestsellers
            </h2>
            <p className="mt-2 max-w-xl text-body text-on-surface-variant">
              Customer favourites, baked fresh from early morning.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-label-lg text-secondary hover:text-primary"
          >
            View all bakes
            <span aria-hidden className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="mt-8">
          <ProductRail products={bestsellers} />
        </div>
      </section>

      <section className="bg-surface-container-low py-14 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
              Curated collections
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
              Shop by category
            </h2>
            <p className="mt-2 text-body text-on-surface-variant">
              Artisanal morning bakes, tea accompaniments and celebration showstoppers.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={`/shop?category=${category.name.toLowerCase()}`}
                className="group overflow-hidden rounded-[var(--radius-card)] bg-surface-container-lowest shadow-level1"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 180px"
                    className="object-cover transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-title-lg text-primary group-hover:text-primary-container">
                    {category.name}
                  </p>
                  <p className="text-label-md text-on-surface-variant">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-[var(--radius-card)] bg-primary px-6 py-10 text-on-primary sm:px-10 lg:px-14 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-label-md uppercase tracking-[0.18em] text-on-primary/70">
                <span aria-hidden className="material-symbols-outlined text-[18px]">
                  draw
                </span>
                Bespoke atelier orders
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Custom cakes for every occasion
              </h2>
              <p className="mt-4 max-w-xl text-body text-on-primary/80">
                Birthdays, anniversaries, weddings and every milestone worth cherishing. We turn
                mood boards, colour palettes and fond memories into edible art.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-6">
                <Link href="/custom-cake">Order a custom cake</Link>
              </Button>
            </div>

            <ul className="space-y-3 text-body">
              {[
                { icon: "call", text: "1-on-1 consultation call" },
                { icon: "cloud_upload", text: "Complimentary tasting box" },
                { icon: "palette", text: "Custom message & theme art" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <span aria-hidden className="material-symbols-outlined text-[20px] text-secondary-fixed">
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-outline-variant/60 bg-surface-container-lowest py-14 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
                Morning oven drops
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
                Freshly baked daily
              </h2>
              <p className="mt-2 max-w-xl text-body text-on-surface-variant">
                Straight from our hearth ovens twice every day.
              </p>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-secondary-container/40 px-4 py-2 text-label-md text-on-secondary-container">
              <span aria-hidden className="material-symbols-outlined text-[16px]">
                update
              </span>
              Next drop at 4:00 PM
            </p>
          </div>

          <div className="mt-8">
            <ProductRail products={dailyBakes} />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-label-md uppercase tracking-[0.18em] text-secondary">
            Praise &amp; celebrations
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
            Sweet words from our customers
          </h2>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="flex flex-col rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1"
            >
              <div className="flex gap-1 text-secondary" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} aria-hidden className="material-symbols-outlined text-[16px]">
                    star
                  </span>
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-body text-on-surface-variant">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-4 border-t border-outline-variant/60 pt-4">
                <p className="text-body-sm font-medium text-primary">{item.name}</p>
                <p className="text-label-md text-on-surface-variant">{item.bought}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low py-14 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-label-md uppercase tracking-[0.18em] text-secondary">
                <span aria-hidden className="material-symbols-outlined text-[18px]">
                  contactless
                </span>
                Simple, personal ordering
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
                No gateway, just a phone call
              </h2>
              <p className="mt-3 text-body text-on-surface-variant">
                Browse, customise and place your items. Our master baker confirms your delivery slot
                and payment preference over WhatsApp or phone before dispatch. No advance payment
                needed.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/faq">Learn how it works</Link>
              </Button>
            </div>

            <ol className="grid gap-4 sm:grid-cols-3">
              {orderingSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-[var(--radius-card)] bg-surface-container-lowest p-5 shadow-level1"
                >
                  <span aria-hidden className="material-symbols-outlined text-[24px] text-secondary">
                    {step.icon}
                  </span>
                  <p className="mt-3 text-label-md uppercase tracking-[0.12em] text-on-surface-variant">
                    Step {index + 1}
                  </p>
                  <p className="mt-1 text-title-lg text-primary">{step.title}</p>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-10 text-label-md text-on-surface-variant">
            {STORE_SETTINGS.openingHours} · {STORE_SETTINGS.bakeDropTimes} · City-wide refrigerated
            dispatch
          </p>
        </div>
      </section>
    </div>
  );
}
