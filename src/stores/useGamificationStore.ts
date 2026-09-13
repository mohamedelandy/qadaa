/** @format */
/**
 * Persisted gamification state: streaks, points, badges, dua/intention dates.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorageAdapter } from "@data/storage/storage";
import { PERSIST_VERSION, migrateGamificationToCurrent } from "./persistMigrations";
import { toLocalISODate, addDays } from "@domain/date";
import { computeStreakState, pruneLoggedDates } from "@domain/streak";
import { checkBadges as domainCheckBadges } from "@domain/badges";
import {
  addPoints as domainAddPoints,
  subtractPoints as domainSubtractPoints,
} from "@domain/points";
import type { PrayerKey } from "./usePrayerStore";
import type { Badge } from "@domain/types";
export interface GamificationState {
  streak: number;
  lastLogDate: string | null;
  /** Monotonic count of distinct days ever logged (never pruned, unlike loggedDates). */
  daysLogged: number;
  loggedDates: string[];
  points: number;
  badges: Badge[];
  graceUsedMonth: string | null;
  lastDuaShownDate: string | null;
  intentionSetDate: string | null;
}
export interface GamificationActions {
  updateStreak: () => void;
  checkBadges: (
    prayers: Record<
      PrayerKey,
      {
        recovered: number;
      }
    >,
    totalMissedDays: number
  ) => Badge[];
  incrementPoints: (amount: number) => void;
  decrementPoints: (amount: number) => void;
  resetLastLogDate: () => void;
  setLastDuaShownDate: (date: string) => void;
  setIntentionSetDate: (date: string) => void;
  getBackupData: () => GamificationBackupData;
  resetAll: () => void;
}
export interface GamificationBackupData {
  streak: number;
  lastLogDate: string | null;
  daysLogged: number;
  loggedDates: string[];
  points: number;
  badges: Badge[];
  graceUsedMonth: string | null;
  lastDuaShownDate: string | null;
  intentionSetDate: string | null;
}
export const useGamificationStore = create<GamificationState & GamificationActions>()(
  persist<GamificationState & GamificationActions, [], [], GamificationState>(
    (set, get) => ({
      streak: 0,
      lastLogDate: null,
      daysLogged: 0,
      loggedDates: [],
      points: 0,
      badges: [],
      graceUsedMonth: null,
      lastDuaShownDate: null,
      intentionSetDate: null,
      updateStreak: () => {
        const state = get();
        const today = toLocalISODate(new Date());
        const yesterday = toLocalISODate(addDays(new Date(), -1));
        const twoDaysAgo = toLocalISODate(addDays(new Date(), -2));
        const currentMonth = today.slice(0, 7);
        const next = computeStreakState({
          currentStreak: state.streak,
          graceUsedMonth: state.graceUsedMonth,
          loggedDates: state.loggedDates,
          lastLogDate: state.lastLogDate,
          today,
          yesterday,
          twoDaysAgo,
          currentMonth,
        });
        // daysLogged is monotonic: bump it only when today is a genuinely new
        // logged day, never on repeated same-day logs (which the pre-prune
        // loggedDates check detects before computeStreakState appends today).
        // Since computeStreakState returns the same exact reference if the date
        // was already included, we can determine inclusion with an O(1) reference check.
        const alreadyLoggedToday = state.loggedDates === next.loggedDates;
        set({
          ...next,
          loggedDates: pruneLoggedDates(next.loggedDates, today),
          daysLogged: alreadyLoggedToday ? state.daysLogged : state.daysLogged + 1,
        });
      },
      checkBadges: (prayers, totalMissedDays) => {
        const state = get();
        const existingIds = new Set(state.badges.map((b) => b.id));
        const now = Date.now();
        const newBadges = domainCheckBadges({
          points: state.points,
          streak: state.streak,
          prayers,
          totalMissedDays,
          existingIds,
          now,
        });
        if (newBadges.length > 0) {
          set({ badges: [...state.badges, ...newBadges] });
        }
        return newBadges;
      },
      incrementPoints: (amount) => {
        set({ points: domainAddPoints(get().points, amount) });
      },
      decrementPoints: (amount) => {
        set({ points: domainSubtractPoints(get().points, amount) });
      },
      resetLastLogDate: () => set({ lastLogDate: null, loggedDates: [], streak: 0 }),
      setLastDuaShownDate: (lastDuaShownDate) => set({ lastDuaShownDate }),
      setIntentionSetDate: (intentionSetDate) => set({ intentionSetDate }),
      resetAll: () => {
        set({
          streak: 0,
          lastLogDate: null,
          daysLogged: 0,
          loggedDates: [],
          points: 0,
          badges: [],
          graceUsedMonth: null,
          lastDuaShownDate: null,
          intentionSetDate: null,
        });
      },
      getBackupData: () => {
        const {
          streak,
          lastLogDate,
          daysLogged,
          loggedDates,
          points,
          badges,
          graceUsedMonth,
          lastDuaShownDate,
          intentionSetDate,
        } = get();
        return {
          streak,
          lastLogDate,
          daysLogged,
          loggedDates,
          points,
          badges,
          graceUsedMonth,
          lastDuaShownDate,
          intentionSetDate,
        };
      },
    }),
    {
      name: "qadaa-gamification-store",
      storage: createJSONStorage(() => asyncStorageAdapter),
      version: PERSIST_VERSION,
      migrate: migrateGamificationToCurrent as unknown as (
        persistedState: unknown,
        version: number
      ) => GamificationState,
      partialize: (state) => ({
        streak: state.streak,
        lastLogDate: state.lastLogDate,
        daysLogged: state.daysLogged,
        loggedDates: state.loggedDates,
        points: state.points,
        badges: state.badges,
        graceUsedMonth: state.graceUsedMonth,
        lastDuaShownDate: state.lastDuaShownDate,
        intentionSetDate: state.intentionSetDate,
      }),
    }
  )
);
