/** @format */
/**
 * Unit tests for the badge grid view model (badges passthrough, unlocked vs locked styling).
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { spacing } from "@theme/spacing";
import { useBadgeGridViewModel } from "../BadgeGrid.viewmodel";
import type { BadgeInfo } from "../../../hooks/useStatsViewModel";

const BADGES: BadgeInfo[] = [
  { id: "first_log", unlockedAt: 1750000000000, icon: "\u{1F331}" },
  { id: "complete", unlockedAt: null, icon: "\u{1F3C6}" },
];
describe("useBadgeGridViewModel", () => {
  it("passes the badge list through unchanged", async () => {
    const { result } = await renderHook(() => useBadgeGridViewModel(BADGES));
    expect(result.current.badges).toBe(BADGES);
    expect(result.current.badges).toHaveLength(2);
  });
  it("exposes the current language for date formatting", async () => {
    const { result } = await renderHook(() => useBadgeGridViewModel(BADGES));
    expect(result.current.language).toBe("ar");
  });
  it("lays the grid out as a gapped wrapping row", async () => {
    const { result } = await renderHook(() => useBadgeGridViewModel(BADGES));
    expect(result.current.styles.grid.flexDirection).toBe("row");
    expect(result.current.styles.grid.flexWrap).toBe("wrap");
    expect(result.current.styles.grid.gap).toBe(spacing[3]);
  });
  it("dims locked icons against a dimmed card", async () => {
    const { result } = await renderHook(() => useBadgeGridViewModel(BADGES));
    expect(result.current.styles.iconLocked.opacity).toBe(0.4);
    expect(result.current.styles.cardLocked.backgroundColor).toBe(result.current.colors.cardDim);
    expect(result.current.styles.cardUnlocked.backgroundColor).toBe(result.current.colors.card);
  });
});
