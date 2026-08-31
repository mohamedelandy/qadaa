/** @format */
/**
 * Unit tests for usePopoverPositioning measure flow, relative vs absolute modes and RTL offsets.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { usePopoverPositioning } from "../usePopoverPositioning";
describe("usePopoverPositioning hook", () => {
  it("runs the measureInWindow callback via a mocked anchorRef", async () => {
    const measureInWindow = jest.fn((cb: (x: number, y: number, w: number, h: number) => void) =>
      cb(50, 100, 30, 20)
    );
    const anchorRef = { current: { measureInWindow } as never };
    const { result } = await renderHook(() =>
      usePopoverPositioning({
        width: 200,
        isRTL: false,
        anchorRef,
        preferBelow: true,
        mode: "absolute",
      })
    );
    expect(result.current.pos).toBeNull();
    await act(async () => {
      result.current.position();
    });
    expect(measureInWindow).toHaveBeenCalled();
    expect(result.current.pos).toEqual({
      left: expect.any(Number),
      top: expect.any(Number),
      width: 200,
    });
  });
  it("computes relative-mode position (covers relative branch)", async () => {
    const measureInWindow = jest.fn((cb: (x: number, y: number, w: number, h: number) => void) =>
      cb(50, 100, 30, 20)
    );
    const anchorRef = { current: { measureInWindow } as never };
    const { result } = await renderHook(() =>
      usePopoverPositioning({
        width: 200,
        isRTL: false,
        anchorRef,
      })
    );
    await act(async () => {
      result.current.position();
    });
    expect(result.current.pos).not.toBeNull();
  });
  it("offsets relative position from the container's end edge in RTL", async () => {
    const measureInWindow = jest.fn((cb: (x: number, y: number, w: number, h: number) => void) =>
      cb(50, 100, 30, 20)
    );
    const anchorRef = { current: { measureInWindow } as never };
    const { result } = await renderHook(() =>
      usePopoverPositioning({
        width: 200,
        isRTL: true,
        anchorRef,
      })
    );
    await act(async () => {
      result.current.position();
    });
    expect(result.current.pos).toEqual({ left: -170, top: 32 });
  });
  it("repositions on layout when pos is already set (covers onPopoverLayout)", async () => {
    const measureInWindow = jest.fn((cb: (x: number, y: number, w: number, h: number) => void) =>
      cb(50, 100, 30, 20)
    );
    const anchorRef = { current: { measureInWindow } as never };
    const { result } = await renderHook(() =>
      usePopoverPositioning({
        width: 200,
        isRTL: false,
        anchorRef,
        mode: "absolute",
      })
    );
    await act(async () => {
      result.current.position();
    });
    expect(result.current.pos).not.toBeNull();
    await act(async () => {
      result.current.onPopoverLayout({ nativeEvent: { layout: { height: 120 } } } as never);
    });
    expect(measureInWindow).toHaveBeenCalledTimes(2);
  });
  it("returns early from position if node is null", async () => {
    const anchorRef = { current: null };
    const { result } = await renderHook(() =>
      usePopoverPositioning({
        width: 200,
        isRTL: false,
        anchorRef,
      })
    );
    await act(async () => {
      result.current.position();
    });
    expect(result.current.pos).toBeNull();
  });
  it("does not call position during onPopoverLayout if pos is null", async () => {
    const measureInWindow = jest.fn();
    const anchorRef = { current: { measureInWindow } as never };
    const { result } = await renderHook(() =>
      usePopoverPositioning({
        width: 200,
        isRTL: false,
        anchorRef,
      })
    );
    await act(async () => {
      result.current.onPopoverLayout({ nativeEvent: { layout: { height: 120 } } } as never);
    });
    expect(measureInWindow).not.toHaveBeenCalled();
  });
});
