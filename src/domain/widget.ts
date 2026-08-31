/** @format */
/**
 * Builds versioned widget payload (totals, streak, rotating hadith) for native home-screen widget.
 */
import { dayOfYear } from "@domain/date";
import { PRAYER_KEYS, type PrayerKey, type Language } from "@domain/types";
export type WidgetLanguage = Language;
export interface WidgetPrayerRow {
  key: PrayerKey;
  recovered: number;
  target: number;
}
export interface WidgetPayloadInput {
  prayers: Record<
    PrayerKey,
    {
      recovered: number;
    }
  >;
  todayPrayers: Partial<Record<PrayerKey, true>>;
  totalMissedDays: number;
  streak: number;
  language: WidgetLanguage;
  hadiths: string[];
}
export interface WidgetPayload {
  version: 1;
  lang: WidgetLanguage;
  totalRecovered: number;
  totalTarget: number;
  recoveredToday: number;
  todayComplete: boolean;
  streak: number;
  hadith: string;
  prayers: WidgetPrayerRow[];
}
export function buildWidgetPayload(input: WidgetPayloadInput): WidgetPayload {
  const { prayers, todayPrayers, totalMissedDays, streak, language, hadiths } = input;
  const totalRecovered = PRAYER_KEYS.reduce((sum, key) => sum + prayers[key].recovered, 0);
  const recoveredToday = Object.keys(todayPrayers).length;
  const todayComplete = PRAYER_KEYS.every((key) => todayPrayers[key] === true);
  const hadith = hadiths.length > 0 ? (hadiths[dayOfYear(new Date()) % hadiths.length] ?? "") : "";
  const prayerRows: WidgetPrayerRow[] = PRAYER_KEYS.map((key) => ({
    key,
    recovered: prayers[key].recovered,
    target: totalMissedDays,
  }));
  return {
    version: 1,
    lang: language,
    totalRecovered,
    totalTarget: totalMissedDays * PRAYER_KEYS.length,
    recoveredToday,
    todayComplete,
    streak,
    hadith,
    prayers: prayerRows,
  };
}
