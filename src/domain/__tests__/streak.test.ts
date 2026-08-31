/** @format */
/**
 * Unit tests for streak computation, grace-day rules, and date pruning.
 */
import { computeStreakState, pruneLoggedDates } from "../streak";
const TODAY = "2026-01-10";
const YESTERDAY = "2026-01-09";
const TWO_DAYS_AGO = "2026-01-08";
const THREE_DAYS_AGO = "2026-01-07";
const MONTH = "2026-01";
describe("computeStreakState", () => {
  it("no change on same day", () => {
    const r = computeStreakState({
      currentStreak: 5,
      graceUsedMonth: null,
      loggedDates: [TODAY],
      lastLogDate: TODAY,
      today: TODAY,
      yesterday: YESTERDAY,
      twoDaysAgo: TWO_DAYS_AGO,
      currentMonth: MONTH,
    });
    expect(r.streak).toBe(5);
    expect(r.graceUsedMonth).toBeNull();
    expect(r.lastLogDate).toBe(TODAY);
  });
  it("increments on consecutive days", () => {
    const r = computeStreakState({
      currentStreak: 4,
      graceUsedMonth: null,
      loggedDates: [YESTERDAY],
      lastLogDate: YESTERDAY,
      today: TODAY,
      yesterday: YESTERDAY,
      twoDaysAgo: TWO_DAYS_AGO,
      currentMonth: MONTH,
    });
    expect(r.streak).toBe(5);
    expect(r.graceUsedMonth).toBeNull();
  });
  it("uses grace day (+1, marks month) when two days ago and grace unused", () => {
    const r = computeStreakState({
      currentStreak: 3,
      graceUsedMonth: null,
      loggedDates: [TWO_DAYS_AGO],
      lastLogDate: TWO_DAYS_AGO,
      today: TODAY,
      yesterday: YESTERDAY,
      twoDaysAgo: TWO_DAYS_AGO,
      currentMonth: MONTH,
    });
    expect(r.streak).toBe(4);
    expect(r.graceUsedMonth).toBe(MONTH);
  });
  it("does not reuse grace day in the same month", () => {
    const r = computeStreakState({
      currentStreak: 3,
      graceUsedMonth: MONTH,
      loggedDates: [TWO_DAYS_AGO],
      lastLogDate: TWO_DAYS_AGO,
      today: TODAY,
      yesterday: YESTERDAY,
      twoDaysAgo: TWO_DAYS_AGO,
      currentMonth: MONTH,
    });
    expect(r.streak).toBe(1);
    expect(r.graceUsedMonth).toBe(MONTH);
  });
  it("resets to 1 on gap > 2 days", () => {
    const r = computeStreakState({
      currentStreak: 10,
      graceUsedMonth: MONTH,
      loggedDates: [THREE_DAYS_AGO],
      lastLogDate: THREE_DAYS_AGO,
      today: TODAY,
      yesterday: YESTERDAY,
      twoDaysAgo: TWO_DAYS_AGO,
      currentMonth: MONTH,
    });
    expect(r.streak).toBe(1);
    expect(r.graceUsedMonth).toBe(MONTH);
  });
  it("first log resets to 1", () => {
    const r = computeStreakState({
      currentStreak: 0,
      graceUsedMonth: null,
      loggedDates: [],
      lastLogDate: null,
      today: TODAY,
      yesterday: YESTERDAY,
      twoDaysAgo: TWO_DAYS_AGO,
      currentMonth: MONTH,
    });
    expect(r.streak).toBe(1);
    expect(r.graceUsedMonth).toBeNull();
  });
  it("does not duplicate today in loggedDates", () => {
    const loggedDates = [YESTERDAY, TODAY];
    const r = computeStreakState({
      currentStreak: 2,
      graceUsedMonth: null,
      loggedDates,
      lastLogDate: TODAY,
      today: TODAY,
      yesterday: YESTERDAY,
      twoDaysAgo: TWO_DAYS_AGO,
      currentMonth: MONTH,
    });
    expect(r.loggedDates).toEqual([YESTERDAY, TODAY]);
  });
  it("creates loggedDates from empty", () => {
    const r = computeStreakState({
      currentStreak: 1,
      graceUsedMonth: null,
      loggedDates: [],
      lastLogDate: null,
      today: TODAY,
      yesterday: YESTERDAY,
      twoDaysAgo: TWO_DAYS_AGO,
      currentMonth: MONTH,
    });
    expect(r.loggedDates).toEqual([TODAY]);
  });
  it("keeps streak when lastLogDate is in the future (clock moved backwards)", () => {
    const TOMORROW = "2026-01-11";
    const r = computeStreakState({
      currentStreak: 7,
      graceUsedMonth: null,
      loggedDates: [TOMORROW],
      lastLogDate: TOMORROW,
      today: TODAY,
      yesterday: YESTERDAY,
      twoDaysAgo: TWO_DAYS_AGO,
      currentMonth: MONTH,
    });
    expect(r.streak).toBe(7);
    expect(r.graceUsedMonth).toBeNull();
    expect(r.lastLogDate).toBe(TODAY);
    expect(r.loggedDates).toContain(TODAY);
  });
});
describe("pruneLoggedDates", () => {
  it("keeps dates within the retention window and drops older ones", () => {
    const old = "2025-01-01";
    const edge = "2025-11-12";
    const recent = "2026-01-09";
    const pruned = pruneLoggedDates([old, edge, recent, TODAY], TODAY);
    expect(pruned).toContain(TODAY);
    expect(pruned).toContain(recent);
    expect(pruned).not.toContain(old);
  });
  it("returns dates unchanged when all are recent", () => {
    const pruned = pruneLoggedDates([YESTERDAY, TODAY], TODAY);
    expect(pruned).toEqual([YESTERDAY, TODAY]);
  });
  it("sorts the result chronologically", () => {
    const pruned = pruneLoggedDates([TODAY, YESTERDAY], TODAY);
    expect(pruned).toEqual([YESTERDAY, TODAY]);
  });
  it("handles an empty list", () => {
    expect(pruneLoggedDates([], TODAY)).toEqual([]);
  });
});
