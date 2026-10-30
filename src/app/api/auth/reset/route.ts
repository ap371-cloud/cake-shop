import { NextResponse } from "next/server";
import { requestPasswordReset, resetPassword } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json();
  const action = body.action;
  if (action === "request") {
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });
    const res = await requestPasswordReset(email);
    return NextResponse.json(res);
  }
  if (action === "confirm") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const token = String(body.token ?? "").trim();
    const password = String(body.password ?? "");
    if (!email || !token || password.length < 8) {
      return NextResponse.json({ error: "Invalid reset request." }, { status: 400 });
    }
    const res = await resetPassword(email, token, password);
    return NextResponse.json(res);
  }
  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}