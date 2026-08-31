/** @format */
/**
 * View models for wizard step 2 period rows (add/remove/edit missed periods).
 */
import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import { useWizardStyles } from "@features/wizard/hooks/useWizardStyles";
import { useWizardStore, type WizardPeriod } from "@stores/useWizardStore";
import { useWizardForms } from "../../WizardFormsContext";
import { cleanDecimal } from "../../validation/sanitize";
import { getStep2Error } from "../../errors";
export function usePeriodRowViewModel() {
  const { t, colors, typography, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        periodRow: {
          borderWidth: 1,
          padding: spacing[3],
          marginTop: spacing[3],
          borderColor: colors.border,
          borderRadius: br.lg,
        },
        periodHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: spacing[2.5],
        },
        typeRow: { flexDirection: "row", alignItems: "center", gap: spacing[1.5] },
        typeBtn: {
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          borderWidth: 1,
          borderRadius: br.md,
          minHeight: 44,
          justifyContent: "center",
        },
        typeBtnText: { fontSize: typography.fontSize.base, fontFamily: typography.fonts.bold },
        removeBtn: {
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          minHeight: 44,
          justifyContent: "center",
          alignItems: "center",
        },
        removeText: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          color: colors.red,
        },
      }),
    [colors, typography, br]
  );
  return {
    t,
    colors,
    styles,
  };
}
export function useStep2PeriodsViewModel() {
  const { step2Control } = useWizardForms();
  const state = useWizardStore(
    useShallow((s) => ({
      advanced: s.advanced,
      periods: s.periods,
      toggleAdvanced: s.toggleAdvanced,
      setQuickYears: s.setQuickYears,
      addPeriod: s.addPeriod,
      removePeriod: s.removePeriod,
      updatePeriod: s.updatePeriod,
      totalMissedDays: s.totalMissedDays,
      totalMissedYears: s.totalMissedYears,
      totalYears: s.totalYears,
      prayerActiveYears: s.prayerActiveYears,
      canAddPeriod: s.canAddPeriod,
    }))
  );
  const { t, colors, styles, br } = useWizardStyles();
  const step2Error = useMemo(() => getStep2Error(state, t), [state, t]);
  const handleUpdatePeriod = useCallback(
    (index: number, field: keyof WizardPeriod, value: string | WizardPeriod["type"]) => {
      const next = field === "years" ? cleanDecimal(value) : value;
      state.updatePeriod(index, field, next);
    },
    [state.updatePeriod]
  );
  return {
    t,
    colors,
    styles,
    br,
    step2Control,
    advanced: state.advanced,
    periods: state.periods,
    onToggleAdvanced: state.toggleAdvanced,
    onQuickYearsChange: state.setQuickYears,
    onAddPeriod: state.addPeriod,
    onRemovePeriod: state.removePeriod,
    onUpdatePeriod: handleUpdatePeriod,
    totalMissedDays: state.totalMissedDays,
    step2Error,
    totalYears: state.totalYears,
    prayerActiveYears: state.prayerActiveYears,
    canAddPeriod: state.canAddPeriod,
  };
}
