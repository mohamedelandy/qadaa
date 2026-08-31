/** @format */
/**
 * Unit tests for the rank card view model (prop passthrough and themed styling).
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useThemeStore } from "@stores/useThemeStore";
import { useRankCardViewModel } from "../RankCard.viewmodel";
import type { RankInfo } from "../../../hooks/useStatsViewModel";

const GOLD_RANK: RankInfo = {
  label: "gold",
  color: "rankGold",
  bg: "rankGoldBg",
  border: "rankGoldBorder",
};
describe("useRankCardViewModel", () => {
  afterEach(() => {
    useThemeStore.getState().setDirection("ltr");
  });
  it("passes rank and points through unchanged", async () => {
    const { result } = await renderHook(() => useRankCardViewModel(GOLD_RANK, 2500));
    expect(result.current.rank).toBe(GOLD_RANK);
    expect(result.current.points).toBe(2500);
  });
  it("themes the card and translator keys off the active palette", async () => {
    const { result } = await renderHook(() => useRankCardViewModel(GOLD_RANK, 10));
    expect(result.current.styles.card.backgroundColor).toBe(result.current.colors.card);
    expect(result.current.styles.card.borderColor).toBe(result.current.colors.border);
    expect(result.current.t("stats.pointsLabel")).toBe("stats.pointsLabel");
  });
  it("mirrors layout direction changes from the theme store", async () => {
    const { result } = await renderHook(() => useRankCardViewModel(GOLD_RANK, 10));
    expect(result.current.isRTL).toBe(false);
    await act(async () => {
      useThemeStore.getState().setDirection("rtl");
    });
    expect(result.current.isRTL).toBe(true);
  });
});
