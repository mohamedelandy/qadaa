/** @format */
/**
 * Unit tests for sheet spring shared values and dismiss completion callback behavior.
 */
import { Dimensions } from "react-native";
import { renderHook } from "@testing-library/react-native";
import { dismissSheet, useSheetSpring } from "../useSheetSpring";

let mockFinished = true;

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
    withSpring: (v: number, _c?: object, cb?: (finished: boolean) => void) => {
      if (cb) cb(mockFinished);
      return v;
    },
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

const SCREEN_HEIGHT = Dimensions.get("window").height;

describe("useSheetSpring", () => {
  beforeEach(() => {
    mockFinished = true;
  });

  it("returns translateY and opacity shared values, animating when visible is true", async () => {
    const { result } = await renderHook(() => useSheetSpring(true));
    expect(result.current.translateY).toBeDefined();
    expect(result.current.opacity).toBeDefined();

    expect(result.current.translateY.value).toBe(0);
    expect(result.current.opacity.value).toBe(1);
  });

  it("does not animate initially if visible is false", async () => {
    const { result } = await renderHook(() => useSheetSpring(false));

    expect(result.current.translateY.value).toBe(SCREEN_HEIGHT);
    expect(result.current.opacity.value).toBe(0);
  });

  it("animates when visibility changes from false to true", async () => {
    const { result, rerender } = await renderHook(
      ({ visible }: { visible: boolean }) => useSheetSpring(visible),
      {
        initialProps: { visible: false },
      }
    );

    expect(result.current.translateY.value).toBe(SCREEN_HEIGHT);
    expect(result.current.opacity.value).toBe(0);

    await rerender({ visible: true });

    expect(result.current.translateY.value).toBe(0);
    expect(result.current.opacity.value).toBe(1);
  });

  it("dismissSheet runs the exit animation and calls onDone", () => {
    const translateY = { value: 0 };
    const opacity = { value: 1 };
    const onDone = jest.fn();
    dismissSheet(translateY as never, opacity as never, onDone);

    expect(onDone).toHaveBeenCalled();
    expect(translateY.value).toBe(SCREEN_HEIGHT);
    expect(opacity.value).toBe(0);
  });

  it("dismissSheet does not call onDone if finished is false", () => {
    mockFinished = false;
    const translateY = { value: 0 };
    const opacity = { value: 1 };
    const onDone = jest.fn();
    dismissSheet(translateY as never, opacity as never, onDone);

    expect(onDone).not.toHaveBeenCalled();
    expect(translateY.value).toBe(SCREEN_HEIGHT);
    expect(opacity.value).toBe(0);
  });
});
