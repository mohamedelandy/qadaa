/** @format */
/**
 * Unit tests for missed-days total calculation and capped prayer recovery increments.
 */
import { calcTotalMissedDays, incrementPrayer } from "../prayers";
describe("calcTotalMissedDays", () => {
  it("sums only missed periods", () => {
    expect(
      calcTotalMissedDays([
        { type: "missed", years: 1 },
        { type: "regular", years: 2 },
        { type: "missed", years: 0.5 },
      ])
    ).toBe(Math.round(1 * 365) + Math.round(0.5 * 365));
  });
  it("returns 0 for empty periods", () => {
    expect(calcTotalMissedDays([])).toBe(0);
  });
  it("rounds fractional years", () => {
    expect(calcTotalMissedDays([{ type: "missed", years: 1.5 }])).toBe(Math.round(1.5 * 365));
  });
});
describe("incrementPrayer", () => {
  it("adds delta when below cap", () => {
    expect(incrementPrayer(5, 10, 3)).toEqual({ recovered: 8, added: 3 });
  });
  it("caps at totalMissedDays", () => {
    expect(incrementPrayer(8, 10, 5)).toEqual({ recovered: 10, added: 2 });
  });
  it("returns 0 added at cap", () => {
    expect(incrementPrayer(10, 10, 1)).toEqual({ recovered: 10, added: 0 });
  });
  it("handles negative delta as no-op", () => {
    expect(incrementPrayer(3, 10, -2)).toEqual({ recovered: 3, added: 0 });
  });
});
