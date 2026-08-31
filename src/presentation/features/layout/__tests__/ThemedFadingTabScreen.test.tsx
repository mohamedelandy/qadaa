/** @format */
/**
 * Unit tests for themedFadingTabScreen lazy/unmount-on-blur null cases and fade branch rendering.
 */
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
    withSpring: (v: number) => v,
    withTiming: (v: number) => v,
    Easing: { out: () => undefined, cubic: {}, bezier: () => undefined },
    interpolate: () => 0,
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  };
});
jest.mock("react-native-screens", () => ({
  __esModule: true,
  Screen: "Screen",
}));
import { render } from "@testing-library/react-native";
import { themedFadingTabScreen } from "../ThemedFadingTabScreen";
describe("themedFadingTabScreen", () => {
  const makeDescriptor = (options: Record<string, boolean> = {}) => ({
    options,
    render: () => null,
    route: { key: "route-1" },
  });
  const baseCtx = { loaded: true, detachInactiveScreens: true };
  const makeElement = (focused: boolean) =>
    themedFadingTabScreen(makeDescriptor(), {
      ...baseCtx,
      isFocused: focused,
    }) as React.ReactElement;
  it("returns null when unmounted and not focused", () => {
    const result = themedFadingTabScreen(makeDescriptor({ unmountOnBlur: true }), {
      isFocused: false,
      ...baseCtx,
    });
    expect(result).toBeNull();
  });
  it("returns null when lazy, not loaded, and not focused", () => {
    const result = themedFadingTabScreen(makeDescriptor({ lazy: true }), {
      isFocused: false,
      loaded: false,
      detachInactiveScreens: true,
    });
    expect(result).toBeNull();
  });
  it("renders the scene when focused", async () => {
    const tree = await render(makeElement(true));
    expect(tree.root).toBeOnTheScreen();
  });
  it("runs both fade-in and fade-out effect branches", async () => {
    const tree = await render(makeElement(false));
    await tree.rerender(makeElement(true));
    await tree.rerender(makeElement(false));
    expect(tree.root).toBeOnTheScreen();
  });
});
