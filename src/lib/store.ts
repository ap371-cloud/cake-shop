import type {
  ContactMessage,
  CustomCakeRequest,
  Order,
  OrderStatus,
  StoreSettings,
  UserProfile,
} from "@/types";
import { STORE_SETTINGS } from "@/lib/data";

// Thin client for the server API. Nothing here touches the database directly:
// prices, stock and totals are decided server-side, and the session cookie is
// the only proof of identity.

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as { error?: string } | null)?.error;
    throw new Error(message ?? "Something went wrong. Please try again.");
  }

  return data as T;
}

const json = (body: unknown): RequestInit => ({ body: JSON.stringify(body) });

export async function listOrders(_userId?: string): Promise<Order[]> {
  return api<Order[]>("/api/orders");
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    return await api<Order>(`/api/orders/${id}`);
  } catch {
    return null;
  }
}

export async function getOrderByNumber(orderNumber: string, phone?: string): Promise<Order | null> {
  const params = new URLSearchParams({ number: orderNumber });
  if (phone) params.set("phone", phone);

  try {
    return await api<Order>(`/api/orders/track?${params}`);
  } catch {
    return null;
  }
}

// Mirrors the payload /api/orders accepts. Totals, prices and the order number
// are decided on the server, so they are not part of this shape.
export type CreateOrderPayload = {
  customerName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryMethod: "delivery" | "pickup";
  deliveryDate: string;
  deliverySlot: string;
  deliveryNotes?: string;
  paymentMethod: "cash_on_delivery" | "upi_on_delivery";
  items: {
    name: string;
    price: number;
    quantity: number;
    slug?: string;
    variant?: string;
    variantId?: string;
  }[];
};

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return api<Order>("/api/orders", { method: "POST", ...json(payload) });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string
): Promise<Order> {
  return api<Order>(`/api/orders/${id}`, { method: "PATCH", ...json({ status, note }) });
}

export async function createCakeRequest(
  payload: Omit<CustomCakeRequest, "id" | "status" | "createdAt">
): Promise<CustomCakeRequest> {
  return api<CustomCakeRequest>("/api/cake-requests", { method: "POST", ...json(payload) });
}

export async function listCakeRequests(): Promise<CustomCakeRequest[]> {
  return api<CustomCakeRequest[]>("/api/cake-requests");
}

export async function createContactMessage(
  payload: Omit<ContactMessage, "id" | "createdAt">
): Promise<ContactMessage> {
  return api<ContactMessage>("/api/contact", { method: "POST", ...json(payload) });
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  return api<ContactMessage[]>("/api/contact");
}

export async function registerUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<UserProfile> {
  return api<UserProfile>("/api/auth/register", { method: "POST", ...json(input) });
}

export async function loginUser(input: { email: string; password: string }): Promise<UserProfile> {
  return api<UserProfile>("/api/auth/login", { method: "POST", ...json(input) });
}

export async function logoutUser(): Promise<void> {
  await api("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const { user } = await api<{ user: UserProfile | null }>("/api/auth/me");
    return user;
  } catch {
    return null;
  }
}

export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  return api("/api/auth/reset", { method: "POST", ...json({ action: "request", email }) });
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  return api("/api/auth/reset", {
    method: "POST",
    ...json({ action: "confirm", email, token, password: newPassword }),
  });
}

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    return await api<StoreSettings>("/api/settings");
  } catch {
    return STORE_SETTINGS;
  }
}

export async function updateStoreSettings(settings: StoreSettings): Promise<StoreSettings> {
  return api<StoreSettings>("/api/settings", { method: "PATCH", ...json(settings) });
}
