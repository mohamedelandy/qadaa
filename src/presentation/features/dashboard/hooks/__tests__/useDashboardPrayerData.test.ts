/** @format */
/**
 * Unit tests for per-prayer recovery rows, today's progress math, and zero-target edge case.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: "ar" },
  }),
}));
import { useDashboardPrayerData } from "../useDashboardPrayerData";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useSettingsStore } from "@stores/useSettingsStore";
describe("useDashboardPrayerData", () => {
  beforeEach(() => {
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useSettingsStore.setState(useSettingsStore.getInitialState());
  });
  it("returns prayer rows with default state", async () => {
    const { result } = await renderHook(() => useDashboardPrayerData());
    expect(result.current.prayerRows).toHaveLength(5);
  });
  it("calculates progress with wizard data", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    const { result } = await renderHook(() => useDashboardPrayerData());
    const first = result.current.prayerRows[0];
    expect(first?.totalMissedDays).toBeGreaterThan(0);
  });
  it("handles zero dailyTarget (covers ternary)", async () => {
    useSettingsStore.setState({ dailyTarget: 0 });
    const { result } = await renderHook(() => useDashboardPrayerData());
    expect(result.current.todayData.progress).toBe(0);
  });
  it("returns allPrayersDone false when no prayers", async () => {
    const { result } = await renderHook(() => useDashboardPrayerData());
    expect(result.current.allPrayersDone).toBe(false);
  });
});
