"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { logoutUser } from "@/lib/store";
import { Button } from "@/components/ui/button";

const shortcuts = [
  { href: "/account/orders", icon: "receipt_long", title: "My orders", body: "Track live bakes and past receipts." },
  { href: "/track-order", icon: "local_shipping", title: "Track an order", body: "Look up any order with its number." },
  { href: "/custom-cake", icon: "cake", title: "Custom cake", body: "Commission a celebration centrepiece." },
  { href: "/shop", icon: "bakery_dining", title: "Browse bakes", body: "Today's oven drops and bestsellers." },
];

export function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await logoutUser();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6">
        <span aria-hidden className="material-symbols-outlined text-[44px] text-outline">
          lock
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-primary">Sign in required</h1>
        <p className="mt-2 text-body text-on-surface-variant">
          Your account keeps past orders and delivery details together.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/login?next=/account">Sign in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Create an account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-enter mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-label-md uppercase tracking-[0.18em] text-secondary">Atelier account</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
            Hello, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-body text-on-surface-variant">{user.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut} loading={signingOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-card)] bg-surface-container-low p-5">
          <p className="text-label-md uppercase tracking-[0.12em] text-on-surface-variant">Name</p>
          <p className="mt-1 text-title-lg text-primary">{user.name}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-surface-container-low p-5">
          <p className="text-label-md uppercase tracking-[0.12em] text-on-surface-variant">Phone</p>
          <p className="mt-1 text-title-lg text-primary">{user.phone}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-surface-container-low p-5">
          <p className="text-label-md uppercase tracking-[0.12em] text-on-surface-variant">Role</p>
          <p className="mt-1 text-title-lg capitalize text-primary">{user.role}</p>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold text-primary">Quick actions</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {shortcuts.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start gap-4 rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-level1 transition-colors hover:border-primary-container/60"
          >
            <span aria-hidden className="material-symbols-outlined text-[24px] text-secondary">
              {item.icon}
            </span>
            <span>
              <span className="block text-title-lg text-primary group-hover:text-primary-container">
                {item.title}
              </span>
              <span className="mt-1 block text-body-sm text-on-surface-variant">{item.body}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
