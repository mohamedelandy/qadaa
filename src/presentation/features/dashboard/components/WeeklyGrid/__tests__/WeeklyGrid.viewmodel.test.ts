/** @format */
/**
 * Unit tests for weekly grid helpers: chunking, flame tiers, consecutive runs and placeholder padding.
 */
import { renderHook } from "@testing-library/react-native";
import { toLocalISODate, addDays } from "@domain/date";
const mockArrays: Record<string, string[]> = {
  "dashboard.dayInitials": ["S", "S", "M", "T", "W", "T", "F"],
};
let mockReturnObjectsValue: unknown;
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (
      k: string,
      opts?: {
        returnObjects?: boolean;
      }
    ) => {
      if (!opts?.returnObjects) return k;
      return mockReturnObjectsValue === undefined ? (mockArrays[k] ?? []) : mockReturnObjectsValue;
    },
    i18n: { language: "ar" },
  }),
}));
import {
  useWeeklyGridViewModel,
  buildFlameGrid,
  weekdayOffset,
  computeFlameTier,
  consecutiveRun,
  chunkArray,
} from "../WeeklyGrid.viewmodel";
const makeCells = (n: number) => {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => ({
    date: toLocalISODate(addDays(today, i - (n - 1))),
    logged: i % 2 === 0,
    isToday: i === n - 1,
  }));
};
describe("chunkArray", () => {
  it("chunks into equal rows", () => {
    const rows = chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 4);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual([1, 2, 3, 4]);
  });
});
describe("computeFlameTier", () => {
  it("maps run lengths to tiers", () => {
    expect(computeFlameTier(0)).toBe(0);
    expect(computeFlameTier(1)).toBe(1);
    expect(computeFlameTier(2)).toBe(2);
    expect(computeFlameTier(3)).toBe(3);
    expect(computeFlameTier(4)).toBe(3);
    expect(computeFlameTier(5)).toBe(4);
    expect(computeFlameTier(6)).toBe(4);
    expect(computeFlameTier(7)).toBe(5);
    expect(computeFlameTier(20)).toBe(5);
  });
});
describe("buildFlameGrid", () => {
  it("keeps exactly 28 real days prefixed by weekday placeholders", () => {
    const grid = buildFlameGrid(makeCells(35));
    const real = grid.filter((c) => !c.placeholder);
    expect(real).toHaveLength(28);
    expect(grid.length % 7).toBe(0);
    expect(grid.length).toBeGreaterThanOrEqual(28);
    expect(grid.length).toBeLessThanOrEqual(35);
    expect(real[real.length - 1]?.isToday).toBe(true);
    expect(grid.filter((c) => c.placeholder).every((c) => c.intensity === 0)).toBe(true);
  });
  it("pads trailing cells so every row is a full 7", () => {
    const grid = buildFlameGrid(makeCells(35));
    expect(grid.length % 7).toBe(0);
    expect(grid.filter((c) => !c.placeholder)).toHaveLength(28);
    let lastRealIndex = -1;
    grid.forEach((c, i) => {
      if (!c.placeholder) lastRealIndex = i;
    });
    grid.slice(lastRealIndex + 1).forEach((c) => expect(c.placeholder).toBe(true));
  });
  it("aligns the first real cell to its true weekday column", () => {
    const grid = buildFlameGrid(makeCells(35));
    const pad = grid.findIndex((c) => !c.placeholder);
    const firstReal = grid[pad];
    if (!firstReal) throw new Error("expected a real cell in the flame grid");
    const weekday = (new Date(`${firstReal.date}T00:00:00`).getDay() - 6 + 7) % 7;
    expect(pad).toBe(weekday);
  });
  it("computes rising intensity for a consecutive run", () => {
    const cells = makeCells(35).map((c, i) =>
      i < 31 ? { ...c, logged: false } : { ...c, logged: true }
    );
    const real = buildFlameGrid(cells).filter((c) => !c.placeholder);
    const last4 = real.slice(-4).map((c) => c.intensity);
    expect(last4).toEqual([1, 2, 3, 3]);
  });
  it("caps a long consecutive run at tier 5 (white-hot)", () => {
    const cells = makeCells(35).map((c, i) =>
      i >= 26 ? { ...c, logged: true } : { ...c, logged: false }
    );
    const real = buildFlameGrid(cells).filter((c) => !c.placeholder);
    expect(real[real.length - 1]?.intensity).toBe(5);
  });
  it("walks a run to the very start when all days are logged", () => {
    const cells = makeCells(35).map((c) => ({ ...c, logged: true }));
    const real = buildFlameGrid(cells).filter((c) => !c.placeholder);
    expect(real[real.length - 1]?.intensity).toBe(5);
  });
  it("returns an empty grid for empty input", () => {
    expect(buildFlameGrid([])).toEqual([]);
  });
});
describe("consecutiveRun", () => {
  it("terminates by loop exhaustion at index 0 when the run reaches the start", () => {
    expect(consecutiveRun([{ date: "x", logged: true, isToday: false }], 0)).toBe(1);
  });
  it("walks a multi-day run to the start and exhausts the loop", () => {
    const cells = [
      { date: "a", logged: true, isToday: false },
      { date: "b", logged: true, isToday: false },
    ];
    expect(consecutiveRun(cells, 1)).toBe(2);
  });
});
describe("weekdayOffset", () => {
  it("returns 0 for an invalid date", () => {
    expect(weekdayOffset("not-a-date")).toBe(0);
  });
  it("maps Saturday to 0 and Friday to 6", () => {
    expect(weekdayOffset("2026-08-15")).toBe(0);
    expect(weekdayOffset("2026-08-14")).toBe(6);
  });
});
describe("useWeeklyGridViewModel", () => {
  it("returns fill-parent cell and header cell styles", async () => {
    const cells = makeCells(35);
    const { result } = await renderHook(() => useWeeklyGridViewModel(cells));
    expect(result.current.styles.cell).toEqual(
      expect.objectContaining({ flex: 1, aspectRatio: 1 })
    );
    expect(result.current.styles.dayHeaderCell).toEqual(expect.objectContaining({ flex: 1 }));
  });
  it("aligns header and rows with row flex direction", async () => {
    const cells = makeCells(35);
    const { result } = await renderHook(() => useWeeklyGridViewModel(cells));
    expect(result.current.styles.dayHeaderRow.flexDirection).toBe("row");
    expect(result.current.styles.row.flexDirection).toBe("row");
  });
  it("returns aligned weeks", async () => {
    const cells = makeCells(35);
    const { result } = await renderHook(() => useWeeklyGridViewModel(cells));
    expect(result.current.styles).toBeDefined();
    expect(result.current.dayInitials).toHaveLength(7);
    const flat = result.current.weeks.flat();
    expect(flat.filter((c) => !c.placeholder)).toHaveLength(28);
    expect(flat.length % 7).toBe(0);
    expect(flat.length).toBeGreaterThanOrEqual(28);
    expect(flat.length).toBeLessThanOrEqual(35);
    expect(result.current.weeks.every((row) => row.length <= 7)).toBe(true);
  });
  it("uses the real translated array for day initials", async () => {
    const cells = makeCells(35);
    const { result } = await renderHook(() => useWeeklyGridViewModel(cells));
    expect(result.current.dayInitials).toEqual(["S", "S", "M", "T", "W", "T", "F"]);
  });
  it("falls back to default initials when translations are not arrays", async () => {
    mockReturnObjectsValue = "not-an-array";
    try {
      const cells = makeCells(35);
      const { result } = await renderHook(() => useWeeklyGridViewModel(cells));
      expect(result.current.dayInitials).toEqual(["S", "S", "M", "T", "W", "T", "F"]);
    } finally {
      mockReturnObjectsValue = undefined;
    }
  });
});
