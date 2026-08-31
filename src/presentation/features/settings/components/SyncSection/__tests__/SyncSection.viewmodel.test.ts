/** @format */
/**
 * Unit tests for the sync view model (copy feedback, import success/error flows).
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
import { useSyncViewModel } from "../SyncSection.viewmodel";
const VALID_BACKUP_JSON = JSON.stringify({
  version: 1,
  wizardComplete: true,
  age: 25,
  pubertyAge: 14,
  periods: [{ type: "missed", years: 1 }],
  totalMissedDays: 365,
  prayers: {
    fajr: { recovered: 0 },
    dhuhr: { recovered: 0 },
    asr: { recovered: 0 },
    maghrib: { recovered: 0 },
    isha: { recovered: 0 },
  },
  todayPrayers: {},
  todayDate: null,
  streak: 5,
  lastLogDate: null,
  loggedDates: [],
  points: 10,
  badges: [],
  language: "ar",
});
describe("useSyncViewModel", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("handleCopy sets copied then clears it (covers copy branch)", async () => {
    const { result } = await renderHook(() => useSyncViewModel(false, jest.fn()));
    await act(async () => {
      await result.current.handleCopy();
    });
    expect(result.current.copied).toBe(true);
    await act(async () => {
      jest.advanceTimersByTime(2500);
    });
    expect(result.current.copied).toBe(false);
  });
  it("handleCopy swallows a failing clipboard write", async () => {
    const backup = jest.requireMock("@data/backup") as { copyToClipboard: jest.Mock };
    backup.copyToClipboard.mockRejectedValueOnce(new Error("clipboard blocked"));
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const { result } = await renderHook(() => useSyncViewModel(false, jest.fn()));
    await act(async () => {
      await result.current.handleCopy();
    });
    expect(warnSpy).toHaveBeenCalled();
    expect(result.current.copied).toBe(false);
    warnSpy.mockRestore();
  });
  it("handleImport sets success when import succeeds and closes after delay", async () => {
    const onClose = jest.fn();
    const { result } = await renderHook(() => useSyncViewModel(false, onClose));
    await act(async () => {
      result.current.setPasteText(VALID_BACKUP_JSON);
    });
    await act(async () => {
      result.current.handleImport();
    });
    expect(result.current.importResult).toBe("success");
    await act(async () => {
      jest.advanceTimersByTime(1200);
    });
    expect(onClose).toHaveBeenCalled();
  });
  it("handleImport sets error when import fails", async () => {
    const { result } = await renderHook(() => useSyncViewModel(false, jest.fn()));
    await act(async () => {
      result.current.setPasteText("   ");
      result.current.handleImport();
    });
    expect(result.current.importResult).toBe("error");
  });
});
