/** @format */
/**
 * Unit tests for log/undo/full-day actions covering points, streaks, badges, haptics, and first-run tour.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("expo-haptics", () => ({
  __esModule: true,
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Error: "error", Warning: "warning" },
}));
import * as Haptics from "expo-haptics";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { useAppStore } from "@stores/useAppStore";
import { useDashboardActions } from "../useDashboardActions";
describe("useDashboardActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
    useAppStore.setState(useAppStore.getInitialState());
  });
  it("handleLogPrayer logs a prayer, updates streak/points, and completes dashboard tour when incomplete", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    useAppStore.setState({ dashboardTourComplete: false });
    useGamificationStore.setState({ badges: [{ id: "first_week", unlockedAt: Date.now() }] });
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleLogPrayer("fajr");
    });
    expect(useGamificationStore.getState().points).toBeGreaterThan(0);
    expect(useAppStore.getState().dashboardTourComplete).toBe(true);
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(1);
  });
  it("handleLogPrayer returns early when points <= 0", async () => {
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleLogPrayer("fajr");
    });
    expect(useGamificationStore.getState().points).toBe(0);
  });
  it("handleLogFullDay logs full day and fires notification haptic", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    useGamificationStore.setState({ badges: [{ id: "first_week", unlockedAt: Date.now() }] });
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleLogFullDay();
    });
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
    expect(useGamificationStore.getState().points).toBeGreaterThan(0);
  });
  it("handleUndo refunds exactly the points awarded for today's log", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleLogPrayer("fajr");
    });
    expect(useGamificationStore.getState().points).toBe(10);
    await act(async () => {
      result.current.actions.handleUndo("fajr");
    });
    expect(useGamificationStore.getState().points).toBe(0);
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(0);
  });
  it("handleUndo does not deduct points for prayers not logged today", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.setState({
      prayers: {
        fajr: { recovered: 3 },
        dhuhr: { recovered: 0 },
        asr: { recovered: 0 },
        maghrib: { recovered: 0 },
        isha: { recovered: 0 },
      },
      todayPrayers: {},
    });
    useGamificationStore.getState().incrementPoints(50);
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleUndo("fajr");
    });
    expect(useGamificationStore.getState().points).toBe(50);
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(3);
  });
  it("handleUndo refunds the full-day bonus accurately (no inflation on log+undo cycles)", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleLogFullDay();
    });
    expect(useGamificationStore.getState().points).toBe(100);
    await act(async () => {
      result.current.actions.handleUndo("fajr");
    });
    expect(useGamificationStore.getState().points).toBe(80);
  });
  it("handleBatch logs a batch and fires impact haptic", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    useGamificationStore.setState({ badges: [{ id: "first_week", unlockedAt: Date.now() }] });
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleBatch("fajr", 5);
    });
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    expect(useGamificationStore.getState().points).toBeGreaterThan(0);
  });
  it("dismissIntention and dismissDua set dates on the gamification store", async () => {
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.dismissIntention();
    });
    await act(async () => {
      result.current.actions.dismissDua();
    });
    const gStore = useGamificationStore.getState();
    expect(gStore.intentionSetDate).not.toBeNull();
    expect(gStore.lastDuaShownDate).not.toBeNull();
  });
  it("handleLogPrayer skips completeDashboardTour when tour is already complete", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    useAppStore.setState({ dashboardTourComplete: true });
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleLogPrayer("fajr");
    });
    expect(useAppStore.getState().dashboardTourComplete).toBe(true);
  });
  it("handleLogPrayer announces new badges with a success haptic when unlocked", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    useGamificationStore.setState({ badges: [], points: 0 });
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleLogPrayer("fajr");
    });
    expect(useGamificationStore.getState().badges.length).toBeGreaterThan(0);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
  });
  it("handleLogFullDay returns early when points <= 0 (all full)", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    const max = usePrayerStore.getState().totalMissedDays;
    ["fajr", "dhuhr", "asr", "maghrib", "isha"].forEach((p) => {
      usePrayerStore.getState().logPrayerBatch(p as never, max);
    });
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleLogFullDay();
    });
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
  });
  it("handleBatch returns early when points <= 0", async () => {
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleBatch("fajr", 5);
    });
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
  it("handleBatch announces new badges with a success haptic when unlocked", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    useGamificationStore.setState({ badges: [], points: 0 });
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleBatch("fajr", 5);
    });
    expect(useGamificationStore.getState().badges.length).toBeGreaterThan(0);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
  });
  it("handleLogFullDay announces new badges with a success haptic when unlocked", async () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    useGamificationStore.setState({ badges: [], points: 0 });
    const { result } = await renderHook(() => useDashboardActions());
    await act(async () => {
      result.current.actions.handleLogFullDay();
    });
    expect(useGamificationStore.getState().badges.length).toBeGreaterThan(0);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
  });
});
