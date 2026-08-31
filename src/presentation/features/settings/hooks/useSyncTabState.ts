/** @format */
/**
 * Local sync-sheet state: active qr/clipboard/import tab, copied flag, paste text, result; resets on close.
 */
import { useState, useEffect } from "react";
type Tab = "qr" | "clipboard" | "import";
export function useSyncTabState(visible: boolean) {
  const [activeTab, setActiveTab] = useState<Tab>("qr");
  const [copied, setCopied] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [importResult, setImportResult] = useState<"idle" | "success" | "error">("idle");
  useEffect(() => {
    if (!visible) {
      setActiveTab("qr");
      setCopied(false);
      setPasteText("");
      setImportResult("idle");
    }
  }, [visible]);
  return {
    activeTab,
    setActiveTab,
    copied,
    setCopied,
    pasteText,
    setPasteText,
    importResult,
    setImportResult,
  };
}
