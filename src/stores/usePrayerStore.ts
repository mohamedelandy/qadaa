/** @format */
/**
 * Persisted core state: wizard inputs, per-prayer recovery counts, daily logs.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorageAdapter } from "@data/storage/storage";
import { PERSIST_VERSION, migratePrayerToCurrent } from "./persistMigrations";
import { toLocalISODate } from "@domain/date";
import { calcTotalMissedDays, incrementPrayer } from "@domain/prayers";
import { PRAYER_KEYS, type PrayerKey, type PrayerPeriod, type Badge } from "@domain/types";
export { PRAYER_KEYS, type PrayerKey, type PrayerPeriod, type Badge };
const initialPrayers = () =>
  Object.fromEntries(PRAYER_KEYS.map((k) => [k, { recovered: 0 }])) as Record<
    PrayerKey,
    {
      recovered: number;
    }
  >;
export interface PrayerState {
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
  totalMissedDays: number;
  age: number;
  pubertyAge: number;
  periods: PrayerPeriod[];
}
export interface PrayerActions {
  completeWizard: (age: number, pubertyAge: number, periods: PrayerPeriod[]) => void;
  logPrayer: (prayer: PrayerKey) => number;
  logPrayerBatch: (prayer: PrayerKey, count: number) => number;
  logFullDay: () => number;
  undoPrayer: (prayer: PrayerKey) => number;
  refreshDay: () => boolean;
  getBackupData: () => PrayerBackupData;
  resetAll: () => void;
}
export type PrayerBackupData = Pick<
  PrayerState,
  | "age"
  | "pubertyAge"
  | "periods"
  | "totalMissedDays"
  | "prayers"
  | "todayPrayers"
  | "todayLogPoints"
  | "todayUnits"
  | "todayDate"
>;
const POINTS_PER_PRAYER = 10;
const FULL_DAY_BONUS_PER_PRAYER = 20;
function resetTodayIfNeeded(
  todayDate: string | null
): Partial<Pick<PrayerState, "todayDate" | "todayPrayers" | "todayLogPoints" | "todayUnits">> {
  const today = toLocalISODate(new Date());
  if (todayDate !== today) {
    return { todayPrayers: {}, todayLogPoints: {}, todayUnits: {}, todayDate: today };
  }
  return {};
}
export const usePrayerStore = create<PrayerState & PrayerActions>()(
  persist<PrayerState & PrayerActions, [], [], PrayerState>(
    (set, get) => ({
      prayers: initialPrayers(),
      todayPrayers: {},
      todayLogPoints: {},
      todayUnits: {},
      todayDate: null,
      totalMissedDays: 0,
      age: 0,
      pubertyAge: 0,
      periods: [],
      completeWizard: (age, pubertyAge, periods) => {
        set({
          age,
          pubertyAge,
          periods,
          totalMissedDays: calcTotalMissedDays(periods),
        });
      },
      logPrayer: (prayer) => {
        const state = get();
        const todayReset = resetTodayIfNeeded(state.todayDate);
        const prayers = { ...state.prayers };
        if (prayers[prayer].recovered >= state.totalMissedDays) {
          if (todayReset.todayDate) set(todayReset);
          return 0;
        }
        prayers[prayer] = { recovered: prayers[prayer].recovered + 1 };
        const todayPrayers = {
          ...(todayReset.todayPrayers ?? state.todayPrayers),
          [prayer]: true as const,
        };
        const base = todayReset.todayLogPoints ?? state.todayLogPoints;
        const todayLogPoints = { ...base, [prayer]: (base[prayer] ?? 0) + POINTS_PER_PRAYER };
        const baseUnits = todayReset.todayUnits ?? state.todayUnits;
        const todayUnits = {
          ...baseUnits,
          [prayer]: [...(baseUnits[prayer] ?? []), POINTS_PER_PRAYER],
        };
        set({ ...todayReset, prayers, todayPrayers, todayLogPoints, todayUnits });
        return POINTS_PER_PRAYER;
      },
      logPrayerBatch: (prayer, count) => {
        if (count <= 0) return 0;
        const state = get();
        const todayReset = resetTodayIfNeeded(state.todayDate);
        const prayers = { ...state.prayers };
        const { recovered, added } = incrementPrayer(
          prayers[prayer].recovered,
          state.totalMissedDays,
          count
        );
        if (added <= 0) {
          if (todayReset.todayDate) set(todayReset);
          return 0;
        }
        prayers[prayer] = { recovered };
        const todayPrayers = {
          ...(todayReset.todayPrayers ?? state.todayPrayers),
          [prayer]: true as const,
        };
        const base = todayReset.todayLogPoints ?? state.todayLogPoints;
        const todayLogPoints = {
          ...base,
          [prayer]: (base[prayer] ?? 0) + added * POINTS_PER_PRAYER,
        };
        const baseUnits = todayReset.todayUnits ?? state.todayUnits;
        const todayUnits = {
          ...baseUnits,
          [prayer]: [
            ...(baseUnits[prayer] ?? []),
            ...Array.from({ length: added }, () => POINTS_PER_PRAYER),
          ],
        };
        set({ ...todayReset, prayers, todayPrayers, todayLogPoints, todayUnits });
        return added * POINTS_PER_PRAYER;
      },
      logFullDay: () => {
        const state = get();
        const todayReset = resetTodayIfNeeded(state.todayDate);
        const prayers = { ...state.prayers };
        const todayLogPoints = { ...(todayReset.todayLogPoints ?? state.todayLogPoints) };
        const todayUnits = { ...(todayReset.todayUnits ?? state.todayUnits) };
        const todayPrayers: Partial<Record<PrayerKey, true>> = {};
        let loggedCount = 0;
        PRAYER_KEYS.forEach((k) => {
          if ((todayReset.todayPrayers ?? state.todayPrayers)[k]) {
            todayPrayers[k] = true;
            return;
          }
          const { recovered, added } = incrementPrayer(
            prayers[k].recovered,
            state.totalMissedDays,
            1
          );
          if (added > 0) {
            prayers[k] = { recovered };
            todayLogPoints[k] = (todayLogPoints[k] ?? 0) + FULL_DAY_BONUS_PER_PRAYER;
            todayUnits[k] = [...(todayUnits[k] ?? []), FULL_DAY_BONUS_PER_PRAYER];
            loggedCount++;
            todayPrayers[k] = true;
          }
        });
        set({ ...todayReset, prayers, todayPrayers, todayLogPoints, todayUnits });
        return loggedCount * FULL_DAY_BONUS_PER_PRAYER;
      },
      undoPrayer: (prayer) => {
        const state = get();
        const todayReset = resetTodayIfNeeded(state.todayDate);
        const effectiveToday = todayReset.todayPrayers ?? state.todayPrayers;
        if (!effectiveToday[prayer]) {
          if (todayReset.todayDate) set(todayReset);
          return 0;
        }
        const prayers = { ...state.prayers };
        if (prayers[prayer].recovered <= 0) return 0;
        prayers[prayer] = { recovered: prayers[prayer].recovered - 1 };
        const baseUnits = todayReset.todayUnits ?? state.todayUnits;
        const stack = baseUnits[prayer] ?? [];
        const base = todayReset.todayLogPoints ?? state.todayLogPoints;
        const todayLogPoints = { ...base };
        const todayPrayers = { ...effectiveToday };
        const todayUnits = { ...baseUnits };
        let refund: number;
        if (stack.length > 0) {
          refund = stack[stack.length - 1] ?? 0;
          const remaining = stack.slice(0, -1);
          if (remaining.length > 0) {
            todayUnits[prayer] = remaining;
            todayLogPoints[prayer] = (todayLogPoints[prayer] ?? 0) - refund;
          } else {
            delete todayUnits[prayer];
            delete todayLogPoints[prayer];
            delete todayPrayers[prayer];
          }
        } else {
          // Legacy state restored from a backup without unit stacks: revert
          // the prayer's whole day entry so points stay consistent.
          refund = todayLogPoints[prayer] ?? 0;
          delete todayLogPoints[prayer];
          delete todayUnits[prayer];
          delete todayPrayers[prayer];
        }
        set({ ...todayReset, prayers, todayPrayers, todayLogPoints, todayUnits });
        return refund;
      },
      refreshDay: () => {
        const { todayDate } = get();
        const reset = resetTodayIfNeeded(todayDate);
        if (!reset.todayDate) return false;
        set(reset);
        // First launch (stored date null) initializes today's flags but is NOT
        // a day rollover: nothing has been logged yet, so the streak must not
        // be bumped (updateStreak would fabricate streak=1 / loggedDates=[today]).
        return todayDate !== null;
      },
      getBackupData: () => {
        const {
          age,
          pubertyAge,
          periods,
          totalMissedDays,
          prayers,
          todayPrayers,
          todayLogPoints,
          todayUnits,
          todayDate,
        } = get();
        return {
          age,
          pubertyAge,
          periods,
          totalMissedDays,
          prayers,
          todayPrayers,
          todayLogPoints,
          todayUnits,
          todayDate,
        };
      },
      resetAll: () => {
        set({
          prayers: initialPrayers(),
          todayPrayers: {},
          todayLogPoints: {},
          todayUnits: {},
          todayDate: null,
          totalMissedDays: 0,
          age: 0,
          pubertyAge: 0,
          periods: [],
        });
      },
    }),
    {
      name: "qadaa-prayer-store",
      storage: createJSONStorage(() => asyncStorageAdapter),
      version: PERSIST_VERSION,
      migrate: migratePrayerToCurrent as unknown as (
        persistedState: unknown,
        version: number
      ) => PrayerState,
      partialize: (state) => ({
        prayers: state.prayers,
        todayPrayers: state.todayPrayers,
        todayLogPoints: state.todayLogPoints,
        todayUnits: state.todayUnits,
        todayDate: state.todayDate,
        totalMissedDays: state.totalMissedDays,
        age: state.age,
        pubertyAge: state.pubertyAge,
        periods: state.periods,
      }),
    }
  )
);
