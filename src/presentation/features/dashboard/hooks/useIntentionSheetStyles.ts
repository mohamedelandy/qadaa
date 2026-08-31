/** @format */
/**
 * Themed styles hook for the intention bottom sheet (title, intention text, Ameen button, auto hint).
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
export function useIntentionSheetStyles() {
  const { t, colors, gradients: g, typography, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: colors.textMuted,
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginTop: spacing[5],
        },
        intentionText: {
          color: colors.textSub,
          fontSize: typography.fontSize.xl,
          lineHeight: spacing[8.5],
          letterSpacing: 0.5,
          textAlign: "center",
          marginTop: spacing[3],
          fontFamily: typography.fonts.regular,
        },
        ameenBtn: { width: "100%", borderRadius: br.xl, marginTop: spacing[5] },
        ameenPressable: {
          paddingVertical: spacing[3.5],
          borderRadius: br.xl,
          alignItems: "center",
          justifyContent: "center",
        },
        ameenText: {
          color: colors.white,
          fontFamily: typography.fonts.bold,
          fontSize: typography.fontSize.base,
        },
        autoHint: {
          color: colors.textPlaceholder,
          fontSize: typography.fontSize.xs,
          marginTop: spacing[2],
          fontFamily: typography.fonts.medium,
        },
      }),
    [colors, typography, br]
  );
  return { t, styles, accent: colors.greenBorder, gradients: g };
}
