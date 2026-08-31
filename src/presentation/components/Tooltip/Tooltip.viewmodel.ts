/** @format */
/**
 * Adapts shared popover-positioning hook to tooltips with fixed width, gap/margins, and padded safe-area insets.
 */
import { usePopoverPositioning } from "@hooks/usePopoverPositioning";
import { spacing } from "@theme/spacing";
import type { EdgeInsets } from "react-native-safe-area-context";
export const POPOVER_WIDTH = 256;
export const GAP = spacing[3];
export const MARGIN = spacing[2];
const CONTAINER_H_PADDING = spacing[4];
function resolveTooltipInsets(safeInsets: EdgeInsets): EdgeInsets {
  return {
    top: safeInsets.top,
    bottom: safeInsets.bottom,
    left: safeInsets.left + CONTAINER_H_PADDING,
    right: safeInsets.right + CONTAINER_H_PADDING,
  };
}
export function useTooltipPositioning(safeInsets: EdgeInsets, isRTL: boolean) {
  return usePopoverPositioning({
    width: POPOVER_WIDTH,
    isRTL,
    gap: GAP,
    margin: MARGIN,
    insets: resolveTooltipInsets(safeInsets),
  });
}
