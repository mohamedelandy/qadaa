/** @format */
/**
 * Daily reminder scheduling, cancellation, and permissions via expo-notifications.
 */
import {
  scheduleNotificationAsync,
  cancelAllScheduledNotificationsAsync,
  requestPermissionsAsync,
  SchedulableTriggerInputTypes,
} from "expo-notifications";
import i18n from "@data/i18n/i18n";
export async function scheduleDailyNotification(hour: number, minute: number) {
  await cancelAllNotifications();
  return scheduleNotificationAsync({
    content: { title: i18n.t("app.name"), body: i18n.t("notifications.reminderBody") },
    trigger: { type: SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
}
export async function cancelAllNotifications() {
  await cancelAllScheduledNotificationsAsync();
}
export async function requestNotificationPermissions() {
  const { granted } = await requestPermissionsAsync();
  return { granted };
}
