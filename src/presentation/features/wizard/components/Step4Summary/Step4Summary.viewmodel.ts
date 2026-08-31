/** @format */
/**
 * View model building the five wizard summary rows from store state.
 */
import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import { useWizardStore } from "@stores/useWizardStore";
import { formatNumber } from "@domain/format";
export function useStep4SummaryViewModel() {
  const state = useWizardStore(
    useShallow((s) => ({
      age: s.age,
      pubertyAge: s.pubertyAge,
      totalMissedDays: s.totalMissedDays,
      totalPrayers: s.totalPrayers,
      dailyTarget: s.dailyTarget,
      customTarget: s.customTarget,
      prevStep: s.prevStep,
      confirm: s.confirm,
    }))
  );
  const { t, colors, typography, borderRadius: br, isRTL } = useUI();
  const router = useRouter();
  const onConfirm = useCallback(() => {
    state.confirm();
    router.replace("/(tabs)/dashboard");
  }, [state.confirm, router]);
  const fmt = (v: string | number): string => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? formatNumber(n, isRTL) : String(v);
  };
  const targetDisplay = state.dailyTarget === -1 ? state.customTarget : String(state.dailyTarget);
  const rows = useMemo(
    () => [
      { label: t("wizard.ageLabel"), value: fmt(state.age), valueColor: colors.text },
      {
        label: t("wizard.pubertyAgeLabel"),
        value: fmt(state.pubertyAge),
        valueColor: colors.text,
      },
      {
        label: t("wizard.totalMissed"),
        value: formatNumber(state.totalMissedDays, isRTL),
        valueColor: colors.green,
      },
      {
        label: t("wizard.totalPrayers"),
        value: formatNumber(state.totalPrayers, isRTL),
        valueColor: colors.gold,
      },
      { label: t("wizard.step3Title"), value: fmt(targetDisplay), valueColor: colors.textMuted },
    ],
    [t, colors, state, targetDisplay, isRTL]
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
        },
        celebrationScene: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surface,
        },
        title: { fontSize: typography.fontSize["2xl"], fontFamily: typography.fonts.bold },
        card: {
          borderWidth: 1,
          overflow: "hidden",
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: br.xl,
          marginTop: spacing[2],
        },
        row: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3.5],
        },
        label: {
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          flex: 1,
          color: colors.textMuted,
        },
        value: { fontSize: typography.fontSize.lg, fontFamily: typography.fonts.bold },
        buttons: {
          flexDirection: "row",
          gap: spacing[3],
          marginTop: spacing[6],
        },
        flexBtn: { flex: 1 },
      }),
    [colors, typography, br, isRTL]
  );
  return {
    t,
    colors,
    styles,
    rows,
    br,
    onBack: state.prevStep,
    onConfirm,
  };
}
