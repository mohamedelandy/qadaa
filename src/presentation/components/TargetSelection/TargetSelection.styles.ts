/** @format */

import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";

export function useTargetSelectionStyles() {
  const { colors, typography, borderRadius: br } = useUI();

  return useMemo(
    () =>
      StyleSheet.create({
        grid: {
          flexDirection: "row",
          gap: spacing[2],
          marginTop: spacing[3],
        },
        presetBtn: { flex: 1, minHeight: 52 },
        gradientFill: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[2],
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
        },
        presetLabel: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          color: colors.white,
        },
        customBtn: {
          marginTop: spacing[2],
          borderWidth: 1,
          paddingVertical: spacing[3],
          alignItems: "center",
          minHeight: 44,
          justifyContent: "center",
        },
        customText: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
        customInputWrap: { marginTop: spacing[2] },
      }),
    [colors, typography, br]
  );
}
