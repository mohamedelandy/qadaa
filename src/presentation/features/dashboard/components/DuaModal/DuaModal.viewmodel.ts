/** @format */
/**
 * View model hook supplying themed styles and emoji/title split for the dua modal.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
export function useDuaModalViewModel() {
  const { t, colors, typography, borderRadius: br, gradients: g } = useUI();
  const titleParts = t("dua.title").split(" ");
  const emojiPart = titleParts[0] ?? "";
  const textPart = titleParts.slice(1).join(" ");
  const styles = useMemo(
    () =>
      StyleSheet.create({
        emojiTitle: { fontSize: typography.fontSize["4xl"], marginTop: spacing[5] },
        subtitle: {
          color: colors.green,
          fontFamily: typography.fonts.bold,
          fontSize: typography.fontSize.base,
          marginTop: spacing[3],
        },
        secondarySubtitle: {
          color: colors.textDim,
          fontSize: typography.fontSize.xs,
          marginTop: spacing[1],
          fontFamily: typography.fonts.medium,
        },
        duaText: {
          color: colors.textSub,
          fontSize: typography.fontSize.xl,
          lineHeight: 34,
          letterSpacing: 0.5,
          marginTop: spacing[5],
          textAlign: "center",
          fontFamily: typography.fonts.regular,
        },
        subtext: {
          color: colors.textMuted,
          fontSize: typography.fontSize.xs,
          lineHeight: 18,
          marginTop: spacing[3],
          textAlign: "center",
          fontFamily: typography.fonts.regular,
        },
        ameenBtn: { width: "100%", borderRadius: br.xl, marginTop: spacing[6] },
        ameenPressable: {
          paddingVertical: spacing[4],
          borderRadius: br.xl,
          alignItems: "center",
          justifyContent: "center",
        },
        ameenText: {
          color: colors.white,
          fontFamily: typography.fonts.bold,
          fontSize: typography.fontSize.base,
        },
      }),
    [colors, typography, br]
  );
  return { t, styles, accent: colors.greenBorder, emojiPart, textPart, gradients: g };
}
