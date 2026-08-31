/** @format */
/**
 * Memoized theme-aware StyleSheet hook for wizard screens (title, fields, counter card, meter, errors).
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
export function useWizardStyles() {
  const { t, colors, typography, borderRadius: br, isRTL } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {},
        title: {
          fontSize: typography.fontSize["2xl"],
          fontFamily: typography.fonts.bold,
        },
        labelRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing[1.5],
          marginTop: spacing[2],
        },
        label: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          textTransform: "uppercase",
          letterSpacing: 0.64,
        },
        field: { marginTop: spacing[6] },
        addBtn: { minHeight: 44, justifyContent: "center", alignItems: "center" },
        addText: { fontSize: typography.fontSize.base, fontFamily: typography.fonts.bold },
        advancedToggle: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing[1.5],
          marginTop: spacing[4],
        },
        advancedText: {
          fontSize: typography.fontSize.xs,
          textDecorationLine: "underline",
          fontFamily: typography.fonts.medium,
        },
        counterCard: {
          marginTop: spacing[5],
          borderWidth: 1,
          padding: spacing[4],
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        counterLabel: { flexDirection: "row", alignItems: "center", gap: spacing[1.5] },
        counterText: { fontSize: typography.fontSize.xs, fontFamily: typography.fonts.medium },
        counterValue: { fontSize: typography.fontSize["2xl"], fontFamily: typography.fonts.bold },
        meterRow: {
          marginTop: spacing[2],
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        meterText: {
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
        },
        addBtnDisabled: {
          opacity: 0.4,
        },
        error: {
          fontSize: typography.fontSize.xs,
          marginTop: spacing[3],
          textAlign: "center",
          fontFamily: typography.fonts.medium,
        },
      }),
    [typography, colors, isRTL, br]
  );
  return { t, colors, styles, br };
}
