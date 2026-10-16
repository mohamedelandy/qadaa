/** @format */
/**
 * Derives dashboard streak data: current streak, at-risk flag, and grace-day used this month.
 */
import { useMemo } from "react";
import { useGamificationStore } from "@stores/useGamificationStore";
import { useShallow } from "zustand/react/shallow";
import { toLocalISODate, addDays } from "@domain/date";
export function useDashboardStreak() {
  // Optimization: Batch multiple store property reads using useShallow to prevent unnecessary re-renders
  const { streak, lastLogDate, graceUsedMonth } = useGamificationStore(
    useShallow((s) => ({
      streak: s.streak,
      lastLogDate: s.lastLogDate,
      graceUsedMonth: s.graceUsedMonth,
    }))
  );
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
