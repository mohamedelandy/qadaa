/** @format */
/**
 * Memoized themed styles for the sync/QR sheet: tabs, QR container, instructions, hints, buttons.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
export function useSyncStyles() {
  const { colors, typography, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          marginTop: spacing[4],
          color: colors.text,
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          textAlign: "center",
        },
        tabBar: {
          marginTop: spacing[4],
          flexDirection: "row",
          gap: spacing[1],
          backgroundColor: colors.surface,
          borderRadius: br.lg,
          padding: spacing[1],
        },
        tab: {
          flex: 1,
          paddingVertical: spacing[2],
          borderRadius: br.md,
          alignItems: "center",
        },
        tabActive: { backgroundColor: colors.primary },
        tabText: {
          color: colors.textDim,
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
        tabTextActive: { color: colors.white },
        tabContent: { marginTop: spacing[5], maxHeight: 400 },
        columnCenter: { flexDirection: "column", alignItems: "center", gap: spacing[4] },
        instruction: {
          color: colors.textDim,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          textAlign: "center",
          marginTop: spacing[3],
        },
        qrContainer: {
          width: 256,
          height: 256,
          borderRadius: br.lg,
          backgroundColor: colors.card,
          alignItems: "center",
          justifyContent: "center",
        },
        qrErrorText: {
          color: colors.red,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          textAlign: "center",
          paddingHorizontal: spacing[4],
        },
        hint: {
          color: colors.textMuted,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          textAlign: "center",
          marginTop: spacing[3],
        },
        actionButton: {
          width: "100%",
          paddingVertical: spacing[3],
          borderRadius: br.lg,
          backgroundColor: colors.primary,
          alignItems: "center",
          minHeight: 44,
          justifyContent: "center",
          marginTop: spacing[3],
        },
        actionButtonDone: { backgroundColor: colors.green },
        actionButtonDisabled: { opacity: 0.4 },
        actionButtonText: {
          color: colors.white,
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
        actionButtonTextDone: { color: colors.surface },
        previewBox: {
          backgroundColor: colors.surface,
          borderRadius: br.lg,
          padding: spacing[3],
          maxHeight: 128,
        },
        previewText: {
          color: colors.textMuted,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
        },
        textarea: {
          width: "100%",
          backgroundColor: colors.surface,
          color: colors.text,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.regular,
          borderRadius: br.lg,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          padding: spacing[3],
          height: 128,
          textAlignVertical: "top",
          marginTop: spacing[3],
        },
        importError: {
          color: colors.red,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          textAlign: "center",
          marginTop: spacing[2],
        },
        importSuccess: {
          color: colors.green,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          textAlign: "center",
          marginTop: spacing[2],
        },
        closeButton: {
          width: "100%",
          paddingVertical: spacing[3],
          borderRadius: br.lg,
          alignItems: "center",
          marginTop: spacing[4],
        },
        closeText: {
          color: colors.textDim,
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
      }),
    [colors, typography, br]
  );
  return { styles };
}
