import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { PRODUCTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Crumble & Co. to reorder favourites and follow your bakes.",
};

const hero = PRODUCTS.find((product) => product.featured) ?? PRODUCTS[0];

export default function LoginPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
      <div className="order-2 hidden lg:order-1 lg:block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-surface-container shadow-level2">
          <Image
            src={hero.images[0]}
            alt={hero.name}
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover"
            priority
          />
        </div>
        <blockquote className="mt-6 font-display text-xl italic leading-relaxed text-primary">
          “The sweetest memories are forged around unhurried craft.”
        </blockquote>
        <p className="mt-2 text-label-md uppercase tracking-[0.14em] text-on-surface-variant">
          Since 2018 · Freeganj, Ujjain
        </p>
      </div>

      <div className="order-1 lg:order-2">
        <p className="text-label-md uppercase tracking-[0.18em] text-secondary">Atelier account</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-2 text-body text-on-surface-variant">
          Sign in to see past orders, reorder a favourite and keep your delivery details handy.
        </p>

        <div className="mt-8 rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1 sm:p-8">
          <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-surface-container" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
