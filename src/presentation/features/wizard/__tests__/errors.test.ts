/** @format */
/**
 * Unit tests for the per-step wizard validation error messages.
 */
import type { TFunction } from "i18next";
import { getStep1Error, getStep2Error, getStep3Error } from "../errors";
const t = ((k: string) => k) as unknown as TFunction;

describe("getStep1Error", () => {
  it("returns empty when both fields are present and valid", () => {
    expect(
      getStep1Error({ age: "30", pubertyAge: "14" }, { ageNum: 30, pubertyAgeNum: 14 }, t)
    ).toBe("");
  });
  it("returns empty when both fields are empty (fresh screen)", () => {
    expect(getStep1Error({ age: "", pubertyAge: "" }, { ageNum: 0, pubertyAgeNum: 0 }, t)).toBe("");
  });
  it("requires the age when only puberty age is filled", () => {
    expect(getStep1Error({ age: "", pubertyAge: "14" }, { ageNum: 0, pubertyAgeNum: 14 }, t)).toBe(
      "validation.age.required"
    );
  });
  it("requires puberty age when only age is filled", () => {
    expect(getStep1Error({ age: "30", pubertyAge: "" }, { ageNum: 30, pubertyAgeNum: 0 }, t)).toBe(
      "validation.pubertyAge.required"
    );
  });
  it("flags puberty ages outside the 9-15 range", () => {
    expect(getStep1Error({ age: "30", pubertyAge: "8" }, { ageNum: 30, pubertyAgeNum: 8 }, t)).toBe(
      "validation.pubertyAge.range"
    );
    expect(
      getStep1Error({ age: "30", pubertyAge: "16" }, { ageNum: 30, pubertyAgeNum: 16 }, t)
    ).toBe("validation.pubertyAge.range");
  });
  it("requires puberty age to be strictly less than the age", () => {
    expect(
      getStep1Error({ age: "14", pubertyAge: "14" }, { ageNum: 14, pubertyAgeNum: 14 }, t)
    ).toBe("validation.pubertyAge.lessThanAge");
  });
});

describe("getStep2Error", () => {
  const base = { totalMissedDays: 365, totalMissedYears: 5, totalYears: 5, prayerActiveYears: 14 };
  it("returns empty for a valid configuration", () => {
    expect(getStep2Error(base, t)).toBe("");
  });
  it("requires at least one missed day", () => {
    expect(getStep2Error({ ...base, totalMissedDays: 0 }, t)).toBe(
      "validation.quickYears.required"
    );
  });
  it("flags missed years exceeding the active years", () => {
    expect(getStep2Error({ ...base, totalMissedYears: 15, totalYears: 15 }, t)).toBe(
      "validation.missedYears.exceedsLimit"
    );
  });
  it("flags total years exceeding the active years", () => {
    expect(getStep2Error({ ...base, totalYears: 15 }, t)).toBe(
      "validation.totalYears.exceedsLimit"
    );
  });
});

describe("getStep3Error", () => {
  it("returns empty when a preset target is chosen", () => {
    expect(
      getStep3Error({ dailyTarget: 5, customTarget: "" }, { customTargetValid: true }, t)
    ).toBe("");
  });
  it("requires a custom target value", () => {
    expect(
      getStep3Error({ dailyTarget: -1, customTarget: "" }, { customTargetValid: false }, t)
    ).toBe("validation.custom.required");
  });
  it("flags an out-of-range custom target", () => {
    expect(
      getStep3Error({ dailyTarget: -1, customTarget: "0" }, { customTargetValid: false }, t)
    ).toBe("validation.custom.range");
  });
});
