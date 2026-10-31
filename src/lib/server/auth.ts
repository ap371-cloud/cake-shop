import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import type { UserProfile } from "@/types";
import { getDb } from "./db";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number
) => Promise<Buffer>;

export const SESSION_COOKIE = "crumble_session";
const SESSION_DAYS = 30;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, digest] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !digest) return false;

  const derived = await scryptAsync(password, salt, 64);
  const expected = Buffer.from(digest, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

const digestToken = (token: string) => createHash("sha256").update(token).digest("hex");

async function startSession(userId: string) {
  const db = await getDb();
  const token = randomBytes(32).toString("hex");

  await db.query(
    "insert into public.sessions (user_id, token_hash, expires_at) values ($1, $2, now() + make_interval(days => $3))",
    [userId, digestToken(token), SESSION_DAYS]
  );

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    const db = await getDb();
    await db.query("delete from public.sessions where token_hash = $1", [digestToken(token)]);
  }

  store.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<UserProfile | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const db = await getDb();
  const { rows } = await db.query<{
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: "customer" | "admin" | null;
  }>(
    `select u.id, u.email, p.full_name, p.phone, p.role
       from public.sessions s
       join auth.users u on u.id = s.user_id
       left join public.profiles p on p.id = u.id
      where s.token_hash = $1 and s.expires_at > now()`,
    [digestToken(token)]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.full_name ?? "",
    phone: row.phone ?? "",
    role: row.role === "admin" ? "admin" : "customer",
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<UserProfile> {
  const db = await getDb();

  const existing = await db.query("select 1 from auth.users where lower(email) = lower($1)", [
    input.email,
  ]);
  if (existing.rows.length > 0) {
    throw new Error("An account with this email already exists.");
  }

  const { rows } = await db.query<{ id: string }>(
    `insert into auth.users (email, encrypted_password, raw_user_meta_data, email_confirmed_at)
     values ($1, $2, $3::jsonb, now())
     returning id`,
    [
      input.email,
      await hashPassword(input.password),
      JSON.stringify({ full_name: input.name, phone: input.phone }),
    ]
  );

  await startSession(rows[0].id);
  return (await getSessionUser())!;
}

export async function loginUser(input: { email: string; password: string }): Promise<UserProfile> {
  const db = await getDb();
  const { rows } = await db.query<{ id: string; encrypted_password: string }>(
    "select id, encrypted_password from auth.users where lower(email) = lower($1)",
    [input.email]
  );

  const row = rows[0];
  if (!row) throw new Error("No account found for this email.");
  if (!(await verifyPassword(input.password, row.encrypted_password))) {
    throw new Error("Incorrect password.");
  }

  await startSession(row.id);
  return (await getSessionUser())!;
}

// The token is written to the server log, never returned to the browser —
// otherwise anyone could reset any account they know the email of.
export async function requestPasswordReset(email: string) {
  const db = await getDb();
  const token = randomBytes(24).toString("hex");

  const { rows } = await db.query<{ id: string }>(
    "update auth.users set reset_token = $2, reset_expires_at = now() + interval '1 hour' where lower(email) = lower($1) returning id",
    [email, token]
  );

  if (rows.length > 0) {
    console.info(`[local auth] password reset token for ${email}: ${token}`);
  }

  return {
    success: true,
    message: "If that email is registered, a reset link has been sent.",
  };
}

export async function resetPassword(email: string, token: string, newPassword: string) {
  const db = await getDb();
  const { rows } = await db.query<{ id: string }>(
    `select id from auth.users
      where lower(email) = lower($1) and reset_token = $2 and reset_expires_at > now()`,
    [email, token]
  );

  if (rows.length === 0) {
    return { success: false, message: "Invalid or expired reset link." };
  }

  await db.query(
    "update auth.users set encrypted_password = $2, reset_token = null, reset_expires_at = null where id = $1",
    [rows[0].id, await hashPassword(newPassword)]
  );
  await db.query("delete from public.sessions where user_id = $1", [rows[0].id]);

  return { success: true, message: "Your password has been updated. You can now sign in." };
}
