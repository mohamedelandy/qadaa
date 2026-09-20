/** @format */
/**
 * Aggregates settings sub-hooks into one view model for the settings screen.
 */
import { useUI } from "@hooks/useUI";
import { useSettingsTheme } from "./useSettingsTheme";
import { useSettingsGraceDay } from "./useSettingsGraceDay";
import { useSettingsStyles } from "./useSettingsStyles";
export function useSettingsViewModel() {
  const { t, colors, gradients } = useUI();
  const { isDark, toggleTheme } = useSettingsTheme();
  const { graceUsed, graceStatus } = useSettingsGraceDay();
  const styles = useSettingsStyles();
  const graceBadgeStyle = graceUsed ? styles.graceBadgeUsed : styles.graceBadgeAvailable;
  return {
    t,
    isDark,
    toggleTheme,
    styles,
    colors,
    gradients,
    graceUsed,
    graceStatus,
    graceBadgeStyle,
  };
}
