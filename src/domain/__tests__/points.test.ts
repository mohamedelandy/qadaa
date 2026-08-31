/** @format */
/**
 * Unit tests for points add/subtract helpers flooring at zero.
 */
import { addPoints, subtractPoints } from "../points";
describe("addPoints", () => {
  it("adds amount", () => {
    expect(addPoints(10, 5)).toBe(15);
  });
  it("handles zero", () => {
    expect(addPoints(0, 0)).toBe(0);
  });
});
describe("subtractPoints", () => {
  it("subtracts amount", () => {
    expect(subtractPoints(10, 3)).toBe(7);
  });
  it("floors at 0", () => {
    expect(subtractPoints(2, 10)).toBe(0);
  });
  it("stays 0", () => {
    expect(subtractPoints(0, 10)).toBe(0);
  });
});
