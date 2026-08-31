/** @format */
/**
 * View model hook providing themed styles for the dashboard hadith card display.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
export function useHadithCardViewModel() {
  const { colors, typography, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginTop: spacing[4],
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: br.xl,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3.5],
          alignItems: "center",
        },
        separator: {
          color: colors.textDim,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          letterSpacing: 2,
          textTransform: "uppercase",
        },
        text: {
          color: colors.textMuted,
          fontSize: typography.fontSize.sm,
          marginTop: spacing[1.5],
          textAlign: "center",
          lineHeight: 22,
          fontFamily: typography.fonts.regular,
        },
      }),
    [colors, typography, br]
  );
  return { styles };
}
