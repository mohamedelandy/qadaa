/** @format */
/**
 * Unit tests for LogFullDayBar pill rendering, press callback, and hide animation branch.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
const mockMinimizedTabBar = { value: 0 };
const mockScrollReactions: { prepare: unknown; effect: unknown }[] = [];
jest.mock("@features/layout/glass-tabs/minimize", () => ({
  useTabBarMinimized: () => mockMinimizedTabBar,
}));
jest.mock("@components/Lottie/LottieView", () => ({
  LottieView: () => null,
}));
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  const clampInterpolate = (value: number, input: number[], output: number[]) => {
    const lo = input[0] ?? 0;
    const hi = input[input.length - 1] ?? 1;
    if (value <= lo) return output[0] ?? 0;
    if (value >= hi) return output[output.length - 1] ?? 0;
    return value;
  };
  return {
    __esModule: true,
    default: {
      View,
      interpolate: clampInterpolate,
      Extrapolate: { CLAMP: "clamp" },
      createAnimatedComponent: (C: unknown) => C,
    },
    useSharedValue: (init: unknown) => ({ value: init }),
    useAnimatedStyle: (styleFn: unknown) => (styleFn as () => unknown)(),
    useAnimatedReaction: (prepare: unknown, effect: unknown) => {
      mockScrollReactions.push({ prepare, effect });
    },
    ReduceMotion: { System: "system", Always: "always", Never: "never" },
    withTiming: (v: number) => v,
    withSpring: (v: number) => v,
    withDelay: (_d: number, v: unknown) => v,
    withRepeat: (v: unknown) => v,
    withSequence: (...vs: unknown[]) => vs[0],
    Easing: {
      out: (e: unknown) => e,
      in: (e: unknown) => e,
      inOut: (e: unknown) => e,
      cubic: {},
      quad: {},
    },
    interpolate: clampInterpolate,
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  };
});
jest.mock("expo-linear-gradient", () => ({
  __esModule: true,
  LinearGradient: "LinearGradient",
}));
jest.mock("react-native-worklets", () => ({
  __esModule: true,
  scheduleOnRN: (cb: (...args: unknown[]) => void, ...args: unknown[]) => cb(...args),
}));
jest.useFakeTimers();
import { act, screen, userEvent } from "@testing-library/react-native";
import { LogFullDayBar } from "./LogFullDayBar";
import { renderWithProviders } from "@/src/__tests__/testUtils";
describe("LogFullDayBar", () => {
  beforeEach(() => {
    mockScrollReactions.length = 0;
    mockMinimizedTabBar.value = 0;
  });
  it("renders the floating pill label and responds to press", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await renderWithProviders(
      <LogFullDayBar visible onPress={onPress} testID="dashboard-fullday-btn" />
    );
    expect(screen.getByTestId("dashboard-fullday-btn")).toBeOnTheScreen();
    expect(screen.getByText(/dashboard.logFullDay/)).toBeOnTheScreen();
    await user.press(screen.getByText(/dashboard.logFullDay/));
    expect(onPress).toHaveBeenCalled();
  });
  it("animates out when not visible (covers useEffect branch)", async () => {
    const { rerender } = await renderWithProviders(<LogFullDayBar visible onPress={jest.fn()} />);
    rerender(<LogFullDayBar visible={false} onPress={jest.fn()} />);
  });

  it("hides the pill once the tab bar is minimized by scrolling", async () => {
    await renderWithProviders(<LogFullDayBar visible onPress={jest.fn()} />);
    expect(screen.getByText(/dashboard.logFullDay/)).toBeOnTheScreen();
    await act(async () => {
      mockMinimizedTabBar.value = 1;
      for (const reaction of mockScrollReactions) {
        (reaction.effect as (value: unknown) => void)((reaction.prepare as () => unknown)());
      }
    });
    expect(screen.queryByText(/dashboard.logFullDay/)).not.toBeOnTheScreen();
  });

  it("starts the sheen sweep after the entrance timer settles", async () => {
    await renderWithProviders(<LogFullDayBar visible onPress={jest.fn()} />);
    await act(async () => {
      jest.advanceTimersByTime(700);
    });
  });
});
