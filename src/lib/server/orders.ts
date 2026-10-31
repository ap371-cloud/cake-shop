import type { Order, OrderStatus } from "@/types";
import { getDb } from "./db";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type OrderRow = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  phone: string;
  email: string | null;
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  fulfilment: "delivery" | "pickup";
  delivery_date: string | Date;
  delivery_slot: string;
  notes: string | null;
  payment_method: "cash_on_delivery" | "upi_on_delivery";
  subtotal: string;
  delivery_fee: string;
  total: string;
  status: OrderStatus;
  created_at: string | Date;
  updated_at: string | Date;
};

type ItemRow = {
  product_name: string;
  variant_label: string | null;
  unit_price: string;
  quantity: number;
};

type HistoryRow = { status: OrderStatus; note: string | null; created_at: string | Date };

const iso = (value: string | Date) => new Date(value).toISOString();

function toOrder(row: OrderRow, items: ItemRow[], history: HistoryRow[]): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    slug: row.order_number,
    user_id: row.user_id ?? undefined,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email ?? undefined,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2 ?? "",
    landmark: row.landmark ?? undefined,
    city: row.city,
    state: row.state,
    pinCode: row.pincode,
    deliveryMethod: row.fulfilment,
    deliveryDate: new Date(row.delivery_date).toISOString().slice(0, 10),
    deliverySlot: row.delivery_slot,
    deliveryNotes: row.notes ?? undefined,
    paymentMethod: row.payment_method,
    items: items.map((item) => ({
      name: item.product_name,
      variant: item.variant_label ?? undefined,
      price: Number(item.unit_price),
      quantity: item.quantity,
    })),
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    status: row.status,
    statusHistory: history.map((entry) => ({
      status: entry.status,
      at: iso(entry.created_at),
      note: entry.note ?? undefined,
    })),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

async function hydrate(rows: OrderRow[]): Promise<Order[]> {
  if (rows.length === 0) return [];
  const db = await getDb();
  const ids = rows.map((row) => row.id);

  const items = await db.query<ItemRow & { order_id: string }>(
    "select order_id, product_name, variant_label, unit_price, quantity from public.order_items where order_id = any($1::uuid[]) order by id",
    [ids]
  );
  const history = await db.query<HistoryRow & { order_id: string }>(
    "select order_id, status, note, created_at from public.order_status_history where order_id = any($1::uuid[]) order by created_at",
    [ids]
  );

  return rows.map((row) =>
    toOrder(
      row,
      items.rows.filter((item) => item.order_id === row.id),
      history.rows.filter((entry) => entry.order_id === row.id)
    )
  );
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!UUID.test(id)) return null;
  const db = await getDb();
  const { rows } = await db.query<OrderRow>("select * from public.orders where id = $1", [id]);
  const [order] = await hydrate(rows);
  return order ?? null;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const db = await getDb();
  const { rows } = await db.query<OrderRow>(
    "select * from public.orders where upper(order_number) = upper($1)",
    [orderNumber.trim()]
  );
  const [order] = await hydrate(rows);
  return order ?? null;
}

export async function listOrders(userId?: string): Promise<Order[]> {
  const db = await getDb();
  const { rows } = userId
    ? await db.query<OrderRow>(
        "select * from public.orders where user_id = $1 order by created_at desc",
        [userId]
      )
    : await db.query<OrderRow>("select * from public.orders order by created_at desc");

  return hydrate(rows);
}

export type CreateOrderInput = {
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
  items: { slug?: string; variantId?: string; variant?: string; name?: string; quantity: number }[];
};

async function resolveVariantId(
  item: CreateOrderInput["items"][number]
): Promise<string> {
  const db = await getDb();

  // Carts built from the static catalogue carry ids like "p1-v2", not UUIDs.
  if (item.variantId && UUID.test(item.variantId)) {
    const { rows } = await db.query<{ id: string }>(
      "select id from public.product_variants where id = $1",
      [item.variantId]
    );
    if (rows.length > 0) return rows[0].id;
  }

  if (item.slug) {
    const { rows } = await db.query<{ id: string }>(
      `select v.id
         from public.product_variants v
         join public.products p on p.id = v.product_id
        where p.slug = $1
          and ($2::text is null or v.label = $2)
        order by v.sort_order
        limit 1`,
      [item.slug, item.variant ?? null]
    );
    if (rows.length > 0) return rows[0].id;
  }

  throw new Error(`"${item.name ?? item.slug ?? "Item"}" is no longer available.`);
}

export async function createOrder(input: CreateOrderInput, userId?: string): Promise<Order> {
  const db = await getDb();

  const items: { variant_id: string; quantity: number }[] = [];
  for (const item of input.items) {
    const quantity = Math.max(1, Math.min(50, Math.floor(item.quantity)));
    items.push({ variant_id: await resolveVariantId(item), quantity });
  }

  const orderId = await db.transaction(async (tx) => {
    // create_order() reads auth.uid() for orders.user_id. Locally there is no
    // JWT, so the caller is passed through the setting for this transaction only.
    if (userId) {
      await tx.query("select set_config('app.user_id', $1, true)", [userId]);
    }

    const { rows } = await tx.query<{ id: string }>(
      "select (public.create_order($1::jsonb, $2::jsonb)).id",
      [
        JSON.stringify(items),
        JSON.stringify({
          customer_name: input.customerName,
          phone: input.phone,
          email: input.email ?? null,
          address_line1: input.addressLine1,
          address_line2: input.addressLine2 ?? null,
          landmark: input.landmark ?? null,
          city: input.city,
          state: input.state,
          pincode: input.pinCode,
          fulfilment: input.deliveryMethod,
          delivery_date: input.deliveryDate,
          delivery_slot: input.deliverySlot,
          notes: input.deliveryNotes ?? null,
          payment_method: input.paymentMethod,
        }),
      ]
    );

    return rows[0].id;
  });

  const order = await getOrder(orderId);
  if (!order) throw new Error("Order was created but could not be read back.");
  return order;
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
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
  note?: string,
  changedBy?: string
): Promise<Order> {
  const current = await getOrder(id);
  if (!current) throw new Error("Order not found.");
  if (!ALLOWED_TRANSITIONS[current.status].includes(status)) {
    throw new Error(`Cannot move an order from "${current.status}" to "${status}".`);
  }

  const db = await getDb();
  await db.query("update public.orders set status = $2 where id = $1", [id, status]);
  await db.query(
    "insert into public.order_status_history (order_id, status, note, changed_by) values ($1, $2, $3, $4)",
    [id, status, note ?? null, changedBy ?? null]
  );

  const updated = await getOrder(id);
  if (!updated) throw new Error("Order not found after update.");
  return updated;
}

export async function getStoreSettings() {
  const db = await getDb();
  const { rows } = await db.query<{
    delivery_fee: string;
    free_delivery_threshold: string;
    phone: string;
    email: string;
    address: string;
    opening_hours: string;
    bake_drop_times: string;
  }>("select * from public.store_settings where id");

  const row = rows[0];
  return {
    deliveryFee: Number(row.delivery_fee),
    freeDeliveryThreshold: Number(row.free_delivery_threshold),
    phone: row.phone,
    email: row.email,
    address: row.address,
    openingHours: row.opening_hours,
    bakeDropTimes: row.bake_drop_times,
  };
}
