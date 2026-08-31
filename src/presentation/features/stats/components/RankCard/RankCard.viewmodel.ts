/** @format */
/**
 * View model for RankCard: row layout, badge chip and points column styling.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import type { RankInfo } from "../../hooks/useStatsViewModel";
export function useRankCardViewModel(rank: RankInfo, points: number) {
  const { t, colors, isRTL, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: br.xl,
          padding: spacing[4],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        badge: {
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1.5],
          borderRadius: br.lg,
          borderWidth: 1,
        },
        badgeText: {},
        pointsContainer: { alignItems: "flex-end" },
        pointsLabel: {
          letterSpacing: 0.5,
          textTransform: "uppercase",
        },
        pointsNumber: {
          marginTop: spacing[2],
        },
      }),
    [colors, br]
  );
  return { t, colors, isRTL, styles, rank, points };
}
