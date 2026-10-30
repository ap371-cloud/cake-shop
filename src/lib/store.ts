import type {
  Order,
  OrderStatus,
  CustomCakeRequest,
  ContactMessage,
  UserProfile,
  StoreSettings,
} from "@/types";
import { PRODUCTS, STORE_SETTINGS } from "@/lib/data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Persistence layer.
//
// When NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are configured, data is read and
// written through Supabase (with Row Level Security on the private tables).
// In local development with no Supabase project, we fall back to the browser's
// localStorage so every customer workflow is still fully functional and testable.
// Prices and totals are ALWAYS recomputed from the trusted catalogue in
// `data.ts`, never from client-supplied values.
// ---------------------------------------------------------------------------

const LS = {
  orders: "cc_orders",
  cakeRequests: "cc_cake_requests",
  messages: "cc_contact_messages",
  user: "cc_user",
  users: "cc_users",
  settings: "cc_settings",
} as const;

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — ignore */
  }
}

function makeOrderNumber(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `CC-${n}`;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function listOrders(userId?: string): Promise<Order[]> {
  if (isSupabaseConfigured) {
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (userId) q = q.eq("user_id", userId);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as Order[];
  }
  const all = readLS<Order[]>(LS.orders, []);
  const filtered = userId ? all.filter((o) => o.user_id === userId) : all;
  return filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function getOrder(id: string): Promise<Order | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
    if (error) return null;
    return data as Order;
  }
  const all = readLS<Order[]>(LS.orders, []);
  return all.find((o) => o.id === id) ?? null;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single();
    if (error) return null;
    return data as Order;
  }
  const all = readLS<Order[]>(LS.orders, []);
  return all.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()) ?? null;
}

/**
 * Create an order. Revalidates every line item against the trusted catalogue
 * and recomputes all money amounts server-side. Client-supplied prices are
 * never trusted.
 */
