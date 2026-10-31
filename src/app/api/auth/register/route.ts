import { NextResponse } from "next/server";
import { registerUser } from "@/lib/server/auth";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "register"), 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Name must be 2-100 characters." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!/^[0-9+\s()-]{7,15}$/.test(phone)) {
      return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const user = await registerUser({ name, email, phone, password });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create the account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
