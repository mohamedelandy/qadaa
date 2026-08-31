/** @format */
/**
 * Reproduction: hero card pill count and nudge/done footer must update LIVE
 * when prayers are logged/unlogged while the dashboard is mounted.
 */
import { act, render } from "@testing-library/react-native";
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
import { useSettingsStore } from "@stores/useSettingsStore";

async function renderDashboard() {
  const tree = await render(<Dashboard />);
  await act(async () => {
    jest.advanceTimersByTime(1000);
  });
  return tree;
}

describe("Dashboard hero card live updates", () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState());
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
    useSettingsStore.setState({ dailyTarget: 3 });
    mockFulldayVisible.mockClear();
  });

  it("updates pill count, journey %, and nudge immediately after logging a prayer", async () => {
    const base = usePrayerStore.getInitialState();
    const prayers = Object.fromEntries(
      (Object.keys(base.prayers) as Array<keyof typeof base.prayers>).map((k) => [
        k,
        { recovered: 0 },
      ])
    ) as typeof base.prayers;
    usePrayerStore.setState({ ...base, totalMissedDays: 50, prayers });

    const tree = await renderDashboard();
    expect(tree.getByText("0/3")).toBeTruthy();

    await act(async () => {
      usePrayerStore.getState().logPrayer("fajr");
    });

    expect(tree.getByText("1/3")).toBeOnTheScreen();
  });

  it("flips from nudge to done when daily target reached", async () => {
    const base = usePrayerStore.getInitialState();
    const prayers = Object.fromEntries(
      (Object.keys(base.prayers) as Array<keyof typeof base.prayers>).map((k) => [
        k,
        { recovered: 0 },
      ])
    ) as typeof base.prayers;
    usePrayerStore.setState({ ...base, totalMissedDays: 50, prayers });

    const tree = await renderDashboard();
    expect(tree.getByTestId("dashboard-hero-nudge")).toBeTruthy();

    await act(async () => {
      usePrayerStore.getState().logPrayer("fajr");
      usePrayerStore.getState().logPrayer("dhuhr");
      usePrayerStore.getState().logPrayer("asr");
    });

    expect(tree.queryByTestId("dashboard-hero-nudge")).toBeNull();
    expect(tree.getByTestId("dashboard-hero-done")).toBeOnTheScreen();
  });

  it("decrements pill count and restores nudge immediately after undo", async () => {
    const base = usePrayerStore.getInitialState();
    const prayers = Object.fromEntries(
      (Object.keys(base.prayers) as Array<keyof typeof base.prayers>).map((k) => [
        k,
        { recovered: 0 },
      ])
    ) as typeof base.prayers;
    usePrayerStore.setState({ ...base, totalMissedDays: 50, prayers });

    const tree = await renderDashboard();
    await act(async () => {
      usePrayerStore.getState().logPrayer("fajr");
      usePrayerStore.getState().logPrayer("dhuhr");
      usePrayerStore.getState().logPrayer("asr");
    });
    expect(tree.getByTestId("dashboard-hero-done")).toBeOnTheScreen();

    await act(async () => {
      usePrayerStore.getState().undoPrayer("asr");
    });
    expect(tree.getByText("2/3")).toBeOnTheScreen();
    expect(tree.queryByTestId("dashboard-hero-done")).toBeNull();
    expect(tree.getByTestId("dashboard-hero-nudge")).toBeOnTheScreen();
  });

  it("updates pill count live after batch log", async () => {
    const base = usePrayerStore.getInitialState();
    const prayers = Object.fromEntries(
      (Object.keys(base.prayers) as Array<keyof typeof base.prayers>).map((k) => [
        k,
        { recovered: 0 },
      ])
    ) as typeof base.prayers;
    usePrayerStore.setState({ ...base, totalMissedDays: 50, prayers });

    const tree = await renderDashboard();
    await act(async () => {
      usePrayerStore.getState().logPrayerBatch("fajr", 2);
    });
    expect(tree.getByText("1/3")).toBeOnTheScreen();

    await act(async () => {
      usePrayerStore.getState().logFullDay();
    });
    // logFullDay marks every prayer logged today; count reflects distinct prayers.
    expect(tree.getByText("5/3")).toBeOnTheScreen();
    expect(tree.getByTestId("dashboard-hero-done")).toBeOnTheScreen();
  });

  it("reflects a dailyTarget change made in settings immediately", async () => {
    const base = usePrayerStore.getInitialState();
    const prayers = Object.fromEntries(
      (Object.keys(base.prayers) as Array<keyof typeof base.prayers>).map((k) => [
        k,
        { recovered: 0 },
      ])
    ) as typeof base.prayers;
    usePrayerStore.setState({ ...base, totalMissedDays: 50, prayers });

    const tree = await renderDashboard();
    expect(tree.getByText("0/3")).toBeOnTheScreen();

    await act(async () => {
      useSettingsStore.getState().setDailyTarget(5);
    });
    expect(tree.getByText("0/5")).toBeOnTheScreen();
  });
});
