/** @format */
/**
 * Derives per-prayer recovery rows (emoji, remaining, done flags) and today's progress toward daily target.
 */
import { useMemo } from "react";
import { useUI } from "@hooks/useUI";
import { usePrayerStore } from "@stores/usePrayerStore";
import { PRAYER_KEYS, type PrayerKey } from "@domain/types";
import { useSettingsStore } from "@stores/useSettingsStore";
const EMOJI_MAP: Record<PrayerKey, string> = {
  fajr: "🌙",
  dhuhr: "☀️",
  asr: "🌤️",
  maghrib: "🌅",
  isha: "🌃",
};
export function useDashboardPrayerData() {
  const { t } = useUI();
  const prayers = usePrayerStore((s) => s.prayers);
  const totalMissedDays = usePrayerStore((s) => s.totalMissedDays);
  const todayPrayers = usePrayerStore((s) => s.todayPrayers);
  const dailyTarget = useSettingsStore((s) => s.dailyTarget);
  const loggedCount = Object.keys(todayPrayers).length;
  const prayerRows = useMemo(
    () =>
      PRAYER_KEYS.map((key) => {
        const recovered = prayers[key].recovered;
        const remaining = Math.max(0, totalMissedDays - recovered);
        return {
          key,
          emoji: EMOJI_MAP[key],
          name: t(`prayers.${key}`),
          recovered,
          totalMissedDays,
          remaining,
          isDone: totalMissedDays > 0 && recovered >= totalMissedDays,
          loggedToday: !!todayPrayers[key],
        };
      }),
    [prayers, todayPrayers, totalMissedDays, t]
  );
  const allPrayersDone = useMemo(
    () => totalMissedDays > 0 && prayerRows.every((row) => row.isDone),
    [totalMissedDays, prayerRows]
  );
  const todayData = useMemo(
    () => ({
      loggedCount,
      dailyTarget,
      progress: dailyTarget > 0 ? (loggedCount / dailyTarget) * 100 : 0,
    }),
    [loggedCount, dailyTarget]
  );
  return { prayerRows, allPrayersDone, todayData };
}
