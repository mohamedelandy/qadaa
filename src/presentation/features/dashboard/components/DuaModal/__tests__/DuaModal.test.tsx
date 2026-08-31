/** @format */
/**
 * Unit tests for DuaModal close press behavior with haptics mocked.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("expo-haptics", () => ({
  __esModule: true,
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
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
    useAnimatedStyle: (style: unknown) => style,
    ReduceMotion: { System: "system", Always: "always", Never: "never" },
    useReducedMotion: () => false,
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
jest.mock("expo-linear-gradient", () => ({
  __esModule: true,
  LinearGradient: "LinearGradient",
}));
jest.mock("lottie-react-native", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: View,
  };
});
jest.useFakeTimers();
import { screen, userEvent } from "@testing-library/react-native";
import { DuaModal } from "../DuaModal";
import { renderWithProviders } from "@/src/__tests__/testUtils";
describe("DuaModal", () => {
  it("renders and closes on press (covers onPress + haptics)", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    await renderWithProviders(<DuaModal visible onClose={onClose} />);
    expect(screen.getByText("dua.close")).toBeOnTheScreen();
    await user.press(screen.getByText("dua.close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
