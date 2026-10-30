import { createClient } from "@supabase/supabase-js";

// Server-side admin client — NEVER import this into a client component.
// It uses the service-role key, which bypasses RLS. Only use it inside
// server route handlers for privileged operations.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase service-role key is not configured.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}