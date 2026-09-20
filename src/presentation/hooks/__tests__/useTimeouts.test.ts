/** @format */

import { renderHook, act } from "@testing-library/react-native";
import { useTimeouts } from "../useTimeouts";

describe("useTimeouts", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should execute the callback after the specified delay", async () => {
    const { result } = await renderHook(() => useTimeouts());
    const callback = jest.fn();

    await act(async () => {
      result.current.addTimeout(callback, 1000);
    });

    expect(callback).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should be able to clear a timeout before it executes", async () => {
    const { result } = await renderHook(() => useTimeouts());
    const callback = jest.fn();

    let timerId: ReturnType<typeof setTimeout> | undefined;

    await act(async () => {
      timerId = result.current.addTimeout(callback, 1000);
    });

    expect(callback).not.toHaveBeenCalled();

    await act(async () => {
      if (timerId) {
        result.current.clearTimeout(timerId);
      }
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should clear all pending timeouts when unmounted", async () => {
    const { result, unmount } = await renderHook(() => useTimeouts());
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    await act(async () => {
      result.current.addTimeout(callback1, 1000);
      result.current.addTimeout(callback2, 2000);
    });

    await act(async () => {
      unmount();
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });
});
