import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCakeRequest, listCakeRequests, updateCakeRequestStatus } from "@/lib/server/requests";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

const REQUIRED = [
  "name",
  "email",
  "phone",
  "flavour",
  "size",
  "shape",
  "occasion",
  "designDescription",
  "preferredDate",
  "budgetRange",
] as const;

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "cake-requests"), 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  try {
    const body = await request.json();

    const missing = REQUIRED.filter((field) => !String(body[field] ?? "").trim());
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(body.email))) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!/^[0-9+\s()-]{7,15}$/.test(String(body.phone))) {
      return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
    }
    if (String(body.designDescription).length > 1500) {
      return NextResponse.json({ error: "Please keep the design description shorter." }, { status: 400 });
    }

    const preferred = new Date(body.preferredDate);
    const earliest = new Date();
    earliest.setDate(earliest.getDate() + 2);
    earliest.setHours(0, 0, 0, 0);
    if (Number.isNaN(preferred.getTime()) || preferred < earliest) {
      return NextResponse.json(
        { error: "Custom cakes need at least 48 hours notice." },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const created = await createCakeRequest(body, user?.id);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit the request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Only an administrator can view requests." }, { status: 403 });
  }

  return NextResponse.json(await listCakeRequests());
}

const REQUEST_STATUSES = ["new", "reviewing", "quoted", "accepted", "declined"] as const;

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Only an administrator can update requests." }, { status: 403 });
  }

  const body = await request.json();
  const status = String(body.status ?? "");
  if (!REQUEST_STATUSES.includes(status as (typeof REQUEST_STATUSES)[number])) {
    return NextResponse.json({ error: "Unknown request status." }, { status: 400 });
  }

  try {
    const updated = await updateCakeRequestStatus(String(body.id ?? ""), status as (typeof REQUEST_STATUSES)[number]);
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update the request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
