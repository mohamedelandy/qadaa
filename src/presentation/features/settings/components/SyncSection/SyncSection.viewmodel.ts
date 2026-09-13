/** @format */
/**
 * View model for the sync sheet: tabs, QR generation, copy and import actions.
 */
import { useEffect, useMemo, useRef } from "react";
import { useUI } from "@hooks/useUI";
import { useSyncTabState } from "../../hooks/useSyncTabState";
import { useSyncQr } from "../../hooks/useSyncQr";
import { useSyncActions } from "../../hooks/useSyncActions";
import { useSyncStyles } from "../../hooks/useSyncStyles";

const COPIED_RESET_DELAY_MS = 2500;
const CLOSE_DELAY_MS = 1200;

export function useSyncViewModel(visible: boolean, onClose: () => void) {
  const { t, colors } = useUI();
  const tabState = useSyncTabState(visible);
  const { getJson, handleCopy: rawCopy, handleImport: rawImport } = useSyncActions();
  const { qrSvg, qrLoading, qrError, generateQr } = useSyncQr(
    visible,
    tabState.activeTab,
    getJson,
    colors
  );
  const { styles } = useSyncStyles();
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);
  const tabs = useMemo(
    () => [
      { key: "qr" as const, label: t("share.tabQr") },
      { key: "clipboard" as const, label: t("share.tabClipboard") },
      { key: "import" as const, label: t("share.tabImport") },
    ],
    [t]
  );
  const handleCopy = async () => {
    try {
      await rawCopy();
    } catch {
      if (__DEV__) {
        console.warn("clipboard copy failed");
      }
      return;
    }
    tabState.setCopied(true);
    timers.current.push(setTimeout(() => tabState.setCopied(false), COPIED_RESET_DELAY_MS));
  };
  const handleImport = () => {
    const ok = rawImport(tabState.pasteText);
    if (ok) {
      tabState.setImportResult("success");
      timers.current.push(setTimeout(() => onClose(), CLOSE_DELAY_MS));
    } else {
      tabState.setImportResult("error");
    }
  };
  return {
    t,
    styles,
    activeTab: tabState.activeTab,
    setActiveTab: tabState.setActiveTab,
    copied: tabState.copied,
    pasteText: tabState.pasteText,
    setPasteText: tabState.setPasteText,
    importResult: tabState.importResult,
    qrSvg,
    qrLoading,
    qrError,
    generateQr,
    handleCopy,
    handleImport,
    getJson,
    tabs,
  };
}
