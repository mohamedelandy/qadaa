/** @format */
/**
 * Aggregates wizard completion, sync visibility, and i18n/theme values for tab layout screens.
 */
import { useAppStore } from "@stores/useAppStore";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useShallow } from "zustand/react/shallow";
import { useUI } from "@hooks/useUI";
export function useTabLayoutViewModel() {
  const wizardComplete = useAppStore((s) => s.wizardComplete);
  const { syncVisible, setSyncVisible } = useSettingsStore(
    useShallow((s) => ({ syncVisible: s.syncVisible, setSyncVisible: s.setSyncVisible }))
  );
  const { t, colors, isDark, direction } = useUI();
  return { wizardComplete, syncVisible, setSyncVisible, t, colors, isDark, direction };
}
