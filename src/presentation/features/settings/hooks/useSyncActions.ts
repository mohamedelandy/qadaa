/** @format */
/**
 * Settings sync hook exposing backup JSON generation, clipboard copy, and JSON import handlers.
 */
import { useCallback } from "react";
import { useSettingsStore } from "@stores/useSettingsStore";
import { generateBackupJson } from "@domain/backup";
export function useSyncActions() {
  const copyBackupToClipboard = useSettingsStore((s) => s.copyBackupToClipboard);
  const getJson = useCallback(() => {
    const data = useSettingsStore.getState().getBackupData();
    return generateBackupJson(data);
  }, []);
  const handleCopy = useCallback(async () => {
    await copyBackupToClipboard();
  }, [copyBackupToClipboard]);
  const handleImport = useCallback((json: string) => {
    const trimmed = json.trim();
    if (!trimmed) return false;
    return useSettingsStore.getState().importBackup(trimmed);
  }, []);
  return { getJson, handleCopy, handleImport };
}
