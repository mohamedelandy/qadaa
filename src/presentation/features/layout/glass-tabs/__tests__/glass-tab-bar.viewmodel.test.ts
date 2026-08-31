/** @format */
/**
 * Unit tests for GlassTabBar viewmodel: hit-test indexing, bar/highlight geometry, label crossfade.
 */
import {
  BAR_MARGIN,
  BLUR_BLEED,
  EXPANDED_HEIGHT,
  HIGHLIGHT_EXPANDED,
  HIGHLIGHT_MINIMIZED,
  ICON_SIZE,
  ITEM_GAP,
  LABEL_BLOCK,
  LABEL_HEIGHT,
  ITEM_PAD_V,
  MINIMIZED_HEIGHT,
  MINIMIZED_INSET,
  ROW_PAD_H,
  activeGlyphOpacity,
  barHeight,
  bottomSafeOffset,
  highlightHeight,
  highlightLayout,
  indexAtX,
  labelPairOpacity,
  sideInset,
} from "../glass-tab-bar.viewmodel";

describe("GlassTabBar viewmodel layout constants", () => {
  it("keeps the verbatim sizing constants", () => {
    expect(EXPANDED_HEIGHT).toBe(58);
    expect(MINIMIZED_HEIGHT).toBe(44);
    expect(MINIMIZED_INSET).toBe(34);
    expect(BAR_MARGIN).toBe(12);
    expect(ROW_PAD_H).toBe(4);
    expect(LABEL_HEIGHT).toBe(13);
    expect(ICON_SIZE).toBe(21);
    expect(ITEM_GAP).toBe(2);
    expect(LABEL_BLOCK).toBe(15);
    expect(ITEM_PAD_V).toBe(7);
    expect(HIGHLIGHT_EXPANDED).toBe(50);
    expect(HIGHLIGHT_MINIMIZED).toBe(35);
    expect(BLUR_BLEED).toBe(44);
  });
});

describe("barHeight", () => {
  it("interpolates between expanded and minimized heights", () => {
    expect(barHeight(0)).toBe(58);
    expect(barHeight(0.25)).toBe(54.5);
    expect(barHeight(1)).toBe(44);
  });
  it("clamps progress outside [0, 1]", () => {
    expect(barHeight(-1)).toBe(58);
    expect(barHeight(3)).toBe(44);
  });
});

describe("highlightHeight", () => {
  it("interpolates between expanded and minimized highlight heights", () => {
    expect(highlightHeight(0)).toBe(50);
    expect(highlightHeight(0.5)).toBe(42.5);
    expect(highlightHeight(1)).toBe(35);
  });
  it("clamps progress outside [0, 1]", () => {
    expect(highlightHeight(-2)).toBe(50);
    expect(highlightHeight(2)).toBe(35);
  });
});

describe("bottomSafeOffset", () => {
  it("reserves 16pt above the inset with a 12pt floor", () => {
    expect(bottomSafeOffset(34)).toBe(18);
    expect(bottomSafeOffset(28)).toBe(12);
    expect(bottomSafeOffset(20)).toBe(12);
    expect(bottomSafeOffset(0)).toBe(12);
    expect(bottomSafeOffset(100)).toBe(84);
  });
});

describe("sideInset", () => {
  it("grows from 0 to MINIMIZED_INSET as the bar collapses", () => {
    expect(sideInset(0)).toBe(0);
    expect(sideInset(0.5)).toBe(17);
    expect(sideInset(1)).toBe(34);
  });
  it("clamps values outside [0, 1]", () => {
    expect(sideInset(-5)).toBe(0);
    expect(sideInset(5)).toBe(34);
  });
});

