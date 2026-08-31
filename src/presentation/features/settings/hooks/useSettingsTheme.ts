/** @format */
/**
 * Theme toggle action with selection haptic.
 */
import * as Haptics from "expo-haptics";
import { useUI } from "@hooks/useUI";
export function useSettingsTheme() {
  const { isDark, toggleTheme } = useUI();
  const handleToggleTheme = () => {
    void Haptics.selectionAsync();
    toggleTheme();
  };
  return { isDark, toggleTheme: handleToggleTheme };
}
