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
  const { t, colors, gradients: g, typography, borderRadius: br, isRTL } = useUI();
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
        grid: {
          flexDirection: "row",
          gap: spacing[2],
          marginTop: spacing[5],
        },
        presetBtn: { flex: 1, minHeight: 52 },
        gradientFill: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[2],
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        },
        presetInactive: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[2],
          borderWidth: 1,
        },
        presetLabel: { fontSize: typography.fontSize.base, fontFamily: typography.fonts.bold },
        customBtn: {
          marginTop: spacing[5],
          borderWidth: 1,
          paddingVertical: spacing[3],
          alignItems: "center",
          minHeight: 44,
          justifyContent: "center",
        },
        customText: { fontSize: typography.fontSize.base, fontFamily: typography.fonts.bold },
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
    gradients: g,
    styles,
    isCustom,
    presets,
    br,
    isRTL,
    dailyTarget: state.dailyTarget,
    customTarget: state.customTarget,
    customError: step3Error,
    onPreset: state.setPreset,
    onCustom: state.setCustom,
    onCustomTargetChange: state.setCustomTarget,
  };
}
