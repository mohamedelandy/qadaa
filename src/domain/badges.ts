/** @format */
/**
 * Badge definitions and unlock checks from points, streak, and recovery progress.
 */
import { PRAYER_KEYS, type Badge, type PrayerKey } from "./types";
export interface BadgeCheckContext {
  points: number;
  streak: number;
  prayers: Record<
    PrayerKey,
    {
      recovered: number;
    }
  >;
  totalMissedDays: number;
}
export function bestProgressValue(
  prayers: Record<
    PrayerKey,
    {
      recovered: number;
    }
  >,
  totalMissedDays: number
): number {
  if (totalMissedDays <= 0) return 0;
  return Math.max(...PRAYER_KEYS.map((k) => (prayers[k].recovered / totalMissedDays) * 100));
}
export const BADGE_IDS = [
  "first_log",
  "first_week",
  "warrior_30",
  "golden_year",
  "quarter_way",
  "halfway",
  "almost_there",
  "complete",
] as const;
export type BadgeId = (typeof BADGE_IDS)[number];
export const BADGE_DEFINITIONS: ReadonlyArray<{
  id: BadgeId;
  check: (ctx: BadgeCheckContext) => boolean;
}> = [
  { id: "first_log", check: (ctx) => ctx.points > 0 },
  { id: "first_week", check: (ctx) => ctx.streak >= 7 },
  { id: "warrior_30", check: (ctx) => ctx.streak >= 30 },
  { id: "golden_year", check: (ctx) => ctx.streak >= 365 },
  { id: "quarter_way", check: (ctx) => bestProgressValue(ctx.prayers, ctx.totalMissedDays) >= 25 },
  { id: "halfway", check: (ctx) => bestProgressValue(ctx.prayers, ctx.totalMissedDays) >= 50 },
  { id: "almost_there", check: (ctx) => bestProgressValue(ctx.prayers, ctx.totalMissedDays) >= 75 },
  { id: "complete", check: (ctx) => bestProgressValue(ctx.prayers, ctx.totalMissedDays) >= 100 },
];
export interface CheckBadgesInput {
  points: number;
  streak: number;
  prayers: Record<
    PrayerKey,
    {
      recovered: number;
    }
  >;
  totalMissedDays: number;
  existingIds: Set<string>;
  now: number;
}
export function checkBadges(input: CheckBadgesInput): Badge[] {
  const ctx: BadgeCheckContext = {
    points: input.points,
    streak: input.streak,
    prayers: input.prayers,
    totalMissedDays: input.totalMissedDays,
  };
  return BADGE_DEFINITIONS.filter((def) => !input.existingIds.has(def.id) && def.check(ctx)).map(
    (def) => ({ id: def.id, unlockedAt: input.now })
  );
}
/**
 * Progress toward a badge (0-100), clamped to 99 while locked so the bar
 * never reads 100% before the badge actually unlocks.
 */
export function badgeProgressValue(id: BadgeId, ctx: BadgeCheckContext): number {
  const bp = bestProgressValue(ctx.prayers, ctx.totalMissedDays);
  switch (id) {
    case "first_log":
      return ctx.points > 0 ? 100 : 0;
    case "first_week":
      return Math.min((ctx.streak / 7) * 100, 99);
    case "warrior_30":
      return Math.min((ctx.streak / 30) * 100, 99);
    case "golden_year":
      return Math.min((ctx.streak / 365) * 100, 99);
    case "quarter_way":
      return Math.min((bp / 25) * 100, 99);
    case "halfway":
      return Math.min((bp / 50) * 100, 99);
    case "almost_there":
      return Math.min((bp / 75) * 100, 99);
    case "complete":
      return Math.min((bp / 100) * 100, 99);
  }
}
