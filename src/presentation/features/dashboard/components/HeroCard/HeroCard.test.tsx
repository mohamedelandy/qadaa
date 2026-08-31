/** @format */
/**
 * Unit tests for HeroCard rendering: ring label, nudge vs done states and segment counts.
 * The card sources its data live from the stores, so state is seeded there.
 */
import { act, screen } from "@testing-library/react-native";
jest.mock("expo-linear-gradient", () => ({
  __esModule: true,
  LinearGradient: "LinearGradient",
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.useFakeTimers();
import { HeroCard } from "./HeroCard";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useSettingsStore } from "@stores/useSettingsStore";
import { PRAYER_KEYS } from "@domain/types";
import { renderWithProviders } from "@/src/__tests__/testUtils";

const renderHero = async (loggedCount: number, dailyTarget: number) => {
  useSettingsStore.setState({ dailyTarget });
  const todayPrayers = Object.fromEntries(
    PRAYER_KEYS.slice(0, loggedCount).map((k) => [k, true as const])
  ) as Partial<Record<(typeof PRAYER_KEYS)[number], true>>;
  usePrayerStore.setState({ todayPrayers });
  await renderWithProviders(<HeroCard />);
  await act(async () => {
    jest.advanceTimersByTime(1000);
  });
};

describe("HeroCard", () => {
  beforeEach(() => {
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useSettingsStore.setState({ dailyTarget: 5 });
  });
  it("renders the today count and journey ring label", async () => {
    usePrayerStore.setState({
      totalMissedDays: 100,
      prayers: { ...usePrayerStore.getState().prayers, fajr: { recovered: 250 } },
    });
    await renderHero(2, 5);
    expect(screen.getByText("2/5")).toBeOnTheScreen();
    expect(screen.getByText("50%")).toBeOnTheScreen();
    expect(screen.getByText("dashboard.journey")).toBeOnTheScreen();
  });
  it("shows the nudge when behind the target", async () => {
    await renderHero(2, 5);
    expect(screen.getByTestId("dashboard-hero-nudge")).toBeOnTheScreen();
    expect(screen.queryByTestId("dashboard-hero-done")).not.toBeOnTheScreen();
  });
  it("shows the done line when the target is reached", async () => {
    await renderHero(5, 5);
    expect(screen.getByTestId("dashboard-hero-done")).toBeOnTheScreen();
    expect(screen.queryByTestId("dashboard-hero-nudge")).not.toBeOnTheScreen();
  });
  it("renders one segment per target capped at 5", async () => {
    await renderHero(3, 5);
    expect(screen.getAllByTestId("dashboard-hero-segment")).toHaveLength(5);
  });
  it("handles zero dailyTarget (no segments, no nudge)", async () => {
    await renderHero(0, 0);
    expect(screen.queryByTestId("dashboard-hero-segment")).not.toBeOnTheScreen();
    expect(screen.getByText("0/0")).toBeOnTheScreen();
  });
});
