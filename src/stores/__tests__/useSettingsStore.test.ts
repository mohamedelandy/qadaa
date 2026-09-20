/** @format */
/**
 * Unit tests for settings actions: language, notifications, and backup flows.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useAppStore } from "@stores/useAppStore";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { generateBackupJson, type BackupData } from "@domain/backup";
jest.mock("@data/backup", () => ({
  exportToFile: jest.fn().mockResolvedValue(undefined),
  importFromFile: jest.fn(),
  copyToClipboard: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@data/notifications", () => ({
  scheduleDailyNotification: jest.fn().mockResolvedValue("id"),
  requestNotificationPermissions: jest.fn().mockResolvedValue({ granted: true }),
}));
const { exportToFile, importFromFile, copyToClipboard } = require("@data/backup") as {
  exportToFile: jest.Mock;
  importFromFile: jest.Mock;
  copyToClipboard: jest.Mock;
};
const { scheduleDailyNotification, requestNotificationPermissions } =
  require("@data/notifications") as {
    scheduleDailyNotification: jest.Mock;
    requestNotificationPermissions: jest.Mock;
  };
beforeEach(() => {
  useSettingsStore.setState(useSettingsStore.getInitialState());
  useAppStore.setState(useAppStore.getInitialState());
  usePrayerStore.setState(usePrayerStore.getInitialState());
  useGamificationStore.setState(useGamificationStore.getInitialState());
  jest.clearAllMocks();
});
const VALID_BACKUP: BackupData = {
  version: 1,
  wizardComplete: true,
  age: 25,
  pubertyAge: 14,
  periods: [{ type: "missed", years: 1 }],
  totalMissedDays: 365,
  prayers: {
    fajr: { recovered: 0 },
    dhuhr: { recovered: 0 },
    asr: { recovered: 0 },
    maghrib: { recovered: 0 },
    isha: { recovered: 0 },
  },
  todayPrayers: {},
  todayLogPoints: {},
  todayUnits: {},
  todayDate: null,
  streak: 5,
  lastLogDate: null,
  daysLogged: 0,
  loggedDates: [],
  points: 10,
  badges: [],
  language: "ar",
  notificationTime: null,
  notificationPermission: "default",
  graceUsedMonth: null,
  lastDuaShownDate: null,
  intentionSetDate: null,
  dailyTarget: 5,
};
const baseBackup = () => JSON.parse(JSON.stringify(VALID_BACKUP)) as Record<string, unknown>;
const withField = (overrides: Record<string, unknown>) => Object.assign(baseBackup(), overrides);
describe("useSettingsStore", () => {
  test("language toggle updates language", () => {
    expect(useSettingsStore.getState().language).toBe("ar");
    useSettingsStore.getState().setLanguage("en");
    expect(useSettingsStore.getState().language).toBe("en");
  });
  test("daily target set", () => {
    useSettingsStore.getState().setDailyTarget(7);
    expect(useSettingsStore.getState().dailyTarget).toBe(7);
  });
  test("notification time set", () => {
    useSettingsStore.getState().setNotificationTime("08:30");
    expect(useSettingsStore.getState().notificationTime).toBe("08:30");
  });
  test("setNotificationPermission / setSyncVisible", () => {
    useSettingsStore.getState().setNotificationPermission("granted");
    expect(useSettingsStore.getState().notificationPermission).toBe("granted");
    useSettingsStore.getState().setSyncVisible(true);
    expect(useSettingsStore.getState().syncVisible).toBe(true);
  });
  test("resetAll clears settings", () => {
    useSettingsStore.getState().setNotificationPermission("granted");
    useSettingsStore.getState().setDailyTarget(9);
    useSettingsStore.getState().setSyncVisible(true);
    useSettingsStore.getState().resetAll();
    const s = useSettingsStore.getState();
    expect(s.notificationPermission).toBe("default");
    expect(s.dailyTarget).toBe(5);
    expect(s.syncVisible).toBe(false);
  });
});
describe("useSettingsStore backup/restore", () => {
  test("getBackupData snapshots cross-store state", () => {
    usePrayerStore.getState().completeWizard(25, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    useGamificationStore.getState().incrementPoints(10);
    const b = useSettingsStore.getState().getBackupData();
    expect(b.version).toBe(1);
    expect(b.wizardComplete).toBe(false);
    expect(b.age).toBe(25);
    expect(b.language).toBe("ar");
    expect(b.points).toBe(10);
    expect(b.prayers.fajr.recovered).toBe(1);
  });
  test("importBackup rejects malformed JSON (catch -> false)", () => {
    expect(useSettingsStore.getState().importBackup("not json")).toBe(false);
  });
  test("importBackup rejects future backup versions (schema locked to version 1)", () => {
    const languageBefore = useSettingsStore.getState().language;
    const ok = useSettingsStore.getState().importBackup(JSON.stringify(withField({ version: 2 })));
    expect(ok).toBe(false);
    // Nothing was applied: language and cross-store state stay untouched.
    expect(useSettingsStore.getState().language).toBe(languageBefore);
    expect(useAppStore.getState().wizardComplete).toBe(false);
    expect(usePrayerStore.getState().age).toBe(0);
    expect(useGamificationStore.getState().points).toBe(0);
  });
  test("importBackup rejects when prayers is null", () => {
    expect(
      useSettingsStore.getState().importBackup(JSON.stringify(withField({ prayers: null })))
    ).toBe(false);
  });
  test("importBackup rejects payloads missing required keys", () => {
    expect(useSettingsStore.getState().importBackup(JSON.stringify({}))).toBe(false);
  });
  test("importBackup rejects prayers missing a key", () => {
    expect(
      useSettingsStore
        .getState()
        .importBackup(JSON.stringify(withField({ prayers: { fajr: { recovered: 0 } } })))
    ).toBe(false);
  });
  test("importBackup rejects prayers entry that is not an object", () => {
    expect(
      useSettingsStore
        .getState()
        .importBackup(JSON.stringify(withField({ prayers: { fajr: "nope" } })))
    ).toBe(false);
  });
  test("importBackup rejects prayers entry with non-number recovered", () => {
    expect(
      useSettingsStore.getState().importBackup(
        JSON.stringify(
          withField({
            prayers: {
              fajr: { recovered: "x" },
              dhuhr: { recovered: 0 },
              asr: { recovered: 0 },
              maghrib: { recovered: 0 },
              isha: { recovered: 0 },
            },
          })
        )
      )
    ).toBe(false);
  });
  test("importBackup rejects badges/loggedDates/periods that are not arrays", () => {
    expect(
      useSettingsStore.getState().importBackup(JSON.stringify(withField({ badges: "no" })))
    ).toBe(false);
    expect(
      useSettingsStore.getState().importBackup(JSON.stringify(withField({ loggedDates: "no" })))
    ).toBe(false);
    expect(
      useSettingsStore.getState().importBackup(JSON.stringify(withField({ periods: "no" })))
    ).toBe(false);
  });
  test("importBackup applies a valid payload and returns true", () => {
    const ok = useSettingsStore.getState().importBackup(JSON.stringify(VALID_BACKUP));
    expect(ok).toBe(true);
    expect(useAppStore.getState().wizardComplete).toBe(true);
    expect(usePrayerStore.getState().age).toBe(25);
    expect(useGamificationStore.getState().points).toBe(10);
    expect(useSettingsStore.getState().language).toBe("ar");
  });
  test("importBackup restores todayLogPoints so undo refunds stay accurate", () => {
    const ok = useSettingsStore
      .getState()
      .importBackup(JSON.stringify(withField({ todayLogPoints: { fajr: 20 } })));
    expect(ok).toBe(true);
    expect(usePrayerStore.getState().todayLogPoints).toEqual({ fajr: 20 });
  });
  test("importBackup re-schedules the daily reminder when permission was granted", () => {
    useSettingsStore
      .getState()
      .importBackup(
        JSON.stringify(withField({ notificationTime: "08:30", notificationPermission: "granted" }))
      );
    expect(scheduleDailyNotification).toHaveBeenCalledWith(8, 30);
  });
  test("importBackup does not schedule when permission was not granted", () => {
    useSettingsStore
      .getState()
      .importBackup(
        JSON.stringify(withField({ notificationTime: "08:30", notificationPermission: "denied" }))
      );
    expect(scheduleDailyNotification).not.toHaveBeenCalled();
  });
  test("importBackup falls back on omitted optional fields (?? branches)", () => {
    const d = baseBackup();
    delete d["todayPrayers"];
    delete d["todayDate"];
    delete d["graceUsedMonth"];
    delete d["lastDuaShownDate"];
    delete d["intentionSetDate"];
    delete d["notificationTime"];
    delete d["notificationPermission"];
    delete d["dailyTarget"];
    delete d["daysLogged"];
    const ok = useSettingsStore.getState().importBackup(JSON.stringify(d));
    expect(ok).toBe(true);
    const s = useSettingsStore.getState();
    expect(s.notificationTime).toBeNull();
    expect(s.notificationPermission).toBe("default");
    expect(s.dailyTarget).toBe(5);
    expect(usePrayerStore.getState().todayPrayers).toEqual({});
    expect(usePrayerStore.getState().todayDate).toBeNull();
    expect(useGamificationStore.getState().graceUsedMonth).toBeNull();
    expect(useGamificationStore.getState().daysLogged).toBe(0);
  });
  test("exportToFile serializes and writes (generateBackupJson + exportToFile)", async () => {
    useGamificationStore.getState().incrementPoints(7);
    await useSettingsStore.getState().exportToFile();
    expect(exportToFile).toHaveBeenCalledTimes(1);
    expect(typeof exportToFile.mock.calls[0][0]).toBe("string");
    expect(generateBackupJson(VALID_BACKUP)).toContain('"version":1');
  });
  test("importFromFile returns false when clipboard/file yields nothing", async () => {
    importFromFile.mockResolvedValue("");
    await expect(useSettingsStore.getState().importFromFile()).resolves.toBe(false);
  });
  test("importFromFile applies valid JSON and returns true", async () => {
    importFromFile.mockResolvedValue(JSON.stringify(VALID_BACKUP));
    await expect(useSettingsStore.getState().importFromFile()).resolves.toBe(true);
    expect(useAppStore.getState().wizardComplete).toBe(true);
  });
  test("importFromFile returns false and handles error when read fails", async () => {
    importFromFile.mockRejectedValue(new Error("File read error"));
    await expect(useSettingsStore.getState().importFromFile()).resolves.toBe(false);
  });
  test("scheduleNotification grants, schedules, and returns true", async () => {
    requestNotificationPermissions.mockResolvedValue({ granted: true });
    const ok = await useSettingsStore.getState().scheduleNotification(8, 30);
    expect(ok).toBe(true);
    expect(useSettingsStore.getState().notificationPermission).toBe("granted");
    expect(scheduleDailyNotification).toHaveBeenCalledWith(8, 30);
  });
  test("scheduleNotification denies and returns false when permission not granted", async () => {
    requestNotificationPermissions.mockResolvedValue({ granted: false });
    const ok = await useSettingsStore.getState().scheduleNotification(8, 30);
    expect(ok).toBe(false);
    expect(useSettingsStore.getState().notificationPermission).toBe("denied");
    expect(scheduleDailyNotification).not.toHaveBeenCalled();
  });
  test("scheduleNotification returns false and handles error gracefully", async () => {
    requestNotificationPermissions.mockResolvedValue({ granted: true });
    jest.mocked(scheduleDailyNotification).mockRejectedValueOnce(new Error("Scheduling failed"));
    const ok = await useSettingsStore.getState().scheduleNotification(8, 30);
    expect(ok).toBe(false);
  });
  test("copyBackupToClipboard serializes and copies", async () => {
    useGamificationStore.getState().incrementPoints(7);
    await useSettingsStore.getState().copyBackupToClipboard();
    expect(copyToClipboard).toHaveBeenCalledTimes(1);
    expect(typeof copyToClipboard.mock.calls[0][0]).toBe("string");
  });
  test("onRehydrateStorage resyncs i18n language when persisted language differs", async () => {
    await AsyncStorage.setItem(
      "qadaa-settings-store",
      JSON.stringify({
        state: {
          language: "en",
          dailyTarget: 3,
          notificationTime: "09:00",
          notificationPermission: "granted",
        },
        version: 0,
      })
    );
    jest.isolateModules(() => {
      require("@stores/useSettingsStore");
    });
    await new Promise((r) => setTimeout(r, 10));
    expect(i18n.changeLanguage).toHaveBeenCalledWith("en");
  });

  test("first-ever launch locks in the detected language so later launches never drift", async () => {
    await AsyncStorage.removeItem("qadaa-settings-store");
    jest.isolateModules(() => {
      require("@stores/useSettingsStore");
    });
    await new Promise((r) => setTimeout(r, 10));
    // Nothing persisted → the detected language (i18n mock: "ar") is written
    // to storage and i18n is NOT flipped.
    expect(i18n.changeLanguage).not.toHaveBeenCalled();
    const raw = await AsyncStorage.getItem("qadaa-settings-store");
    expect(JSON.parse(raw ?? "{}")?.state?.language).toBe("ar");
  });

  test("corrupt persisted language falls back to the detected language", async () => {
    await AsyncStorage.setItem(
      "qadaa-settings-store",
      JSON.stringify({ state: { language: "zz" }, version: 2 })
    );
    jest.isolateModules(() => {
      require("@stores/useSettingsStore");
    });
    await new Promise((r) => setTimeout(r, 10));
    expect(i18n.changeLanguage).not.toHaveBeenCalled();
    const raw = await AsyncStorage.getItem("qadaa-settings-store");
    expect(JSON.parse(raw ?? "{}")?.state?.language).toBe("ar");
  });
});
describe("useSettingsStore.importBackup i18n sync", () => {
  test("importBackup calls changeLanguage when the backup language differs from i18n", () => {
    expect(useSettingsStore.getState().language).toBe("ar");
    const ok = useSettingsStore
      .getState()
      .importBackup(JSON.stringify(withField({ language: "en" })));
    expect(ok).toBe(true);
    expect(useSettingsStore.getState().language).toBe("en");
    expect(i18n.changeLanguage).toHaveBeenCalledWith("en");
  });
  test("importBackup skips changeLanguage when the backup language matches i18n", () => {
    const ok = useSettingsStore
      .getState()
      .importBackup(JSON.stringify(withField({ language: "ar" })));
    expect(ok).toBe(true);
    expect(useSettingsStore.getState().language).toBe("ar");
    expect(i18n.changeLanguage).not.toHaveBeenCalled();
  });
});
describe("useSettingsStore.importBackup error handling", () => {
  test("importBackup handles malformed JSON without throwing and changes nothing", () => {
    const languageBefore = useSettingsStore.getState().language;
    expect(() =>
      useSettingsStore.getState().importBackup('{"version": 1, "prayers": broken')
    ).not.toThrow();
    expect(useSettingsStore.getState().language).toBe(languageBefore);
    expect(useAppStore.getState().wizardComplete).toBe(false);
  });
  test("importBackup swallows a parser crash through its catch branch and returns false", () => {
    const backupModule = require("@domain/backup") as {
      parseBackupJson: (json: string) => BackupData | null;
    };
    const spy = jest.spyOn(backupModule, "parseBackupJson").mockImplementation(() => {
      throw new Error("parser crash");
    });
    try {
      expect(useSettingsStore.getState().importBackup("{}")).toBe(false);
      expect(useSettingsStore.getState().language).toBe("ar");
    } finally {
      spy.mockRestore();
    }
  });
});
