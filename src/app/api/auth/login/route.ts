import { NextResponse } from "next/server";
import { loginUser } from "@/lib/server/auth";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "login"), 10, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await loginUser({ email, password });
    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not log in.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
