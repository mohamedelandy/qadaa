/** @format */
/**
 * Hook exposing the current language with a haptic-backed setter.
 */
import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "@stores/useSettingsStore";
import type { Language } from "@domain/types";
export function useSettingsLanguage() {
  const language = useSettingsStore((s) => s.language);
  const setSettingsLanguage = useSettingsStore((s) => s.setLanguage);
  const setLanguage = useCallback(
    (lang: Language) => {
      void Haptics.selectionAsync();
      setSettingsLanguage(lang);
    },
    [setSettingsLanguage]
  );
  return { language, setLanguage };
}
