/** @format */
/**
 * Wizard step 1 screen: age and puberty-age inputs with tooltips.
 */
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { useStep1InfoViewModel } from "./Step1Info.viewmodel";
import { Input } from "@components/Input/Input";
import { Tooltip } from "@components/Tooltip/Tooltip";
import { Text } from "@components/Text/Text";
export function Step1Info() {
  const { t, colors, styles, control, step1Error, onAgeChange, onPubertyAgeChange } =
    useStep1InfoViewModel();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{t("wizard.step1Title")}</Text>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textMuted }]}>{t("wizard.ageLabel")}</Text>
          <Tooltip testID="wizard-age-tooltip" text={t("wizard.ageTip")} />
        </View>
        <Controller
          control={control}
          name="age"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              testID="wizard-age-input"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                onAgeChange(text);
              }}
              placeholder="30"
              keyboardType="numeric"
              error={error?.message}
            />
          )}
        />
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            {t("wizard.pubertyAgeLabel")}
          </Text>
          <Tooltip testID="wizard-puberty-tooltip" text={t("wizard.pubertyAgeTip")} />
        </View>
        <Controller
          control={control}
          name="pubertyAge"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              testID="wizard-puberty-input"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                onPubertyAgeChange(text);
              }}
              placeholder="14"
              keyboardType="numeric"
              error={error?.message ?? step1Error}
              errorTestID="wizard-step1-error"
            />
          )}
        />
      </View>
    </View>
  );
}
