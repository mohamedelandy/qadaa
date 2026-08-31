/** @format */
/**
 * Unit tests for locale-aware number formatting helpers.
 */
import { formatNumber, formatPlus } from "../format";
describe("formatPlus", () => {
  it("uses Arabic-Indic digits in RTL", () => {
    expect(formatPlus(10, true)).toBe("+١٠");
  });
  it("uses Western digits in LTR", () => {
    expect(formatPlus(3, false)).toBe("+3");
  });
  it("keeps the plus sign in both locales", () => {
    expect(formatPlus(1, false).startsWith("+")).toBe(true);
    expect(formatPlus(1, true).startsWith("+")).toBe(true);
  });
});
describe("formatNumber", () => {
  it("uses Arabic-Indic digits in RTL", () => {
    expect(formatNumber(10, true)).toBe("١٠");
  });
  it("uses Western digits in LTR", () => {
    expect(formatNumber(3, false)).toBe("3");
  });
});
