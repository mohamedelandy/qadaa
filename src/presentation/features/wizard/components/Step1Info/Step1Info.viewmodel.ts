/** @format */
/**
 * View model binding wizard step 1 age inputs to the store.
 */
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWizardStyles } from "../../hooks/useWizardStyles";
import { useWizardStore } from "@stores/useWizardStore";
import { useWizardForms } from "../../WizardFormsContext";
import { getStep1Error } from "../../errors";
export function useStep1InfoViewModel() {
  const { t, colors, styles } = useWizardStyles();
  const { control } = useWizardForms();
  const state = useWizardStore(
    useShallow((s) => ({
      age: s.age,
      pubertyAge: s.pubertyAge,
      ageNum: s.ageNum,
      pubertyAgeNum: s.pubertyAgeNum,
      setAge: s.setAge,
      setPubertyAge: s.setPubertyAge,
    }))
  );
  const step1Error = useMemo(
    () =>
      getStep1Error(
        { age: state.age, pubertyAge: state.pubertyAge },
        { ageNum: state.ageNum, pubertyAgeNum: state.pubertyAgeNum },
        t
      ),
    [state, t]
  );
  return {
    t,
    colors,
    styles,
    control,
    step1Error,
    onAgeChange: state.setAge,
    onPubertyAgeChange: state.setPubertyAge,
  };
}
