/** @format */
/**
 * Bridges stored 24h notification time with 12-hour AM/PM picker values and schedules it.
 */
import { useCallback } from "react";
import { useSettingsStore } from "@stores/useSettingsStore";
export function useSettingsNotification() {
  const notificationTime = useSettingsStore((s) => s.notificationTime);
  const notificationPermission = useSettingsStore((s) => s.notificationPermission);
  const setNotificationTimeStore = useSettingsStore((s) => s.setNotificationTime);
  const scheduleNotification = useSettingsStore((s) => s.scheduleNotification);
  let notificationHour = 9;
  let notificationMinute = 0;
  let notificationAmPm: "AM" | "PM" = "AM";
  if (notificationTime) {
    const parts = notificationTime.split(":");
    const h = parseInt(parts[0] ?? "9", 10);
    const m = parseInt(parts[1] ?? "0", 10);
    notificationMinute = m;
    if (h === 0) {
      notificationHour = 12;
      notificationAmPm = "AM";
    } else if (h < 12) {
      notificationHour = h;
      notificationAmPm = "AM";
    } else if (h === 12) {
      notificationHour = 12;
      notificationAmPm = "PM";
    } else {
      notificationHour = h - 12;
      notificationAmPm = "PM";
    }
  }
  const setNotificationTime = useCallback(
    async (hour12: number, minute: number, amPm: "AM" | "PM") => {
      let hour24 = hour12;
      if (amPm === "AM" && hour12 === 12) hour24 = 0;
      if (amPm === "PM" && hour12 !== 12) hour24 = hour12 + 12;
      const timeStr = `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const scheduled = await scheduleNotification(hour24, minute);
      if (scheduled) {
        setNotificationTimeStore(timeStr);
        return true;
      }
      return false;
    },
    [scheduleNotification, setNotificationTimeStore]
  );
  return {
    notificationHour,
    notificationMinute,
    notificationAmPm,
    notificationPermission,
    setNotificationTime,
  };
}
