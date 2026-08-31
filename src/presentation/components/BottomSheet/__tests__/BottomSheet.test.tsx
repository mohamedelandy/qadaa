/** @format */
/**
 * Unit tests for BottomSheet — delegates visible/onClose to Sheet.
 */
jest.useFakeTimers();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
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
    withSpring: (value: number) => value,
    withTiming: (value: number) => value,
    Easing: { out: () => undefined, cubic: {} },
    interpolate: () => 0,
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  };
});
jest.mock("react-native-worklets", () => ({
  __esModule: true,
  scheduleOnRN: (cb: (...args: unknown[]) => unknown, ...args: unknown[]) => cb(...args),
}));
jest.mock("react-native-gesture-handler", () => {
  const {
    panHandlers: store,
  } = require("../../../features/layout/glass-tabs/__tests__/gesture-capture");
  const makeBuilder = () => {
    const self: Record<string, unknown> = {
      activeOffsetY: () => self,
      onUpdate: (cb: (...a: unknown[]) => void) => {
        store.push({ name: "onUpdate", cb });
        return self;
      },
      onEnd: (cb: (...a: unknown[]) => void) => {
        store.push({ name: "onEnd", cb });
        return self;
      },
    };
    return self;
  };
  return {
    __esModule: true,
    Gesture: { Pan: () => makeBuilder() },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock("expo-blur", () => ({
  __esModule: true,
  BlurView: "BlurView",
}));
jest.mock("@hooks/useSheetSpring", () => {
  const actual = jest.requireActual("@hooks/useSheetSpring");
  return {
    ...actual,
    dismissSheet: (_t: unknown, _o: unknown, onDone: () => void) => onDone(),
  };
});
import { screen, userEvent } from "@testing-library/react-native";
import { View } from "react-native";
import { panHandlers } from "../../../features/layout/glass-tabs/__tests__/gesture-capture";
import { renderWithProviders } from "@/src/__tests__/testUtils";
import { BottomSheet } from "../BottomSheet";

describe("BottomSheet", () => {
  const user = userEvent.setup();
  beforeEach(() => {
    panHandlers.length = 0;
  });

  it("hides dialog when visible is false", async () => {
    await renderWithProviders(
      <BottomSheet visible={false} onClose={() => {}}>
        <View testID="child" />
      </BottomSheet>
    );
    expect(screen.queryByTestId("child")).not.toBeOnTheScreen();
  });

  it("shows children and dialog when visible", async () => {
    await renderWithProviders(
      <BottomSheet visible onClose={() => {}}>
        <View testID="child" />
      </BottomSheet>
    );
    expect(screen.getByTestId("child")).toBeOnTheScreen();
  });

  it("fires onClose on backdrop press", async () => {
    const onClose = jest.fn();
    await renderWithProviders(
      <BottomSheet visible onClose={onClose}>
        <View testID="child" />
      </BottomSheet>
    );
    await user.press(
      screen.getByRole("button", {
        name: /a11y\.close/,
        includeHiddenElements: true,
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});
