/** @format */
/**
 * Memoized StyleSheet hook for the Stats screen layout with tab-bar bottom clearance.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import { useTabBarClearance } from "@hooks/useTabBarClearance";
export function useStatsStyles() {
  const { colors, typography, borderRadius: br } = useUI();
  const clearance = useTabBarClearance(spacing[6]);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        scrollView: { flex: 1 },
        scrollContent: { paddingBottom: clearance },
        header: { paddingBottom: spacing[4] },
        title: {
          letterSpacing: -0.5,
          paddingTop: spacing[2],
          paddingBottom: spacing[5],
        },
        row: {
          flexDirection: "row",
          gap: spacing[3],
          marginTop: spacing[3],
        },
        half: { flex: 1 },
        rankWrapper: { marginTop: spacing[3] },
        estimateWrapper: { marginTop: spacing[3] },
        nextBadgeWrapper: { marginTop: spacing[3] },
        badgesHeader: {
          letterSpacing: 0.5,
          textTransform: "uppercase",
          marginTop: spacing[3],
        },
        badgeGrid: {
          marginTop: spacing[2],
        },
      }),
    [colors, typography, br, clearance]
  );
  return styles;
}
