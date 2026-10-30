"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.getState().hydrate();
  }, []);
  return <>{children}</>;
}