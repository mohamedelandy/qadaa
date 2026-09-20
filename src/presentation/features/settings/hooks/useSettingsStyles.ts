/** @format */
/**
 * Memoized StyleSheet for the Settings screen built from theme tokens.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
export function useSettingsStyles() {
  const { colors, typography, borderRadius: br, isRTL: _isRTL } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          paddingVertical: spacing[2],
        },
        scroll: { flex: 1 },
        scrollContent: { paddingBottom: spacing[24] },
        targetRow: {
          flexDirection: "row",
          gap: spacing[2],
          alignItems: "stretch",
          marginTop: spacing[2],
        },
        targetInput: {
          flex: 1,
          backgroundColor: colors.surface,
          color: colors.text,
          borderRadius: br.lg,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2.5],
          textAlign: "center",
          minHeight: 44,
        },
        targetSaveButton: {
          width: "100%",
          paddingVertical: spacing[3],
          borderRadius: br.lg,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 44,
          marginTop: spacing[3],
        },
        targetSaveButtonSaved: {
          backgroundColor: colors.green,
        },
        targetSaveButtonDisabled: {
          opacity: 0.4,
        },
        targetSaveText: {
          color: colors.white,
        },
        targetSaveTextSaved: {
          color: colors.greenDim,
        },
        syncButton: {
          width: "100%",
          paddingVertical: spacing[3],
          borderRadius: br.lg,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 44,
          backgroundColor: colors.primary,
        },
        backupRow: {
          flexDirection: "row",
          gap: spacing[2],
          marginTop: spacing[3],
        },
        backupButton: {
          flex: 1,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[3],
          borderRadius: br.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          alignItems: "center",
          justifyContent: "center",
        },
        graceRow: {
          marginTop: spacing[3],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        graceBadge: {
          paddingHorizontal: spacing[2.5],
          paddingVertical: spacing[1],
          borderRadius: br.md,
        },
        graceBadgeAvailable: {
          backgroundColor: colors.primaryGlow,
        },
        graceBadgeUsed: {
          backgroundColor: colors.border,
        },
        graceBadgeText: {
          fontFamily: typography.fonts.medium,
          color: colors.green,
        },
        graceBadgeTextUsed: {
          color: colors.textMuted,
        },
        feedbackButton: {
          width: "100%",
          paddingVertical: spacing[3],
          borderRadius: br.lg,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 44,
          backgroundColor: colors.blueStart,
          marginTop: spacing[2],
        },
        themeButton: {
          width: "100%",
          paddingVertical: spacing[3],
          borderRadius: br.lg,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 44,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          marginTop: spacing[3],
        },
        targetSection: {
          marginTop: spacing[2],
        },
        targetTitle: {
          fontSize: typography.fontSize["2xl"],
          fontFamily: typography.fonts.bold,
        },
        targetSubtitle: {
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          marginTop: spacing[2],
        },
        targetHint: {
          fontSize: typography.fontSize.xs,
          textAlign: "center",
          marginTop: spacing[3],
          fontFamily: typography.fonts.medium,
        },
      }),
    [colors, typography, br]
  );
  return styles;
}
