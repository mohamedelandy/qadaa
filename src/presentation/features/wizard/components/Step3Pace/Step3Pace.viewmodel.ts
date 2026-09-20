/** @format */
/**
 * View model for step 3 pace selection and custom target validation.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import { useWizardStore } from "@stores/useWizardStore";
import { getStep3Error } from "../../errors";
const presets = [1, 5, 10] as const;
export function useStep3PaceViewModel() {
  const state = useWizardStore(
    useShallow((s) => ({
      dailyTarget: s.dailyTarget,
      customTarget: s.customTarget,
      customTargetValid: s.customTargetValid,
      setPreset: s.setPreset,
      setCustom: s.setCustom,
      setCustomTarget: s.setCustomTarget,
    }))
  );
  const { t, colors, typography, isRTL } = useUI();
  const isCustom = state.dailyTarget === -1;
  const step3Error = useMemo(() => getStep3Error(state, state, t), [state, t]);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: { fontSize: typography.fontSize["2xl"], fontFamily: typography.fonts.bold },
        subtitle: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          marginTop: spacing[3],
        },
        hint: {
          fontSize: typography.fontSize.xs,
          textAlign: "center",
          marginTop: spacing[5],
          fontFamily: typography.fonts.medium,
        },
      }),
    [typography, isRTL]
  );
  return {
    t,
    colors,
    styles,
    isCustom,
    presets,
    isRTL,
    dailyTarget: state.dailyTarget,
    customTarget: state.customTarget,
    customError: step3Error,
    onPreset: state.setPreset,
    onCustom: state.setCustom,
    onCustomTargetChange: state.setCustomTarget,
  };
}
