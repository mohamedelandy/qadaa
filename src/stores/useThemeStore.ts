/** @format */
/**
 * Persisted theme mode and layout direction synced with OS appearance.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Appearance } from "react-native";
import { asyncStorageAdapter } from "@data/storage/storage";
import { PERSIST_VERSION, migrateToCurrent } from "./persistMigrations";
import type { ThemeMode } from "@shared/theme";
interface ThemeState {
  mode: ThemeMode;
  direction: "ltr" | "rtl";
}
interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  setDirection: (direction: "ltr" | "rtl") => void;
  toggleTheme: () => void;
}
export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      mode: Appearance.getColorScheme() === "dark" ? "dark" : "light",
      direction: "ltr",
      setMode: (mode) => {
        set({ mode });
        Appearance.setColorScheme(mode);
      },
      setDirection: (direction) => set({ direction }),
      toggleTheme: () => {
        const next: ThemeMode = get().mode === "dark" ? "light" : "dark";
        set({ mode: next });
        Appearance.setColorScheme(next);
      },
    }),
    {
      name: "qadaa-theme",
      storage: createJSONStorage(() => asyncStorageAdapter),
      version: PERSIST_VERSION,
      migrate: migrateToCurrent,
      partialize: (state) => ({ mode: state.mode }),
      merge: (persisted, current) => {
        if (persisted === undefined) return current;
        // direction is runtime-only (not persisted via partialize), but strip
        // it defensively in case a future partialize change leaks it into storage.
        const { direction: _dir, ...rest } = persisted as Partial<ThemeState>;
        void _dir;
        return { ...current, ...rest };
      },
      onRehydrateStorage: () => (state) => {
        if (state?.mode) {
          Appearance.setColorScheme(state.mode);
        }
      },
    }
  )
);
