/** @format */
/**
 * Unit tests for Dashboard screen rendering, hero card, hero nudge, and full-day pill visibility.
 */
import { act, screen } from "@testing-library/react-native";
jest.mock("react-native-worklets", () => ({
  __esModule: true,
  scheduleOnRN: (cb: () => void) => cb(),
}));
jest.mock("react-native-gesture-handler", () => {
  const buildPan = () => {
    const self = {
      activeOffsetY: () => self,
      onUpdate: () => self,
      onEnd: () => self,
    };
    return self;
  };
  return {
    __esModule: true,
    Gesture: { Pan: () => buildPan() },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock("@features/layout/glass-tabs/minimize", () => ({
  useMinimizeOnScroll: () => undefined,
  useTabBarMinimized: () => ({ value: 0 }),
}));
const mockFulldayVisible = jest.fn();
jest.mock("../components/LogFullDayBar/LogFullDayBar", () => ({
  __esModule: true,
  LogFullDayBar: ({ visible }: { visible: boolean }) => {
    mockFulldayVisible(visible);
    return null;
  },
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: "ar" },
  }),
}));
jest.useFakeTimers();
import Dashboard from "../index";
import { useAppStore } from "@stores/useAppStore";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import type { PrayerKey } from "@domain/types";
import { renderWithProviders } from "@/src/__tests__/testUtils";
describe("Dashboard", () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState());
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
    mockFulldayVisible.mockClear();
  });
  it("renders the app name from the VM", async () => {
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("app.name")).toBeOnTheScreen();
  });
  it("hides the floating pill in the zero-missed-days state (nothing to recover)", async () => {
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockFulldayVisible).toHaveBeenLastCalledWith(false);
  });
  it("hides the floating pill once all five prayers are logged today, even with remaining catch-up", async () => {
    const base = usePrayerStore.getInitialState();
    const prayers = Object.fromEntries(
      (Object.keys(base.prayers) as PrayerKey[]).map((k) => [k, { recovered: 10 }])
    ) as typeof base.prayers;
    const todayPrayers = Object.fromEntries(
      (Object.keys(base.prayers) as PrayerKey[]).map((k) => [k, true as const])
    ) as typeof base.todayPrayers;
    usePrayerStore.setState({ ...base, totalMissedDays: 50, prayers, todayPrayers });
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockFulldayVisible).toHaveBeenLastCalledWith(false);
  });
  it("renders the hero card and shows the floating log-full-day pill when prayers remain", async () => {
    const base = usePrayerStore.getInitialState();
    const prayers = Object.fromEntries(
      (Object.keys(base.prayers) as PrayerKey[]).map((k) => [k, { recovered: 10 }])
    ) as typeof base.prayers;
    usePrayerStore.setState({ ...base, totalMissedDays: 50, prayers });
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("dashboard-hero-card")).toBeOnTheScreen();
    expect(mockFulldayVisible).toHaveBeenLastCalledWith(true);
  });
  it("renders the all-caught-up celebration state instead of rows when nothing is missed", async () => {
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("dashboard-caught-up")).toBeOnTheScreen();
    expect(screen.getByText("dashboard.allCaughtUpTitle")).toBeOnTheScreen();
    expect(screen.queryByTestId("dashboard-hero-card")).not.toBeOnTheScreen();
  });
  it("shows the hero nudge with the default target and nothing logged today", async () => {
    const base = usePrayerStore.getInitialState();
    const prayers = Object.fromEntries(
      (Object.keys(base.prayers) as PrayerKey[]).map((k) => [k, { recovered: 0 }])
    ) as typeof base.prayers;
    usePrayerStore.setState({ ...base, totalMissedDays: 50, prayers });
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("dashboard-hero-nudge")).toBeOnTheScreen();
  });
  it("does not render the legacy today banner or catchup banner", async () => {
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByTestId("dashboard-today-banner")).not.toBeOnTheScreen();
    expect(screen.queryByTestId("dashboard-catchup-banner")).not.toBeOnTheScreen();
  });
  it("hides the log-full-day pill when the intention sheet is shown", async () => {
    useAppStore.setState({ wizardComplete: true });
    useGamificationStore.setState({ intentionSetDate: "2000-01-01" });
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByTestId("intention-sheet")).toBeOnTheScreen();
    expect(mockFulldayVisible).toHaveBeenLastCalledWith(false);
  });

  it("renders the skeleton while hydration is still pending", async () => {
    const hasHydratedSpy = jest.spyOn(usePrayerStore.persist, "hasHydrated").mockReturnValue(false);
    const onFinishSpy = jest
      .spyOn(usePrayerStore.persist, "onFinishHydration")
      .mockReturnValue(() => undefined);
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("dashboard-skeleton")).toBeOnTheScreen();
    expect(screen.queryByTestId("dashboard-hero-card")).not.toBeOnTheScreen();
    hasHydratedSpy.mockRestore();
    onFinishSpy.mockRestore();
  });

  it("plays the day-completion celebration once all prayers are caught up", async () => {
    const base = usePrayerStore.getInitialState();
    const prayers = Object.fromEntries(
      (Object.keys(base.prayers) as PrayerKey[]).map((k) => [k, { recovered: 10 }])
    ) as typeof base.prayers;
    usePrayerStore.setState({ ...base, totalMissedDays: 50, prayers });
    await renderWithProviders(<Dashboard />);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    // Nothing caught up yet — no confetti.
    expect(screen.queryByTestId("lottie-confetti")).not.toBeOnTheScreen();

    // Catch up every prayer: the celebration fires once and the confetti plays.
    const caughtUp = Object.fromEntries(
      (Object.keys(base.prayers) as PrayerKey[]).map((k) => [k, { recovered: 50 }])
    ) as typeof base.prayers;
    await act(async () => {
      usePrayerStore.setState({ prayers: caughtUp });
    });
    const confetti = screen.getByTestId("lottie-confetti");
    expect(confetti).toBeOnTheScreen();

    // Firing the confetti's finish callback clears the celebration state.
    await act(async () => {
      confetti.props["onAnimationFinish"]?.();
    });
  });
});
