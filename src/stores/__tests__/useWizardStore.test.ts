/** @format */
/**
 * Unit tests for wizard navigation, derived validation, and confirm flow.
 */
import { useWizardStore, initialWizardState } from "@stores/useWizardStore";
jest.mock("@stores/usePrayerStore", () => {
  const mockStore = {
    completeWizard: jest.fn(),
  };
  const usePrayerStore = jest.fn((selector) => selector(mockStore));
  Object.assign(usePrayerStore, {
    getState: () => mockStore,
    setState: jest.fn(),
    getInitialState: () => mockStore,
    subscribe: jest.fn((cb) => cb(mockStore)),
  });
  return { usePrayerStore };
});
jest.mock("@stores/useSettingsStore", () => {
  const mockStore = {
    setDailyTarget: jest.fn(),
  };
  const useSettingsStore = jest.fn((selector) => selector(mockStore));
  Object.assign(useSettingsStore, {
    getState: () => mockStore,
    setState: jest.fn(),
    getInitialState: () => mockStore,
    subscribe: jest.fn((cb) => cb(mockStore)),
  });
  return { useSettingsStore };
});
jest.mock("@stores/useAppStore", () => {
  const mockStore = {
    completeWizard: jest.fn(),
  };
  const useAppStore = jest.fn((selector) => selector(mockStore));
  Object.assign(useAppStore, {
    getState: () => mockStore,
    setState: jest.fn(),
    getInitialState: () => mockStore,
    subscribe: jest.fn((cb) => cb(mockStore)),
  });
  return { useAppStore };
});
function reset() {
  useWizardStore.getState().resetAll();
}
beforeEach(() => {
  reset();
});
describe("useWizardStore", () => {
  test("defaults to the initial wizard state", () => {
    const s = useWizardStore.getState();
    expect(s.currentStep).toBe(initialWizardState.currentStep);
    expect(s.age).toBe("");
    expect(s.pubertyAge).toBe("");
    expect(s.advanced).toBe(false);
    expect(s.quickYears).toBe("");
    expect(s.periods).toEqual([{ type: "missed", years: "" }]);
    expect(s.dailyTarget).toBe(5);
    expect(s.customTarget).toBe("");
  });
  test("setAge and setPubertyAge store raw strings", () => {
    useWizardStore.getState().setAge("28");
    useWizardStore.getState().setPubertyAge("14");
    expect(useWizardStore.getState().age).toBe("28");
    expect(useWizardStore.getState().pubertyAge).toBe("14");
  });
  test("setQuickYears stores the value", () => {
    useWizardStore.getState().setQuickYears("5");
    expect(useWizardStore.getState().quickYears).toBe("5");
  });
  test("nextStep/prevStep clamp within [0, 3]", () => {
    useWizardStore.getState().nextStep();
    expect(useWizardStore.getState().currentStep).toBe(1);
    useWizardStore.getState().nextStep();
    useWizardStore.getState().nextStep();
    useWizardStore.getState().nextStep();
    expect(useWizardStore.getState().currentStep).toBe(3);
    useWizardStore.getState().nextStep();
    expect(useWizardStore.getState().currentStep).toBe(3);
    useWizardStore.getState().prevStep();
    expect(useWizardStore.getState().currentStep).toBe(2);
    useWizardStore.getState().prevStep();
    useWizardStore.getState().prevStep();
    useWizardStore.getState().prevStep();
    expect(useWizardStore.getState().currentStep).toBe(0);
    useWizardStore.getState().prevStep();
    expect(useWizardStore.getState().currentStep).toBe(0);
  });
  test("addPeriod appends a missed period", () => {
    useWizardStore.getState().addPeriod();
    const periods = useWizardStore.getState().periods;
    expect(periods).toHaveLength(2);
    expect(periods[1]).toEqual({ type: "missed", years: "" });
  });
  test("removePeriod removes the given index", () => {
    useWizardStore.getState().addPeriod();
    useWizardStore.getState().removePeriod(0);
    expect(useWizardStore.getState().periods).toHaveLength(1);
    expect(useWizardStore.getState().periods[0]?.type).toBe("missed");
  });
  test("updatePeriod updates a field on the given period", () => {
    useWizardStore.getState().updatePeriod(0, "type", "regular");
    useWizardStore.getState().updatePeriod(0, "years", "3.5");
    expect(useWizardStore.getState().periods[0]).toEqual({ type: "regular", years: "3.5" });
  });
  test("setPreset sets dailyTarget and clears customTarget", () => {
    useWizardStore.getState().setCustomTarget("10");
    useWizardStore.getState().setPreset(1);
    expect(useWizardStore.getState().dailyTarget).toBe(1);
    expect(useWizardStore.getState().customTarget).toBe("");
  });
  test("setCustom sets dailyTarget to -1", () => {
    useWizardStore.getState().setCustom();
    expect(useWizardStore.getState().dailyTarget).toBe(-1);
  });
  test("setCustomTarget stores the value", () => {
    useWizardStore.getState().setCustomTarget("50");
    expect(useWizardStore.getState().customTarget).toBe("50");
  });
});
describe("useWizardStore derived values", () => {
  test("computes prayerActiveYears from age and pubertyAge", () => {
    useWizardStore.getState().setAge("28");
    useWizardStore.getState().setPubertyAge("14");
    const s = useWizardStore.getState();
    expect(s.prayerActiveYears).toBe(14);
    expect(s.ageNum).toBe(28);
    expect(s.pubertyAgeNum).toBe(14);
  });
  test("step1Valid is true for valid ages and false otherwise", () => {
    useWizardStore.getState().setAge("28");
    useWizardStore.getState().setPubertyAge("14");
    expect(useWizardStore.getState().step1Valid).toBe(true);
    useWizardStore.getState().setPubertyAge("30");
    expect(useWizardStore.getState().step1Valid).toBe(false);
    useWizardStore.getState().setPubertyAge("14");
    useWizardStore.getState().setAge("5");
    expect(useWizardStore.getState().step1Valid).toBe(false);
  });
  test("step2Valid and totals derive from quickYears", () => {
    useWizardStore.getState().setAge("28");
    useWizardStore.getState().setPubertyAge("14");
    useWizardStore.getState().setQuickYears("5");
    const s = useWizardStore.getState();
    expect(s.totalMissedDays).toBe(1825);
    expect(s.totalMissedYears).toBe(5);
    expect(s.totalYears).toBe(5);
    expect(s.totalPrayers).toBe(9125);
    expect(s.step2Valid).toBe(true);
    expect(s.canAddPeriod).toBe(true);
    expect(s.remainingYears).toBe(9);
  });
  test("step2Valid is false when missed years exceed active years", () => {
    useWizardStore.getState().setAge("28");
    useWizardStore.getState().setPubertyAge("14");
    useWizardStore.getState().setQuickYears("50");
    useWizardStore.getState().nextStep();
    const s = useWizardStore.getState();
    expect(s.step2Valid).toBe(false);
    expect(s.isNextDisabled).toBe(true);
  });
  test("step3Valid reflects presets and custom target", () => {
    useWizardStore.getState().setPreset(1);
    expect(useWizardStore.getState().step3Valid).toBe(true);
    useWizardStore.getState().setCustom();
    expect(useWizardStore.getState().step3Valid).toBe(false);
    useWizardStore.getState().setCustomTarget("7");
    expect(useWizardStore.getState().step3Valid).toBe(true);
    useWizardStore.getState().setCustomTarget("51");
    expect(useWizardStore.getState().customTargetValid).toBe(false);
    expect(useWizardStore.getState().step3Valid).toBe(false);
  });
  test("finalTarget returns customTarget in custom mode", () => {
    useWizardStore.getState().setCustom();
    useWizardStore.getState().setCustomTarget("7");
    expect(useWizardStore.getState().finalTarget).toBe(7);
    useWizardStore.getState().setPreset(10);
    expect(useWizardStore.getState().finalTarget).toBe(10);
  });
  test("showNext/showBack reflect the current step", () => {
    const s = useWizardStore.getState();
    expect(s.showNext).toBe(true);
    expect(s.showBack).toBe(false);
    useWizardStore.getState().nextStep();
    expect(useWizardStore.getState().showBack).toBe(true);
    useWizardStore.getState().nextStep();
    useWizardStore.getState().nextStep();
    expect(useWizardStore.getState().currentStep).toBe(3);
    expect(useWizardStore.getState().showNext).toBe(false);
    expect(useWizardStore.getState().showBack).toBe(false);
  });
});
describe("useWizardStore toggleAdvanced", () => {
  test("turning advanced on carries quickYears into the first period", () => {
    useWizardStore.getState().setQuickYears("5");
    useWizardStore.getState().toggleAdvanced();
    const s = useWizardStore.getState();
    expect(s.advanced).toBe(true);
    expect(s.periods).toEqual([{ type: "missed", years: "5" }]);
  });
  test("turning advanced on without quickYears keeps existing periods", () => {
    useWizardStore.getState().toggleAdvanced();
    const s = useWizardStore.getState();
    expect(s.advanced).toBe(true);
    expect(s.periods).toEqual([{ type: "missed", years: "" }]);
  });
  test("turning advanced off carries missed years into quickYears", () => {
    useWizardStore.getState().setQuickYears("2");
    useWizardStore.getState().toggleAdvanced();
    useWizardStore.getState().updatePeriod(0, "years", "3.5");
    useWizardStore.getState().toggleAdvanced();
    const s = useWizardStore.getState();
    expect(s.advanced).toBe(false);
    expect(s.quickYears).toBe("3.5");
  });
  test("turning advanced off without missed years keeps quickYears", () => {
    useWizardStore.getState().toggleAdvanced();
    useWizardStore.getState().updatePeriod(0, "type", "regular");
    useWizardStore.getState().toggleAdvanced();
    const s = useWizardStore.getState();
    expect(s.advanced).toBe(false);
    expect(s.quickYears).toBe("");
  });
  test("resetAll restores the initial state", () => {
    useWizardStore.getState().setAge("28");
    useWizardStore.getState().setCustomTarget("7");
    useWizardStore.getState().nextStep();
    useWizardStore.getState().resetAll();
    expect(useWizardStore.getState().age).toBe("");
    expect(useWizardStore.getState().currentStep).toBe(0);
  });
});
describe("useWizardStore confirm", () => {
  test("writes cross-store state", () => {
    const prayerMock = jest.requireMock("@stores/usePrayerStore").usePrayerStore.getState();
    const settingsMock = jest.requireMock("@stores/useSettingsStore").useSettingsStore.getState();
    const appMock = jest.requireMock("@stores/useAppStore").useAppStore.getState();
    useWizardStore.getState().setAge("28");
    useWizardStore.getState().setPubertyAge("14");
    useWizardStore.getState().setQuickYears("5");
    useWizardStore.getState().setPreset(7);
    useWizardStore.getState().confirm();
    expect(prayerMock.completeWizard).toHaveBeenCalledWith(28, 14, [{ type: "missed", years: 5 }]);
    expect(settingsMock.setDailyTarget).toHaveBeenCalledWith(7);
    expect(appMock.completeWizard).toHaveBeenCalled();
  });
  test("falls back to a 5-prayer daily target when finalTarget is invalid", () => {
    const settingsMock = jest.requireMock("@stores/useSettingsStore").useSettingsStore.getState();
    useWizardStore.getState().setCustom();
    useWizardStore.getState().setCustomTarget("");
    useWizardStore.getState().confirm();
    expect(settingsMock.setDailyTarget).toHaveBeenCalledWith(5);
  });
});
