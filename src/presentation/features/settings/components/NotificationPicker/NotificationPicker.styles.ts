/** @format */
/**
 * Styles for the notification time picker, built from live UI theme tokens.
 */
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";

type UITokens = Pick<ReturnType<typeof useUI>, "colors" | "typography" | "borderRadius">;

export function createNotificationPickerStyles({ colors, typography, borderRadius: br }: UITokens) {
  return StyleSheet.create({
    root: { marginTop: spacing[2], gap: spacing[3] },
    pickerRow: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: spacing[3],
    },
    selectorGroup: { flexDirection: "row", alignItems: "center", gap: spacing[1] },
    arrowButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    arrowText: {
      color: colors.textMuted,
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fonts.regular,
    },
    valueBox: {
      backgroundColor: colors.surface,
      borderRadius: br.lg,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      minWidth: 60,
      alignItems: "center",
    },
    valueText: {
      color: colors.text,
      fontSize: typography.fontSize["2lg"],
      fontFamily: typography.fonts.bold,
    },
    minuteRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing[1],
    },
    minuteButton: {
      backgroundColor: colors.surface,
      borderRadius: br.lg,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      paddingHorizontal: spacing[2],
      minHeight: 44,
      minWidth: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    minuteButtonSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    minuteText: {
      color: colors.text,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fonts.bold,
    },
    minuteTextSelected: { color: colors.white },
    ampmGroup: {
      flexDirection: "row",
      gap: spacing[1],
    },
    ampmButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: br.md,
      paddingHorizontal: spacing[2.5],
      minHeight: 44,
      justifyContent: "center",
    },
    ampmActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    ampmText: {
      color: colors.textDim,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fonts.bold,
    },
    ampmTextActive: { color: colors.white },
    saveButton: {
      width: "100%",
      paddingVertical: spacing[3],
      borderRadius: br.lg,
      backgroundColor: colors.primary,
      alignItems: "center",
      minHeight: 44,
      justifyContent: "center",
    },
    saveButtonSaved: { backgroundColor: colors.green },
    saveText: {
      color: colors.white,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fonts.bold,
    },
    saveTextSaved: { color: colors.greenDim },
    errorText: {
      color: colors.red,
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fonts.medium,
    },
  });
}
