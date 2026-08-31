/** @format */
/**
 * Pure geometry and opacity math for the glass tab bar (no React/Native imports).
 */
export const EXPANDED_HEIGHT = 58;
export const MINIMIZED_HEIGHT = 44;
export const MINIMIZED_INSET = 34;
export const BAR_MARGIN = 12;
export const ROW_PAD_H = 4;
export const LABEL_HEIGHT = 13;
export const ICON_SIZE = 21;
export const ITEM_GAP = 2;
export const LABEL_BLOCK = LABEL_HEIGHT + ITEM_GAP;
export const ITEM_PAD_V = 7;
export const HIGHLIGHT_EXPANDED = ICON_SIZE + LABEL_BLOCK + ITEM_PAD_V * 2;
export const HIGHLIGHT_MINIMIZED = ICON_SIZE + ITEM_PAD_V * 2;
export const BLUR_BLEED = 44;

const LABEL_FADE_END = 0.4;

type BarGeometry = {
  sideInset: number;
  barWidth: number;
  itemWidth: number;
};
export type HighlightLayout = {
  height: number;
  width: number;
  borderRadius: number;
  top: number;
  translateX: number;
};
export type LabelOpacities = {
  active: number;
  inactive: number;
};

function clamp01(value: number): number {
  "worklet";
  return Math.min(Math.max(value, 0), 1);
}
/** Equivalent of `interpolate(t, [0, 1], [outMin, outMax], Extrapolation.CLAMP)`. */
function mixClamped(t: number, outMin: number, outMax: number): number {
  "worklet";
  return outMin + clamp01(t) * (outMax - outMin);
}
export function barHeight(progress: number): number {
  "worklet";
  return mixClamped(progress, EXPANDED_HEIGHT, MINIMIZED_HEIGHT);
}
export function highlightHeight(progress: number): number {
  "worklet";
  return mixClamped(progress, HIGHLIGHT_EXPANDED, HIGHLIGHT_MINIMIZED);
}
export function sideInset(minimizedValue: number): number {
  "worklet";
  return mixClamped(minimizedValue, 0, MINIMIZED_INSET);
}
export function bottomSafeOffset(insetBottom: number): number {
  return Math.max(insetBottom - 16, 12);
}
function rowGeometry(windowWidth: number, tabCount: number, minimizedValue: number): BarGeometry {
  "worklet";
  const inset = sideInset(minimizedValue);
  const barWidth = windowWidth - BAR_MARGIN * 2 - inset * 2;
  const itemWidth = (barWidth - ROW_PAD_H * 2) / tabCount;
  return { sideInset: inset, barWidth, itemWidth };
}
export function indexAtX(
  x: number,
  windowWidth: number,
  tabCount: number,
  minimizedValue: number
): number {
  "worklet";
  const { itemWidth } = rowGeometry(windowWidth, tabCount, minimizedValue);
  const raw = (x - ROW_PAD_H) / itemWidth - 0.5;
  return Math.min(Math.max(raw, 0), tabCount - 1);
}
export function highlightLayout(
  progress: number,
  slideIndex: number,
  windowWidth: number,
  tabCount: number
): HighlightLayout {
  "worklet";
  const height = highlightHeight(progress);
  const { itemWidth } = rowGeometry(windowWidth, tabCount, progress);
  return {
    height,
    width: itemWidth,
    borderRadius: height / 2,
    top: (barHeight(progress) - height) / 2,
    translateX: ROW_PAD_H + itemWidth * slideIndex,
  };
}
/** Slide-distance fade shared by glyph crossfade and label pair (1 = fully focused neighbor distance). */
function focusFade(slideIndex: number, index: number): number {
  "worklet";
  return Math.min(Math.abs(slideIndex - index), 1);
}
export function activeGlyphOpacity(slideIndex: number, index: number): number {
  "worklet";
  return 1 - focusFade(slideIndex, index);
}
export function labelPairOpacity(
  progress: number,
  slideIndex: number,
  index: number
): LabelOpacities {
  "worklet";
  const collapseFade = 1 - clamp01(progress / LABEL_FADE_END);
  const fade = focusFade(slideIndex, index);
  return { active: collapseFade * (1 - fade), inactive: collapseFade * fade };
}
