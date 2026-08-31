/** @format */
/**
 * Themed layout styles for Dashboard screen including tab bar scroll clearance.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import { useTabBarClearance } from "@hooks/useTabBarClearance";
export function useDashboardStyles() {
  const { colors, typography, borderRadius: br, gradients: g } = useUI();
  const clearance = useTabBarClearance(spacing[6]);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        scrollView: { flex: 1 },
        scrollContent: { paddingBottom: clearance },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: spacing[2],
          paddingBottom: spacing[4],
        },
        appName: {
          letterSpacing: -0.5,
        },
        sectionLabel: {
          letterSpacing: 1,
          textTransform: "uppercase",
          paddingTop: spacing[3],
          paddingBottom: spacing[2],
        },
      }),
    [colors, typography, br, clearance]
  );
  return { styles, gradients: g };
}
