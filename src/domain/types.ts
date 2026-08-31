/** @format */
/**
 * Core domain types: prayer keys, periods, badges, and language.
 */
export type Language = "ar" | "en";
export const SUPPORTED_LANGUAGES: readonly Language[] = ["ar", "en"];
export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export const PRAYER_KEYS: readonly PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
export interface PrayerPeriod {
  type: "missed" | "regular";
  years: number;
}
export interface Badge {
  id: string;
  unlockedAt: number;
}
