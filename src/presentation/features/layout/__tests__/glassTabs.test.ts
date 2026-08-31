/** @format */
/**
 * Unit tests for glassTabs tab order/labels/hrefs/icons and dark/light theme token mapping.
 */
import { buildGlassTabItems, buildGlassTabTheme } from "../glassTabs";
const t = (key: string) => key;
describe("buildGlassTabItems", () => {
  it("returns the three tabs in order", () => {
    const items = buildGlassTabItems(t);
    expect(items.map((i) => i.name)).toEqual(["dashboard", "stats", "settings"]);
  });
  it("labels each tab via the t function", () => {
    const t2 = (key: string) => `LBL:${key}`;
    const items = buildGlassTabItems(t2);
    expect(items.map((i) => i.label)).toEqual([
      "LBL:nav.dashboard",
      "LBL:nav.stats",
      "LBL:nav.settings",
    ]);
  });
  it("sets the expected hrefs and icon names", () => {
    const items = buildGlassTabItems(t);
    expect(items.map((i) => i.href)).toEqual(["/dashboard", "/stats", "/settings"]);
    expect(items.map((i) => i.icon)).toEqual([
      "home-outline",
      "stats-chart-outline",
      "settings-outline",
    ]);
  });
});
describe("buildGlassTabTheme", () => {
  const dark = {
    white: "#ffffff",
    textMuted: "#94a3b8",
    textDim: "#64748b",
    primary: "#047857",
    primaryHover: "#059669",
    surface: "#0f172a",
  };
  const light = {
    white: "#ffffff",
    textMuted: "#475569",
    textDim: "#64748b",
    primary: "#047857",
    primaryHover: "#059669",
    surface: "#f0f4f8",
  };
  it("maps dark tokens", () => {
    expect(buildGlassTabTheme(dark, true)).toEqual({
      activeTint: "#ffffff",
      inactiveTint: "#94a3b8",
      highlight: "rgba(5,150,105,0.55)",
      glassTint: "rgba(15,23,42,0.55)",
      solidFallback: "rgba(15,23,42,0.94)",
    });
  });
  it("maps light tokens", () => {
    expect(buildGlassTabTheme(light, false)).toEqual({
      activeTint: "#047857",
      inactiveTint: "#64748b",
      highlight: "rgba(4,120,87,0.22)",
      glassTint: "rgba(255,255,255,0.6)",
      solidFallback: "rgba(255,255,255,0.92)",
    });
  });
});
