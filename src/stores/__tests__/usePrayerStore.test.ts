/** @format */
/**
 * Unit tests for logging, undoing, batching, and capping recovered prayers.
 */
import { usePrayerStore, PRAYER_KEYS } from "@stores/usePrayerStore";
import { toLocalISODate } from "@domain/date";
beforeEach(() => {
  usePrayerStore.setState(usePrayerStore.getInitialState());
});
describe("usePrayerStore", () => {
  test("logPrayer increments recovered count", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    const prayer = "fajr";
    usePrayerStore.getState().logPrayer(prayer);
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(1);
  });
  test("logPrayer caps at totalMissedDays", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    const maxDays = usePrayerStore.getState().totalMissedDays;
    for (let i = 0; i < maxDays + 5; i++) {
      usePrayerStore.getState().logPrayer("fajr");
    }
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(maxDays);
  });
  test("logPrayerBatch respects remaining cap", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayerBatch("dhuhr", 999);
    expect(usePrayerStore.getState().prayers.dhuhr.recovered).toBe(
      usePrayerStore.getState().totalMissedDays
    );
  });
  test("logFullDay increments all prayers", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logFullDay();
    PRAYER_KEYS.forEach((k) => {
      expect(usePrayerStore.getState().prayers[k].recovered).toBe(1);
    });
  });
  test("undoPrayer decrements (min 0)", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    usePrayerStore.getState().undoPrayer("fajr");
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(0);
    usePrayerStore.getState().undoPrayer("fajr");
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(0);
  });
  test("wizard stores age/pubertyAge/periods and computes totalMissedDays", () => {
    usePrayerStore.getState().completeWizard(30, 14, [
      { type: "missed", years: 10 },
      { type: "regular", years: 2 },
      { type: "missed", years: 3 },
    ]);
    const state = usePrayerStore.getState();
    expect(state.age).toBe(30);
    expect(state.pubertyAge).toBe(14);
    expect(state.periods).toHaveLength(3);
    expect(state.totalMissedDays).toBe(13 * 365);
  });
  test("logPrayerBatch with non-positive count returns 0", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    expect(usePrayerStore.getState().logPrayerBatch("fajr", 0)).toBe(0);
  });
  test("logPrayerBatch when nothing left returns 0", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    const max = usePrayerStore.getState().totalMissedDays;
    usePrayerStore.getState().logPrayerBatch("fajr", max);
    expect(usePrayerStore.getState().logPrayerBatch("fajr", 5)).toBe(0);
  });
  test("logFullDay skips prayers already at totalMissedDays", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    const max = usePrayerStore.getState().totalMissedDays;
    usePrayerStore.getState().logPrayerBatch("fajr", max);
    usePrayerStore.getState().logFullDay();
    const prayers = usePrayerStore.getState().prayers;
    expect(prayers.fajr.recovered).toBe(max);
    expect(prayers.dhuhr.recovered).toBe(1);
  });
  test("logFullDay does not mark completed prayers as logged today", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    const max = usePrayerStore.getState().totalMissedDays;
    usePrayerStore.setState({
      prayers: {
        fajr: { recovered: max },
        dhuhr: { recovered: 0 },
        asr: { recovered: 0 },
        maghrib: { recovered: 0 },
        isha: { recovered: 0 },
      },
      todayPrayers: {},
    });
    usePrayerStore.getState().logFullDay();
    const s = usePrayerStore.getState();
    expect(s.prayers.fajr.recovered).toBe(max);
    expect(s.todayPrayers.fajr).toBeUndefined();
    expect(s.todayLogPoints.fajr).toBeUndefined();
    expect(s.todayPrayers.dhuhr).toBe(true);
    expect(s.prayers.dhuhr.recovered).toBe(1);
  });
  test("logFullDay keeps flags and points of prayers logged earlier today", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    usePrayerStore.getState().logFullDay();
    const s = usePrayerStore.getState();
    expect(s.todayPrayers.fajr).toBe(true);
    expect(s.todayLogPoints.fajr).toBe(10);
    expect(s.prayers.fajr.recovered).toBe(1);
    PRAYER_KEYS.forEach((k) => {
      expect(s.todayPrayers[k]).toBe(true);
      if (k !== "fajr") expect(s.todayLogPoints[k]).toBe(20);
    });
  });
  test("getBackupData returns snapshot of prayer state", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    const s = usePrayerStore.getState();
    const b = s.getBackupData();
    expect(b).toEqual({
      age: s.age,
      pubertyAge: s.pubertyAge,
      periods: s.periods,
      totalMissedDays: s.totalMissedDays,
      prayers: s.prayers,
      todayPrayers: s.todayPrayers,
      todayLogPoints: s.todayLogPoints,
      todayUnits: s.todayUnits,
      todayDate: s.todayDate,
    });
  });
  test("logPrayerBatch called twice successfully covers todayReset branch", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayerBatch("fajr", 5);
    usePrayerStore.getState().logPrayerBatch("fajr", 5);
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(10);
  });
  test("logPrayer records 10 points for today", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    expect(usePrayerStore.getState().todayLogPoints.fajr).toBe(10);
  });
  test("logPrayerBatch records 10 points per added prayer", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayerBatch("fajr", 3);
    expect(usePrayerStore.getState().todayLogPoints.fajr).toBe(30);
  });
  test("logFullDay records 20 points per newly logged prayer", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logFullDay();
    PRAYER_KEYS.forEach((k) => {
      expect(usePrayerStore.getState().todayLogPoints[k]).toBe(20);
    });
  });
  test("undoPrayer refunds today's points and reverts the log", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(10);
    const s = usePrayerStore.getState();
    expect(s.prayers.fajr.recovered).toBe(0);
    expect(s.todayPrayers.fajr).toBeUndefined();
    expect(s.todayLogPoints.fajr).toBeUndefined();
  });
  test("undoPrayer ignores prayers not logged today (no history rewrite)", () => {
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
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(0);
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(3);
  });
  test("undoPrayer refunds the full-day bonus of 20 per prayer", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logFullDay();
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(20);
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(0);
    expect(usePrayerStore.getState().prayers.dhuhr.recovered).toBe(1);
  });
  test("undoPrayer refunds nothing when no points were earned for the flag", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.setState({ todayPrayers: { fajr: true } });
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(0);
    expect(usePrayerStore.getState().todayPrayers.fajr).toBeUndefined();
  });
  test("todayLogPoints resets on day rollover", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    expect(usePrayerStore.getState().todayLogPoints.fajr).toBe(10);
    usePrayerStore.setState({ todayDate: "2000-01-01" });
    usePrayerStore.getState().logPrayer("dhuhr");
    const s = usePrayerStore.getState();
    expect(s.todayLogPoints.fajr).toBeUndefined();
    expect(s.todayLogPoints.dhuhr).toBe(10);
  });
  test("undoPrayer after a batch log refunds one unit and keeps the flag", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayerBatch("fajr", 3);
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(10);
    const s = usePrayerStore.getState();
    expect(s.prayers.fajr.recovered).toBe(2);
    expect(s.todayLogPoints.fajr).toBe(20);
    expect(s.todayUnits.fajr).toEqual([10, 10]);
    expect(s.todayPrayers.fajr).toBe(true);
  });
  test("repeated undos unwind a batch one unit at a time until clean", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayerBatch("fajr", 2);
    expect(usePrayerStore.getState().undoPrayer("fajr")).toBe(10);
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(1);
    expect(usePrayerStore.getState().todayPrayers.fajr).toBe(true);
    expect(usePrayerStore.getState().undoPrayer("fajr")).toBe(10);
    const s = usePrayerStore.getState();
    expect(s.prayers.fajr.recovered).toBe(0);
    expect(s.todayPrayers.fajr).toBeUndefined();
    expect(s.todayLogPoints.fajr).toBeUndefined();
    expect(s.todayUnits.fajr).toBeUndefined();
    expect(usePrayerStore.getState().undoPrayer("fajr")).toBe(0);
  });
  test("mixed single and full-day logs undo in LIFO order with exact refunds", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    usePrayerStore.setState({ todayPrayers: {} });
    usePrayerStore.getState().logFullDay();
    expect(usePrayerStore.getState().undoPrayer("fajr")).toBe(20);
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(1);
    expect(usePrayerStore.getState().todayUnits.fajr).toEqual([10]);
    expect(usePrayerStore.getState().undoPrayer("fajr")).toBe(10);
    expect(usePrayerStore.getState().todayLogPoints.fajr).toBeUndefined();
  });
  test("day rollover clears todayUnits too", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayerBatch("fajr", 2);
    usePrayerStore.setState({ todayDate: "2000-01-01" });
    usePrayerStore.getState().logPrayer("dhuhr");
    const s = usePrayerStore.getState();
    expect(s.todayUnits.fajr).toBeUndefined();
    expect(s.todayUnits.dhuhr).toEqual([10]);
  });
  test("undoPrayer on legacy state without stacks reverts the whole day entry", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.setState({
      prayers: { ...usePrayerStore.getState().prayers, fajr: { recovered: 3 } },
      todayPrayers: { fajr: true },
      todayLogPoints: { fajr: 30 },
      todayUnits: {},
      todayDate: toLocalISODate(new Date()),
    });
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(30);
    const s = usePrayerStore.getState();
    expect(s.prayers.fajr.recovered).toBe(2);
    expect(s.todayPrayers.fajr).toBeUndefined();
    expect(s.todayLogPoints.fajr).toBeUndefined();
  });
});
describe("usePrayerStore.resetAll", () => {
  test("resetAll restores every persisted field to initial state", () => {
    usePrayerStore.getState().completeWizard(30, 14, [
      { type: "missed", years: 10 },
      { type: "regular", years: 2 },
    ]);
    usePrayerStore.getState().logPrayerBatch("fajr", 3);
    usePrayerStore.getState().logFullDay();
    usePrayerStore.getState().resetAll();
    const s = usePrayerStore.getState();
    expect(s.prayers).toEqual(Object.fromEntries(PRAYER_KEYS.map((k) => [k, { recovered: 0 }])));
    expect(s.todayPrayers).toEqual({});
    expect(s.todayLogPoints).toEqual({});
    expect(s.todayUnits).toEqual({});
    expect(s.todayDate).toBeNull();
    expect(s.totalMissedDays).toBe(0);
    expect(s.age).toBe(0);
    expect(s.pubertyAge).toBe(0);
    expect(s.periods).toEqual([]);
  });
  test("logging and undoing still behave after resetAll", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    usePrayerStore.getState().resetAll();
    expect(usePrayerStore.getState().prayers.fajr.recovered).toBe(0);
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(10);
    const s = usePrayerStore.getState();
    expect(s.prayers.fajr.recovered).toBe(0);
    expect(s.todayPrayers.fajr).toBeUndefined();
    expect(s.todayLogPoints.fajr).toBeUndefined();
  });
  test("lazy day-rollover reset still works after resetAll", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().resetAll();
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    expect(usePrayerStore.getState().todayDate).toBe(toLocalISODate(new Date()));
    usePrayerStore.setState({ todayDate: "2000-01-01" });
    usePrayerStore.getState().logPrayer("dhuhr");
    const s = usePrayerStore.getState();
    expect(s.todayLogPoints.fajr).toBeUndefined();
    expect(s.todayUnits.fajr).toBeUndefined();
    expect(s.todayLogPoints.dhuhr).toBe(10);
    expect(s.todayUnits.dhuhr).toEqual([10]);
  });
});
describe("usePrayerStore legacy backup-restore undo", () => {
  test("legacy undo reverts the whole day entry and refunds the stored points", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.setState({
      prayers: {
        fajr: { recovered: 4 },
        dhuhr: { recovered: 2 },
        asr: { recovered: 0 },
        maghrib: { recovered: 0 },
        isha: { recovered: 0 },
      },
      todayPrayers: { fajr: true, dhuhr: true },
      todayLogPoints: { fajr: 30, dhuhr: 20 },
      todayUnits: {},
      todayDate: toLocalISODate(new Date()),
    });
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(30);
    const s = usePrayerStore.getState();
    expect(s.prayers.fajr.recovered).toBe(3);
    expect(s.prayers.dhuhr.recovered).toBe(2);
    expect(s.todayPrayers.fajr).toBeUndefined();
    expect(s.todayPrayers.dhuhr).toBe(true);
    expect(s.todayLogPoints.fajr).toBeUndefined();
    expect(s.todayLogPoints.dhuhr).toBe(20);
    expect(s.todayUnits).toEqual({});
  });
  test("legacy undo refunds zero points yet still decrements and clears the flag", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.setState({
      prayers: {
        fajr: { recovered: 1 },
        dhuhr: { recovered: 0 },
        asr: { recovered: 0 },
        maghrib: { recovered: 0 },
        isha: { recovered: 0 },
      },
      todayPrayers: { fajr: true },
      todayLogPoints: {},
      todayUnits: {},
      todayDate: toLocalISODate(new Date()),
    });
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(0);
    const s = usePrayerStore.getState();
    expect(s.prayers.fajr.recovered).toBe(0);
    expect(s.todayPrayers.fajr).toBeUndefined();
    expect(s.todayLogPoints).toEqual({});
    expect(s.todayUnits).toEqual({});
  });
  test("legacy undo bails out untouched when the restored count is already zero", () => {
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.setState({
      prayers: {
        fajr: { recovered: 0 },
        dhuhr: { recovered: 0 },
        asr: { recovered: 0 },
        maghrib: { recovered: 0 },
        isha: { recovered: 0 },
      },
      todayPrayers: { fajr: true },
      todayLogPoints: { fajr: 30 },
      todayUnits: {},
      todayDate: toLocalISODate(new Date()),
    });
    const refund = usePrayerStore.getState().undoPrayer("fajr");
    expect(refund).toBe(0);
    const s = usePrayerStore.getState();
    expect(s.prayers.fajr.recovered).toBe(0);
    expect(s.todayPrayers.fajr).toBe(true);
    expect(s.todayLogPoints.fajr).toBe(30);
  });
});
