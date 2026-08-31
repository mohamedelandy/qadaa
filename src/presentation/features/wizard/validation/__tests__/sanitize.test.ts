/** @format */
/**
 * Unit tests for cleanDecimal sanitizer incl. Arabic-Indic digit and decimal separator normalization.
 */
import { cleanDecimal } from "../sanitize";
describe("cleanDecimal", () => {
  it("strips non-digit/non-dot characters", () => {
    expect(cleanDecimal("12ab3.5")).toBe("123.5");
  });
  it("collapses multiple dots into one", () => {
    expect(cleanDecimal("1.2.3")).toBe("1.23");
  });
  it("prepends 0 to a leading dot", () => {
    expect(cleanDecimal(".5")).toBe("0.5");
  });
  it("strips a leading zero before a non-dot digit", () => {
    expect(cleanDecimal("05")).toBe("5");
  });
  it("keeps 0.5 as-is", () => {
    expect(cleanDecimal("0.5")).toBe("0.5");
  });
  it("returns empty for empty input", () => {
    expect(cleanDecimal("")).toBe("");
  });
  it("handles only dots", () => {
    expect(cleanDecimal("...")).toBe("0.");
  });
  it("normalizes Arabic-Indic digits and decimal separator", () => {
    expect(cleanDecimal("٠٫٥")).toBe("0.5");
    expect(cleanDecimal("١٢")).toBe("12");
  });
  it("normalizes Eastern Arabic-Indic digits", () => {
    expect(cleanDecimal("۱۲.۵")).toBe("12.5");
  });
  it("keeps ASCII input untouched by normalization", () => {
    expect(cleanDecimal("2.5x")).toBe("2.5");
  });
});
