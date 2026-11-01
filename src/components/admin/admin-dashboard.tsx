"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { ContactMessage, CustomCakeRequest, Order, StoreSettings } from "@/types";
import { useAuth } from "@/components/auth-provider";
import {
  getStoreSettings,
  listCakeRequests,
  listContactMessages,
  listOrders,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { OverviewPanel } from "./overview-panel";
import { OrdersPanel } from "./orders-panel";
import { CakeRequestsPanel } from "./cake-requests-panel";
import { MessagesPanel } from "./messages-panel";
import { SettingsPanel } from "./settings-panel";

const TABS = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "orders", label: "Orders", icon: "receipt_long" },
  { id: "requests", label: "Cake requests", icon: "cake" },
  { id: "messages", label: "Messages", icon: "mail" },
  { id: "settings", label: "Settings", icon: "tune" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<TabId>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<CustomCakeRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  const load = useCallback(async () => {
    setFetching(true);
    setError("");

    try {
      const [orderRows, requestRows, messageRows, storeSettings] = await Promise.all([
        listOrders(),
        listCakeRequests(),
        listContactMessages(),
        getStoreSettings(),
      ]);

      setOrders(orderRows);
      setRequests(requestRows);
      setMessages(messageRows);
      setSettings(storeSettings);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load the console.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-48 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6">
        <span aria-hidden className="material-symbols-outlined text-[44px] text-outline">
          lock
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-primary">Staff only</h1>
        <p className="mt-2 text-body text-on-surface-variant">
          Sign in with an administrator account to open the console.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login?next=/admin">Sign in</Link>
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6">
        <span aria-hidden className="material-symbols-outlined text-[44px] text-outline">
          shield_person
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-primary">No access</h1>
        <p className="mt-2 text-body text-on-surface-variant">
          {user.email} is a customer account. Ask the atelier owner to grant administrator rights.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/account">Back to my account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-label-md uppercase tracking-[0.18em] text-secondary">Atelier console</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
            Good day, {user.name.split(" ")[0]}
          </h1>
        </div>
        <Button variant="outline" onClick={() => void load()} loading={fetching}>
          Refresh
        </Button>
      </div>

      <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-outline-variant/60 pb-px">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`flex shrink-0 items-center gap-2 rounded-t-xl px-4 py-2.5 text-label-lg transition-colors ${
              tab === item.id
                ? "border-b-2 border-primary-container text-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span aria-hidden className="material-symbols-outlined text-[18px]">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      )}

      <div className="mt-8">
        {fetching && orders.length === 0 ? (
          <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-surface-container" />
        ) : (
          <>
            {tab === "overview" && (
              <OverviewPanel orders={orders} requests={requests} messages={messages} />
            )}

            {tab === "orders" && (
              <OrdersPanel
                orders={orders}
                onChange={(updated) =>
                  setOrders((prev) => prev.map((order) => (order.id === updated.id ? updated : order)))
                }
              />
            )}

            {tab === "requests" && (
              <CakeRequestsPanel
                requests={requests}
                onChange={(updated) =>
                  setRequests((prev) =>
                    prev.map((request) => (request.id === updated.id ? updated : request))
                  )
                }
              />
            )}

            {tab === "messages" && <MessagesPanel messages={messages} />}

            {tab === "settings" && settings && (
              <SettingsPanel settings={settings} onChange={setSettings} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
