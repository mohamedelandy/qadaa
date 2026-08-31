/** @format */
/**
 * Positions popovers against an anchor view clamped to window insets with RTL support.
 */
import { useCallback, useRef, useState } from "react";
import type { RefObject } from "react";
import { useWindowDimensions, LayoutChangeEvent, View } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";
import { spacing } from "@theme/spacing";
export interface PopoverPos {
  left?: number;
  right?: number;
  top: number;
  width?: number;
}
export interface PopoverClampInput {
  x: number;
  y: number;
  w: number;
  h: number;
  width: number;
  height: number;
  gap: number;
  margin: number;
  preferBelow: boolean;
  isRTL: boolean;
  windowWidth: number;
  windowHeight: number;
  insets: EdgeInsets;
}
export function clampPopoverPosition(p: PopoverClampInput): PopoverPos {
  const {
    x,
    y,
    w,
    h,
    width,
    height,
    gap,
    margin,
    preferBelow,
    isRTL,
    windowWidth,
    windowHeight,
    insets,
  } = p;
  const topMin = margin + insets.top;
  const bottomMax = windowHeight - margin - insets.bottom;
  const leftMin = margin + insets.left;
  const rightMax = windowWidth - margin - insets.right;
  const maxX = rightMax - width;
  const minX = Math.min(leftMin, maxX);
  const rawX = isRTL ? x : x + w - width;
  const popX = Math.min(Math.max(rawX, minX), maxX);
  const aboveTop = y - gap - height;
  const belowTop = y + h + gap;
  let top: number;
  if (preferBelow) {
    top = belowTop + height <= bottomMax ? belowTop : Math.max(aboveTop, topMin);
  } else {
    top =
      aboveTop >= topMin
        ? aboveTop
        : belowTop + height <= bottomMax
          ? belowTop
          : Math.max(aboveTop, topMin);
  }
  return { left: popX, top, width };
}
const FALLBACK_HEIGHT = 96;
const DEFAULT_GAP = spacing[3];
const DEFAULT_MARGIN = spacing[2];
const ZERO_INSETS: EdgeInsets = { top: 0, bottom: 0, left: 0, right: 0 };
interface UsePopoverPositioningOptions {
  width: number;
  isRTL: boolean;
  gap?: number;
  margin?: number;
  preferBelow?: boolean;
  mode?: "relative" | "absolute";
  insets?: EdgeInsets;
  anchorRef?: RefObject<View | null>;
}
export interface UsePopoverPositioningResult {
  ref: RefObject<View | null>;
  pos: PopoverPos | null;
  position: (heightOverride?: number) => void;
  onPopoverLayout: (e: LayoutChangeEvent) => void;
}
export function usePopoverPositioning({
  width,
  isRTL,
  gap = DEFAULT_GAP,
  margin = DEFAULT_MARGIN,
  preferBelow = false,
  mode = "relative",
  insets = ZERO_INSETS,
  anchorRef,
}: UsePopoverPositioningOptions): UsePopoverPositioningResult {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const internalRef = useRef<View>(null);
  const ref = anchorRef ?? internalRef;
  const heightRef = useRef(0);
  const [pos, setPos] = useState<PopoverPos | null>(null);
  const position = useCallback(
    (heightOverride?: number) => {
      const node = ref.current;
      if (!node) return;
      node.measureInWindow((x: number, y: number, w: number, h: number) => {
        const height =
          heightOverride ?? (heightRef.current > 0 ? heightRef.current : FALLBACK_HEIGHT);
        const res = clampPopoverPosition({
          x,
          y,
          w,
          h,
          width,
          height,
          gap,
          margin,
          preferBelow,
          isRTL,
          windowWidth,
          windowHeight,
          insets,
        });
        const popX = res.left as number;
        const top = res.top;
        if (mode === "absolute") {
          setPos({ left: popX, top, width });
        } else {
          const left = isRTL ? x + w - popX - width : popX - x;
          setPos({ left, top: top - y });
        }
      });
    },
    [isRTL, margin, width, gap, preferBelow, mode, windowWidth, windowHeight, insets]
  );
  const onPopoverLayout = useCallback(
    (e: LayoutChangeEvent) => {
      heightRef.current = e.nativeEvent.layout.height;
      if (pos) position(heightRef.current);
    },
    [pos, position]
  );
  return { ref, pos, position, onPopoverLayout };
}
