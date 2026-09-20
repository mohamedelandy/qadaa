/** @format */
/**
 * Unit tests for backup JSON generation and schema-validated parsing round-trips.
 */
import { generateBackupJson, parseBackupJson, type BackupData } from "../backup";
const SAMPLE: BackupData = {
  version: 1,
  wizardComplete: true,
  age: 30,
  pubertyAge: 14,
  periods: [{ type: "missed", years: 1 }],
  totalMissedDays: 365,
  prayers: {
    fajr: { recovered: 100 },
    dhuhr: { recovered: 0 },
    asr: { recovered: 0 },
    maghrib: { recovered: 0 },
    isha: { recovered: 0 },
  },
  todayPrayers: { fajr: true },
  todayLogPoints: { fajr: 20 },
  todayUnits: {},
  todayDate: "2026-01-01",
  streak: 3,
  lastLogDate: "2026-01-01",
  daysLogged: 1,
  loggedDates: ["2026-01-01"],
  points: 30,
  badges: [{ id: "first_log", unlockedAt: 1 }],
  language: "ar",
  notificationTime: null,
  notificationPermission: "granted",
  graceUsedMonth: null,
  lastDuaShownDate: null,
  intentionSetDate: null,
  dailyTarget: 5,
};
describe("generateBackupJson", () => {
  it("serializes with version 1", () => {
    const json = generateBackupJson(SAMPLE);
    const parsed = JSON.parse(json) as BackupData;
    expect(parsed.version).toBe(1);
    expect(parsed.periods).toEqual([{ type: "missed", years: 1 }]);
    expect(parsed.dailyTarget).toBe(5);
  });
});
describe("parseBackupJson", () => {
  it("round-trips generated json", () => {
    const parsed = parseBackupJson(generateBackupJson(SAMPLE));
    expect(parsed).toEqual({ ...SAMPLE, version: 1 });
  });
  it("returns null for invalid JSON", () => {
    expect(parseBackupJson("not json")).toBeNull();
  });

  it("returns null for malformed JSON causing parse error", () => {
    expect(parseBackupJson("{invalid}")).toBeNull();
  });

  it("rejects oversized input before parsing", () => {
    expect(parseBackupJson("x".repeat(250_001))).toBeNull();
  });
  it("returns null for non-object data", () => {
    expect(parseBackupJson("42")).toBeNull();
    expect(parseBackupJson("null")).toBeNull();
  });
  it("returns null when required fields are missing or have wrong types", () => {
    const invalidAge = { ...SAMPLE, age: "thirty" };
    expect(parseBackupJson(JSON.stringify(invalidAge))).toBeNull();
    const missingPrayers = { ...SAMPLE, prayers: { fajr: { recovered: 0 } } };
    expect(parseBackupJson(JSON.stringify(missingPrayers))).toBeNull();
  });

  it("rejects unknown versions (schema is locked to version 1)", () => {
    expect(parseBackupJson(JSON.stringify({ ...SAMPLE, version: 2 }))).toBeNull();
  });
});
