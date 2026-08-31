/** @format */
/**
 * Wizard step 2 advanced mode: missed/regular period rows with years-used meter and add/remove.
 */
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { Controller } from "react-hook-form";
import { Tooltip } from "@components/Tooltip/Tooltip";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { usePeriodRowViewModel, useStep2PeriodsViewModel } from "./Step2Periods.viewmodel";
import { Input } from "@components/Input/Input";
import { Text } from "@components/Text/Text";
import { useUI } from "@hooks/useUI";
import { formatNumber } from "@domain/format";
import type { WizardPeriod } from "../../hooks/useWizardViewModel";
interface PeriodRowProps {
  period: WizardPeriod;
  idx: number;
  totalPeriods: number;
  onUpdatePeriod: (i: number, field: keyof WizardPeriod, v: string | WizardPeriod["type"]) => void;
  onRemovePeriod: (i: number) => void;
}
function PeriodRow({ period, idx, totalPeriods, onUpdatePeriod, onRemovePeriod }: PeriodRowProps) {
  const { t, colors, styles } = usePeriodRowViewModel();
  return (
    <View style={styles.periodRow}>
      <View style={styles.periodHeader}>
        <View style={styles.typeRow}>
          <PressableScale
            testID={`wizard-period-${idx}-type-missed`}
            accessibilityRole="button"
            accessibilityState={{ selected: period.type === "missed" }}
            style={[
              styles.typeBtn,
              {
                backgroundColor: period.type === "missed" ? colors.primary : colors.card,
                borderColor: colors.borderStrong,
              },
            ]}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onUpdatePeriod(idx, "type", "missed");
            }}
          >
            <Text
              style={[
                styles.typeBtnText,
                { color: period.type === "missed" ? colors.white : colors.textMuted },
              ]}
            >
              {t("wizard.periodMissed")}
            </Text>
          </PressableScale>
          <PressableScale
            testID={`wizard-period-${idx}-type-regular`}
            accessibilityRole="button"
            accessibilityState={{ selected: period.type === "regular" }}
            style={[
              styles.typeBtn,
              {
                backgroundColor: period.type === "regular" ? colors.surfaceAlt : colors.card,
                borderColor: colors.borderStrong,
              },
            ]}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onUpdatePeriod(idx, "type", "regular");
            }}
          >
            <Text
              style={[
                styles.typeBtnText,
                { color: period.type === "regular" ? colors.white : colors.textMuted },
              ]}
            >
              {t("wizard.periodRegular")}
            </Text>
          </PressableScale>
          <Tooltip
            testID={`wizard-period-${idx}-type-tooltip`}
            text={
              period.type === "missed" ? t("wizard.periodMissedTip") : t("wizard.periodRegularTip")
            }
          />
        </View>
        {totalPeriods > 1 && (
          <PressableScale
            testID={`wizard-period-${idx}-remove-btn`}
            style={styles.removeBtn}
            onPress={() => onRemovePeriod(idx)}
            accessibilityRole="button"
          >
            <Text style={styles.removeText}>{t("wizard.removePeriod")}</Text>
          </PressableScale>
        )}
      </View>
      <Input
        value={period.years}
        onChangeText={(text) => onUpdatePeriod(idx, "years", text)}
        placeholder={t("wizard.yearsPlaceholder")}
        keyboardType="decimal-pad"
        testID={`wizard-period-${idx}-years-input`}
      />
    </View>
  );
}
export function Step2Periods() {
  const { isRTL } = useUI();
  const {
    t,
    colors,
    styles,
    br,
    step2Control,
    advanced,
    periods,
    onToggleAdvanced,
    onQuickYearsChange,
    onAddPeriod,
    onRemovePeriod,
    onUpdatePeriod,
    totalMissedDays,
    step2Error,
    totalYears,
    prayerActiveYears,
    canAddPeriod,
  } = useStep2PeriodsViewModel();
  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>{t("wizard.step2Title")}</Text>

      {!advanced ? (
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              {t("wizard.yearsLabel")}
            </Text>
            <Tooltip testID="wizard-years-tooltip" text={t("wizard.yearsTip")} />
          </View>
          <Controller
            name="quickYears"
            control={step2Control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                testID="wizard-years-quick-input"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  onQuickYearsChange(text);
                }}
                placeholder="5"
                keyboardType="decimal-pad"
                error={error?.message ?? step2Error}
                errorTestID="wizard-step2-error"
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.field}>
          {periods.map((period, idx) => (
            <PeriodRow
              key={idx}
              period={period}
              idx={idx}
              totalPeriods={periods.length}
              onUpdatePeriod={onUpdatePeriod}
              onRemovePeriod={onRemovePeriod}
            />
          ))}

          <PressableScale
            testID="wizard-add-period-btn"
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onAddPeriod();
            }}
            disabled={!canAddPeriod}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canAddPeriod }}
            style={[styles.addBtn, !canAddPeriod && styles.addBtnDisabled]}
          >
            <Text style={[styles.addText, { color: colors.primary }]}>
              + {t("wizard.addPeriod")}
            </Text>
          </PressableScale>
        </View>
      )}
      {advanced && (
        <View style={styles.meterRow}>
          <Text testID="wizard-step2-meter" style={[styles.meterText, { color: colors.textMuted }]}>
            {t("wizard.yearsUsedMeter", { used: totalYears, total: prayerActiveYears })}
          </Text>
        </View>
      )}

      {advanced && !!step2Error && (
        <Text testID="wizard-step2-error" style={[styles.error, { color: colors.red }]}>
          {step2Error}
        </Text>
      )}
      <PressableScale
        testID="wizard-step2-advanced-btn"
        onPress={onToggleAdvanced}
        accessibilityRole="button"
        accessibilityState={{ selected: advanced }}
      >
        <View style={styles.advancedToggle}>
          <Tooltip testID="wizard-advanced-tooltip" text={t("wizard.advancedTip")} />
          <Text style={[styles.advancedText, { color: colors.textMuted }]}>
            {t("wizard.advancedToggle")}
          </Text>
        </View>
      </PressableScale>

      <View
        style={[
          styles.counterCard,
          {
            backgroundColor: colors.greenSurface,
            borderColor: colors.greenBorder,
            borderRadius: br.xl,
          },
        ]}
      >
        <View style={styles.counterLabel}>
          <Text style={[styles.counterText, { color: colors.green }]}>
            {t("wizard.totalMissed")}
          </Text>
          <Tooltip testID="wizard-total-missed-tooltip" text={t("wizard.totalMissedTip")} />
        </View>
        <Text style={[styles.counterValue, { color: colors.green }]}>
          {formatNumber(totalMissedDays, isRTL)}
        </Text>
      </View>
    </View>
  );
}
