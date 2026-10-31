import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a Crumble & Co. account to track orders, save delivery details and reorder your favourite bakes.",
};

const perks = [
  "Order history and one-tap reorders",
  "Saved delivery details at checkout",
  "Early access to seasonal bake drops",
];

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-20">
      <div className="text-center">
        <p className="text-label-md uppercase tracking-[0.18em] text-secondary">Join the atelier</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
          Create your account
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-body text-on-surface-variant">
          A few details and your bakes are one tap away next time.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
        <div className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1 sm:p-8">
          <RegisterForm />
        </div>

        <aside className="rounded-[var(--radius-card)] bg-surface-container-low p-6">
          <p className="text-title-lg text-primary">Member perks</p>
          <ul className="mt-3 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex gap-2 text-body-sm text-on-surface-variant">
                <span aria-hidden className="material-symbols-outlined text-[18px] text-sage">
                  check
                </span>
                {perk}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-outline-variant/60 pt-4 text-label-md text-on-surface-variant">
            No online payment is stored. Orders are paid by cash or UPI on delivery.
          </p>
        </aside>
      </div>
    </div>
  );
}
