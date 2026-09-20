/** @format */
/**
 * View model for the notification time picker with hour cycling, save, and denial error.
 */
import { useState, useEffect, useMemo } from "react";
import * as Haptics from "expo-haptics";
import { useUI } from "@hooks/useUI";
import { useTimeout } from "@hooks/useTimeout";
import { createNotificationPickerStyles } from "./NotificationPicker.styles";
interface NotificationPickerProps {
  currentHour: number;
  currentMinute: number;
  currentAmPm: "AM" | "PM";
  onSave: (hour: number, minute: number, amPm: "AM" | "PM") => Promise<boolean>;
}
const MINUTE_OPTIONS = ["00", "15", "30", "45"] as const;
export function useNotificationPickerViewModel(props: NotificationPickerProps) {
  const { currentHour, currentMinute, currentAmPm, onSave } = props;
  const { t, isRTL, colors, typography, borderRadius: br } = useUI();
  const [hour, setHour] = useState(currentHour);
  const [minute, setMinute] = useState(currentMinute);
  const [amPm, setAmPm] = useState(currentAmPm);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeout = useTimeout();
  useEffect(() => {
    setHour(currentHour);
    setMinute(currentMinute);
    setAmPm(currentAmPm);
  }, [currentHour, currentMinute, currentAmPm]);
  const cycleHour = (dir: -1 | 1) => {
    setHour((prev) => {
      let next = prev + dir;
      if (next < 1) next = 12;
      if (next > 12) next = 1;
      return next;
    });
  };
  const handleSave = async () => {
    let granted: boolean;
    try {
      granted = await onSave(hour, minute, amPm);
    } catch {
      if (__DEV__) {
        console.warn("notification save failed");
      }
      return;
    }
    if (granted) {
      void Haptics.selectionAsync();
      setSaved(true);
      timeout.set(() => setSaved(false), 2000);
    } else {
      setError(t("settings.notificationDenied"));
    }
  };
  const styles = useMemo(
    () => createNotificationPickerStyles({ colors, typography, borderRadius: br }),
    [colors, typography, br]
  );
  return {
    t,
    isRTL,
    styles,
    hour,
    minute,
    amPm,
    setMinute,
    setAmPm,
    saved,
    error,
    cycleHour,
    handleSave,
    MINUTE_OPTIONS,
  };
}
