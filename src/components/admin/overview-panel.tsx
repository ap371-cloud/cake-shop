"use client";

import type { ContactMessage, CustomCakeRequest, Order } from "@/types";

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
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function OverviewPanel({
  orders,
  requests,
  messages,
}: {
  orders: Order[];
  requests: CustomCakeRequest[];
  messages: ContactMessage[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const booked = orders.filter((order) => order.status !== "cancelled");
  const revenue = booked.reduce((sum, order) => sum + order.total, 0);
  const awaiting = orders.filter((order) => order.status === "pending").length;
  const newBriefs = requests.filter((request) => request.status === "new").length;
  const dispatches = booked.filter((order) => order.deliveryDate.slice(0, 10) === today);

  const stats = [
    { label: "Orders in the book", value: orders.length.toString(), icon: "receipt_long" },
    { label: "Revenue booked", value: `₹${revenue.toLocaleString("en-IN")}`, icon: "payments" },
    { label: "Awaiting confirmation", value: awaiting.toString(), icon: "pending_actions" },
    { label: "New cake briefs", value: newBriefs.toString(), icon: "cake" },
    { label: "Inbox", value: messages.length.toString(), icon: "mail" },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-level1"
          >
            <span aria-hidden className="material-symbols-outlined text-[22px] text-secondary">
              {stat.icon}
            </span>
            <p className="mt-2 font-display text-2xl font-semibold text-primary">{stat.value}</p>
            <p className="text-label-md text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-xl font-semibold text-primary">Going out today</h2>
          {dispatches.length === 0 ? (
            <p className="mt-2 text-body-sm text-on-surface-variant">
              Nothing scheduled for today. The ovens get a breather.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dispatches.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-body-sm"
                >
                  <span>
                    <span className="font-medium text-on-surface">{order.orderNumber}</span> ·{" "}
                    {order.customerName} · {order.deliverySlot}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-label-md capitalize ${statusTone[order.status]}`}>
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-primary">Latest orders</h2>
          <ul className="mt-3 space-y-2">
            {orders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-body-sm"
              >
                <span>
                  {order.orderNumber} · {formatDate(order.createdAt)} · ₹
                  {order.total.toLocaleString("en-IN")}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-label-md capitalize ${statusTone[order.status]}`}>
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
