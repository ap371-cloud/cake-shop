"use client";

import { create } from "zustand";
import type { StoreSettings } from "@/types";
import { STORE_SETTINGS } from "@/lib/data";

type SettingsState = {
  settings: StoreSettings;
  loaded: boolean;
  load: () => Promise<void>;
  save: (next: StoreSettings) => Promise<void>;
};

// The build-time defaults render instantly; the live values (delivery fee,
// threshold) come from the database once the client asks for them.
export const useStoreSettings = create<SettingsState>()((set, get) => ({
  settings: STORE_SETTINGS,
  loaded: false,

  load: async () => {
    if (get().loaded) return;

    try {
      const response = await fetch("/api/settings", { cache: "no-store" });
      if (!response.ok) return;
      set({ settings: (await response.json()) as StoreSettings, loaded: true });
    } catch {
      // offline or server down — the baked-in defaults stay in place
    }
  },

  save: async (next) => {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error ?? "Could not save the settings.");
    }

    set({ settings: (await response.json()) as StoreSettings, loaded: true });
  },
}));
