/** @format */
/**
 * Combined hook merging the active theme with the i18n translator and
 * the persisted language from the settings store.
 */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "./useTheme";
import { useSettingsStore } from "@stores/useSettingsStore";
export function useUI() {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useSettingsStore((s) => s.language);
  return useMemo(
    () => ({
      ...theme,
      t,
      language,
    }),
    [theme, t, language]
  );
}
