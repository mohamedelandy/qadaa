/** @format */
/**
 * Unit tests for badge unlock rules (progress, streak thresholds, first-log).
 */
import { bestProgressValue, checkBadges, BADGE_DEFINITIONS } from "../badges";
const ALL_ZERO = () => ({
  fajr: { recovered: 0 },
  dhuhr: { recovered: 0 },
  asr: { recovered: 0 },
  maghrib: { recovered: 0 },
  isha: { recovered: 0 },
});
const ALL = (recovered: number) => ({
  fajr: { recovered },
  dhuhr: { recovered },
  asr: { recovered },
  maghrib: { recovered },
  isha: { recovered },
});
describe("bestProgressValue", () => {
  it("returns 0 when totalMissedDays is 0", () => {
    expect(bestProgressValue(ALL_ZERO(), 0)).toBe(0);
  });
  it("returns max recovery across prayers", () => {
    const prayers = {
      fajr: { recovered: 60 },
      dhuhr: { recovered: 30 },
      asr: { recovered: 100 },
      maghrib: { recovered: 10 },
      isha: { recovered: 90 },
    };
    expect(bestProgressValue(prayers, 100)).toBe(100);
  });
});
describe("checkBadges", () => {
  it("unlocks first_log when points > 0", () => {
    const badges = checkBadges({
      points: 10,
      streak: 0,
      prayers: ALL_ZERO(),
      totalMissedDays: 100,
      existingIds: new Set(),
      now: 42,
    });
    expect(badges.map((b) => b.id)).toContain("first_log");
  });
  it("unlocks streak badges at thresholds", () => {
    expect(
      checkBadges({
        points: 0,
        streak: 7,
        prayers: ALL(0),
        totalMissedDays: 100,
        existingIds: new Set(),
        now: 1,
      }).map((b) => b.id)
    ).toContain("first_week");
    expect(
      checkBadges({
        points: 0,
        streak: 30,
        prayers: ALL(0),
        totalMissedDays: 100,
        existingIds: new Set(),
        now: 1,
      }).map((b) => b.id)
    ).toContain("warrior_30");
    expect(
      checkBadges({
        points: 0,
        streak: 365,
        prayers: ALL(0),
        totalMissedDays: 100,
        existingIds: new Set(),
        now: 1,
      }).map((b) => b.id)
    ).toContain("golden_year");
  });
  it("unlocks at progress boundaries 25/50/75/100", () => {
    expect(
      checkBadges({
        points: 0,
        streak: 0,
        prayers: ALL(25),
        totalMissedDays: 100,
        existingIds: new Set(),
        now: 1,
      }).map((b) => b.id)
    ).toContain("quarter_way");
    expect(
      checkBadges({
        points: 0,
        streak: 0,
        prayers: ALL(50),
        totalMissedDays: 100,
        existingIds: new Set(),
        now: 1,
      }).map((b) => b.id)
    ).toContain("halfway");
    expect(
      checkBadges({
        points: 0,
        streak: 0,
        prayers: ALL(75),
        totalMissedDays: 100,
        existingIds: new Set(),
        now: 1,
      }).map((b) => b.id)
    ).toContain("almost_there");
    expect(
      checkBadges({
        points: 0,
        streak: 0,
        prayers: ALL(100),
        totalMissedDays: 100,
        existingIds: new Set(),
        now: 1,
      }).map((b) => b.id)
    ).toContain("complete");
  });
  it("does not unlock below thresholds", () => {
    const ids = checkBadges({
      points: 0,
      streak: 6,
      prayers: ALL(24),
      totalMissedDays: 100,
      existingIds: new Set(),
      now: 1,
    }).map((b) => b.id);
    expect(ids).toEqual([]);
  });
  it("skips already-unlocked badges", () => {
    const ids = checkBadges({
      points: 10,
      streak: 365,
      prayers: ALL(100),
      totalMissedDays: 100,
      existingIds: new Set([
        "first_log",
        "first_week",
        "warrior_30",
        "quarter_way",
        "halfway",
        "almost_there",
        "complete",
      ]),
      now: 1,
    }).map((b) => b.id);
    expect(ids).not.toContain("first_log");
    expect(ids).toEqual(["golden_year"]);
  });
  it("assigns unlockedAt from now", () => {
    const badges = checkBadges({
      points: 1,
      streak: 0,
      prayers: ALL(0),
      totalMissedDays: 100,
      existingIds: new Set(),
      now: 12345,
    });
    expect(badges.find((b) => b.id === "first_log")?.unlockedAt).toBe(12345);
  });
});
describe("BADGE_DEFINITIONS", () => {
  it("has exactly the 8 documented badges", () => {
    expect(BADGE_DEFINITIONS.map((d) => d.id)).toEqual([
      "first_log",
      "first_week",
      "warrior_30",
      "golden_year",
      "quarter_way",
      "halfway",
      "almost_there",
      "complete",
    ]);
  });
});
