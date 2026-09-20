import { useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";
import { useWizardStore } from "@stores/useWizardStore";
import { useUI } from "@hooks/useUI";
import { CreateStep1Schema, CreateStep2Schema } from "../validation";
import { getStep1Error, getStep2Error, getStep3Error } from "../errors";
export type { WizardPeriod } from "@stores/useWizardStore";

function useWizardState() {
  return useWizardStore(
    useShallow((s) => ({
      currentStep: s.currentStep,
      age: s.age,
      pubertyAge: s.pubertyAge,
      advanced: s.advanced,
      quickYears: s.quickYears,
      periods: s.periods,
      dailyTarget: s.dailyTarget,
      customTarget: s.customTarget,
    }))
  );
}

function useWizardDerived() {
  return useWizardStore(
    useShallow((s) => ({
      totalMissedDays: s.totalMissedDays,
      totalMissedYears: s.totalMissedYears,
      totalPrayers: s.totalPrayers,
      totalYears: s.totalYears,
      prayerActiveYears: s.prayerActiveYears,
      canAddPeriod: s.canAddPeriod,
      remainingYears: s.remainingYears,
      step1Valid: s.step1Valid,
      step2Valid: s.step2Valid,
      step3Valid: s.step3Valid,
      finalTarget: s.finalTarget,
      showNext: s.showNext,
      showBack: s.showBack,
      isNextDisabled: s.isNextDisabled,
      ageNum: s.ageNum,
      pubertyAgeNum: s.pubertyAgeNum,
      customTargetValid: s.customTargetValid,
    }))
  );
}

function useWizardActions() {
  return useWizardStore(
    useShallow((s) => ({
      setAge: s.setAge,
      setPubertyAge: s.setPubertyAge,
      toggleAdvanced: s.toggleAdvanced,
      setQuickYears: s.setQuickYears,
      addPeriod: s.addPeriod,
      removePeriod: s.removePeriod,
      updatePeriod: s.updatePeriod,
      setPreset: s.setPreset,
      setCustom: s.setCustom,
      setCustomTarget: s.setCustomTarget,
      nextStep: s.nextStep,
      prevStep: s.prevStep,
      confirm: s.confirm,
    }))
  );
}

function useWizardForms(quickYears: string, t: (key: string) => string) {
  const step1Schema = useMemo(() => CreateStep1Schema(t), [t]);
  const step2Schema = useMemo(() => CreateStep2Schema(t), [t]);

  const form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: { age: "", pubertyAge: "" },
    mode: "onChange",
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: { quickYears: "" },
    mode: "onChange",
  });

  useEffect(() => {
    step2Form.setValue("quickYears", quickYears, { shouldValidate: true });
  }, [quickYears, step2Form]);

  return { form, step2Form };
}

export function useWizardViewModel() {
  const { t } = useUI();

  const state = useWizardState();
  const derived = useWizardDerived();
  const actions = useWizardActions();

  const { form, step2Form } = useWizardForms(state.quickYears, t);

  const {
    control,
    formState: { errors },
    trigger,
    clearErrors,
    reset,
  } = form;

  const {
    control: step2Control,
    formState: { errors: step2Errors },
    trigger: step2Trigger,
    clearErrors: step2ClearErrors,
  } = step2Form;

  const step1Error = useMemo(
    () => getStep1Error({ age: state.age, pubertyAge: state.pubertyAge }, { ageNum: derived.ageNum, pubertyAgeNum: derived.pubertyAgeNum }, t),
    [state.age, state.pubertyAge, derived.ageNum, derived.pubertyAgeNum, t]
  );

  const step2Error = useMemo(
    () => getStep2Error({ totalMissedDays: derived.totalMissedDays, totalMissedYears: derived.totalMissedYears, totalYears: derived.totalYears, prayerActiveYears: derived.prayerActiveYears }, t),
    [derived.totalMissedDays, derived.totalMissedYears, derived.totalYears, derived.prayerActiveYears, t]
  );

  const step3Error = useMemo(
    () => getStep3Error({ dailyTarget: state.dailyTarget, customTarget: state.customTarget }, { customTargetValid: derived.customTargetValid }, t),
    [state.dailyTarget, state.customTarget, derived.customTargetValid, t]
  );

  const handleCustomTargetChange = useCallback(
    (v: string) => {
      actions.setCustomTarget(v.replace(/[^\d]/g, ""));
    },
    [actions.setCustomTarget]
  );

  return {
    t,
    ...state,
    ...derived,
    ...actions,
    setCustomTarget: handleCustomTargetChange,
    step1Error,
    step2Error,
    step3Error,
    control,
    errors,
    trigger,
    clearErrors,
    reset,
    step2Control,
    step2Errors,
    step2Trigger,
    step2ClearErrors,
  };
}
export type WizardViewModel = ReturnType<typeof useWizardViewModel>;
