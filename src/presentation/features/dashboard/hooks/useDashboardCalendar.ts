/** @format */
/**
 * Builds last-35-days logged/unlogged calendar cells and selects rotating daily hadith text.
 */
import { useMemo } from "react";
import { useUI } from "@hooks/useUI";
import { useGamificationStore } from "@stores/useGamificationStore";
import { toLocalISODate, dayOfYear } from "@domain/date";
export function useDashboardCalendar() {
  const { t } = useUI();
  const loggedDates = useGamificationStore((s) => s.loggedDates);
  const today = toLocalISODate(new Date());
  const weeklyGridData = useMemo(() => {
    const cells = new Array<{
      date: string;
      logged: boolean;
      isToday: boolean;
    }>(35);
    const cursor = new Date();
    cursor.setDate(cursor.getDate() - 34);
    const loggedSet = new Set(loggedDates);
    for (let i = 0; i < 35; i++) {
      const dateStr = toLocalISODate(cursor);
      cells[i] = {
        date: dateStr,
        logged: loggedSet.has(dateStr),
        isToday: dateStr === today,
      };
      cursor.setDate(cursor.getDate() + 1);
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
