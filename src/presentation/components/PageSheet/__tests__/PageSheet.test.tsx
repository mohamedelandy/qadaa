/** @format */
/**
 * Unit tests for PageSheet — dialog semantics and close lifecycle.
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
import { Sheet } from "../PageSheet";

describe("Sheet", () => {
  const user = userEvent.setup();
  beforeEach(() => {
    panHandlers.length = 0;
  });

  it("renders nothing when hidden", async () => {
    await renderWithProviders(
      <Sheet visible={false} onClose={() => {}} testID="sheet">
        <View testID="child" />
      </Sheet>
    );
    expect(screen.queryByTestId("sheet")).not.toBeOnTheScreen();
  });

  it("renders dialog when open", async () => {
    await renderWithProviders(
      <Sheet visible onClose={() => {}} testID="sheet">
        <View testID="child" />
      </Sheet>
    );
    const sheet = screen.getByTestId("sheet");
    expect(sheet).toBeOnTheScreen();
    expect(sheet.props["role"]).toBe("dialog");
    // The sheet container must NOT be a grouped accessibility element (no
    // `accessible` prop): interactive children must stay individually exposed
    // to VoiceOver and UI automation (regression: see dua-close-btn e2e).
    expect(sheet.props["accessible"]).toBeUndefined();
    expect(screen.getByTestId("child")).toBeOnTheScreen();
  });

  it("close action invokes onClose", async () => {
    const onClose = jest.fn();
    await renderWithProviders(
      <Sheet visible onClose={onClose}>
        <View testID="child" />
      </Sheet>
    );
    await user.press(
      screen.getByRole("button", {
        name: /a11y\.close/,
        includeHiddenElements: true,
      })
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("hides dialog when closed after being open", async () => {
    const onClose = jest.fn();
    await renderWithProviders(
      <Sheet visible onClose={onClose} testID="sheet">
        <View testID="child" />
      </Sheet>
    );
    expect(screen.getByTestId("sheet")).toBeOnTheScreen();
    await screen.rerender(
      <Sheet visible={false} onClose={onClose} testID="sheet">
        <View testID="child" />
      </Sheet>
    );
    expect(screen.queryByTestId("sheet")).not.toBeOnTheScreen();
  });

  it("runs pan onUpdate and onEnd worklets", async () => {
    await renderWithProviders(
      <Sheet visible onClose={() => {}}>
        <View />
      </Sheet>
    );
    const onUpdate = panHandlers.find((h) => h.name === "onUpdate");
    const onEnd = panHandlers.find((h) => h.name === "onEnd");
    expect(onUpdate).toBeDefined();
    expect(onEnd).toBeDefined();
    onUpdate?.cb({ translationY: 10 });
    onUpdate?.cb({ translationY: -5 });
    onEnd?.cb({ translationY: 100, velocityY: 50 });
    onEnd?.cb({ translationY: 10, velocityY: 50 });
  });
});
