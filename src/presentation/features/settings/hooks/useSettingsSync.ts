/** @format */
/**
 * Hook wiring sync sheet visibility to backup export/import actions.
 */
import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "@stores/useSettingsStore";
import { generateBackupJson } from "@domain/backup";
export function useSettingsSync() {
  const syncVisible = useSettingsStore((s) => s.syncVisible);
  const setSyncVisible = useSettingsStore((s) => s.setSyncVisible);
  const exportToFileAction = useSettingsStore((s) => s.exportToFile);
  const importFromFileAction = useSettingsStore((s) => s.importFromFile);
  const importBackupAction = useSettingsStore((s) => s.importBackup);
  const getBackupData = useSettingsStore((s) => s.getBackupData);
  const handleExport = useCallback(async () => {
    try {
      await exportToFileAction();
      return true;
    } catch {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
  }, [exportToFileAction]);
  const handleImport = useCallback(async () => {
    try {
      return await importFromFileAction();
    } catch {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
  }, [importFromFileAction]);
  const handleImportBackupJson = useCallback(
    (json: string) => {
      return importBackupAction(json);
    },
    [importBackupAction]
  );
  const getBackupJson = useCallback(() => {
    const data = getBackupData();
    return generateBackupJson(data);
  }, [getBackupData]);
  return {
    syncVisible,
    setSyncVisible,
    handleExport,
    handleImport,
    handleImportBackupJson,
    getBackupJson,
  };
}
