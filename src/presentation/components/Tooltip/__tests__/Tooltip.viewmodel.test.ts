/** @format */
/**
 * Unit tests for tooltip positioning (fixed geometry constants and unanchored no-op guard).
 */
import { renderHook, act } from "@testing-library/react-native";
import { POPOVER_WIDTH, GAP, MARGIN, useTooltipPositioning } from "../Tooltip.viewmodel";
import { spacing } from "@theme/spacing";
import type { EdgeInsets } from "react-native-safe-area-context";

const SAFE_INSETS: EdgeInsets = { top: 4, bottom: 6, left: 8, right: 2 };
describe("tooltip geometry constants", () => {
  it("pins the popover width and spacing to shared tokens", () => {
    expect(POPOVER_WIDTH).toBe(256);
    expect(GAP).toBe(spacing[3]);
    expect(MARGIN).toBe(spacing[2]);
  });
});
describe("useTooltipPositioning", () => {
  it("reports no position before the anchor is measured", async () => {
    const { result } = await renderHook(() => useTooltipPositioning(SAFE_INSETS, false));
    expect(result.current.pos).toBeNull();
  });
  it("keeps positioning a no-op when no anchor view is attached", async () => {
    const { result } = await renderHook(() => useTooltipPositioning(SAFE_INSETS, true));
    await act(async () => {
      result.current.position(120);
    });
    expect(result.current.pos).toBeNull();
    expect(typeof result.current.onPopoverLayout).toBe("function");
    expect(typeof result.current.position).toBe("function");
  });
});
