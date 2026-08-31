/** @format */
/**
 * Pure math for missed-day totals and capped prayer recovery increments.
 */
import type { PrayerPeriod } from "./types";
export function calcTotalMissedDays(periods: PrayerPeriod[]): number {
  return periods
    .filter((p) => p.type === "missed")
    .reduce((sum, p) => sum + Math.round(p.years * 365), 0);
}
export function incrementPrayer(
  currentRecovered: number,
  totalMissedDays: number,
  delta: number
): {
  recovered: number;
  added: number;
} {
  const remaining = totalMissedDays - currentRecovered;
  const actual = Math.min(delta, remaining);
  if (actual <= 0) return { recovered: currentRecovered, added: 0 };
  return { recovered: currentRecovered + actual, added: actual };
}
