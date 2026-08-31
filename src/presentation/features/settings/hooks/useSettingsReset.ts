/** @format */
/**
 * Reset hook wiping settings, app, gamification, prayer, and wizard stores plus modal visibility and language back to defaults.
 */
import { useCallback } from "react";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useAppStore } from "@stores/useAppStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useWizardStore } from "@stores/useWizardStore";
import { useModalVisibilityStore } from "@stores/useModalVisibilityStore";
// Note: the i18n language reset to Arabic lives inside useSettingsStore.resetAll
// (the settings store owns i18n sync); presentation must not touch @data directly.
export function useSettingsReset() {
  const resetAll = useCallback(() => {
    useSettingsStore.getState().resetAll();
    useAppStore.getState().resetAll();
    useGamificationStore.getState().resetAll();
    usePrayerStore.getState().resetAll();
    useWizardStore.getState().resetAll();
    useModalVisibilityStore.getState().setOverlayOpen(false);
  }, []);
  return { resetAll };
}
