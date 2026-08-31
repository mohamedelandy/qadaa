/** @format */
/**
 * Wizard view-model hook binding react-hook-form + zod schemas to wizard store state and actions.
 * Subscribes via narrow shallow slices so unrelated store changes don't re-render the wizard.
 */
import { useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";
import { useWizardStore } from "@stores/useWizardStore";
import { useUI } from "@hooks/useUI";
import { CreateStep1Schema, CreateStep2Schema } from "../validation";
import { getStep1Error, getStep2Error, getStep3Error } from "../errors";
export type { WizardPeriod } from "@stores/useWizardStore";
export function useWizardViewModel() {
  const { t } = useUI();
  const { currentStep, age, pubertyAge, advanced, quickYears, periods, dailyTarget, customTarget } =
    useWizardStore(
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
  const {
    totalMissedDays,
    totalMissedYears,
    totalPrayers,
    totalYears,
    prayerActiveYears,
    canAddPeriod,
    remainingYears,
    step1Valid,
    step2Valid,
    step3Valid,
    finalTarget,
    showNext,
    showBack,
    isNextDisabled,
    ageNum,
    pubertyAgeNum,
    customTargetValid,
  } = useWizardStore(
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
  const {
    setAge,
    setPubertyAge,
    toggleAdvanced,
    setQuickYears,
    addPeriod,
    removePeriod,
    updatePeriod,
    setPreset,
    setCustom,
    setCustomTarget,
    nextStep,
    prevStep,
    confirm,
  } = useWizardStore(
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
    () => getStep1Error({ age, pubertyAge }, { ageNum, pubertyAgeNum }, t),
    [age, pubertyAge, ageNum, pubertyAgeNum, t]
  );
  const step2Error = useMemo(
    () => getStep2Error({ totalMissedDays, totalMissedYears, totalYears, prayerActiveYears }, t),
    [totalMissedDays, totalMissedYears, totalYears, prayerActiveYears, t]
  );
  const step3Error = useMemo(
    () => getStep3Error({ dailyTarget, customTarget }, { customTargetValid }, t),
    [dailyTarget, customTarget, customTargetValid, t]
  );
  const handleCustomTargetChange = useCallback(
    (v: string) => {
      setCustomTarget(v.replace(/[^\d]/g, ""));
    },
    [setCustomTarget]
  );
  return {
    t,
    currentStep,
    age,
    setAge,
    pubertyAge,
    setPubertyAge,
    advanced,
    toggleAdvanced,
    quickYears,
    setQuickYears,
    periods,
    addPeriod,
    removePeriod,
    updatePeriod,
    totalMissedDays,
    totalPrayers,
    totalYears,
    prayerActiveYears,
    canAddPeriod,
    remainingYears,
    dailyTarget,
    customTarget,
    step1Valid,
    step1Error,
    step2Valid,
    step2Error,
    step3Valid,
    step3Error,
    finalTarget,
    nextStep,
    prevStep,
    setPreset,
    setCustom,
    setCustomTarget: handleCustomTargetChange,
    confirm,
    showNext,
    showBack,
    isNextDisabled,
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
