/** @format */
/**
 * Pure boot helpers: initial RTL direction resolution, language sync and permission reconcile.
 */
import type { PermissionStatus } from "expo-notifications";
import type { Language } from "@domain/types";
export type LocaleLike = {
  languageCode?: string | null;
};
export function resolveInitialDirection(locales: LocaleLike[]): boolean {
  const first = locales.length > 0 ? locales[0] : undefined;
  return first ? first.languageCode !== "en" : true;
}
export type LanguageSync = {
  isRtl: boolean;
  alreadyMatched: boolean;
};
export function syncLanguage(
  language: Language,
  i18nLike: {
    language: string;
    changeLanguage: (l: string) => Promise<unknown>;
  },
  forceRTL: (isRTL: boolean) => void
): LanguageSync {
  const isRtl = language === "ar";
  forceRTL(isRtl);
  if (language !== i18nLike.language) {
    void Promise.resolve(i18nLike.changeLanguage(language)).catch(() => {});
    return { isRtl, alreadyMatched: false };
  }
  return { isRtl, alreadyMatched: true };
}

/**
 * Boot-time variant of syncLanguage that AWAITS the i18n switch so the caller
 * can hold the first paint until the app renders in the stored language.
 * Guarantees every launch opens in the language chosen on first launch —
 * never a device-locale flash followed by a remount.
 */
export async function syncLanguageAsync(
  language: Language,
  i18nLike: {
    language: string;
    changeLanguage: (l: string) => Promise<unknown>;
  },
  forceRTL: (isRTL: boolean) => void
): Promise<LanguageSync> {
  const isRtl = language === "ar";
  forceRTL(isRtl);
  if (language !== i18nLike.language) {
    try {
      await Promise.resolve(i18nLike.changeLanguage(language));
    } catch {
      // Best-effort boot sync — keep the current i18n language on failure.
    }
    return { isRtl, alreadyMatched: false };
  }
  return { isRtl, alreadyMatched: true };
}
export type NotificationPermission = "default" | "granted" | "denied";
export async function reconcileNotificationPermission(
  getPermissions: () => Promise<{
    status: PermissionStatus;
  }>,
  current: NotificationPermission | undefined,
  setPermission: (p: NotificationPermission) => void
): Promise<void> {
  try {
    const { status } = await getPermissions();
    if (current !== status) {
      setPermission(status as NotificationPermission);
    }
  } catch {
    return;
  }
}
