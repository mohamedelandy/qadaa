/** @format */
/**
 * Unit tests for useGlassTabBarViewModel tab ordering, RTL mirroring, theming, and label translation.
 */
import { render, act } from "@testing-library/react-native";
const MOCK_THEME = {
  white: "#ffffff",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  primary: "#047857",
  primaryHover: "#059669",
  surface: "#0f172a",
} as const;
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: "ar" },
  }),
}));
import { useGlassTabBarViewModel } from "../useGlassTabBarViewModel";
import { useThemeStore } from "@stores/useThemeStore";
import { useModalVisibilityStore } from "@stores/useModalVisibilityStore";
type ViewModel = ReturnType<typeof useGlassTabBarViewModel>;
let vm: ViewModel | undefined;
function Harness() {
  vm = useGlassTabBarViewModel();
  return null;
}
describe("useGlassTabBarViewModel", () => {
  beforeEach(() => {
    vm = undefined;
    useThemeStore.setState({
      mode: "dark",
      direction: "ltr",
      setMode: useThemeStore.getState().setMode,
      setDirection: useThemeStore.getState().setDirection,
      toggleTheme: useThemeStore.getState().toggleTheme,
    });
    useModalVisibilityStore.setState({
      activeOpen: false,
      setOverlayOpen: useModalVisibilityStore.getState().setOverlayOpen,
    });
  });
  it("builds the three tab defs in LTR order", async () => {
    await render(<Harness />);
    expect(vm?.tabDefs.map((d) => d.name)).toEqual(["dashboard", "stats", "settings"]);
    expect(vm?.glassItems.map((i) => i.name)).toEqual(["dashboard", "stats", "settings"]);
  });
  it("mirrors the item order for RTL without flipping the container", async () => {
    await render(<Harness />);
    await act(async () => {
      useThemeStore.getState().setDirection("rtl");
    });
    expect(vm?.direction).toBe("rtl");
    expect(vm?.glassItems.map((i) => i.name)).toEqual(["settings", "stats", "dashboard"]);
  });
  it("builds a dark theme when the mode is dark", async () => {
    await render(<Harness />);
    expect(vm?.isDark).toBe(true);
    expect(vm?.tabTheme.activeTint).toBe(MOCK_THEME.white);
  });
  it("builds a light theme when the mode is light", async () => {
    await render(<Harness />);
    await act(async () => {
      useThemeStore.getState().setMode("light");
    });
    expect(vm?.isDark).toBe(false);
    expect(vm?.tabTheme.activeTint).toBe(MOCK_THEME.primary);
  });
  it("translates each tab label through the t function", async () => {
    await render(<Harness />);
    expect(vm?.glassItems.map((i) => i.label)).toEqual([
      "nav.dashboard",
      "nav.stats",
      "nav.settings",
    ]);
  });
  it("sets hideDistance from the bottom inset plus the offscreen margin", async () => {
    await render(<Harness />);
    if (!vm) throw new Error("no viewmodel");
    expect(vm.hideDistance).toBe(120);
    const styleFn = vm.barStyle as unknown as () => {
      transform: Array<{
        translateY: number;
      }>;
    };
    expect(styleFn().transform[0]?.translateY).toBe(0);
  });
  it("builds a renderIcon callback per item", async () => {
    await render(<Harness />);
    if (!vm) throw new Error("no viewmodel");
    const item = vm.glassItems[0];
    if (!item) throw new Error("no item");
    if (!item.renderIcon) throw new Error("no renderIcon");
    const icon = item.renderIcon({ tint: "#fff", size: 21 });
    expect(icon).toBeTruthy();
  });
  it("springs the bar off-screen while a modal overlay is open", async () => {
    await render(<Harness />);
    await act(async () => {
      useModalVisibilityStore.getState().setOverlayOpen(true);
    });
    if (!vm) throw new Error("no viewmodel");
    expect(vm.activeOpen).toBe(true);
    const styleFn = vm.barStyle as unknown as () => {
      transform: Array<{
        translateY: number;
      }>;
    };
    expect(styleFn().transform[0]?.translateY).toBe(120);
  });
});
