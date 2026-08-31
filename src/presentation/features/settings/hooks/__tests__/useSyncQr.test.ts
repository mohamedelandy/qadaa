/** @format */
/**
 * Unit tests for QR generation: normal payload SVG, oversized-payload error, and encode failure.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("qrcode", () => ({
  toString: jest.fn().mockResolvedValue("<svg>qr</svg>"),
}));
import QRCode from "qrcode";
import { useSyncQr } from "../useSyncQr";
const colors = { text: "#000", card: "#fff" };
describe("useSyncQr", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("generateQr produces an SVG for a normal payload", async () => {
    const { result } = await renderHook(() => useSyncQr(false, "qr", () => "backup-json", colors));
    await act(async () => {
      result.current.generateQr();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(QRCode.toString).toHaveBeenCalledWith("backup-json", expect.any(Object));
    expect(result.current.qrSvg).toBe("<svg>qr</svg>");
    expect(result.current.qrError).toBe(false);
  });
  it("generateQr sets qrError for an oversized payload", async () => {
    const longJson = "x".repeat(2500);
    const { result } = await renderHook(() => useSyncQr(false, "qr", () => longJson, colors));
    await act(async () => {
      result.current.generateQr();
      await Promise.resolve();
    });
    expect(result.current.qrError).toBe(true);
    expect(result.current.qrSvg).toBeNull();
    expect(QRCode.toString).not.toHaveBeenCalled();
  });
  it("generateQr sets qrError when QRCode throws (covers catch block)", async () => {
    (QRCode.toString as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    const { result } = await renderHook(() => useSyncQr(false, "qr", () => "backup-json", colors));
    await act(async () => {
      result.current.generateQr();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.qrError).toBe(true);
  });
});
