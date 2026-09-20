/** @format */
/**
 * Unit tests for clampPopoverPosition inset-aware placement including RTL and preferBelow.
 */
import { clampPopoverPosition } from "../usePopoverPositioning";
describe("clampPopoverPosition", () => {
  const base = {
    x: 10,
    y: 20,
    w: 30,
    h: 30,
    width: 200,
    height: 100,
    gap: 8,
    margin: 8,
    preferBelow: false,
    isRTL: false,
    windowWidth: 400,
    windowHeight: 800,
  };
  it("keeps popover inside insets on top/left/right/bottom", () => {
    const r = clampPopoverPosition({
      ...base,
      insets: { top: 44, bottom: 34, left: 16, right: 16 },
    });
    expect(r.top).toBeGreaterThanOrEqual(44 + 8);
    expect(r.top + 100).toBeLessThanOrEqual(800 - 34 - 8);
    expect(r.left).toBeGreaterThanOrEqual(16 + 8);
    expect((r.left as number) + 200).toBeLessThanOrEqual(400 - 16 - 8);
  });
  it("clamps to window margin only when insets are zero (backward compatible)", () => {
    const r = clampPopoverPosition({
      ...base,
      insets: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    expect(r.top).toBeGreaterThanOrEqual(8);
    expect(r.top + 100).toBeLessThanOrEqual(800 - 8);
    expect(r.left).toBeGreaterThanOrEqual(8);
    expect((r.left as number) + 200).toBeLessThanOrEqual(400 - 8);
  });
  it("does not regress to the exact original position() output at zero insets", () => {
    expect(
      clampPopoverPosition({ ...base, insets: { top: 0, bottom: 0, left: 0, right: 0 } })
    ).toEqual({ left: 8, top: 58, width: 200 });
  });
  it("keeps a wide popover inside parent content padding (no start/end overflow)", () => {
    const win = { windowWidth: 390, windowHeight: 800 };
    const r = clampPopoverPosition({
      ...base,
      ...win,
      x: 354,
      y: 20,
      w: 24,
      h: 24,
      width: 256,
      height: 100,
      insets: { top: 44, bottom: 34, left: 16, right: 16 },
    });
    expect(r.left).toBeGreaterThanOrEqual(8 + 16);
    expect((r.left as number) + 256).toBeLessThanOrEqual(390 - 8 - 16);
  });
  it("handles isRTL: true correctly", () => {
    const r = clampPopoverPosition({
      ...base,
      isRTL: true,
      insets: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    expect(r.left).toBe(10);
  });
  it("handles preferBelow: true where vertical space permits below", () => {
    const r = clampPopoverPosition({
      ...base,
      preferBelow: true,
      y: 100,
      windowHeight: 800,
      insets: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    expect(r.top).toBe(138);
  });
  it("handles preferBelow: true where vertical space is constrained below", () => {
    const r = clampPopoverPosition({
      ...base,
      preferBelow: true,
      y: 700,
      windowHeight: 800,
      insets: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    expect(r.top).toBe(592);
  });
  it("handles preferBelow: false where vertical space is constrained above but fits below", () => {
    const r = clampPopoverPosition({
      ...base,
      preferBelow: false,
      y: 50,
      windowHeight: 800,
      insets: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    expect(r.top).toBe(88);
  });
  it("handles preferBelow: false where vertical space is constrained both above and below", () => {
    const r = clampPopoverPosition({
      ...base,
      preferBelow: false,
      y: 50,
      windowHeight: 150,
      insets: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    expect(r.top).toBe(8);
  });
  it("handles preferBelow: false where vertical space permits above", () => {
    const r = clampPopoverPosition({
      ...base,
      preferBelow: false,
      y: 500,
      windowHeight: 800,
      insets: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    // aboveTop = y - gap - height = 500 - 8 - 100 = 392
    expect(r.top).toBe(392);
  });
});
