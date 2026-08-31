/** @format */
/**
 * Unit tests for useSyncActions: backup JSON export, clipboard copy, and empty-import rejection.
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
import { useSyncActions } from "../useSyncActions";
describe("useSyncActions", () => {
  beforeEach(() => {
    useSettingsStore.setState(useSettingsStore.getInitialState());
  });
  it("getJson returns serialized backup", async () => {
    const { result } = await renderHook(() => useSyncActions());
    const json = result.current.getJson();
    expect(json).toContain('"version"');
  });
  it("handleCopy delegates to store.copyBackupToClipboard", async () => {
    const { result } = await renderHook(() => useSyncActions());
    await act(async () => {
      await result.current.handleCopy();
    });
    const backup = jest.requireMock("@data/backup") as {
      copyToClipboard: jest.Mock;
    };
    expect(backup.copyToClipboard).toHaveBeenCalledTimes(1);
  });
  it("handleImport returns false for empty input", async () => {
    const { result } = await renderHook(() => useSyncActions());
    let ok = true;
    await act(async () => {
      ok = result.current.handleImport("   ");
    });
    expect(ok).toBe(false);
  });
  it("handleImport delegates non-empty input to store.importBackup", async () => {
    const { result } = await renderHook(() => useSyncActions());
    await act(async () => {
      result.current.handleImport("{}");
    });
    expect(useSettingsStore.getState().language).toBe("ar");
  });
});
