/** @format */
/**
 * Unit tests for local ISO date formatting, day-of-year, days-since, addDays.
 */
import { toLocalISODate, dayOfYear, addDays } from "../date";
describe("toLocalISODate", () => {
  it("formats a local date as YYYY-MM-DD", () => {
    expect(toLocalISODate(new Date(2026, 0, 1))).toBe("2026-01-01");
  });
  it("pads months and days", () => {
    expect(toLocalISODate(new Date(2026, 10, 5))).toBe("2026-11-05");
  });
});
describe("dayOfYear", () => {
  it("returns 1 on New Year's Day", () => {
    expect(dayOfYear(new Date(2026, 0, 1))).toBe(1);
  });
  it("returns 366 for Dec 31 in a leap year", () => {
    expect(dayOfYear(new Date(2024, 11, 31))).toBe(366);
  });
  it("defaults to today when no date is passed", () => {
    jest.useFakeTimers({ now: new Date(2026, 0, 8, 12, 0, 0) });
    expect(dayOfYear()).toBe(dayOfYear(new Date(2026, 0, 8, 12, 0, 0)));
    jest.useRealTimers();
  });
});
describe("addDays", () => {
  it("adds days crossing month boundaries", () => {
    expect(addDays(new Date(2026, 0, 30), 3).getDate()).toBe(2);
    expect(addDays(new Date(2026, 0, 30), 3).getMonth()).toBe(1);
  });
  it("handles leap years", () => {
    expect(addDays(new Date(2024, 1, 28), 1).getDate()).toBe(29);
  });
  it("handles negative days", () => {
    expect(addDays(new Date(2026, 0, 1), -1).getDate()).toBe(31);
  });
});
