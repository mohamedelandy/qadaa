/** @format */
/**
 * Hook generating an SVG QR code from backup JSON when the QR tab is active.
 */
import { useState, useEffect, useCallback } from "react";
import QRCodeLib from "qrcode";

/**
 * The qrcode package ships no types and its ambient declaration is bypassed by
 * JS resolution, which yields an unresolvable default import under the lint
 * program. Bind it to this explicit contract instead.
 */
interface QRCodeToStringOptions {
  type?: "svg" | "terminal" | "utf8";
  margin?: number;
  width?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}
interface QRCodeClient {
  toString(text: string, options?: QRCodeToStringOptions): Promise<string>;
}

const QRCode: QRCodeClient = QRCodeLib;
export function useSyncQr(
  visible: boolean,
  activeTab: string,
  getJson: () => string,
  colors: {
    text: string;
    card: string;
  }
) {
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(false);
  const generateQr = useCallback(async () => {
    setQrLoading(true);
    setQrError(false);
    setQrSvg(null);
    try {
      const json = getJson();
      if (json.length > 2000) {
        setQrError(true);
        setQrLoading(false);
        return;
      }
      const svg = await QRCode.toString(json, {
        type: "svg",
        margin: 1,
        width: 280,
        color: { dark: colors.text, light: colors.card },
      });
      setQrSvg(svg);
    } catch {
      setQrError(true);
    } finally {
      setQrLoading(false);
    }
  }, [getJson, colors]);
  useEffect(() => {
    if (visible && activeTab === "qr") {
      void generateQr();
    }
  }, [visible, activeTab, generateQr]);
  return { qrSvg, qrLoading, qrError, generateQr };
}
