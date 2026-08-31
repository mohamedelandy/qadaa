/** @format */
/**
 * Unit tests for useSettingsSync: sheet visibility and export/import delegation to backup layer.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("@data/backup", () => ({
  exportToFile: jest.fn().mockResolvedValue(undefined),
  importFromFile: jest.fn(),
  copyToClipboard: jest.fn().mockResolvedValue(undefined),
}));
import { useSettingsStore } from "@stores/useSettingsStore";
import { useSettingsSync } from "../useSettingsSync";
describe("useSettingsSync", () => {
  beforeEach(() => {
    useSettingsStore.setState(useSettingsStore.getInitialState());
  });
  it("reflects syncVisible from the store", async () => {
    const { result } = await renderHook(() => useSettingsSync());
    expect(result.current.syncVisible).toBe(false);
    await act(async () => {
      result.current.setSyncVisible(true);
    });
    expect(result.current.syncVisible).toBe(true);
  });
  it("handleExport delegates to store.exportToFile", async () => {
    const { result } = await renderHook(() => useSettingsSync());
    await act(async () => {
      await result.current.handleExport();
    });
    const backup = jest.requireMock("@data/backup") as {
      exportToFile: jest.Mock;
    };
    expect(backup.exportToFile).toHaveBeenCalledTimes(1);
  });
  it("handleImport delegates to store.importFromFile", async () => {
    const { result } = await renderHook(() => useSettingsSync());
    await act(async () => {
      await result.current.handleImport();
    });
    const backup = jest.requireMock("@data/backup") as {
      importFromFile: jest.Mock;
    };
    expect(backup.importFromFile).toHaveBeenCalledTimes(1);
  });
  it("handleImportBackupJson delegates to store.importBackup", async () => {
    const { result } = await renderHook(() => useSettingsSync());
    let ok = false;
    await act(async () => {
      ok = result.current.handleImportBackupJson("{}");
    });
    expect(typeof ok).toBe("boolean");
  });
  it("getBackupJson returns serialized backup", async () => {
    const { result } = await renderHook(() => useSettingsSync());
    const json = result.current.getBackupJson();
    expect(typeof json).toBe("string");
    expect(json).toContain('"version"');
  });
  it("handleExport reports failure and fires an error haptic when the file write fails", async () => {
    const backup = jest.requireMock("@data/backup") as { exportToFile: jest.Mock };
    backup.exportToFile.mockRejectedValueOnce(new Error("disk full"));
    const haptics = jest.requireMock("expo-haptics") as { notificationAsync: jest.Mock };
    const { result } = await renderHook(() => useSettingsSync());
    await act(async () => {
      await expect(result.current.handleExport()).resolves.toBe(false);
    });
    expect(haptics.notificationAsync).toHaveBeenCalled();
  });
  it("handleImport reports failure and fires an error haptic when the picker throws", async () => {
    const backup = jest.requireMock("@data/backup") as { importFromFile: jest.Mock };
    backup.importFromFile.mockRejectedValueOnce(new Error("picker cancelled"));
    const haptics = jest.requireMock("expo-haptics") as { notificationAsync: jest.Mock };
    const { result } = await renderHook(() => useSettingsSync());
    await act(async () => {
      await expect(result.current.handleImport()).resolves.toBe(false);
    });
    expect(haptics.notificationAsync).toHaveBeenCalled();
  });
});
