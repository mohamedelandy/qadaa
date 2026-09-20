/** @format */

import { renderHook, act } from "@testing-library/react-native";
import { useTimeouts } from "../useTimeouts";

describe("useTimeouts hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should add and execute timeouts", async () => {
    const { result } = await renderHook(() => useTimeouts());
    const callback = jest.fn();

    await act(async () => {
      result.current.addTimeout(callback, 1000);
    });

    expect(callback).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should clear all timeouts when clearAllTimeouts is called", async () => {
    const { result } = await renderHook(() => useTimeouts());
    const callback = jest.fn();

    await act(async () => {
      result.current.addTimeout(callback, 1000);
    });

    await act(async () => {
      result.current.clearAllTimeouts();
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should automatically clear timeouts on unmount", async () => {
    const { result, unmount } = await renderHook(() => useTimeouts());
    const callback = jest.fn();

    await act(async () => {
      result.current.addTimeout(callback, 1000);
    });

    await unmount();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
