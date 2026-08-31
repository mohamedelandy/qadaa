/** @format */
/**
 * Heatmap color palette mapping intensity tiers to theme tokens.
 */
import type { ColorKey } from "@theme/types";
export interface HeatmapPalette {
  fills: [string, string, string, string, string];
  text: string;
  glow: (string | null)[];
  today: string;
  todayOuter: string;
  todayGlow: string;
}
export function getHeatmapPalette(colors: Record<ColorKey, string>): HeatmapPalette {
  return {
    fills: [
      colors.heatmapFill0,
      colors.heatmapFill1,
      colors.heatmapFill2,
      colors.heatmapFill3,
      colors.heatmapFill4,
    ],
    text: colors.heatmapText,
    glow: [null, null, colors.heatmapGlow0, colors.heatmapGlow1, colors.heatmapGlow2],
    today: colors.heatmapToday,
    todayOuter: colors.heatmapTodayOuter,
    todayGlow: colors.heatmapGlow,
  };
}
export function heatmapFill(palette: HeatmapPalette, intensity: number): string | null {
  const tier = Math.min(5, Math.max(0, intensity));
  if (tier === 0) return null;
  return palette.fills[tier - 1] ?? null;
}
export function heatmapGlow(palette: HeatmapPalette, intensity: number): string | null {
  const tier = Math.min(5, Math.max(0, intensity));
  if (tier === 0) return null;
  return palette.glow[tier - 1] ?? null;
}
