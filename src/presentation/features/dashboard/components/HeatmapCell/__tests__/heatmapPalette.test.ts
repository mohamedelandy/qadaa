/** @format */
/**
 * Unit tests for heatmap palette tier mapping in both themes.
 */
import { darkColors, lightColors } from "@theme/colors";
import { getHeatmapPalette, heatmapFill, heatmapGlow } from "../heatmapPalette";
describe("heatmapPalette", () => {
  const dark = getHeatmapPalette(darkColors);
  const light = getHeatmapPalette(lightColors);
  it("derives tier fills from dark-mode tokens", () => {
    expect(dark.fills).toEqual([
      darkColors.heatmapFill0,
      darkColors.heatmapFill1,
      darkColors.heatmapFill2,
      darkColors.heatmapFill3,
      darkColors.heatmapFill4,
    ]);
  });
  it("derives tier fills from light-mode tokens", () => {
    expect(light.fills).toEqual([
      lightColors.heatmapFill0,
      lightColors.heatmapFill1,
      lightColors.heatmapFill2,
      lightColors.heatmapFill3,
      lightColors.heatmapFill4,
    ]);
  });
  it("maps tiers 1-5 through heatmapFill in both modes", () => {
    expect(heatmapFill(dark, 1)).toBe(darkColors.heatmapFill0);
    expect(heatmapFill(dark, 5)).toBe(darkColors.heatmapFill4);
    expect(heatmapFill(light, 1)).toBe(lightColors.heatmapFill0);
    expect(heatmapFill(light, 5)).toBe(lightColors.heatmapFill4);
  });
  it("returns null for tier 0 (empty tile uses theme tokens)", () => {
    expect(heatmapFill(dark, 0)).toBeNull();
    expect(heatmapFill(light, 0)).toBeNull();
    expect(heatmapGlow(dark, 0)).toBeNull();
    expect(heatmapGlow(light, 0)).toBeNull();
  });
  it("clamps high intensity to tier 5", () => {
    expect(heatmapFill(dark, 99)).toBe(darkColors.heatmapFill4);
    expect(heatmapFill(light, 99)).toBe(lightColors.heatmapFill4);
  });
  it("leaves tiers 1-2 without glow and glows tiers 3-5", () => {
    expect(heatmapGlow(dark, 1)).toBeNull();
    expect(heatmapGlow(dark, 2)).toBeNull();
    expect(heatmapGlow(dark, 3)).toBe(darkColors.heatmapGlow0);
    expect(heatmapGlow(dark, 4)).toBe(darkColors.heatmapGlow1);
    expect(heatmapGlow(dark, 5)).toBe(darkColors.heatmapGlow2);
    expect(heatmapGlow(light, 3)).toBe(lightColors.heatmapGlow0);
    expect(heatmapGlow(light, 5)).toBe(lightColors.heatmapGlow2);
  });
  it("derives today ring, outer ring and inner glow from tokens", () => {
    expect(dark.today).toBe(darkColors.heatmapToday);
    expect(dark.todayOuter).toBe(darkColors.heatmapTodayOuter);
    expect(dark.todayGlow).toBe(darkColors.heatmapGlow);
    expect(light.today).toBe(lightColors.heatmapToday);
    expect(light.todayOuter).toBe(lightColors.heatmapTodayOuter);
    expect(light.todayGlow).toBe(lightColors.heatmapGlow);
  });
  it("derives the tier text color from tokens", () => {
    expect(dark.text).toBe(darkColors.heatmapText);
    expect(light.text).toBe(lightColors.heatmapText);
  });
});
