import type { UserProfile } from "@/types";
import { getSessionUser } from "@/lib/server/auth";

export async function getCurrentUser(): Promise<UserProfile | null> {
  return getSessionUser();
}

export async function requireUser(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requireAdmin(): Promise<UserProfile> {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
