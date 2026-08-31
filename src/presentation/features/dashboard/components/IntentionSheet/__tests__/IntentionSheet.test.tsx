/** @format */
/**
 * Unit tests for IntentionSheet confirm press and auto-confirm timer.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("expo-haptics", () => ({
  __esModule: true,
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
}));
jest.mock("expo-linear-gradient", () => ({
  __esModule: true,
  LinearGradient: "LinearGradient",
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
    ReduceMotion: { System: "system", Always: "always", Never: "never" },
    useReducedMotion: jest.fn(() => false),
    useAnimatedStyle: (style: unknown) => style,
    withSpring: (v: number) => v,
    withTiming: (v: number) => v,
    Easing: { out: () => undefined, cubic: {} },
    interpolate: () => 0,
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  };
});
jest.mock("react-native-worklets", () => ({
  __esModule: true,
  scheduleOnRN: (cb: () => void) => cb(),
}));
jest.mock("react-native-gesture-handler", () => {
  const buildGesture = () => {
    const self = {
      activeOffsetY: () => self,
      activeOffsetX: () => self,
      failOffsetY: () => self,
      onUpdate: () => self,
      onEnd: () => self,
      onStart: () => self,
      onFinalize: () => self,
    };
    return self;
  };
  return {
    __esModule: true,
    Gesture: {
      Pan: () => buildGesture(),
      Tap: () => buildGesture(),
      Race: () => ({ type: "Root" }),
    },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.useFakeTimers();
import { act, screen, userEvent } from "@testing-library/react-native";
import { IntentionSheet } from "../IntentionSheet";
import { renderWithProviders } from "@/src/__tests__/testUtils";
describe("IntentionSheet", () => {
  it("renders when visible and confirms on press", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    await renderWithProviders(<IntentionSheet visible onConfirm={onConfirm} />);
    expect(screen.getByText("intention.title")).toBeOnTheScreen();
    await user.press(screen.getByText("intention.confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
  it("auto-confirms after timeout when visible (covers useEffect)", async () => {
    const onConfirm = jest.fn();
    await renderWithProviders(<IntentionSheet visible onConfirm={onConfirm} />);
    expect(onConfirm).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
  it("guards against double confirm (covers confirmedRef guard)", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    await renderWithProviders(<IntentionSheet visible onConfirm={onConfirm} />);
    await user.press(screen.getByText("intention.confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
