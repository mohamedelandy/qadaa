/** @format */
/**
 * Memoized theme-aware StyleSheet hook for the onboarding slides screen layout.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
export function useOnboardingStyles() {
  const { colors, typography, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        topBar: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: spacing[4],
          height: spacing[12],
        },
        skipButton: {
          paddingHorizontal: spacing[3],
        },
        slideArea: {
          flex: 1,
        },
        bottomBar: {
          height: spacing[12],
        },
      }),
    [colors, typography, br]
  );
  return { styles };
}
