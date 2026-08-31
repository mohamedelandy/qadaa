/** @format */
/**
 * View model for EstimateCard supplying themed card styles and translation helper.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import type { EstimateInfo } from "../../hooks/useStatsViewModel";
export function useEstimateCardViewModel(estimate: EstimateInfo) {
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
        noData: {
          marginTop: spacing[2],
        },
        line1: { marginTop: spacing[2] },
        line2: { marginTop: spacing[1] },
        line3: { marginTop: spacing[1] },
      }),
    [colors, br]
  );
  return { t, colors, styles, estimate };
}
