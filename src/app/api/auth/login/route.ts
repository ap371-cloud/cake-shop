import { NextResponse } from "next/server";
import { loginUser } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const user = await loginUser({ email, password });
    return NextResponse.json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not log in.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}