import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

// POST /api/orders — place an order. Validates everything server-side.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getCurrentUser();

    const required = [
      "customerName",
      "phone",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pinCode",
      "deliveryDate",
      "deliverySlot",
      "paymentMethod",
      "deliveryMethod",
    ];
    const missing = required.filter((k) => !body[k] || String(body[k]).trim() === "");
    if (missing.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(String(body.pinCode))) {
      return NextResponse.json({ error: "Invalid PIN code." }, { status: 400 });
    }
    if (!/^[0-9+\s()-]{7,15}$/.test(String(body.phone))) {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }
    if (body.customerName.length > 100 || body.addressLine1.length > 200 || body.addressLine2.length > 200) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }
    if (body.deliveryNotes && body.deliveryNotes.length > 600) {
      return NextResponse.json({ error: "Delivery notes too long." }, { status: 400 });
    }
    if (!["cash_on_delivery", "upi_on_delivery"].includes(body.paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }
    if (!["delivery", "pickup"].includes(body.deliveryMethod)) {
      return NextResponse.json({ error: "Invalid delivery method." }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const order = await createOrder({
      ...body,
      user_id: user?.id,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not place order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// GET /api/orders — list the caller's own orders only.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  }
  const orders = await listOrders(user.id);
  return NextResponse.json(orders);
}