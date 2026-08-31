/** @format */
/**
 * Styles for the batch-log popover (popover + custom-count sheet), built from live UI theme tokens.
 */
import { StyleSheet } from "react-native";
import { spacing } from "@theme/spacing";
type UITokens = {
  colors: {
    scrim: string;
    card: string;
    borderStrong: string;
    shadow: string;
    textDim: string;
    primary: string;
    white: string;
    surfaceAlt: string;
    surface: string;
    text: string;
    textMuted: string;
    textSub: string;
    textPlaceholder: string;
  };
  typography: {
    fontSize: Record<"xs" | "sm" | "base", number>;
    fonts: { regular: string; medium: string; bold: string };
  };
  borderRadius: Record<"lg" | "xl", number>;
};
export function createBatchLogPopoverStyles({ colors, typography, borderRadius: br }: UITokens) {
  return StyleSheet.create({
    scrim: { flex: 1 },
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.scrim,
    },
    container: {
      position: "absolute",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: br.xl,
      padding: spacing[3],
      paddingBottom: spacing[1.5],
      minWidth: 160,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
    },
    title: {
      color: colors.textDim,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fonts.bold,
      textAlign: "center",
    },
    presetRow: { marginTop: spacing[2], gap: spacing[2] },
    presetBtn: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
      borderRadius: br.lg,
      backgroundColor: colors.primary,
    },
    presetBtnDisabled: { opacity: 0.3 },
    presetText: {
      color: colors.white,
      fontFamily: typography.fonts.bold,
      fontSize: typography.fontSize.base,
      textAlign: "center",
    },
    presetTextDisabled: { opacity: 0.5 },
    customBtn: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
      borderRadius: br.lg,
      backgroundColor: colors.surfaceAlt,
    },
    customText: {
      color: colors.textMuted,
      fontFamily: typography.fonts.bold,
      fontSize: typography.fontSize.base,
      textAlign: "center",
    },
    customRow: { gap: spacing[2] },
    input: {
      backgroundColor: colors.surface,
      color: colors.text,
      textAlign: "center",
      borderRadius: br.lg,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderWidth: 1,
      borderColor: colors.borderStrong,
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fonts.regular,
    },
    confirmBtn: {
      paddingVertical: spacing[2],
      borderRadius: br.lg,
      backgroundColor: colors.primary,
    },
    confirmText: {
      color: colors.white,
      fontFamily: typography.fonts.bold,
      fontSize: typography.fontSize.base,
      textAlign: "center",
    },
    cancelBtn: { width: "100%", paddingVertical: spacing[1.5] },
    cancelText: {
      color: colors.textMuted,
      fontSize: typography.fontSize.base,
      textAlign: "center",
      fontFamily: typography.fonts.bold,
    },
  });
}
export function createBatchLogSheetStyles({ colors, typography, borderRadius: br }: UITokens) {
  return StyleSheet.create({
    kav: {
      paddingVertical: spacing[2],
      gap: spacing[3],
    },
    title: {
      color: colors.textSub,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fonts.bold,
      textAlign: "center",
    },
    input: {
      backgroundColor: colors.surface,
      color: colors.text,
      textAlign: "center",
      borderRadius: br.lg,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
      borderWidth: 1,
      borderColor: colors.borderStrong,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fonts.regular,
    },
    cancelBtn: { width: "100%", paddingVertical: spacing[2] },
    cancelText: {
      color: colors.textMuted,
      fontSize: typography.fontSize.base,
      textAlign: "center",
      fontFamily: typography.fonts.bold,
    },
  });
}
