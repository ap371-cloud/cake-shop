import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || name.length > 100) return NextResponse.json({ error: "Name required." }, { status: 400 });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    if (!/^[0-9+\s()-]{7,15}$/.test(phone)) return NextResponse.json({ error: "Invalid phone." }, { status: 400 });
    if (!message || message.length < 10 || message.length > 2000) return NextResponse.json({ error: "Message must be 10–2000 characters." }, { status: 400 });

    const msg = await createContactMessage({ name, email, phone, message });
    return NextResponse.json(msg, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not send message.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}