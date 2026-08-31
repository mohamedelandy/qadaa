/** @format */
/**
 * Pure builders for glass tab definitions (dashboard/stats/settings) and theme colors from UI tokens.
 */
import type { Href } from "expo-router";
import type { GlassTabBarTheme } from "./glass-tabs/glass-tab-bar";
import { withAlpha } from "@theme/glassTabs";
export type IoniconName = "home-outline" | "stats-chart-outline" | "settings-outline";
export type GlassTabDef = {
  name: string;
  href: Href;
  label: string;
  icon: IoniconName;
};
const TAB_DEFS: Array<Pick<GlassTabDef, "name" | "href" | "icon">> = [
  { name: "dashboard", href: "/dashboard", icon: "home-outline" },
  { name: "stats", href: "/stats", icon: "stats-chart-outline" },
  { name: "settings", href: "/settings", icon: "settings-outline" },
];
export function buildGlassTabItems(t: (key: string) => string): GlassTabDef[] {
  return TAB_DEFS.map((def) => ({
    ...def,
    label: t(`nav.${def.name}`),
  }));
}
type TabColorTokens = {
  white: string;
  textMuted: string;
  textDim: string;
  primary: string;
  primaryHover: string;
  surface: string;
};
export function buildGlassTabTheme(colors: TabColorTokens, isDark: boolean): GlassTabBarTheme {
  const glassStrength = isDark ? 0.55 : 0.6;
  const pillEmphasis = isDark ? 0.55 : 0.22;
  return {
    activeTint: isDark ? colors.white : colors.primary,
    inactiveTint: isDark ? colors.textMuted : colors.textDim,
    highlight: withAlpha(isDark ? colors.primaryHover : colors.primary, pillEmphasis),
    glassTint: withAlpha(isDark ? colors.surface : colors.white, glassStrength),
    solidFallback: withAlpha(isDark ? colors.surface : colors.white, isDark ? 0.94 : 0.92),
  };
}
