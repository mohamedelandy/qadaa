/** @format */
/**
 * Unit tests for useSyncTabState: QR default tab and state reset when hidden.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useSyncTabState } from "../useSyncTabState";
describe("useSyncTabState", () => {
  it("defaults to the qr tab and idle import result", async () => {
    const { result } = await renderHook(() => useSyncTabState(true));
    expect(result.current.activeTab).toBe("qr");
    expect(result.current.importResult).toBe("idle");
    expect(result.current.copied).toBe(false);
  });
  it("resets state when hidden", async () => {
    const { result, rerender } = await renderHook((visible: boolean) => useSyncTabState(visible), {
      initialProps: true,
    });
    await act(async () => {
      result.current.setActiveTab("clipboard");
      result.current.setCopied(true);
      result.current.setImportResult("success");
    });
    expect(result.current.activeTab).toBe("clipboard");
    await rerender(false);
    expect(result.current.activeTab).toBe("qr");
    expect(result.current.copied).toBe(false);
    expect(result.current.importResult).toBe("idle");
  });
});
