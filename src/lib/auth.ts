import { createServerSupabase } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";

export function supabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Auth lookup failing must not take the whole page down, so a missing session,
// missing config and a network blip all collapse to "guest".
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!supabaseConfigured()) return null;

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone, role")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email ?? "",
      name: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
      role: profile?.role === "admin" ? "admin" : "customer",
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
