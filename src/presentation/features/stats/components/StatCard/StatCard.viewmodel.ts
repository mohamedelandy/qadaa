/** @format */
/**
 * View model for StatCard: card typography/spacing styles plus RTL flag for number formatting.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
export function useStatCardViewModel() {
  const { colors, typography, isRTL, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: br.xl,
          padding: spacing[4],
          flexDirection: "column",
          alignItems: "center",
          gap: spacing[1],
        },
        emoji: { fontSize: typography.fontSize["3xl"] },
        number: {},
        label: {
          textAlign: "center",
        },
        hint: {
          textAlign: "center",
          lineHeight: 13,
        },
      }),
    [colors, typography, br]
  );
  return { colors, styles, isRTL };
}
