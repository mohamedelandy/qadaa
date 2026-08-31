/** @format */
/**
 * Aggregates wizard completion, sync visibility, and i18n/theme values for tab layout screens.
 */
import { useAppStore } from "@stores/useAppStore";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useUI } from "@hooks/useUI";
export function useTabLayoutViewModel() {
  const wizardComplete = useAppStore((s) => s.wizardComplete);
  const syncVisible = useSettingsStore((s) => s.syncVisible);
  const setSyncVisible = useSettingsStore((s) => s.setSyncVisible);
  const { t, colors, isDark, direction } = useUI();
  return { wizardComplete, syncVisible, setSyncVisible, t, colors, isDark, direction };
}
