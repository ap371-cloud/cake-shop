import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/store";

export async function POST() {
  await logoutUser();
  return NextResponse.json({ ok: true });
}