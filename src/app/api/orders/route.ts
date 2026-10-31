import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createOrder, listOrders, type CreateOrderInput } from "@/lib/server/orders";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

const REQUIRED = [
  "customerName",
  "phone",
  "deliveryDate",
  "deliverySlot",
  "paymentMethod",
  "deliveryMethod",
] as const;

function validate(body: CreateOrderInput & Record<string, unknown>) {
  const missing = REQUIRED.filter((field) => !String(body[field] ?? "").trim());
  if (missing.length > 0) return `Missing required fields: ${missing.join(", ")}`;

  if (!/^[0-9+\s()-]{7,15}$/.test(String(body.phone))) return "Enter a valid phone number.";
  if (body.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(body.email))) {
    return "Enter a valid email address.";
  }

  if (body.deliveryMethod === "delivery") {
    for (const field of ["addressLine1", "city", "state", "pinCode"] as const) {
      if (!String(body[field] ?? "").trim()) return "A delivery address is required.";
    }
    if (!/^\d{6}$/.test(String(body.pinCode))) return "PIN code must be 6 digits.";
  }

  if (!["cash_on_delivery", "upi_on_delivery"].includes(body.paymentMethod)) {
    return "Choose a valid payment method.";
  }
  if (!["delivery", "pickup"].includes(body.deliveryMethod)) {
    return "Choose delivery or pickup.";
  }

  const deliveryDate = new Date(body.deliveryDate);
  if (Number.isNaN(deliveryDate.getTime())) return "Choose a valid delivery date.";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (deliveryDate < today) return "Delivery date cannot be in the past.";

  if (!Array.isArray(body.items) || body.items.length === 0) return "Your cart is empty.";
  if (body.items.length > 50) return "Too many different items in one order.";

  if (body.customerName.length > 100) return "Name is too long.";
  if ((body.deliveryNotes ?? "").length > 600) return "Delivery notes are too long.";

  return null;
}

function friendlyError(message: string) {
  if (message.startsWith("INSUFFICIENT_STOCK:")) {
    return `Not enough stock for ${message.split(":")[1]}.`;
  }
  if (message === "ITEM_UNAVAILABLE") return "One of the items is no longer available.";
  if (message === "CART_EMPTY") return "Your cart is empty.";
  if (message === "INVALID_QUANTITY") return "Invalid quantity.";
  return message;
}

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "orders"), 10, 60_000)) {
    return NextResponse.json(
      { error: "Too many order attempts. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as CreateOrderInput & Record<string, unknown>;
    const problem = validate(body);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const user = await getCurrentUser();
    const order = await createOrder(body, user?.id);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not place the order.";
    return NextResponse.json({ error: friendlyError(message) }, { status: 400 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const orders = await listOrders(user.role === "admin" ? undefined : user.id);
  return NextResponse.json(orders);
}
