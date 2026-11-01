"use client";

import { useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/types";
import { updateOrderStatus } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "baking",
  "dispatched",
  "delivered",
  "cancelled",
];

const tone: Record<OrderStatus, string> = {
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

export function OrdersPanel({
  orders,
  onChange,
}: {
  orders: Order[];
  onChange: (order: Order) => void;
}) {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, OrderStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return orders.filter((order) => {
      if (filter !== "all" && order.status !== filter) return false;
      if (!needle) return true;
      return [order.orderNumber, order.customerName, order.phone].some((value) =>
        value.toLowerCase().includes(needle)
      );
    });
  }, [orders, filter, query]);

  async function applyStatus(order: Order, status: OrderStatus) {
    setBusyId(order.id);
    setError("");

    try {
      const updated = await updateOrderStatus(order.id, status, notes[order.id]?.trim() || undefined);
      onChange(updated);
      setDrafts((prev) => ({ ...prev, [order.id]: updated.status }));
      setNotes((prev) => ({ ...prev, [order.id]: "" }));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not update the order.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", ...STATUSES] as const).map((status) => {
            const count =
              status === "all" ? orders.length : orders.filter((order) => order.status === status).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-full px-3.5 py-1.5 text-label-md capitalize transition-colors ${
                  filter === status
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {status} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Order number, name or phone"
          aria-label="Search orders"
          className="sm:max-w-xs"
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon="receipt_long"
            title="No orders here"
            description={
              orders.length === 0
                ? "Nothing has come through yet. New orders appear the moment a customer checks out."
                : "No order matches this filter."
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visible.map((order) => {
            const nextStatus = drafts[order.id] ?? order.status;
            const address =
              order.deliveryMethod === "pickup"
                ? "Pickup at the atelier"
                : [order.addressLine1, order.addressLine2, order.city, `${order.state} ${order.pinCode}`]
                    .filter(Boolean)
                    .join(", ");

            return (
              <article
                key={order.id}
                className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-level1"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-primary">
                      {order.orderNumber}
                    </p>
                    <p className="text-label-md text-on-surface-variant">
                      {formatDate(order.createdAt)} · {order.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}{" "}
                      on {formatDate(order.deliveryDate)} · {order.deliverySlot}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-label-md capitalize ${tone[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="text-body-sm text-on-surface-variant">
                    <p className="font-medium text-on-surface">{order.customerName}</p>
                    <p>
                      <a href={`tel:${order.phone}`} className="hover:text-primary">
                        {order.phone}
                      </a>
                      {order.email ? (
                        <>
                          {" · "}
                          <a href={`mailto:${order.email}`} className="hover:text-primary">
                            {order.email}
                          </a>
                        </>
                      ) : null}
                    </p>
                    <p className="mt-1">{address}</p>
                    {order.landmark && <p>Landmark: {order.landmark}</p>}
                    {order.deliveryNotes && (
                      <p className="mt-2 rounded-lg bg-surface-container-low px-3 py-2">
                        “{order.deliveryNotes}”
                      </p>
                    )}
                  </div>

                  <div className="text-body-sm">
                    <ul className="space-y-1 text-on-surface-variant">
                      {order.items.map((item, index) => (
                        <li key={`${item.slug ?? item.name}-${index}`} className="flex justify-between gap-3">
                          <span>
                            {item.name}
                            {item.variant ? ` · ${item.variant}` : ""} × {item.quantity}
                          </span>
                          <span className="text-on-surface">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 flex justify-between border-t border-outline-variant/60 pt-2 text-body">
                      <span className="text-on-surface-variant">
                        {order.paymentMethod === "cash_on_delivery" ? "Cash on delivery" : "UPI on delivery"}
                      </span>
                      <span className="font-semibold text-primary">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-outline-variant/60 pt-4 sm:flex-row sm:items-center">
                  <Select
                    aria-label={`Status for ${order.orderNumber}`}
                    value={nextStatus}
                    onChange={(event) =>
                      setDrafts((prev) => ({ ...prev, [order.id]: event.target.value as OrderStatus }))
                    }
                    className="sm:max-w-44"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>

                  <Input
                    value={notes[order.id] ?? ""}
                    onChange={(event) =>
                      setNotes((prev) => ({ ...prev, [order.id]: event.target.value }))
                    }
                    placeholder="Note for the status log (optional)"
                    aria-label={`Status note for ${order.orderNumber}`}
                    className="flex-1"
                  />

                  <Button
                    onClick={() => applyStatus(order, nextStatus)}
                    loading={busyId === order.id}
                    disabled={nextStatus === order.status}
                  >
                    Update
                  </Button>
                </div>

                {order.statusHistory.length > 0 && (
                  <details className="mt-3 text-label-md text-on-surface-variant">
                    <summary className="cursor-pointer hover:text-primary">
                      Status history ({order.statusHistory.length})
                    </summary>
                    <ul className="mt-2 space-y-1">
                      {order.statusHistory.map((entry, index) => (
                        <li key={`${entry.at}-${index}`}>
                          {formatDate(entry.at)} · <span className="capitalize">{entry.status}</span>
                          {entry.note ? ` — ${entry.note}` : ""}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
