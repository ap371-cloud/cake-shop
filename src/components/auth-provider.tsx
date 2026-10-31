"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { UserProfile } from "@/types";

type AuthContext = {
  user: UserProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) throw new Error("not signed in");
      const data = (await response.json()) as { user: UserProfile | null };
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refresh();
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return <Ctx.Provider value={{ user, loading, refresh }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const context = useContext(Ctx);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>.");
  return context;
}
