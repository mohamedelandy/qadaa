/** @format */
/**
 * Derives dashboard streak data: current streak, at-risk flag, and grace-day used this month.
 */
import { useMemo } from "react";
import { useGamificationStore } from "@stores/useGamificationStore";
import { toLocalISODate, addDays } from "@domain/date";
export function useDashboardStreak() {
  const streak = useGamificationStore((s) => s.streak);
  const lastLogDate = useGamificationStore((s) => s.lastLogDate);
  const graceUsedMonth = useGamificationStore((s) => s.graceUsedMonth);
  const now = new Date();
  const today = toLocalISODate(now);
  const yesterday = toLocalISODate(addDays(now, -1));
  const streakData = useMemo(
    () => ({
      streak,
      isAtRisk: streak > 0 && lastLogDate === yesterday,
      graceUsed: graceUsedMonth === today.slice(0, 7),
    }),
    [streak, lastLogDate, graceUsedMonth, yesterday, today]
  );
  return { streakData };
}
