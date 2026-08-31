/** @format */
/**
 * Wizard flow state: step navigation, period entries, derived totals/validation.
 */
import { create } from "zustand";
import { usePrayerStore } from "./usePrayerStore";
import { useSettingsStore } from "./useSettingsStore";
import { useAppStore } from "./useAppStore";
import { calcTotalMissedDays } from "@domain/prayers";
export interface WizardPeriod {
  type: "missed" | "regular";
  years: string;
}
export interface WizardState {
  currentStep: number;
  age: string;
  pubertyAge: string;
  advanced: boolean;
  quickYears: string;
  periods: WizardPeriod[];
  dailyTarget: number;
  customTarget: string;
}
export interface WizardDerived {
  ageNum: number;
  pubertyAgeNum: number;
  customTargetNum: number;
  activePeriods: {
    type: "missed" | "regular";
    years: number;
  }[];
  totalMissedDays: number;
  totalMissedYears: number;
  totalYears: number;
  prayerActiveYears: number;
  canAddPeriod: boolean;
  remainingYears: number;
  step1Valid: boolean;
  step2Valid: boolean;
  step3Valid: boolean;
  customTargetValid: boolean;
  totalPrayers: number;
  finalTarget: number;
  showNext: boolean;
  showBack: boolean;
  isNextDisabled: boolean;
}
export type WizardStore = WizardState & WizardDerived & WizardActions;
export interface WizardActions {
  setAge: (v: string) => void;
  setPubertyAge: (v: string) => void;
  toggleAdvanced: () => void;
  setQuickYears: (v: string) => void;
  addPeriod: () => void;
  removePeriod: (index: number) => void;
  updatePeriod: (
    index: number,
    field: keyof WizardPeriod,
    value: string | WizardPeriod["type"]
  ) => void;
  setPreset: (n: number) => void;
  setCustom: () => void;
  setCustomTarget: (v: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  confirm: () => void;
  resetAll: () => void;
}
export const initialWizardState: WizardState = {
  currentStep: 0,
  age: "",
  pubertyAge: "",
  advanced: false,
  quickYears: "",
  periods: [{ type: "missed", years: "" }],
  dailyTarget: 5,
  customTarget: "",
};
export function deriveWizard(state: WizardState): WizardDerived {
  const ageNum = Number(state.age);
  const pubertyAgeNum = Number(state.pubertyAge);
  const customTargetNum = Number(state.customTarget);
  const activePeriods = (() => {
    const list = state.advanced
      ? state.periods.map((p) => ({ type: p.type, years: Number(p.years) }))
      : [{ type: "missed" as const, years: Number(state.quickYears) }];
    return list
      .map((p) => ({
        type: p.type,
        years: isNaN(p.years) ? 0 : p.years,
      }))
      .filter((p) => p.years > 0);
  })();
  const totalMissedDays = calcTotalMissedDays(activePeriods);
  const totalMissedYears = activePeriods
    .filter((p) => p.type === "missed")
    .reduce((sum, p) => sum + p.years, 0);
  const totalYears = activePeriods.reduce((sum, p) => sum + p.years, 0);
  const prayerActiveYears = ageNum - pubertyAgeNum;
  const canAddPeriod = totalYears < prayerActiveYears;
  const remainingYears = Math.max(prayerActiveYears - totalYears, 0);
  const step1Valid = (() => {
    const ageIsInteger = /^\d+$/.test(state.age);
    const pubertyAgeIsInteger = /^\d+$/.test(state.pubertyAge);
    return (
      ageIsInteger &&
      pubertyAgeIsInteger &&
      ageNum >= 10 &&
      ageNum <= 120 &&
      pubertyAgeNum >= 9 &&
      pubertyAgeNum <= 15 &&
      pubertyAgeNum < ageNum
    );
  })();
  const step2Valid =
    totalMissedDays > 0 && totalMissedYears <= prayerActiveYears && totalYears <= prayerActiveYears;
  const customTargetValid = (() => {
    const isInteger = /^\d+$/.test(state.customTarget);
    const num = Number(state.customTarget);
    return isInteger && num > 0 && num <= 50;
  })();
  const step3Valid = state.dailyTarget !== -1 ? state.dailyTarget > 0 : customTargetValid;
  const totalPrayers = totalMissedDays * 5;
  const finalTarget = state.dailyTarget === -1 ? customTargetNum : state.dailyTarget;
  const showNext = state.currentStep < 3;
  const showBack = state.currentStep > 0 && state.currentStep < 3;
  const isNextDisabled =
    (state.currentStep === 0 && !step1Valid) ||
    (state.currentStep === 1 && !step2Valid) ||
    (state.currentStep === 2 && !step3Valid);
  return {
    ageNum,
    pubertyAgeNum,
    customTargetNum,
    activePeriods,
    totalMissedDays,
    totalMissedYears,
    totalYears,
    prayerActiveYears,
    canAddPeriod,
    remainingYears,
    step1Valid,
    step2Valid,
    step3Valid,
    customTargetValid,
    totalPrayers,
    finalTarget,
    showNext,
    showBack,
    isNextDisabled,
  };
}
export const useWizardStore = create<WizardStore>()((set, get) => {
  // INVARIANT: All state mutations MUST route through commit() — it is the only
  // path that recomputes derived fields (deriveWizard). Raw setState() calls
  // bypass recomputation and silently desync every derived field. If you ever
  // need an external write, extend commit or add a named action instead.
  const commit = (partial: Partial<WizardState>) => {
    const next = { ...get(), ...partial };
    set({ ...partial, ...deriveWizard(next) });
  };
  return {
    ...initialWizardState,
    ...deriveWizard(initialWizardState),
    setAge: (age) => commit({ age }),
    setPubertyAge: (pubertyAge) => commit({ pubertyAge }),
    toggleAdvanced: () => {
      const state = get();
      if (!state.advanced) {
        if (state.quickYears) {
          commit({ advanced: true, periods: [{ type: "missed", years: state.quickYears }] });
        } else {
          commit({ advanced: true });
        }
        return;
      }
      const missedSum = state.periods
        .filter((p) => p.type === "missed")
        .reduce((sum, p) => {
          const val = Number(p.years);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
      if (missedSum > 0) {
        commit({ advanced: false, quickYears: String(missedSum) });
      } else {
        commit({ advanced: false });
      }
    },
    setQuickYears: (quickYears) => commit({ quickYears }),
    addPeriod: () => commit({ periods: [...get().periods, { type: "missed", years: "" }] }),
    removePeriod: (index) => commit({ periods: get().periods.filter((_, i) => i !== index) }),
    updatePeriod: (index, field, value) =>
      commit({
        periods: get().periods.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
      }),
    setPreset: (dailyTarget) => commit({ dailyTarget, customTarget: "" }),
    setCustom: () => commit({ dailyTarget: -1 }),
    setCustomTarget: (customTarget) => commit({ customTarget }),
    nextStep: () => commit({ currentStep: Math.min(get().currentStep + 1, 3) }),
    prevStep: () => commit({ currentStep: Math.max(get().currentStep - 1, 0) }),
    confirm: () => {
      const state = get();
      const d = deriveWizard(state);
      const target =
        d.finalTarget && !isNaN(d.finalTarget) && d.finalTarget > 0 ? d.finalTarget : 5;
      usePrayerStore.getState().completeWizard(d.ageNum, d.pubertyAgeNum, d.activePeriods);
      useSettingsStore.getState().setDailyTarget(target);
      useAppStore.getState().completeWizard();
    },
    resetAll: () => {
      const next = { ...initialWizardState };
      set({ ...next, ...deriveWizard(next) });
    },
  };
});
