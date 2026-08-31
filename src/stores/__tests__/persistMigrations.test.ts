/** @format */

import {
  PERSIST_VERSION,
  migrateToCurrent,
  migratePrayerToCurrent,
  migrateGamificationToCurrent,
} from "../persistMigrations";
import { useAppStore } from "../useAppStore";
import { useSettingsStore } from "../useSettingsStore";
import { useGamificationStore } from "../useGamificationStore";
import { useThemeStore } from "../useThemeStore";
import { usePrayerStore } from "../usePrayerStore";

describe("PERSIST_VERSION", () => {
  test("is 2", () => {
    expect(PERSIST_VERSION).toBe(2);
  });
});

describe("migrateToCurrent", () => {
  test("returns input unchanged", () => {
    const input = { foo: "bar" };
    expect(migrateToCurrent(input, 0)).toBe(input);
  });
  test("returns undefined unchanged", () => {
    expect(migrateToCurrent(undefined, 0)).toBeUndefined();
  });
});

describe("migrateGamificationToCurrent", () => {
  test("backfills daysLogged from loggedDates length for v1 state", () => {
    const result = migrateGamificationToCurrent(
      { loggedDates: ["2026-01-01", "2026-01-02"], streak: 2 },
      1
    );
    expect(result["daysLogged"]).toBe(2);
    expect(result["streak"]).toBe(2);
  });
  test("preserves an existing daysLogged value", () => {
    const result = migrateGamificationToCurrent(
      { loggedDates: ["2026-01-01"], daysLogged: 12, streak: 2 },
      1
    );
    expect(result["daysLogged"]).toBe(12);
  });
  test("defaults daysLogged to 0 when loggedDates is missing", () => {
    const result = migrateGamificationToCurrent({ streak: 1 }, 1);
    expect(result["daysLogged"]).toBe(0);
  });
  test("leaves state untouched at the current version", () => {
    const input = { loggedDates: ["2026-01-01"], daysLogged: 5 };
    expect(migrateGamificationToCurrent(input, PERSIST_VERSION)).toBe(input);
  });
});

describe("migratePrayerToCurrent", () => {
  test("fills missing todayUnits, todayLogPoints, todayDate with defaults", () => {
    const result = migratePrayerToCurrent({}, 0);
    expect(result).toEqual({
      todayUnits: {},
      todayLogPoints: {},
      todayDate: null,
    });
  });
  test("preserves existing fields", () => {
    const input = {
      todayUnits: { fajr: [10] },
      todayLogPoints: { fajr: 10 },
      todayDate: "2026-08-25",
      prayers: { fajr: { recovered: 3 } },
    };
    const result = migratePrayerToCurrent(input, 0);
    expect(result).toEqual({
      todayUnits: { fajr: [10] },
      todayLogPoints: { fajr: 10 },
      todayDate: "2026-08-25",
      prayers: { fajr: { recovered: 3 } },
    });
  });
  test("handles null persisted data", () => {
    const result = migratePrayerToCurrent(null, 0);
    expect(result).toEqual({
      todayUnits: {},
      todayLogPoints: {},
      todayDate: null,
    });
  });
});

describe("store persist version", () => {
  test("useAppStore version is 2", () => {
    expect(useAppStore.persist.getOptions().version).toBe(2);
  });
  test("useSettingsStore version is 2", () => {
    expect(useSettingsStore.persist.getOptions().version).toBe(2);
  });
  test("useGamificationStore version is 2", () => {
    expect(useGamificationStore.persist.getOptions().version).toBe(2);
  });
  test("useThemeStore version is 2", () => {
    expect(useThemeStore.persist.getOptions().version).toBe(2);
  });
  test("usePrayerStore version is 2", () => {
    expect(usePrayerStore.persist.getOptions().version).toBe(2);
  });
});
