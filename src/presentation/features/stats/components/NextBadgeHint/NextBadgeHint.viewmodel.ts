/** @format */
/**
 * View model for next-badge hint: card header, progress track and fill styling.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import type { NextBadgeInfo } from "../../hooks/useStatsViewModel";
export function useNextBadgeHintViewModel(nextBadge: NextBadgeInfo | null) {
  const { t, colors, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: br.xl,
          padding: spacing[4],
        },
        header: {
          letterSpacing: 0.5,
          marginTop: spacing[3],
          textTransform: "uppercase",
        },
        content: {
          marginTop: spacing[2],
          flexDirection: "row",
          alignItems: "center",
          gap: spacing[2],
        },
        icon: {},
        name: {
          color: colors.textSub,
          marginTop: spacing[2],
        },
        progressTrack: {
          marginTop: spacing[3],
          backgroundColor: colors.surface,
          borderRadius: br.md,
          height: 8,
          overflow: "hidden",
        },
        progressFill: { height: 8, borderRadius: br.md },
        pct: {
          marginTop: spacing[3],
        },
      }),
    [colors, br]
  );
  return { t, colors, styles, nextBadge };
}
