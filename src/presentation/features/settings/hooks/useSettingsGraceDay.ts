/** @format */
/**
 * Computes monthly grace-day used flag and localized remaining status from gamification store.
 */
import { useGamificationStore } from "@stores/useGamificationStore";
import { useUI } from "@hooks/useUI";
import { toLocalISODate } from "@domain/date";
export function useSettingsGraceDay() {
  const graceUsedMonth = useGamificationStore((s) => s.graceUsedMonth);
  const { t } = useUI();
  const today = toLocalISODate(new Date());
  const currentMonth = today.slice(0, 7);
  const graceUsed = graceUsedMonth === currentMonth;
  const graceStatus = graceUsed
    ? t("settings.graceDayRemaining_zero")
    : t("settings.graceDayRemaining_one", { count: 1 });
  return { graceUsed, graceStatus };
}
