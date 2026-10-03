/** @format */
/**
 * Derives the memoized theme object with dark/RTL flags from theme store state.
 */
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { buildTheme } from "@presentation/theme/ThemeProvider";
import { useThemeStore } from "@stores/useThemeStore";
export function useTheme() {
  // Optimization: Batch multiple store property reads using useShallow to prevent unnecessary re-renders
  // Expected impact: Reduces store subscriptions from 3 to 1 and prevents re-renders when unrelated theme state changes.
  const { mode, direction, toggleTheme } = useThemeStore(
    useShallow((s) => ({
      mode: s.mode,
      direction: s.direction,
      toggleTheme: s.toggleTheme,
    }))
  );
  const theme = useMemo(() => buildTheme(mode, direction), [mode, direction]);
  const isRTL = direction === "rtl";
  return useMemo(
    () => ({
      ...theme,
      isDark: mode === "dark",
      isRTL,
      textAlign: isRTL ? "right" : ("left" as const),
      toggleTheme,
    }),
    [theme, mode, toggleTheme, isRTL]
  );
}
