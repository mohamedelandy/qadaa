/** @format */
/**
 * Null-rendering bridge mounting the notification deep-link hook inside
 * the router context (app/_layout).
 */
import { useNotificationDeepLink } from "./useNotificationDeepLink";
export function NotificationTapBridge({ active }: { active: boolean }) {
  useNotificationDeepLink(active);
  return null;
}
