/** @format */
/**
 * Builds last-35-days logged/unlogged calendar cells and selects rotating daily hadith text.
 */
import { useMemo } from "react";
import { useUI } from "@hooks/useUI";
import { useGamificationStore } from "@stores/useGamificationStore";
import { toLocalISODate, addDays, dayOfYear } from "@domain/date";
export function useDashboardCalendar() {
  const { t } = useUI();
  const loggedDates = useGamificationStore((s) => s.loggedDates);
  const today = toLocalISODate(new Date());
  const weeklyGridData = useMemo(() => {
    const cells: {
      date: string;
      logged: boolean;
      isToday: boolean;
    }[] = [];
    const now = new Date();
    const loggedSet = new Set(loggedDates);
    for (let i = 34; i >= 0; i--) {
      const dateStr = toLocalISODate(addDays(now, -i));
      cells.push({
        date: dateStr,
        logged: loggedSet.has(dateStr),
        isToday: dateStr === today,
      });
    }
    return cells;
  }, [loggedDates, today]);
  const hadithData = useMemo(() => {
    const raw: unknown = t("hadiths", { returnObjects: true });
    if (!Array.isArray(raw)) return { text: "" };
    const hadiths = raw.filter((item): item is string => typeof item === "string");
    const idx = dayOfYear(new Date()) % hadiths.length;
    return { text: hadiths[idx] ?? "" };
  }, [t, today]);
  return { weeklyGridData, hadithData };
}
