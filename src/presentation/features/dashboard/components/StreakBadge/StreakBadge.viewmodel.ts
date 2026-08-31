/** @format */
/**
 * View model hook computing themed pill styles from streak, at-risk, and grace-used props.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
interface StreakBadgeProps {
  streak: number;
  isAtRisk: boolean;
  graceUsed: boolean;
}
export function useStreakBadgeViewModel(props: StreakBadgeProps) {
  const { streak, isAtRisk, graceUsed } = props;
  const { t, colors, typography, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flexDirection: "row", alignItems: "center", gap: spacing[2.5] },
        streakPill: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing[1.5],
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          borderRadius: br.lg,
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1.5],
        },
        streakPillAtRisk: { borderColor: colors.amberBorder },
        fireEmoji: { fontSize: typography.fontSize.base },
        fireEmojiPulse: { opacity: 0.6 },
        streakNumber: {
          color: colors.gold,
          fontFamily: typography.fonts.bold,
          fontSize: typography.fontSize.sm,
          fontVariant: ["tabular-nums"],
        },
        graceEmoji: { fontSize: typography.fontSize.xs, opacity: 0.7 },
      }),
    [colors, typography, br]
  );
  return { t, styles, streak, isAtRisk, graceUsed };
}
