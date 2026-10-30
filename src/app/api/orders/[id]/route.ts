import { NextResponse } from "next/server";
import { getOrder } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (user && user.role !== "admin" && order.user_id && order.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  return NextResponse.json(order);
}