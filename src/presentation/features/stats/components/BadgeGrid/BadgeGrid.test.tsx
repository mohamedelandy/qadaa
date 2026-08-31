/** @format */
/**
 * Unit tests for BadgeGrid: locked placeholders, unlocked dates, and the
 * one-shot burst animation for badges unlocked after mount.
 */
import { screen, act } from "@testing-library/react-native";
let mockI18nLanguage = "ar";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: mockI18nLanguage } }),
}));
import { renderWithProviders } from "@/src/__tests__/testUtils";
import { BadgeGrid } from "./BadgeGrid";
import type { BadgeInfo } from "@features/stats/hooks/useStatsViewModel";
import { useSettingsStore } from "@stores/useSettingsStore";

describe("BadgeGrid", () => {
  afterEach(() => {
    mockI18nLanguage = "ar";
    useSettingsStore.setState(useSettingsStore.getInitialState());
  });
  it("renders a grid of badges", async () => {
    const badges: BadgeInfo[] = [
      { id: "first_log", icon: "🎉", unlockedAt: 1 },
      { id: "first_week", icon: "🏆", unlockedAt: null },
    ];
    await renderWithProviders(<BadgeGrid badges={badges} />);
    expect(screen.getByText("stats.lockedBadge")).toBeOnTheScreen();
    expect(screen.getByTestId("stats-badge-first_week-locked")).toBeOnTheScreen();
    expect(screen.queryByTestId("stats-badge-first_week-date")).not.toBeOnTheScreen();
  });

  it("renders the localized unlock date for unlocked badges only", async () => {
    const unlockedAt = 1750000000000;
    const badges: BadgeInfo[] = [
      { id: "first_log", icon: "🎉", unlockedAt },
      { id: "complete", icon: "🏆", unlockedAt: null },
    ];
    await renderWithProviders(<BadgeGrid badges={badges} />);
    const expectedDate = new Date(unlockedAt).toLocaleDateString("ar-EG");
    expect(screen.getByText(expectedDate)).toBeOnTheScreen();
    expect(screen.getAllByText("stats.lockedBadge")).toHaveLength(1);
    expect(screen.getByTestId("stats-badge-first_log-date")).toBeOnTheScreen();
    expect(screen.queryByTestId("stats-badge-first_log-locked")).not.toBeOnTheScreen();
  });

  it("formats the unlock date for the English locale when the UI is English", async () => {
    mockI18nLanguage = "en";
    useSettingsStore.setState({ language: "en" });
    const unlockedAt = 1750000000000;
    const badges: BadgeInfo[] = [{ id: "first_log", icon: "🎉", unlockedAt }];
    await renderWithProviders(<BadgeGrid badges={badges} />);
    const expectedDate = new Date(unlockedAt).toLocaleDateString("en-US");
    expect(screen.getByText(expectedDate)).toBeOnTheScreen();
  });

  it("plays the burst animation only for badges unlocked after mount", async () => {
    const lockedOnly: BadgeInfo[] = [
      { id: "first_log", icon: "🎉", unlockedAt: null },
      { id: "first_week", icon: "🏆", unlockedAt: null },
    ];
    const result = await renderWithProviders(<BadgeGrid badges={lockedOnly} />);
    expect(screen.queryByTestId("lottie-star-burst")).not.toBeOnTheScreen();

    const newlyUnlocked: BadgeInfo[] = [
      { id: "first_log", icon: "🎉", unlockedAt: 1750000000000 },
      { id: "first_week", icon: "🏆", unlockedAt: null },
    ];
    await result.rerender(<BadgeGrid badges={newlyUnlocked} />);
    const burst = screen.getByTestId("lottie-star-burst");
    expect(burst).toBeOnTheScreen();

    await act(async () => {
      burst.props["onAnimationFinish"]?.();
    });
    expect(screen.queryByTestId("lottie-star-burst")).not.toBeOnTheScreen();
    expect(screen.getByText("stats.badges_data.first_log")).toBeOnTheScreen();
  });
});
