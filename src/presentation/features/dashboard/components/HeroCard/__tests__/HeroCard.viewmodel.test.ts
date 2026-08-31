/** @format */
/**
 * Unit tests for hero card state math: journey percent computation, divide-by-zero guard and capping.
 */
import { computeHeroCardState } from "../HeroCard.viewmodel";
import { PRAYER_KEYS, type PrayerKey } from "@domain/types";
const emptyPrayers = (): Record<
  PrayerKey,
  {
    recovered: number;
  }
> =>
  Object.fromEntries(PRAYER_KEYS.map((k) => [k, { recovered: 0 }])) as Record<
    PrayerKey,
    {
      recovered: number;
    }
  >;
describe("computeHeroCardState", () => {
  it("computes journeyPct from recovered totals", () => {
    const prayers = emptyPrayers();
    prayers.fajr = { recovered: 250 };
    const state = computeHeroCardState({
      loggedCount: 2,
      dailyTarget: 5,
      prayers,
      totalMissedDays: 100,
    });
    expect(state.journeyPct).toBe(50);
  });
  it("guards divide-by-zero when totalMissedDays is 0", () => {
    const state = computeHeroCardState({
      loggedCount: 0,
      dailyTarget: 5,
      prayers: emptyPrayers(),
      totalMissedDays: 0,
    });
    expect(state.journeyPct).toBe(0);
  });
  it("caps journeyPct at 100", () => {
    const prayers = emptyPrayers();
    prayers.fajr = { recovered: 100 };
    prayers.dhuhr = { recovered: 100 };
    const state = computeHeroCardState({
      loggedCount: 1,
      dailyTarget: 5,
      prayers,
      totalMissedDays: 10,
    });
    expect(state.journeyPct).toBe(100);
  });
  it("keeps small recovery progress visible instead of rounding to 0", () => {
    const prayers = emptyPrayers();
    PRAYER_KEYS.forEach((k) => {
      prayers[k] = { recovered: 1 };
    });
    const state = computeHeroCardState({
      loggedCount: 5,
      dailyTarget: 5,
      prayers,
      totalMissedDays: 1825,
    });
    expect(state.journeyPct).toBe(0.1);
  });
  it("rounds to one decimal place", () => {
    const prayers = emptyPrayers();
    PRAYER_KEYS.forEach((k) => {
      prayers[k] = { recovered: 2 };
    });
    const state = computeHeroCardState({
      loggedCount: 5,
      dailyTarget: 5,
      prayers,
      totalMissedDays: 1095,
    });
    expect(state.journeyPct).toBe(0.2);
  });
  it("derives nudge count and behind state", () => {
    const state = computeHeroCardState({
      loggedCount: 2,
      dailyTarget: 5,
      prayers: emptyPrayers(),
      totalMissedDays: 100,
    });
    expect(state.isBehind).toBe(true);
    expect(state.behind).toBe(3);
    expect(state.isDone).toBe(false);
  });
  it("marks done when loggedCount reaches dailyTarget", () => {
    const state = computeHeroCardState({
      loggedCount: 5,
      dailyTarget: 5,
      prayers: emptyPrayers(),
      totalMissedDays: 100,
    });
    expect(state.isDone).toBe(true);
    expect(state.isBehind).toBe(false);
  });
  it("caps visual segments at 5", () => {
    const state = computeHeroCardState({
      loggedCount: 0,
      dailyTarget: 8,
      prayers: emptyPrayers(),
      totalMissedDays: 100,
    });
    expect(state.segments).toBe(5);
  });
});
