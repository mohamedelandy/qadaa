/** @format */
import { useSafeTimeouts } from "../useSafeTimeouts";
import { create, act } from "react-test-renderer";

jest.useFakeTimers();

describe("useSafeTimeouts", () => {
  it("should execute callback after timeout", () => {
    let hook: ReturnType<typeof useSafeTimeouts>;
    function Comp() {
      hook = useSafeTimeouts();
      return null;
    }

    act(() => {
      create(<Comp />);
    });

    const callback = jest.fn();

    act(() => {
      hook.setSafeTimeout(callback, 1000);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should clear timeout manually", () => {
    let hook: ReturnType<typeof useSafeTimeouts>;
    function Comp() {
      hook = useSafeTimeouts();
      return null;
    }

    act(() => {
      create(<Comp />);
    });

    const callback = jest.fn();

    act(() => {
      const timer = hook.setSafeTimeout(callback, 1000);
      hook.clearSafeTimeout(timer);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should clear timeouts on unmount", () => {
    let hook: ReturnType<typeof useSafeTimeouts>;
    function Comp() {
      hook = useSafeTimeouts();
      return null;
    }
    let root: ReturnType<typeof create>;
    act(() => {
      root = create(<Comp />);
    });

    const callback = jest.fn();

    act(() => {
      hook.setSafeTimeout(callback, 1000);
    });

    act(() => {
      root.unmount();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
