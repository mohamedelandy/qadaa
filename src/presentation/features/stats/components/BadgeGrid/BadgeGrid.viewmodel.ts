/** @format */
/**
 * View model for badge grid: themed styles distinguishing unlocked vs locked achievement cards.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import type { BadgeInfo } from "../../hooks/useStatsViewModel";
export function useBadgeGridViewModel(badges: BadgeInfo[]) {
  const { t, colors, typography, language, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing[3] },
        card: {
          width: "48%",
          borderRadius: br.xl,
          padding: spacing[4],
          flexDirection: "column",
          alignItems: "center",
          gap: spacing[2],
          borderWidth: 1,
        },
        cardUnlocked: { backgroundColor: colors.card, borderColor: colors.border },
        cardLocked: {
          backgroundColor: colors.cardDim,
          borderColor: colors.border,
        },
        icon: { fontSize: typography.fontSize["3xl"] },
        iconLocked: { opacity: 0.4 },
        name: { textAlign: "center" },
        date: {},
        locked: {
          fontSize: typography.fontSize.xs,
          lineHeight: typography.fontSize.xs,
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: br.sm,
          paddingHorizontal: spacing[1.5],
          paddingVertical: spacing[0.5],
          overflow: "hidden",
          fontFamily: typography.fonts.medium,
        },
      }),
    [colors, typography, br]
  );
  return { t, colors, styles, badges, language };
}
