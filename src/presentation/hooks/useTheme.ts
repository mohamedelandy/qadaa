/** @format */
/**
 * Derives the memoized theme object with dark/RTL flags from theme store state.
 */
import { useMemo } from "react";
import { buildTheme } from "@presentation/theme/ThemeProvider";
import { useThemeStore } from "@stores/useThemeStore";
export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const direction = useThemeStore((s) => s.direction);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
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
