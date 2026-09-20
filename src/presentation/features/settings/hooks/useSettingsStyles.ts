/** @format */
/**
 * Memoized StyleSheet for the Settings screen built from theme tokens.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";

// Using utility types instead of explicit any to resolve lint issues
type UIColors = ReturnType<typeof useUI>["colors"];
type UITypography = ReturnType<typeof useUI>["typography"];
type UIBorderRadius = ReturnType<typeof useUI>["borderRadius"];

const createBaseStyles = () => ({
  header: {
    paddingVertical: spacing[2],
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing[24] },
});

const createTargetStyles = (colors: UIColors, typography: UITypography, br: UIBorderRadius) => ({
  targetRow: {
    flexDirection: "row" as const,
    gap: spacing[2],
    alignItems: "stretch" as const,
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
    textAlign: "center" as const,
    minHeight: 44,
  },
  targetSaveButton: {
    width: "100%",
    paddingVertical: spacing[3],
    borderRadius: br.lg,
    backgroundColor: colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
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
    flexDirection: "row" as const,
    gap: spacing[2],
    marginTop: spacing[3],
  },
  presetBtn: { flex: 1, minHeight: 52 },
  presetGradient: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
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
    justifyContent: "center" as const,
    alignItems: "center" as const,
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
    alignItems: "center" as const,
    minHeight: 44,
    justifyContent: "center" as const,
    borderRadius: br.xl,
  },
  customText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fonts.bold,
  },
  targetHint: {
    fontSize: typography.fontSize.xs,
    textAlign: "center" as const,
    marginTop: spacing[3],
    fontFamily: typography.fonts.medium,
  },
  customInputWrap: { marginTop: spacing[2] },
});

const createBackupStyles = (colors: UIColors, br: UIBorderRadius) => ({
  syncButton: {
    width: "100%",
    paddingVertical: spacing[3],
    borderRadius: br.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: 44,
    backgroundColor: colors.primary,
  },
  backupRow: {
    flexDirection: "row" as const,
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
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
});

const createGraceDayStyles = (colors: UIColors, typography: UITypography, br: UIBorderRadius) => ({
  graceRow: {
    marginTop: spacing[3],
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
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
});

const createAppearanceStyles = (colors: UIColors, br: UIBorderRadius) => ({
  themeButton: {
    width: "100%",
    paddingVertical: spacing[3],
    borderRadius: br.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: 44,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginTop: spacing[3],
  },
});

const createFeedbackStyles = (colors: UIColors, br: UIBorderRadius) => ({
  feedbackButton: {
    width: "100%",
    paddingVertical: spacing[3],
    borderRadius: br.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: 44,
    backgroundColor: colors.blueStart,
    marginTop: spacing[2],
  },
});

export function useSettingsStyles() {
  const { colors, typography, borderRadius: br, isRTL: _isRTL } = useUI();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        ...createBaseStyles(),
        ...createTargetStyles(colors, typography, br),
        ...createBackupStyles(colors, br),
        ...createGraceDayStyles(colors, typography, br),
        ...createAppearanceStyles(colors, br),
        ...createFeedbackStyles(colors, br),
      }),
    [colors, typography, br]
  );

  return styles;
}
