/** @format */
/**
 * Component tests for heatmap cell tiers, placeholders, and today ring.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("@components/Lottie/LottieView", () => ({
  LottieView: () => null,
}));
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      interpolate: () => 0,
      Extrapolate: { CLAMP: "clamp" },
      createAnimatedComponent: (C: unknown) => C,
    },
    useSharedValue: (init: unknown) => ({ value: init }),
    useAnimatedStyle: (styleFn: unknown) => (styleFn as () => unknown)(),
    ReduceMotion: { System: "system", Always: "always", Never: "never" },
    withSpring: () => 1,
    withTiming: (v: number) => v,
    withSequence: (v: unknown) => v,
    withDelay: (_d: number, v: number) => v,
    withRepeat: (v: number) => v,
    interpolateColor: () => "color",
    interpolate: () => 0,
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
    Easing: {
      out: (f: unknown) => f,
      inOut: (f: unknown) => f,
      quad: (v: unknown) => v,
      cubic: (v: unknown) => v,
      ease: (v: unknown) => v,
    },
  };
});
jest.useFakeTimers();
import { screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { useThemeStore } from "@stores/useThemeStore";
import { lightColors } from "@theme/colors";
import { HeatmapCell } from "../HeatmapCell";
import { renderWithProviders } from "@/src/__tests__/testUtils";
describe("HeatmapCell", () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: "light", direction: "ltr" });
  });
  it("renders a logged cell with a flat tier-1 fill", async () => {
    await renderWithProviders(<HeatmapCell intensity={1} isToday={false} style={{}} />);
    const cell = screen.getByTestId("heatmap-cell");
    expect(StyleSheet.flatten(cell.props["style"]).backgroundColor).toBe(lightColors.heatmapFill0);
  });
  it("renders today's cell with the ring", async () => {
    await renderWithProviders(<HeatmapCell intensity={2} isToday style={{}} />);
    expect(screen.getByTestId("heatmap-cell-today")).toBeOnTheScreen();
    expect(screen.getByTestId("heatmap-ring")).toBeOnTheScreen();
  });
  it("renders an ash tile (theme dim) for intensity 0", async () => {
    await renderWithProviders(<HeatmapCell intensity={0} isToday={false} style={{}} />);
    expect(screen.getByTestId("heatmap-cell")).toBeOnTheScreen();
    const ash = screen.getByTestId("heatmap-ash");
    expect(ash).toBeOnTheScreen();
  });
  it("renders a faint placeholder tile (no heatmap-cell testID)", async () => {
    await renderWithProviders(<HeatmapCell intensity={0} placeholder isToday={false} style={{}} />);
    expect(screen.getByTestId("heatmap-placeholder")).toBeOnTheScreen();
    expect(screen.queryAllByTestId("heatmap-cell")).toHaveLength(0);
  });
  it("ignites when intensity goes from 0 to logged (covers burst effect)", async () => {
    const { rerender } = await renderWithProviders(
      <HeatmapCell intensity={0} isToday={false} style={{}} />
    );
    rerender(<HeatmapCell intensity={3} isToday={false} style={{}} />);
    expect(screen.getByTestId("heatmap-cell")).toBeOnTheScreen();
  });
});
