/** @format */
/**
 * Unit tests for press animation handlers and scale value exposure.
 */

let mockWithTiming = jest.fn();
let mockWithSpring = jest.fn();

jest.mock("react-native-reanimated", () => {
  return {
    __esModule: true,
    useSharedValue: (init: unknown) => ({ value: init }),
    useAnimatedStyle: (cb: () => unknown) => cb(),
    withTiming: (val: number, config: unknown) => mockWithTiming(val, config),
    withSpring: (val: number, config: unknown) => mockWithSpring(val, config),
    ReduceMotion: { System: "System" },
  };
});

import { renderHook, act } from "@testing-library/react-native";
import { usePressAnimation } from "../usePressAnimation";

describe("usePressAnimation", () => {
  beforeEach(() => {
    mockWithTiming = jest.fn((val) => val);
    mockWithSpring = jest.fn((val) => val);
  });

  it("returns scale, pressStyle, and press handlers", async () => {
    const { result } = await renderHook(() => usePressAnimation());

    expect(result.current.scale).toBeDefined();
    expect(result.current.scale.value).toBe(1);

    expect(result.current.pressStyle).toBeDefined();

    expect(typeof result.current.handlePressIn).toBe("function");
    expect(typeof result.current.handlePressOut).toBe("function");
  });

  it("invokes the press-in handler and updates scale using withTiming with default scaleTo", async () => {
    const { result } = await renderHook(() => usePressAnimation());

    await act(async () => {
      result.current.handlePressIn();
    });

    expect(mockWithTiming).toHaveBeenCalledWith(
      0.97,
      expect.objectContaining({
        duration: 80,
        reduceMotion: "System",
      })
    );

    expect(result.current.scale.value).toBe(0.97);
  });

  it("invokes the press-in handler and updates scale using withTiming with custom scaleTo", async () => {
    const { result } = await renderHook(() => usePressAnimation(0.9));

    await act(async () => {
      result.current.handlePressIn();
    });

    expect(mockWithTiming).toHaveBeenCalledWith(
      0.9,
      expect.objectContaining({
        duration: 80,
        reduceMotion: "System",
      })
    );

    expect(result.current.scale.value).toBe(0.9);
  });

  it("invokes the press-out handler and updates scale using withSpring", async () => {
    const { result } = await renderHook(() => usePressAnimation());

    await act(async () => {
      result.current.handlePressOut();
    });

    expect(mockWithSpring).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        duration: 150,
        dampingRatio: 0.8,
        reduceMotion: "System",
      })
    );

    expect(result.current.scale.value).toBe(1);
  });
});