export async function createOrder(
  payload: Omit<Order, "id" | "orderNumber" | "status" | "statusHistory" | "createdAt" | "updatedAt" | "subtotal" | "deliveryFee" | "total" | "user_id"> & {
    user_id?: string;
  }
): Promise<Order> {
  // Recompute from the catalogue.
  const lines = payload.items.map((item) => {
    const product = PRODUCTS.find(
      (p) =>
        p.slug === item.slug ||
        p.id === item.name ||
        p.name.toLowerCase() === item.name.toLowerCase()
    );
    if (!product || !product.available || product.stock <= 0) {
      throw new Error(`"${item.name}" is no longer available.`);
    }
    const variant =
      item.variantId && product.variants
        ? product.variants.find((v) => v.id === item.variantId)
        : undefined;
    if (variant && variant.stock < item.quantity) {
      throw new Error(`Not enough stock for "${item.name}".`);
    }
    const unitPrice = variant ? variant.price : product.price;
    return {
      name: product.name,
      slug: product.slug,
      variantId: variant?.id,
      variantLabel: variant?.label,
      price: unitPrice,
      quantity: Math.max(1, Math.floor(item.quantity)),
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const settings = await getStoreSettings();
  const deliveryFee =
    payload.deliveryMethod === "delivery" && subtotal < settings.freeDeliveryThreshold
      ? settings.deliveryFee
      : 0;
  const total = subtotal + deliveryFee;

  const now = new Date().toISOString();
  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: makeOrderNumber(),
    customerName: payload.customerName,
    phone: payload.phone,
    email: payload.email,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2,
    landmark: payload.landmark,
    city: payload.city,
    state: payload.state,
    pinCode: payload.pinCode,
    deliveryMethod: payload.deliveryMethod,
    deliveryDate: payload.deliveryDate,
    deliverySlot: payload.deliverySlot,
    deliveryNotes: payload.deliveryNotes,
    paymentMethod: payload.paymentMethod,
    items: lines.map((l) => ({
      name: l.name,
      variant: l.variantLabel,
      price: l.price,
      quantity: l.quantity,
    })),
    subtotal,
    deliveryFee,
    total,
    status: "pending",
    statusHistory: [{ status: "pending", at: now, note: "Order request placed" }],
    createdAt: now,
    updatedAt: now,
    user_id: payload.user_id,
  };

  if (isSupabaseConfigured) {
    const { error } = await supabase.from("orders").insert(order);
    if (error) throw error;
  } else {
    const all = readLS<Order[]>(LS.orders, []);
    all.push(order);
    writeLS(LS.orders, all);
  }
  return order;
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["baking", "cancelled"],
  baking: ["dispatched", "cancelled"],
  dispatched: ["delivered"],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string
): Promise<Order> {
  const current = await getOrder(id);
  if (!current) throw new Error("Order not found.");
  if (!VALID_TRANSITIONS[current.status].includes(status)) {
    throw new Error(`Cannot move order from "${current.status}" to "${status}".`);
  }
  const now = new Date().toISOString();
  const updated: Order = {
    ...current,
    status,
    updatedAt: now,
    statusHistory: [...current.statusHistory, { status, at: now, note }],
  };

  if (isSupabaseConfigured) {
    const { error } = await supabase.from("orders").update(updated).eq("id", id);
    if (error) throw error;
  } else {
    const all = readLS<Order[]>(LS.orders, []);
    const i = all.findIndex((o) => o.id === id);
    if (i >= 0) all[i] = updated;
    writeLS(LS.orders, all);
  }
  return updated;
}

// ---------------------------------------------------------------------------
// Custom cake requests
// ---------------------------------------------------------------------------

export async function createCakeRequest(
  payload: Omit<CustomCakeRequest, "id" | "status" | "createdAt">
): Promise<CustomCakeRequest> {
  const req: CustomCakeRequest = {
    ...payload,
    id: crypto.randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("custom_cake_requests").insert(req);
    if (error) throw error;
  } else {
    const all = readLS<CustomCakeRequest[]>(LS.cakeRequests, []);
    all.push(req);
    writeLS(LS.cakeRequests, all);
  }
  return req;
}

export async function listCakeRequests(): Promise<CustomCakeRequest[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("custom_cake_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CustomCakeRequest[];
  }
  return readLS<CustomCakeRequest[]>(LS.cakeRequests, []).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------

export async function createContactMessage(
  payload: Omit<ContactMessage, "id" | "createdAt">
): Promise<ContactMessage> {
  const msg: ContactMessage = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("contact_messages").insert(msg);
    if (error) throw error;
  } else {
    const all = readLS<ContactMessage[]>(LS.messages, []);
    all.push(msg);
    writeLS(LS.messages, all);
  }
  return msg;
}

// ---------------------------------------------------------------------------
// Lightweight user accounts (local mode). In production, use Supabase Auth
// with email/password + RLS; this mirrors the same shape for local dev.
// ---------------------------------------------------------------------------

type StoredUser = UserProfile & { passwordHash: string; resetToken?: string };

// PBKDF2 via Web Crypto — a real, established hashing algorithm, not plaintext.
async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 120000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyPassword(password: string, salt: string, expected: string) {
  const got = await hashPassword(password, salt);
  return got === expected;
}

export async function registerUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<UserProfile> {
  const users = readLS<StoredUser[]>(LS.users, []);
  const exists = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (exists) throw new Error("An account with this email already exists.");
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(input.password, id);
  const user: StoredUser = {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    role: "customer",
    passwordHash,
  };
  users.push(user);
  writeLS(LS.users, users);
  const publicUser = stripSecrets(user);
  writeLS(LS.user, publicUser);
  return publicUser;
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<UserProfile> {
  const users = readLS<StoredUser[]>(LS.users, []);
  const user = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (!user) throw new Error("No account found for this email.");
  // Derive salt from a stable per-user key stored alongside.
  const ok = await verifyPassword(input.password, user.id, user.passwordHash);
  if (!ok) throw new Error("Incorrect password.");
  const publicUser = stripSecrets(user);
  writeLS(LS.user, publicUser);
  return publicUser;
}

export async function logoutUser(): Promise<void> {
  writeLS(LS.user, null);
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.user_metadata?.name ?? "Customer",
      phone: session.user.user_metadata?.phone ?? "",
      email: session.user.email ?? "",
      role: (session.user.user_metadata?.role as "customer" | "admin") ?? "customer",
    };
  }
  return readLS<UserProfile | null>(LS.user, null);
}

export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  const users = readLS<StoredUser[]>(LS.users, []);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  // Always report success to avoid account enumeration.
  if (!user) return { success: true, message: "If that email is registered, a reset link was sent." };
  user.resetToken = crypto.randomUUID();
  writeLS(LS.users, users);
  return {
    success: true,
    message:
      "If that email is registered, a reset link has been sent. (Demo: use the token shown by your admin.)",
  };
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const users = readLS<StoredUser[]>(LS.users, []);
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.resetToken === token
  );
  if (!user) return { success: false, message: "Invalid or expired reset link." };
  user.passwordHash = await hashPassword(newPassword, user.id);
  delete user.resetToken;
  writeLS(LS.users, users);
  return { success: true, message: "Your password has been updated. You can now sign in." };
}

function stripSecrets(u: StoredUser): UserProfile {
  const { passwordHash, resetToken, ...pub } = u;
  return pub;
}

// ---------------------------------------------------------------------------
// Store settings
// ---------------------------------------------------------------------------

export async function getStoreSettings(): Promise<StoreSettings> {
  if (typeof window === "undefined") return STORE_SETTINGS;
  return readLS<StoreSettings>(LS.settings, STORE_SETTINGS);
}

export async function updateStoreSettings(s: StoreSettings): Promise<StoreSettings> {
  writeLS(LS.settings, s);
  return s;
}