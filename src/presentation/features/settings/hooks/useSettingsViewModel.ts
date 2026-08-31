/** @format */
/**
 * Aggregates settings sub-hooks into one view model for the settings screen.
 */
import { useUI } from "@hooks/useUI";
import { useSettingsTheme } from "./useSettingsTheme";
import { useSettingsLanguage } from "./useSettingsLanguage";
import { useSettingsTarget } from "./useSettingsTarget";
import { useSettingsNotification } from "./useSettingsNotification";
import { useSettingsSync } from "./useSettingsSync";
import { useSettingsGraceDay } from "./useSettingsGraceDay";
import { useSettingsFeedback } from "./useSettingsFeedback";
import { useSettingsReset } from "./useSettingsReset";
import { useSettingsStyles } from "./useSettingsStyles";
export function useSettingsViewModel() {
  const { t, colors, gradients } = useUI();
  const { language, setLanguage } = useSettingsLanguage();
  const { isDark, toggleTheme } = useSettingsTheme();
  const {
    preset,
    selectPreset,
    setCustomTarget,
    customTarget,
    isCustom,
    isValid,
    targetSaved,
    handleTargetSave,
  } = useSettingsTarget();
  const {
    notificationHour,
    notificationMinute,
    notificationAmPm,
    notificationPermission,
    setNotificationTime,
  } = useSettingsNotification();
  const { syncVisible, setSyncVisible, handleExport, handleImport } = useSettingsSync();
  const { graceUsed, graceStatus } = useSettingsGraceDay();
  const { handleFeedback } = useSettingsFeedback();
  const { resetAll } = useSettingsReset();
  const styles = useSettingsStyles();
  const graceBadgeStyle = graceUsed ? styles.graceBadgeUsed : styles.graceBadgeAvailable;
  return {
    t,
    isDark,
    toggleTheme,
    styles,
    colors,
    gradients,
    language,
    notificationHour,
    notificationMinute,
    notificationAmPm,
    notificationPermission,
    graceUsed,
    targetSaved,
    syncVisible,
    graceStatus,
    graceBadgeStyle,
    preset,
    selectPreset,
    setCustomTarget,
    customTarget,
    isCustom,
    isValid,
    setSyncVisible,
    setLanguage,
    setNotificationTime,
    handleTargetSave,
    handleExport,
    handleImport,
    handleFeedback,
    resetAll,
  };
}
