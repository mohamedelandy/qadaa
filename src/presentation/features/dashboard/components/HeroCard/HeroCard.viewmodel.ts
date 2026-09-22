/** @format */
/**
 * Pure state machine computing hero card journey percent and daily segments,
 * plus the view-model hook sourcing store data so the component stays dumb.
 */
import { PRAYER_KEYS, type PrayerKey } from "@domain/types";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useShallow } from "zustand/react/shallow";
export interface HeroCardState {
  loggedCount: number;
  dailyTarget: number;
  journeyPct: number;
  isDone: boolean;
  isBehind: boolean;
  behind: number;
  segments: number;
  filledSegments: number;
}
export interface HeroCardInput {
  loggedCount: number;
  dailyTarget: number;
  prayers: Record<
    PrayerKey,
    {
      recovered: number;
    }
  >;
  totalMissedDays: number;
}
export function computeHeroCardState({
  loggedCount,
  dailyTarget,
  prayers,
  totalMissedDays,
}: HeroCardInput): HeroCardState {
  const journeyPct =
    totalMissedDays <= 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (PRAYER_KEYS.reduce((acc, k) => acc + prayers[k].recovered, 0) /
              (totalMissedDays * 5)) *
              1000
          ) / 10
        );
  const isDone = dailyTarget > 0 && loggedCount >= dailyTarget;
  const behind = Math.max(0, dailyTarget - loggedCount);
  const isBehind = dailyTarget > 0 && behind > 0;
  const segments = Math.min(Math.max(dailyTarget, 0), 5);
  const filledSegments = Math.min(Math.max(loggedCount, 0), segments);
  return {
    loggedCount,
    dailyTarget,
    journeyPct,
    isDone,
    isBehind,
    behind,
    segments,
    filledSegments,
  };
}
export function useHeroCardViewModel(): HeroCardState {
  // Optimization: Batch multiple store property reads using useShallow to prevent unnecessary re-renders
  const { prayers, totalMissedDays, todayPrayers } = usePrayerStore(
    useShallow((s) => ({
      prayers: s.prayers,
      totalMissedDays: s.totalMissedDays,
      todayPrayers: s.todayPrayers,
    }))
  );
  const dailyTarget = useSettingsStore((s) => s.dailyTarget);
  const loggedCount = Object.keys(todayPrayers).length;
  return computeHeroCardState({ loggedCount, dailyTarget, prayers, totalMissedDays });
}
