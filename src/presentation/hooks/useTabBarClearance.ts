/** @format */
/**
 * Computes bottom clearance height needed above the floating glass tab bar.
 */
import { useSafeAreaInsets } from "react-native-safe-area-context";
const GLASS_BAR_EXPANDED_HEIGHT = 58;
const GLASS_BAR_MARGIN = 12;
export function useTabBarClearance(extra = 0): number {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom - 16, GLASS_BAR_MARGIN);
  return bottomOffset + GLASS_BAR_EXPANDED_HEIGHT + extra;
}
