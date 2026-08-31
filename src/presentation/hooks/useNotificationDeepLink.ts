/** @format */
/**
 * Bridges notification taps to in-app navigation.
 *
 * Warm/background taps arrive through the response listener; a cold start
 * from a tap surfaces via getLastNotificationResponse exactly once,
 * handled with `replace` so no stale entry sits under the dashboard tab.
 */
import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

export const REMINDER_ROUTE = "/(tabs)/dashboard" as const;

export function reminderRouteFor(notificationResponse: unknown): typeof REMINDER_ROUTE | null {
  return notificationResponse ? REMINDER_ROUTE : null;
}

export function useNotificationDeepLink(enabled: boolean): void {
  const router = useRouter();
  useEffect(() => {
    if (!enabled) return;
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      router.navigate(REMINDER_ROUTE);
    });
    const route = reminderRouteFor(Notifications.getLastNotificationResponse());
    if (route) {
      router.replace(route);
    }
    return () => {
      subscription.remove();
    };
  }, [enabled, router]);
}
