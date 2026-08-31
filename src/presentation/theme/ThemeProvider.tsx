/** @format */
/**
 * Builds the theme object from mode/direction and syncs direction into the theme store.
 */
import { useEffect, type ReactNode } from "react";
import { darkColors, lightColors, gradients, lightGradients } from "./colors";
import { fonts, fontSize, lineHeight } from "./typography";
import { spacing, borderRadius } from "./spacing";
import { useThemeStore } from "@stores/useThemeStore";
import type { ColorKey, ThemeMode } from "./types";
export function buildTheme(mode: ThemeMode, direction: "ltr" | "rtl") {
  const colors = mode === "dark" ? darkColors : lightColors;
  const g = mode === "dark" ? gradients : lightGradients;
  return {
    mode,
    direction,
    colors,
    gradients: g,
    typography: { fonts, fontSize, lineHeight },
    spacing,
    borderRadius,
    getColor: (colorKey: ColorKey): string => colors[colorKey],
  };
}
export type Theme = ReturnType<typeof buildTheme>;
export function ThemeProvider({
  children,
  direction = "ltr",
}: {
  children: ReactNode;
  direction?: "ltr" | "rtl";
}) {
  const setDirection = useThemeStore((s) => s.setDirection);
  useEffect(() => {
    setDirection(direction);
  }, [direction, setDirection]);
  return children;
}
