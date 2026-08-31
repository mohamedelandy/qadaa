/** @format */
/**
 * Unit tests for streak display logic, flagging at-risk streak when last log was yesterday.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useDashboardStreak } from "../useDashboardStreak";
import { useGamificationStore } from "@stores/useGamificationStore";
import { toLocalISODate } from "@domain/date";
describe("useDashboardStreak", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGamificationStore.setState(useGamificationStore.getInitialState());
  });
  it("returns at-risk false when no streak", async () => {
    const { result } = await renderHook(() => useDashboardStreak());
    expect(result.current.streakData.isAtRisk).toBe(false);
  });
  it("returns at-risk true when streak exists and last log was yesterday", async () => {
    const yesterday = toLocalISODate(new Date(Date.now() - 86400000));
    useGamificationStore.setState({ streak: 3, lastLogDate: yesterday });
    const { result } = await renderHook(() => useDashboardStreak());
    expect(result.current.streakData.isAtRisk).toBe(true);
  });
});
