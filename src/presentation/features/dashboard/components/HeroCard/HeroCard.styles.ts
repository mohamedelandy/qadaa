/** @format */

import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";

export function useHeroCardStyles() {
  const { colors, mode, typography, borderRadius: br } = useUI();
  const isLight = mode === "light";

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderRadius: br["2xl"],
          padding: spacing[4],
          marginTop: spacing[3],
          borderWidth: 1,
          borderColor: colors.greenBorder,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isLight ? 0.05 : 0.25,
          shadowRadius: 12,
          elevation: 3,
        },
        innerContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing[4],
        },
        ringWrap: {
          width: 88,
          height: 88,
          justifyContent: "center",
          alignItems: "center",
        },
        ringCenter: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        },
        ringPct: {
          color: colors.green,
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fonts.bold,
          includeFontPadding: false,
        },
        ringLabel: {
          color: colors.textDim,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          marginTop: spacing[0.5],
        },
        todayPanel: {
          flex: 1,
          justifyContent: "center",
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: spacing[2],
        },
        todayTitle: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          color: colors.text,
        },
        targetPill: {
          flexDirection: "row",
          alignItems: "baseline",
          paddingHorizontal: spacing[2.5],
          paddingVertical: spacing[1],
          borderRadius: br.full,
          backgroundColor: isLight ? colors.greenSurface : colors.greenSubtle,
        },
        countActive: {
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fonts.bold,
          color: colors.green,
          fontVariant: ["tabular-nums"],
        },
        countDivider: {
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fonts.medium,
          color: colors.textDim,
          marginHorizontal: spacing[0.5],
        },
        countTotal: {
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fonts.bold,
          color: colors.textMuted,
          fontVariant: ["tabular-nums"],
        },
        segments: {
          flexDirection: "row",
          gap: spacing[1.5],
          alignSelf: "stretch",
          marginVertical: spacing[1],
        },
        segment: {
          flex: 1,
          height: 6,
          borderRadius: br.full,
        },
        segmentFilled: {
          backgroundColor: colors.green,
        },
        segmentEmpty: {
          backgroundColor: colors.greenSubtle,
        },
        footerRow: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: spacing[1.5],
        },
        nudge: {
          color: colors.textMuted,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
        },
        done: {
          color: colors.green,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
        },
        confettiOverlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }),
    [colors, typography, br, isLight]
  );

  return { styles };
}
