"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useStoreSettings } from "@/store/settings";
import { AuthProvider } from "@/components/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.getState().hydrate();
    void useStoreSettings.getState().load();
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
