/** @format */
/**
 * Per-step validation messages for wizard ages, missed periods vs active years, and custom target.
 */
import type { TFunction } from "i18next";
import type { WizardDerived, WizardState } from "@stores/useWizardStore";
export function getStep1Error(
  state: Pick<WizardState, "age" | "pubertyAge">,
  d: Pick<WizardDerived, "ageNum" | "pubertyAgeNum">,
  t: TFunction
): string {
  if (!state.age && !state.pubertyAge) return "";
  if (!state.age) return t("validation.age.required");
  if (!state.pubertyAge) return t("validation.pubertyAge.required");
  if (d.pubertyAgeNum < 9 || d.pubertyAgeNum > 15) return t("validation.pubertyAge.range");
  if (d.pubertyAgeNum >= d.ageNum) return t("validation.pubertyAge.lessThanAge");
  return "";
}
export function getStep2Error(
  d: Pick<
    WizardDerived,
    "totalMissedDays" | "totalMissedYears" | "totalYears" | "prayerActiveYears"
  >,
  t: TFunction
): string {
  if (!d.totalMissedDays) return t("validation.quickYears.required");
  if (d.totalMissedYears > d.prayerActiveYears) return t("validation.missedYears.exceedsLimit");
  if (d.totalYears > d.prayerActiveYears) return t("validation.totalYears.exceedsLimit");
  return "";
}
export function getStep3Error(
  state: Pick<WizardState, "dailyTarget" | "customTarget">,
  d: Pick<WizardDerived, "customTargetValid">,
  t: TFunction
): string {
  if (state.dailyTarget !== -1) return "";
  if (!state.customTarget) return t("validation.custom.required");
  if (!d.customTargetValid) return t("validation.custom.range");
  return "";
}
