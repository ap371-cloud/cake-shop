import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/server/orders";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/server/db";

export async function GET() {
  return NextResponse.json(await getStoreSettings());
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Only an administrator can change store settings." }, { status: 403 });
  }

  const body = await request.json();
  const db = await getDb();

  await db.query(
    `update public.store_settings set
       delivery_fee = $1,
       free_delivery_threshold = $2,
       phone = $3,
       email = $4,
       address = $5,
       opening_hours = $6,
       bake_drop_times = $7
     where id`,
    [
      Number(body.deliveryFee),
      Number(body.freeDeliveryThreshold),
      String(body.phone ?? ""),
      String(body.email ?? ""),
      String(body.address ?? ""),
      String(body.openingHours ?? ""),
      String(body.bakeDropTimes ?? ""),
    ]
  );

  return NextResponse.json(await getStoreSettings());
}
