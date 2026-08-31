/** @format */
/**
 * Unit tests for sheet spring shared values and dismiss completion callback behavior.
 */
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
    withSpring: (_v: number, _c?: object, cb?: (finished: boolean) => void) => {
      if (cb) cb(mockFinished);
      return undefined;
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

import { renderHook } from "@testing-library/react-native";
import { dismissSheet, useSheetSpring } from "../useSheetSpring";

describe("useSheetSpring", () => {
  beforeEach(() => {
    mockFinished = true;
  });

  it("returns translateY and opacity shared values", async () => {
    const { result } = await renderHook(() => useSheetSpring(true));
    expect(result.current.translateY).toBeDefined();
    expect(result.current.opacity).toBeDefined();
  });

  it("dismissSheet runs the exit animation and calls onDone", async () => {
    const translateY = { value: 0 };
    const opacity = { value: 1 };
    const onDone = jest.fn();
    dismissSheet(translateY as never, opacity as never, onDone);
    expect(onDone).toHaveBeenCalled();
  });

  it("dismissSheet does not call onDone if finished is false", async () => {
    mockFinished = false;
    const translateY = { value: 0 };
    const opacity = { value: 1 };
    const onDone = jest.fn();
    dismissSheet(translateY as never, opacity as never, onDone);
    expect(onDone).not.toHaveBeenCalled();
  });
});
