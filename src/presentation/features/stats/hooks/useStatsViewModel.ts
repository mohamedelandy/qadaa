/** @format */
/**
 * Stats view model deriving streak, level, points, rank, badges, next badge, and recovery estimate from stores.
 */
import { useMemo } from "react";
import { usePrayerStore } from "@stores/usePrayerStore";
import { PRAYER_KEYS } from "@domain/types";
import { useGamificationStore } from "@stores/useGamificationStore";
import { useUI } from "@hooks/useUI";
import { addDays } from "@domain/date";
import { BADGE_IDS, badgeProgressValue } from "@domain/badges";
import type { ColorKey } from "@theme/types";
import { useStatsStyles } from "./useStatsStyles";
const BADGE_ICONS: Record<string, string> = {
  first_log: "\u{1F331}",
  first_week: "\u{1F525}",
  warrior_30: "\u{2694}\u{FE0F}",
  golden_year: "\u{1F31F}",
  quarter_way: "\u{1F3AF}",
  halfway: "\u{1F3C3}",
  almost_there: "\u{1F3C5}",
  complete: "\u{1F3C6}",
};
export interface RankInfo {
  label: string;
  color: ColorKey;
  bg: ColorKey;
  border: ColorKey;
}
export interface BadgeInfo {
  id: string;
  unlockedAt: number | null;
  icon: string;
}
export interface NextBadgeInfo {
  id: string;
  icon: string;
  progress: number;
}
export interface EstimateInfo {
  show: boolean;
  years: string;
  date: string;
  pace: string;
  avgPerDay: number;
  remaining: number;
  totalPrayers: number;
  recoveredPrayers: number;
}
export interface StatsViewModel {
  t: (key: string) => string;
  colors: ReturnType<typeof useUI>["colors"];
  styles: ReturnType<typeof useStatsStyles>;
  streak: number;
  level: number;
  points: number;
  rank: RankInfo;
  badges: BadgeInfo[];
  nextBadge: NextBadgeInfo | null;
  estimate: EstimateInfo;
}
function getRank(points: number): RankInfo {
  if (points >= 5000)
    return {
      label: "platinum",
      color: "rankPlatinum",
      bg: "rankPlatinumBg",
      border: "rankPlatinumBorder",
    };
  if (points >= 2000)
    return { label: "gold", color: "rankGold", bg: "rankGoldBg", border: "rankGoldBorder" };
  if (points >= 500)
    return { label: "silver", color: "rankSilver", bg: "rankSilverBg", border: "rankSilverBorder" };
  return { label: "bronze", color: "rankBronze", bg: "rankBronzeBg", border: "rankBronzeBorder" };
}

let enFormatter: Intl.DateTimeFormat | null = null;
let arFormatter: Intl.DateTimeFormat | null = null;

function formatDate(d: Date, language: string): string {
  if (language === "ar") {
    if (arFormatter !== null) return arFormatter.format(d);

    try {
      arFormatter = new Intl.DateTimeFormat("ar-EG-u-ca-islamic", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      if (enFormatter === null) {
        enFormatter = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      arFormatter = enFormatter;
    }
    return arFormatter.format(d);
  }

  if (enFormatter !== null) return enFormatter.format(d);

  enFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return enFormatter.format(d);
}
export function useStatsViewModel(): StatsViewModel {
  const { t, colors, language } = useUI();
  const styles = useStatsStyles();
  const prayers = usePrayerStore((s) => s.prayers);
  const totalMissedDays = usePrayerStore((s) => s.totalMissedDays);
  const streak = useGamificationStore((s) => s.streak);
  const daysLogged = useGamificationStore((s) => s.daysLogged);
  const points = useGamificationStore((s) => s.points);
  const badges = useGamificationStore((s) => s.badges);

  const data = useMemo(() => {
    const level = Math.floor(daysLogged / 30) + 1;
    const rank = getRank(points);
    const badgeMap = new Map(badges.map((b) => [b.id, b.unlockedAt]));
    const allBadges = BADGE_IDS.map((id) => ({
      id,
      unlockedAt: badgeMap.get(id) ?? null,
      icon: BADGE_ICONS[id] ?? "\u{1F3C5}",
    }));
    const firstLocked = BADGE_IDS.find((id) => !badgeMap.has(id));
    const nextBadgeData: NextBadgeInfo | null = firstLocked
      ? {
          id: firstLocked,
          icon: BADGE_ICONS[firstLocked] ?? "\u{1F3C5}",
          progress: Math.round(
            badgeProgressValue(firstLocked, { points, streak, prayers, totalMissedDays })
          ),
        }
      : null;
    const totalPrayersValue = totalMissedDays * 5;
    const recoveredPrayers = PRAYER_KEYS.reduce((sum, k) => sum + prayers[k].recovered, 0);
    const remaining = totalPrayersValue - recoveredPrayers;
    const avgPerDay = points / 10 / Math.max(daysLogged, 1);
    const daysToFinish = avgPerDay > 0 ? Math.ceil(remaining / avgPerDay) : Infinity;
    const estimate: EstimateInfo = {
      show: daysLogged >= 3,
      years: daysToFinish === Infinity ? "—" : (daysToFinish / 365).toFixed(1),
      date:
        daysToFinish === Infinity ? "—" : formatDate(addDays(new Date(), daysToFinish), language),
      pace: avgPerDay > 0 ? avgPerDay.toFixed(1) : "0",
      avgPerDay,
      remaining,
      totalPrayers: totalPrayersValue,
      recoveredPrayers,
    };
    return { streak, level, points, rank, badges: allBadges, nextBadge: nextBadgeData, estimate };
  }, [prayers, totalMissedDays, streak, daysLogged, points, badges, language]);
  return { t, colors, styles, ...data };
}
