/** @format */
/**
 * Action handlers wiring prayer log/undo/batch to points, streak updates, badge checks, and haptics.
 */
import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { usePrayerStore } from "@stores/usePrayerStore";
import { PRAYER_KEYS } from "@domain/types";
import type { PrayerKey } from "@domain/types";
import { useGamificationStore } from "@stores/useGamificationStore";
import { useAppStore } from "@stores/useAppStore";
import { toLocalISODate } from "@domain/date";
export function useDashboardActions() {
  const handleLogPrayer = useCallback((prayer: PrayerKey) => {
    const gStore = useGamificationStore.getState();
    const points = usePrayerStore.getState().logPrayer(prayer);
    if (points <= 0) return;
    gStore.updateStreak();
    gStore.incrementPoints(points);
    if (!useAppStore.getState().dashboardTourComplete) {
      useAppStore.getState().completeDashboardTour();
    }
    const { prayers: latestPrayers, totalMissedDays: latestTotal } = usePrayerStore.getState();
    const newBadges = gStore.checkBadges(latestPrayers, latestTotal);
    if (newBadges.length > 0) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);
  const handleLogFullDay = useCallback(() => {
    const gStore = useGamificationStore.getState();
    const points = usePrayerStore.getState().logFullDay();
    if (points <= 0) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    gStore.updateStreak();
    gStore.incrementPoints(points);
    const { prayers: latestPrayers, totalMissedDays: latestTotal } = usePrayerStore.getState();
    const newBadges = gStore.checkBadges(latestPrayers, latestTotal);
    if (newBadges.length > 0) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);
  const handleUndo = useCallback((prayer: PrayerKey) => {
    const refund = usePrayerStore.getState().undoPrayer(prayer);
    if (refund > 0) {
      useGamificationStore.getState().decrementPoints(refund);
    }
    const prayerState = usePrayerStore.getState();
    const allRecoveredFalse = PRAYER_KEYS.every((k) => prayerState.prayers[k].recovered === 0);
    if (allRecoveredFalse) {
      useGamificationStore.getState().resetLastLogDate();
    }
  }, []);
  const handleBatch = useCallback((prayer: PrayerKey, count: number) => {
    const gStore = useGamificationStore.getState();
    const points = usePrayerStore.getState().logPrayerBatch(prayer, count);
    if (points <= 0) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    gStore.updateStreak();
    gStore.incrementPoints(points);
    const { prayers: latestPrayers, totalMissedDays: latestTotal } = usePrayerStore.getState();
    const newBadges = gStore.checkBadges(latestPrayers, latestTotal);
    if (newBadges.length > 0) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);
  const dismissIntention = useCallback(() => {
    useGamificationStore.getState().setIntentionSetDate(toLocalISODate(new Date()));
  }, []);
  const dismissDua = useCallback(() => {
    useGamificationStore.getState().setLastDuaShownDate(toLocalISODate(new Date()));
  }, []);
  return {
    actions: {
      handleLogPrayer,
      handleLogFullDay,
      handleUndo,
      handleBatch,
      dismissIntention,
      dismissDua,
    },
  };
}
