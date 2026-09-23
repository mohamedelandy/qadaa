/** @format */
/**
 * Hook wiring sync sheet visibility to backup export/import actions.
 */
import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useShallow } from "zustand/react/shallow";
import { generateBackupJson } from "@domain/backup";
export function useSettingsSync() {
  // Optimization: Batch multiple store property reads using useShallow to prevent unnecessary re-renders
  const {
    syncVisible,
    setSyncVisible,
    exportToFileAction,
    importFromFileAction,
    importBackupAction,
    getBackupData,
  } = useSettingsStore(
    useShallow((s) => ({
      syncVisible: s.syncVisible,
      setSyncVisible: s.setSyncVisible,
      exportToFileAction: s.exportToFile,
      importFromFileAction: s.importFromFile,
      importBackupAction: s.importBackup,
      getBackupData: s.getBackupData,
    }))
  );
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