describe("indexAtX", () => {
  const WINDOW_WIDTH = 390;
  const TAB_COUNT = 4;

  it("maps tab centers to their indices when expanded", () => {
    // itemWidth = (390 - 24 - 0 - 8) / 4 = 89.5; centers at 4 + (i + 0.5) * 89.5
    expect(indexAtX(48.75, WINDOW_WIDTH, TAB_COUNT, 0)).toBe(0);
    expect(indexAtX(138.25, WINDOW_WIDTH, TAB_COUNT, 0)).toBe(1);
    expect(indexAtX(227.75, WINDOW_WIDTH, TAB_COUNT, 0)).toBe(2);
    expect(indexAtX(317.25, WINDOW_WIDTH, TAB_COUNT, 0)).toBe(3);
  });
  it("returns fractional indices mid-drag", () => {
    expect(indexAtX(93.5, WINDOW_WIDTH, TAB_COUNT, 0)).toBe(0.5);
  });
  it("shrinks the row when minimized", () => {
    // itemWidth = (390 - 24 - 68 - 8) / 4 = 72.5; centers at 4 + (i + 0.5) * 72.5
    expect(indexAtX(40.25, WINDOW_WIDTH, TAB_COUNT, 1)).toBe(0);
    expect(indexAtX(257.75, WINDOW_WIDTH, TAB_COUNT, 1)).toBe(3);
  });
  it("clamps the minimized value outside [0, 1]", () => {
    expect(indexAtX(48.75, WINDOW_WIDTH, TAB_COUNT, -0.5)).toBe(0);
    expect(indexAtX(257.75, WINDOW_WIDTH, TAB_COUNT, 2)).toBe(3);
  });
  it("clamps taps outside the bar to the end tabs", () => {
    expect(indexAtX(-50, WINDOW_WIDTH, TAB_COUNT, 0)).toBe(0);
    expect(indexAtX(400, WINDOW_WIDTH, TAB_COUNT, 0)).toBe(3);
  });
  it("handles zero-width items without throwing", () => {
    // windowWidth 32 collapses the row to zero width, matching legacy division behavior
    expect(indexAtX(10, 32, TAB_COUNT, 0)).toBe(TAB_COUNT - 1);
    expect(indexAtX(-2, 32, TAB_COUNT, 0)).toBe(0);
    expect(indexAtX(4, 32, TAB_COUNT, 0)).toBeNaN();
  });
  it("handles a negative row width by mirroring the raw ratio", () => {
    // barWidth = -14 -> itemWidth = -5.5; raw = (-7 - 4) / -5.5 - 0.5 = 1.5
    expect(indexAtX(-7, 10, TAB_COUNT, 0)).toBe(1.5);
  });
});

describe("highlightLayout", () => {
  const WINDOW_WIDTH = 390;
  const TAB_COUNT = 4;

  it("lays out the pill centered in the expanded bar", () => {
    expect(highlightLayout(0, 0, WINDOW_WIDTH, TAB_COUNT)).toEqual({
      height: 50,
      width: 89.5,
      borderRadius: 25,
      top: 4,
      translateX: 4,
    });
  });
  it("lays out the smaller pill centered in the minimized bar", () => {
    expect(highlightLayout(1, 2, WINDOW_WIDTH, TAB_COUNT)).toEqual({
      height: 35,
      width: 72.5,
      borderRadius: 17.5,
      top: 4.5,
      translateX: 4 + 72.5 * 2,
    });
  });
  it("slides fractionally mid-drag", () => {
    const layout = highlightLayout(0, 1.5, WINDOW_WIDTH, TAB_COUNT);
    expect(layout.translateX).toBe(4 + 89.5 * 1.5);
  });
});

describe("label crossfade", () => {
  it("fades labels out over the first 40% of collapse", () => {
    expect(labelPairOpacity(0, 2, 2)).toEqual({ active: 1, inactive: 0 });
    expect(labelPairOpacity(0.2, 2, 2).active).toBeCloseTo(0.5);
    expect(labelPairOpacity(0.4, 2, 2)).toEqual({ active: 0, inactive: 0 });
    expect(labelPairOpacity(1, 2, 2)).toEqual({ active: 0, inactive: 0 });
  });
  it("crossfades active and inactive labels with slide distance when expanded", () => {
    expect(labelPairOpacity(0, 2, 2)).toEqual({ active: 1, inactive: 0 });
    expect(labelPairOpacity(0, 3, 2)).toEqual({ active: 0, inactive: 1 });
    expect(labelPairOpacity(0, 2.5, 2)).toEqual({ active: 0.5, inactive: 0.5 });
  });
  it("combines collapse fade with slide fade multiplicatively", () => {
    const { active } = labelPairOpacity(0.2, 3, 2);
    expect(active).toBeCloseTo(0.5 * 0);
    expect(labelPairOpacity(0.2, 2.5, 2).inactive).toBeCloseTo(0.5 * 0.5);
  });
});

describe("activeGlyphOpacity", () => {
  it("is opaque on the focused tab and fades over one slot of travel", () => {
    expect(activeGlyphOpacity(2, 2)).toBe(1);
    expect(activeGlyphOpacity(2.5, 2)).toBe(0.5);
    expect(activeGlyphOpacity(3, 2)).toBe(0);
    expect(activeGlyphOpacity(5, 2)).toBe(0);
  });
});
