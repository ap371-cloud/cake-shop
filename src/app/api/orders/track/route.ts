import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/server/orders";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import { getCurrentUser } from "@/lib/auth";

// Order numbers are sequential, so a number alone is not proof of ownership:
// either the phone matches or the signed-in customer owns the order.
export async function GET(request: Request) {
  if (!rateLimit(clientKey(request, "track"), 20, 60_000)) {
    return NextResponse.json({ error: "Too many lookups. Please wait a minute." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number")?.trim();
  const phone = searchParams.get("phone")?.trim();

  if (!number) {
    return NextResponse.json({ error: "Order number is required." }, { status: 400 });
  }

  const order = await getOrderByNumber(number);
  if (!order) {
    return NextResponse.json({ error: "No order matches those details." }, { status: 404 });
  }

  // A phone match lets guests track an order; otherwise only the owner may.
  const phoneMatches =
    Boolean(phone) && order.phone.replace(/\D/g, "") === phone!.replace(/\D/g, "");
  if (!phoneMatches) {
    const user = await getCurrentUser();
    if (!user || (order.user_id !== user.id && user.role !== "admin")) {
      return NextResponse.json({ error: "No order matches those details." }, { status: 404 });
    }
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    statusHistory: order.statusHistory,
    total: order.total,
    deliveryDate: order.deliveryDate,
    deliverySlot: order.deliverySlot,
    deliveryMethod: order.deliveryMethod,
    items: order.items.map((item) => ({
      name: item.name,
      variant: item.variant,
      quantity: item.quantity,
    })),
    createdAt: order.createdAt,
  });
}
