/** @format */
/**
 * Glass tab bar theme tokens: derived from the app palette (darkColors) so the
 * fixed dark liquid-glass default matches the dashboard theme exactly.
 */
import { darkColors } from "./colors";

export type GlassTabBarTheme = {
  activeTint: string;
  inactiveTint: string;
  highlight: string;
  glassTint: string;
  solidFallback: string;
};
export function withAlpha(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
export const DEFAULT_TAB_THEME: GlassTabBarTheme = {
  activeTint: darkColors.white,
  inactiveTint: darkColors.textMuted,
  highlight: withAlpha(darkColors.primaryHover, 0.55),
  glassTint: withAlpha(darkColors.surface, 0.55),
  solidFallback: withAlpha(darkColors.surface, 0.94),
};
