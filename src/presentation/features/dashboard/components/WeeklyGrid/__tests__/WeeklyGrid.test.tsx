/** @format */
/**
 * Unit tests for WeeklyGrid rendering: section labels, day initials, cell counts, today ring and legend.
 */
import { act, screen } from "@testing-library/react-native";
import { toLocalISODate, addDays } from "@domain/date";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { WeeklyGrid } from "../WeeklyGrid";
import { renderWithProviders } from "@/src/__tests__/testUtils";
jest.useFakeTimers();
const ANCHOR = new Date("2026-08-20T00:00:00");
const makeCells = () => {
  return Array.from({ length: 35 }, (_, i) => ({
    date: toLocalISODate(addDays(ANCHOR, i - 34)),
    logged: i % 2 === 0,
    isToday: i === 34,
  }));
};
describe("WeeklyGrid", () => {
  const renderGrid = async () => {
    await renderWithProviders(<WeeklyGrid cells={makeCells()} />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
  };
  it("renders the section labels", async () => {
    await renderGrid();
    expect(screen.getByText("dashboard.weeklyGrid")).toBeOnTheScreen();
    expect(screen.getByText("dashboard.lastWeeks")).toBeOnTheScreen();
  });
  it("renders the day-initial header row", async () => {
    await renderGrid();
    expect(screen.getByTestId("heatmap-day-header")).toBeOnTheScreen();
    expect(screen.getAllByText("S")).toHaveLength(2);
    expect(screen.getAllByText("T")).toHaveLength(2);
  });
  it("renders 28 grid cells plus leading weekday placeholders", async () => {
    await renderGrid();
    const cells = screen.getAllByTestId(/heatmap-cell/);
    expect(cells).toHaveLength(28);
    const placeholders = screen.getAllByTestId("heatmap-placeholder");
    const total = cells.length + placeholders.length;
    expect(total % 7).toBe(0);
    expect(total).toBeGreaterThanOrEqual(28);
    expect(total).toBeLessThanOrEqual(35);
  });
  it("marks today's cell with the ring overlay", async () => {
    await renderGrid();
    expect(screen.getByTestId("heatmap-cell-today")).toBeOnTheScreen();
    expect(screen.getByTestId("heatmap-ring")).toBeOnTheScreen();
  });
  it("renders the intensity legend row", async () => {
    await renderGrid();
    expect(screen.getByTestId("dashboard-heatmap-legend")).toBeOnTheScreen();
    expect(screen.getByText("dashboard.legendLess")).toBeOnTheScreen();
    expect(screen.getByText("dashboard.legendMore")).toBeOnTheScreen();
  });
  it("no longer renders the continuity chain", async () => {
    await renderGrid();
    expect(screen.queryAllByTestId(/continuity-node/)).toHaveLength(0);
  });
});
