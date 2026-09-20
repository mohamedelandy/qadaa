/** @format */
/**
 * Wizard step 3 screen: recovery pace presets plus custom target option.
 */
import { View } from "react-native";
import { useStep3PaceViewModel } from "./Step3Pace.viewmodel";
import { Text } from "@components/Text/Text";
import { TargetSelector } from "@presentation/components/TargetSelector";

export function Step3Pace() {
  const {
    t,
    colors,
    styles,
    isCustom,
    dailyTarget,
    customTarget,
    customError,
    onPreset,
    onCustom,
    onCustomTargetChange,
  } = useStep3PaceViewModel();
  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>{t("wizard.step3Title")}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {t("wizard.step3Subtitle")}
      </Text>

      <TargetSelector
        activeTarget={dailyTarget}
        customTarget={customTarget}
        isCustom={isCustom}
        customError={customError}
        onSelectPreset={onPreset}
        onSelectCustom={onCustom}
        onCustomTargetChange={onCustomTargetChange}
        testIDPrefix="wizard"
        gridTestID="step3-presets-grid"
        errorTestID="wizard-step3-error"
      />
    </View>
  );
}
