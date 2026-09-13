/** @format */
/**
 * Persisted settings plus orchestration of backup, notifications, and language.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorageAdapter } from "@data/storage/storage";
import { PERSIST_VERSION, migrateToCurrent } from "./persistMigrations";
import i18n from "@data/i18n/i18n";
import type { Language } from "@domain/types";
// OWNERSHIP: Settings orchestrates backup import/export across sibling stores
// (prayer, gamification, app) via getState()/setState(). No reverse imports
// exist — prayer/gamification/app never import settings — so no cycles.
// This coupling is intentional: backup restore is a top-level concern.
import { usePrayerStore } from "./usePrayerStore";
import { useGamificationStore } from "./useGamificationStore";
import { useAppStore } from "./useAppStore";
import { generateBackupJson, parseBackupJson } from "@domain/backup";
import {
  exportToFile as backupExportToFile,
  importFromFile as backupImportFromFile,
  copyToClipboard as backupCopyToClipboard,
} from "@data/backup";
import { scheduleDailyNotification, requestNotificationPermissions } from "@data/notifications";
import { Logger } from "@services/logger";
import type { BackupData } from "@domain/backup";
export interface SettingsState {
  language: Language;
  dailyTarget: number;
  notificationTime: string | null;
  notificationPermission: "default" | "granted" | "denied";
  syncVisible?: boolean;
}
export interface SettingsActions {
  setLanguage: (lang: Language) => void;
  setDailyTarget: (n: number) => void;
  setNotificationTime: (time: string | null) => void;
  setNotificationPermission: (p: "default" | "granted" | "denied") => void;
  setSyncVisible: (v: boolean) => void;
  resetAll: () => void;
  getBackupData: () => BackupData;
  importBackup: (json: string) => boolean;
  exportToFile: () => Promise<void>;
  importFromFile: () => Promise<boolean>;
  scheduleNotification: (hour: number, minute: number) => Promise<boolean>;
  copyBackupToClipboard: () => Promise<void>;
}
const initialState: SettingsState = {
  language: "ar",
  dailyTarget: 5,
  notificationTime: null,
  notificationPermission: "default",
  syncVisible: false,
};
// True when the settings store rehydrated ACTUAL persisted data. An empty
// read means this is the app's first-ever launch (or the stored blob is
// unusable) — see the onRehydrateStorage lock-in below.
let settingsRehydratedFromStorage = false;
const settingsStorage = createJSONStorage<SettingsState>(() => ({
  getItem: async (name: string) => {
    const raw = await asyncStorageAdapter.getItem(name);
    if (raw != null) settingsRehydratedFromStorage = true;
    return raw;
  },
  setItem: (name: string, value: string) => asyncStorageAdapter.setItem(name, value),
  removeItem: (name: string) => asyncStorageAdapter.removeItem(name),
}));
export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist<SettingsState & SettingsActions, [], [], SettingsState>(
    (set, get) => ({
      ...initialState,
      setLanguage: (language) => {
        set({ language });
        void Promise.resolve(i18n.changeLanguage(language)).catch(() => {});
      },
      setDailyTarget: (dailyTarget) => set({ dailyTarget }),
      setNotificationTime: (notificationTime) => set({ notificationTime }),
      setNotificationPermission: (notificationPermission) => set({ notificationPermission }),
      setSyncVisible: (syncVisible) => set({ syncVisible }),
      resetAll: () => {
        const currentLanguage = get().language;
        set({ ...initialState, language: currentLanguage });
      },
      getBackupData: () => {
        const state = get();
        const prayerState = usePrayerStore.getState();
        const gamificationState = useGamificationStore.getState();
        const appState = useAppStore.getState();
        return {
          version: 1,
          wizardComplete: appState.wizardComplete,
          age: prayerState.age,
          pubertyAge: prayerState.pubertyAge,
          periods: prayerState.periods,
          totalMissedDays: prayerState.totalMissedDays,
          prayers: prayerState.prayers,
          todayPrayers: prayerState.todayPrayers,
          todayLogPoints: prayerState.todayLogPoints,
          todayUnits: prayerState.todayUnits,
          todayDate: prayerState.todayDate,
          streak: gamificationState.streak,
          lastLogDate: gamificationState.lastLogDate,
          daysLogged: gamificationState.daysLogged,
          loggedDates: gamificationState.loggedDates,
          points: gamificationState.points,
          badges: gamificationState.badges,
          language: state.language,
          notificationTime: state.notificationTime,
          notificationPermission: state.notificationPermission,
          graceUsedMonth: gamificationState.graceUsedMonth,
          lastDuaShownDate: gamificationState.lastDuaShownDate,
          intentionSetDate: gamificationState.intentionSetDate,
          dailyTarget: state.dailyTarget,
        };
      },
      importBackup: (json) => {
        try {
          const parsed = parseBackupJson(json);
          if (!parsed) return false;
          useAppStore.setState({
            wizardComplete: parsed.wizardComplete,
            onboardingComplete: true,
          });
          usePrayerStore.setState({
            age: parsed.age,
            pubertyAge: parsed.pubertyAge,
            periods: parsed.periods,
            totalMissedDays: parsed.totalMissedDays,
            prayers: parsed.prayers,
            todayPrayers: parsed.todayPrayers,
            todayLogPoints: parsed.todayLogPoints,
            todayUnits: parsed.todayUnits,
            todayDate: parsed.todayDate,
          });
          useGamificationStore.setState({
            streak: parsed.streak,
            lastLogDate: parsed.lastLogDate,
            daysLogged: parsed.daysLogged,
            loggedDates: parsed.loggedDates,
            points: parsed.points,
            badges: parsed.badges,
            graceUsedMonth: parsed.graceUsedMonth,
            lastDuaShownDate: parsed.lastDuaShownDate,
            intentionSetDate: parsed.intentionSetDate,
          });
          set({
            language: parsed.language,
            notificationTime: parsed.notificationTime,
            notificationPermission: parsed.notificationPermission,
            dailyTarget: parsed.dailyTarget,
          });
          if (parsed.language !== i18n.language) {
            void Promise.resolve(i18n.changeLanguage(parsed.language)).catch(() => {});
          }
          const timeParts = parsed.notificationTime?.split(":") ?? [];
          const hour = Number(timeParts[0]);
          const minute = Number(timeParts[1]);
          if (
            parsed.notificationTime &&
            parsed.notificationPermission === "granted" &&
            Number.isFinite(hour) &&
            Number.isFinite(minute)
          ) {
            void scheduleDailyNotification(hour, minute).catch(() => {});
          }
          return true;
        } catch {
          if (__DEV__) Logger.warn("import failed", { module: "backup" });
          return false;
        }
      },
      exportToFile: async () => {
        const json = generateBackupJson(get().getBackupData());
        await backupExportToFile(json);
      },
      importFromFile: async () => {
        try {
          const jsonRaw = await backupImportFromFile();
          if (!jsonRaw) return false;
          return get().importBackup(jsonRaw);
        } catch {
          if (__DEV__) Logger.warn("file import failed", { module: "backup" });
          return false;
        }
      },
      scheduleNotification: async (hour, minute) => {
        const { granted } = await requestNotificationPermissions();
        if (granted) {
          set({ notificationPermission: "granted" });
          await scheduleDailyNotification(hour, minute);
          return true;
        }
        set({ notificationPermission: "denied" });
        return false;
      },
      copyBackupToClipboard: async () => {
        const json = generateBackupJson(get().getBackupData());
        await backupCopyToClipboard(json);
      },
    }),
    {
      name: "qadaa-settings-store",
      storage: settingsStorage,
      version: PERSIST_VERSION,
      migrate: migrateToCurrent as (persistedState: unknown, version: number) => SettingsState,
      partialize: (state) => ({
        language: state.language,
        dailyTarget: state.dailyTarget,
        notificationTime: state.notificationTime,
        notificationPermission: state.notificationPermission,
      }),
      onRehydrateStorage: () => (state) => {
        const lang = state?.language;
        if (!settingsRehydratedFromStorage || (lang !== "en" && lang !== "ar")) {
          // First-ever launch (or unusable persisted language): lock in the
          // language detected at i18n init (the device locale) so every future
          // launch opens in the same language even if the device locale later
          // changes. setState triggers the persist write immediately.
          if (state) {
            const firstLang: Language = i18n.language === "en" ? "en" : "ar";
            useSettingsStore.setState({ language: firstLang });
          }
          return;
        }
        if (lang !== i18n.language) {
          void Promise.resolve(i18n.changeLanguage(lang)).catch(() => {});
        }
      },
    }
  )
);
