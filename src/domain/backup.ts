/** @format */
/**
 * Zod schemas plus typed interface validating full app-state backup export/import payloads.
 */
import { z } from "zod";
import type { PrayerKey, PrayerPeriod, Badge, Language } from "./types";
import { PRAYER_KEYS } from "./types";
export const PrayerPeriodSchema = z.object({
  type: z.enum(["missed", "regular"]),
  years: z.number().nonnegative(),
});
export const BadgeSchema = z.object({
  id: z.string(),
  unlockedAt: z.number(),
});
const MAX_BACKUP_JSON_CHARS = 250_000;

export const BackupDataSchema = z.object({
  version: z.literal(1),
  wizardComplete: z.boolean(),
  age: z.number().nonnegative(),
  pubertyAge: z.number().nonnegative(),
  periods: z.array(PrayerPeriodSchema),
  totalMissedDays: z.number().nonnegative(),
  prayers: z
    .record(
      z.string(),
      z.object({
        recovered: z.number().nonnegative(),
      })
    )
    .refine(
      (
        prayers
      ): prayers is Record<
        PrayerKey,
        {
          recovered: number;
        }
      > => PRAYER_KEYS.every((k) => k in prayers && typeof prayers[k]?.recovered === "number"),
      { message: "Must contain all 5 prayer keys" }
    ),
  todayPrayers: z.record(z.string(), z.literal(true).optional()).default({}),
  todayLogPoints: z.record(z.string(), z.number()).default({}),
  todayUnits: z.record(z.string(), z.array(z.number())).default({}),
  todayDate: z.string().nullable().default(null),
  streak: z.number().nonnegative(),
  lastLogDate: z.string().nullable(),
  daysLogged: z.number().nonnegative().default(0),
  loggedDates: z.array(z.string()),
  points: z.number().nonnegative(),
  badges: z.array(BadgeSchema),
  language: z.enum(["ar", "en"]),
  notificationTime: z.string().nullable().default(null),
  notificationPermission: z.enum(["default", "granted", "denied"]).default("default"),
  graceUsedMonth: z.string().nullable().default(null),
  lastDuaShownDate: z.string().nullable().default(null),
  intentionSetDate: z.string().nullable().default(null),
  dailyTarget: z.number().default(5),
});
export interface BackupData {
  version: number;
  wizardComplete: boolean;
  age: number;
  pubertyAge: number;
  periods: PrayerPeriod[];
  totalMissedDays: number;
  prayers: Record<
    PrayerKey,
    {
      recovered: number;
    }
  >;
  todayPrayers: Partial<Record<PrayerKey, true>>;
  todayLogPoints: Partial<Record<PrayerKey, number>>;
  todayUnits: Partial<Record<PrayerKey, number[]>>;
  todayDate: string | null;
  streak: number;
  lastLogDate: string | null;
  daysLogged: number;
  loggedDates: string[];
  points: number;
  badges: Badge[];
  language: Language;
  notificationTime: string | null;
  notificationPermission: "default" | "granted" | "denied";
  graceUsedMonth: string | null;
  lastDuaShownDate: string | null;
  intentionSetDate: string | null;
  dailyTarget: number;
}
export function generateBackupJson(state: BackupData): string {
  return JSON.stringify({ ...state, version: 1 });
}
export function parseBackupJson(json: string): BackupData | null {
  if (json.length > MAX_BACKUP_JSON_CHARS) return null;
  try {
    const data = JSON.parse(json);
    const parsed = BackupDataSchema.safeParse(data);
    if (!parsed.success) return null;
    return parsed.data;
  } catch {
    return null;
  }
}
