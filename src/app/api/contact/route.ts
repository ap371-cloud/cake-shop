import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createContactMessage, listContactMessages } from "@/lib/server/requests";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "contact"), 5, 60_000)) {
    return NextResponse.json({ error: "Too many messages. Please wait a minute." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: "Please keep your message under 2000 characters." }, { status: 400 });
    }

    const created = await createContactMessage({
      name,
      email,
      phone: String(body.phone ?? "").trim(),
      message,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const text = error instanceof Error ? error.message : "Could not send the message.";
    return NextResponse.json({ error: text }, { status: 400 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Only an administrator can read messages." }, { status: 403 });
  }

  return NextResponse.json(await listContactMessages());
}
