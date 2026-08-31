/** @format */
/**
 * Derives whether intention sheet or completion dua overlay should show today from wizard and logging state.
 */
import { useAppStore } from "@stores/useAppStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { usePrayerStore, PRAYER_KEYS } from "@stores/usePrayerStore";
import { toLocalISODate } from "@domain/date";
export function useDashboardOverlays() {
  const wizardComplete = useAppStore((s) => s.wizardComplete);
  const intentionSetDate = useGamificationStore((s) => s.intentionSetDate);
  const lastDuaShownDate = useGamificationStore((s) => s.lastDuaShownDate);
  const todayPrayers = usePrayerStore((s) => s.todayPrayers);
  const today = toLocalISODate(new Date());
  const loggedCount = Object.keys(todayPrayers).length;
  const showIntention = wizardComplete && intentionSetDate !== today && loggedCount === 0;
  const showDua = loggedCount >= PRAYER_KEYS.length && lastDuaShownDate !== today;
  return { showIntention, showDua };
}
