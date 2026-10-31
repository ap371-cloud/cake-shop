import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getOrder, updateOrderStatus } from "@/lib/server/orders";
import type { OrderStatus } from "@/types";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const user = await getCurrentUser();
  const isOwner = user && order.user_id === user.id;
  if (!isOwner && user?.role !== "admin") {
    return NextResponse.json({ error: "You cannot view this order." }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Only an administrator can update orders." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const status = body.status as OrderStatus;
    const order = await updateOrderStatus(id, status, body.note, user.id);
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update the order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
