"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/types";
import { useAuth } from "@/components/auth-provider";
import { listOrders } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const statusTone: Record<string, string> = {
  pending: "bg-surface-container text-on-surface-variant",
  confirmed: "bg-secondary-container/40 text-on-surface",
  baking: "bg-secondary-container text-on-secondary-container",
  dispatched: "bg-primary-fixed text-primary",
  delivered: "bg-sage/15 text-sage",
  cancelled: "bg-error-container text-error",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;

    listOrders()
      .then((rows) => {
        if (active) setOrders(rows);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load orders.");
      });

    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-primary">Sign in to see orders</h1>
        <p className="mt-2 text-body text-on-surface-variant">
          Past receipts and live bakes live in your account.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login?next=/account/orders">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-label-md text-on-surface-variant">
        <Link href="/account" className="hover:text-primary">
          Account
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary">My orders</span>
      </nav>

      <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">My orders</h1>
      <p className="mt-2 text-body text-on-surface-variant">
        Every bake you have booked with this account, newest first.
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      )}

      {!orders && !error && (
        <div className="mt-8 space-y-4">
          {[0, 1].map((row) => (
            <div key={row} className="h-32 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
          ))}
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="mt-10">
          <EmptyState
            icon="receipt_long"
            title="No orders yet"
            description="Your first bake is a click away — the oven is already warm."
            action={
              <Button asChild>
                <Link href="/shop">Browse the bakes</Link>
              </Button>
            }
          />
        </div>
      )}

      <div className="mt-8 space-y-4">
        {orders?.map((order) => (
          <article
            key={order.id}
            className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-level1"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-primary">{order.orderNumber}</p>
                <p className="text-label-md text-on-surface-variant">
                  Placed {formatDate(order.createdAt)} · {order.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}{" "}
                  on {formatDate(order.deliveryDate)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-label-md capitalize ${
                  statusTone[order.status] ?? "bg-surface-container text-on-surface-variant"
                }`}
              >
                {order.status}
              </span>
            </div>

            <ul className="mt-4 space-y-1 text-body-sm text-on-surface-variant">
              {order.items.map((item, index) => (
                <li key={`${item.slug ?? item.name}-${index}`} className="flex justify-between gap-4">
                  <span>
                    {item.name}
                    {item.variant ? ` · ${item.variant}` : ""} × {item.quantity}
                  </span>
                  <span className="font-medium text-on-surface">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/60 pt-4">
              <p className="text-body-sm">
                <span className="text-on-surface-variant">Total </span>
                <span className="font-semibold text-primary">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
                <span className="text-on-surface-variant">
                  {" "}
                  · {order.paymentMethod === "cash_on_delivery" ? "Cash on delivery" : "UPI on delivery"}
                </span>
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href={`/track-order?number=${encodeURIComponent(order.orderNumber)}`}>
                  Track order
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
