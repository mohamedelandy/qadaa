/** @format */
/**
 * Unit tests for prayer row entrance, pop, and bubble animations (Reanimated shared values).
 */
import { renderHook, act } from "@testing-library/react-native";
import { usePrayerRowAnimations } from "../PrayerRow.animations";
jest.mock("react-native-reanimated", () => {
  return {
    __esModule: true,
    default: { View: "Animated.View", createAnimatedComponent: (c: unknown) => c },
    useSharedValue: (init: unknown) => {
      const shared = {
        value: init as unknown,
        get(): unknown {
          return this.value;
        },
        set(next: unknown) {
          this.value = next;
        },
      };
      return shared;
    },
    useAnimatedStyle: (fn: () => unknown) => fn,
    interpolate: (value: number, input: number[], output: number[]) => {
      const lo = input[0] ?? 0;
      const hi = input[input.length - 1] ?? 1;
      if (value <= lo) return output[0] ?? value;
      if (value >= hi) return output[output.length - 1] ?? value;
      for (let i = 1; i < input.length; i++) {
        const edge = input[i];
        if (edge !== undefined && value <= edge) {
          const t0 = input[i - 1] ?? lo;
          const t1 = edge;
          const v0 = output[i - 1] ?? 0;
          const v1 = output[i] ?? 0;
          const f = (value - t0) / (t1 - t0);
          return v0 + (v1 - v0) * f;
        }
      }
      return value;
    },
    withTiming: (toValue: number) => toValue,
    withSpring: (toValue: number) => toValue,
    withDelay: (_delayMs: number, next: unknown) => next,
    withSequence: (...anims: unknown[]) => anims[0],
    ReduceMotion: { System: "system", Always: "always", Never: "never" },
    Easing: {
      out: (e: unknown) => e,
      in: (e: unknown) => e,
      quad: {},
      cubic: {},
    },
  };
});
describe("usePrayerRowAnimations", () => {
  it("starts at rest (entrance 0, pop 1, bubble 0)", async () => {
    const { result } = await renderHook(() => usePrayerRowAnimations());
    expect(result.current.entrance.value).toBe(0);
    expect(result.current.pop.value).toBe(1);
    expect(result.current.bubble.value).toBe(0);
  });
  it("playEntrance drives entrance to 1 and entranceStyles to rest", async () => {
    const { result } = await renderHook(() => usePrayerRowAnimations());
    const entranceStyles = result.current.entranceStyles as unknown as () => {
      opacity: number;
      transform: { translateY: number }[];
    };
    expect(entranceStyles()).toEqual({ opacity: 0, transform: [{ translateY: 20 }] });
    await act(() => {
      result.current.playEntrance();
    });
    expect(result.current.entrance.value).toBe(1);
    expect(entranceStyles()).toEqual({ opacity: 1, transform: [{ translateY: 0 }] });
  });
  it("triggerPop targets the pop overshoot and shows the bubble", async () => {
    const { result } = await renderHook(() => usePrayerRowAnimations());
    await act(() => {
      result.current.triggerPop();
    });
    expect(result.current.pop.value).toBeGreaterThan(1);
    expect(result.current.bubble.value).toBeGreaterThan(0);
  });
  it("bubbleStyle maps bubble progress to opacity/translate/scale keyframes", async () => {
    const { result } = await renderHook(() => usePrayerRowAnimations());
    const bubbleStyle = result.current.bubbleStyle as unknown as () => {
      opacity: number;
      transform: ({ translateY: number } | { scale: number })[];
    };
    await act(() => {
      result.current.bubble.set(1);
    });
    expect(bubbleStyle()).toEqual({
      opacity: 0,
      transform: [{ translateY: -28 }, { scale: 1 }],
    });
  });
});
