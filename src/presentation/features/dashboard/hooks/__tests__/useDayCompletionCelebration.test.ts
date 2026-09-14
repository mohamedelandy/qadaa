/** @format */
/**
 * Celebration tests: fires once on false→true transition, skips initial
 * already-done mount, re-arms after reset, respects reduced motion.
 */
import { renderHook } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { useDayCompletionCelebration } from "../useDayCompletionCelebration";

const reanimated = jest.requireMock("react-native-reanimated") as {
  useReducedMotion: jest.Mock;
};

beforeEach(() => {
  jest.clearAllMocks();
  reanimated.useReducedMotion.mockImplementation(() => false);
});

describe("useDayCompletionCelebration", () => {
  it("fires the success haptic once on the done transition", async () => {
    const { rerender } = await renderHook(
      (p: { done: boolean }) => useDayCompletionCelebration(p.done),
      {
        initialProps: { done: false },
      }
    );
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    await rerender({ done: true });
    expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
    await rerender({ done: true });
    expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
  });

  it("does not celebrate on a mount that is already done", async () => {
    await renderHook(() => useDayCompletionCelebration(true));
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
  });

  it("re-arms after the day resets to not-done", async () => {
    const { rerender } = await renderHook(
      (p: { done: boolean }) => useDayCompletionCelebration(p.done),
      {
        initialProps: { done: false },
      }
    );
    await rerender({ done: true });
    await rerender({ done: false });
    await rerender({ done: true });
    expect(Haptics.notificationAsync).toHaveBeenCalledTimes(2);
  });

  it("keeps scale at rest under reduced motion while still celebrating", async () => {
    reanimated.useReducedMotion.mockImplementation(() => true);
    const { result, rerender } = await renderHook(
      (p: { done: boolean }) => useDayCompletionCelebration(p.done),
      {
        initialProps: { done: false },
      }
    );
    await rerender({ done: true });
    expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
    const raw = result.current.celebrationStyle as unknown as
      { transform: [{ scale: number }] } | (() => { transform: [{ scale: number }] });
    const style = typeof raw === "function" ? raw() : raw;
    expect(style.transform[0].scale).toBe(1);
  });
});
