/** @format */
/**
 * View model hook for the batch-log popover: preset/custom count validation and keyboard dismiss.
 */
import { useState, useMemo } from "react";
import { Keyboard } from "react-native";
import { useUI } from "@hooks/useUI";
import { createBatchLogPopoverStyles, createBatchLogSheetStyles } from "./BatchLogPopover.styles";
import type { PrayerKey } from "@domain/types";
interface BatchLogPopoverProps {
  prayerKey: PrayerKey;
  maxRemaining: number;
  onBatch: (prayer: PrayerKey, count: number) => void;
  onClose: () => void;
}
export function useBatchLogPopoverViewModel(props: BatchLogPopoverProps) {
  const { prayerKey, maxRemaining, onBatch, onClose } = props;
  const { t, colors, typography, borderRadius: br } = useUI();
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const handlePreset = (n: number) => {
    if (n <= maxRemaining) {
      onBatch(prayerKey, n);
      onClose();
    }
  };
  const handleCustomConfirm = () => {
    const n = parseInt(customValue, 10);
    if (n > 0 && n <= maxRemaining) {
      onBatch(prayerKey, n);
      onClose();
    }
  };
  const styles = useMemo(
    () => createBatchLogPopoverStyles({ colors, typography, borderRadius: br }),
    [colors, typography, br]
  );
  const sheetStyles = useMemo(
    () => createBatchLogSheetStyles({ colors, typography, borderRadius: br }),
    [colors, typography, br]
  );
  return {
    t,
    styles,
    sheetStyles,
    placeholderColor: colors.textPlaceholder,
    customMode,
    openCustomMode: () => setCustomMode(true),
    cancelCustomMode: () => setCustomMode(false),
    customValue,
    setCustomValue,
    maxRemaining,
    handlePreset,
    handleCustomConfirm,
    dismissKeyboard: () => {
      void Keyboard.dismiss();
    },
  };
}
