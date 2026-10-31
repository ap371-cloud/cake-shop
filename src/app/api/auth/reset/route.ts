import { NextResponse } from "next/server";
import { requestPasswordReset, resetPassword } from "@/lib/server/auth";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "reset"), 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  const body = await request.json();

  if (body.action === "request") {
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    return NextResponse.json(await requestPasswordReset(email));
  }

  if (body.action === "confirm") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const token = String(body.token ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !token || password.length < 8) {
      return NextResponse.json({ error: "Invalid reset request." }, { status: 400 });
    }
    return NextResponse.json(await resetPassword(email, token, password));
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
