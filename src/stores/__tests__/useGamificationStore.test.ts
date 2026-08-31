/** @format */
/**
 * Unit tests for streak updates, badge unlocks, and point accounting.
 */
import { useGamificationStore } from "@stores/useGamificationStore";
import { toLocalISODate, addDays } from "@domain/date";
beforeEach(() => {
  useGamificationStore.setState(useGamificationStore.getInitialState());
  jest.clearAllMocks();
});
describe("useGamificationStore", () => {
  test("updateStreak prunes loggedDates beyond the retention window", () => {
    const today = toLocalISODate(new Date());
    const ancient = toLocalISODate(addDays(new Date(), -400));
    useGamificationStore.setState({
      streak: 1,
      lastLogDate: today,
      loggedDates: [ancient, today],
    });
    useGamificationStore.getState().updateStreak();
    const dates = useGamificationStore.getState().loggedDates;
    expect(dates).toContain(today);
    expect(dates).not.toContain(ancient);
  });
  test("resetLastLogDate clears streak so a full undo shows no stale streak", () => {
    const today = toLocalISODate(new Date());
    useGamificationStore.setState({
      streak: 12,
      lastLogDate: today,
      loggedDates: [today],
    });
    useGamificationStore.getState().resetLastLogDate();
    const s = useGamificationStore.getState();
    expect(s.streak).toBe(0);
    expect(s.lastLogDate).toBeNull();
    expect(s.loggedDates).toEqual([]);
  });
  test("updateStreak on same day (no change)", () => {
    const today = toLocalISODate(new Date());
    useGamificationStore.setState({ streak: 5, lastLogDate: today, loggedDates: [today] });
    useGamificationStore.getState().updateStreak();
    expect(useGamificationStore.getState().streak).toBe(5);
  });
  test("updateStreak on consecutive days (+1)", () => {
    const yesterday = toLocalISODate(new Date(Date.now() - 86400000));
    useGamificationStore.setState({ streak: 4, lastLogDate: yesterday, loggedDates: [yesterday] });
    useGamificationStore.getState().updateStreak();
    expect(useGamificationStore.getState().streak).toBe(5);
  });
  test("updateStreak with grace day (+1, marks month)", () => {
    const twoDaysAgo = toLocalISODate(new Date(Date.now() - 2 * 86400000));
    useGamificationStore.setState({
      streak: 3,
      lastLogDate: twoDaysAgo,
      loggedDates: [twoDaysAgo],
      graceUsedMonth: null,
    });
    useGamificationStore.getState().updateStreak();
    expect(useGamificationStore.getState().streak).toBe(4);
    const currentMonth = toLocalISODate(new Date()).slice(0, 7);
    expect(useGamificationStore.getState().graceUsedMonth).toBe(currentMonth);
  });
  test("updateStreak with gap > 2 (reset to 1)", () => {
    const threeDaysAgo = toLocalISODate(new Date(Date.now() - 3 * 86400000));
    useGamificationStore.setState({
      streak: 10,
      lastLogDate: threeDaysAgo,
      loggedDates: [threeDaysAgo],
    });
    useGamificationStore.getState().updateStreak();
    expect(useGamificationStore.getState().streak).toBe(1);
  });
  test("updateStreak on first log (reset to 1)", () => {
    useGamificationStore.setState({ streak: 0, lastLogDate: null, loggedDates: [] });
    useGamificationStore.getState().updateStreak();
    expect(useGamificationStore.getState().streak).toBe(1);
  });
  test("checkBadges returns correct badges for given state", () => {
    const prayers = {
      fajr: { recovered: 100 },
      dhuhr: { recovered: 100 },
      asr: { recovered: 100 },
      maghrib: { recovered: 100 },
      isha: { recovered: 100 },
    };
    useGamificationStore.setState({ points: 10, streak: 7 });
    const badges = useGamificationStore.getState().checkBadges(prayers, 100);
    expect(badges.some((b) => b.id === "first_log")).toBe(true);
  });
  test("checkBadges dedups against existing badges (covers existingIds map)", () => {
    useGamificationStore.setState({
      points: 10,
      streak: 7,
      badges: [{ id: "first_log", unlockedAt: 1 }],
    });
    const prayers = {
      fajr: { recovered: 100 },
      dhuhr: { recovered: 100 },
      asr: { recovered: 100 },
      maghrib: { recovered: 100 },
      isha: { recovered: 100 },
    };
    const badges = useGamificationStore.getState().checkBadges(prayers, 100);
    expect(badges.some((b) => b.id === "first_log")).toBe(false);
    expect(badges.some((b) => b.id === "first_week")).toBe(true);
  });
  test("checkBadges with zero progress yields no new badges (bestProgress 0 + empty path)", () => {
    useGamificationStore.setState({ points: 0, streak: 0, badges: [] });
    const prayers = {
      fajr: { recovered: 0 },
      dhuhr: { recovered: 0 },
      asr: { recovered: 0 },
      maghrib: { recovered: 0 },
      isha: { recovered: 0 },
    };
    expect(useGamificationStore.getState().checkBadges(prayers, 0)).toEqual([]);
  });
  test("incrementPoints adds to points", () => {
    useGamificationStore.getState().incrementPoints(5);
    expect(useGamificationStore.getState().points).toBe(5);
  });
  test("decrementPoints clamps at 0", () => {
    useGamificationStore.setState({ points: 2 });
    useGamificationStore.getState().decrementPoints(10);
    expect(useGamificationStore.getState().points).toBe(0);
  });
  test("setLastDuaShownDate and setIntentionSetDate", () => {
    useGamificationStore.getState().setLastDuaShownDate("2026-01-01");
    useGamificationStore.getState().setIntentionSetDate("2026-01-02");
    const s = useGamificationStore.getState();
    expect(s.lastDuaShownDate).toBe("2026-01-01");
    expect(s.intentionSetDate).toBe("2026-01-02");
  });
  test("resetAll clears gamification state", () => {
    useGamificationStore.setState({
      streak: 9,
      points: 9,
      badges: [{ id: "x", unlockedAt: 1 }],
      lastLogDate: "2026-01-01",
      daysLogged: 4,
      loggedDates: ["2026-01-01"],
      graceUsedMonth: "2026-01",
      lastDuaShownDate: "2026-01-01",
      intentionSetDate: "2026-01-01",
    });
    useGamificationStore.getState().resetAll();
    expect(useGamificationStore.getState()).toMatchObject({
      streak: 0,
      lastLogDate: null,
      daysLogged: 0,
      loggedDates: [],
      points: 0,
      badges: [],
      graceUsedMonth: null,
      lastDuaShownDate: null,
      intentionSetDate: null,
    });
  });
  test("getBackupData returns snapshot", () => {
    useGamificationStore.setState({
      streak: 9,
      points: 9,
      badges: [{ id: "x", unlockedAt: 1 }],
      lastLogDate: "2026-01-01",
      daysLogged: 4,
      loggedDates: ["2026-01-01"],
      graceUsedMonth: "2026-01",
      lastDuaShownDate: "2026-01-03",
      intentionSetDate: "2026-01-04",
    });
    const s = useGamificationStore.getState();
    const b = s.getBackupData();
    expect(b).toEqual({
      streak: 9,
      lastLogDate: "2026-01-01",
      daysLogged: 4,
      loggedDates: ["2026-01-01"],
      points: 9,
      badges: [{ id: "x", unlockedAt: 1 }],
      graceUsedMonth: "2026-01",
      lastDuaShownDate: "2026-01-03",
      intentionSetDate: "2026-01-04",
    });
    expect(b).toEqual({
      streak: s.streak,
      lastLogDate: s.lastLogDate,
      daysLogged: s.daysLogged,
      loggedDates: s.loggedDates,
      points: s.points,
      badges: s.badges,
      graceUsedMonth: s.graceUsedMonth,
      lastDuaShownDate: s.lastDuaShownDate,
      intentionSetDate: s.intentionSetDate,
    });
  });
  test("updateStreak increments daysLogged once per new day, never on repeat logs", () => {
    const today = toLocalISODate(new Date());
    useGamificationStore.setState({ streak: 0, lastLogDate: null, loggedDates: [], daysLogged: 0 });
    useGamificationStore.getState().updateStreak();
    expect(useGamificationStore.getState().daysLogged).toBe(1);
    // Same-day repeat: no increment.
    useGamificationStore.getState().updateStreak();
    expect(useGamificationStore.getState().daysLogged).toBe(1);
    expect(useGamificationStore.getState().loggedDates).toEqual([today]);
  });
  test("daysLogged survives loggedDates pruning and keeps counting new days", () => {
    const today = toLocalISODate(new Date());
    const ancient = toLocalISODate(addDays(new Date(), -400));
    useGamificationStore.setState({
      streak: 1,
      lastLogDate: ancient,
      daysLogged: 0,
      loggedDates: [ancient],
    });
    useGamificationStore.getState().updateStreak();
    // ancient falls outside the 60-day retention window and is pruned, but the
    // monotonic counter still grows for today's brand-new logged day.
    expect(useGamificationStore.getState().loggedDates).toEqual([today]);
    expect(useGamificationStore.getState().daysLogged).toBe(1);
  });
});
