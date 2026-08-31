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
        presetsGrid: {
          flexDirection: "row",
          gap: spacing[2],
          marginTop: spacing[3],
        },
        presetBtn: { flex: 1, minHeight: 52 },
        presetGradient: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[2],
          borderRadius: br.xl,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        },
        presetInactive: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[2],
          borderWidth: 1,
          borderColor: colors.borderStrong,
          borderRadius: br.xl,
          backgroundColor: colors.card,
        },
        presetLabel: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          color: colors.white,
        },
        presetLabelInactive: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          color: colors.textMuted,
        },
        customBtn: {
          marginTop: spacing[2],
          borderWidth: 1,
          paddingVertical: spacing[3],
          alignItems: "center",
          minHeight: 44,
          justifyContent: "center",
          borderRadius: br.xl,
        },
        customText: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
        targetHint: {
          fontSize: typography.fontSize.xs,
          textAlign: "center",
          marginTop: spacing[3],
          fontFamily: typography.fonts.medium,
        },
        customInputWrap: { marginTop: spacing[2] },
      }),
    [colors, typography, br]
  );
  return styles;
}
