/** @format */
/**
 * Wizard step 3 screen: recovery pace presets plus custom target option.
 */
import { View } from "react-native";
import { useStep3PaceViewModel } from "./Step3Pace.viewmodel";
import { Text } from "@components/Text/Text";
import { TargetSelection } from "@components/TargetSelection";

export function Step3Pace() {
  const {
    t,
    colors,
    styles,
    isCustom,
    presets,
    dailyTarget,
    customTarget,
    customError,
    onPreset,
    onCustomTargetChange,
  } = useStep3PaceViewModel();

  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>{t("wizard.step3Title")}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {t("wizard.step3Subtitle")}
      </Text>

      <TargetSelection
        preset={dailyTarget}
        customTarget={customTarget}
        isCustom={isCustom}
        customError={customError}
        presets={presets}
        onSelectPreset={onPreset}
        onCustomTargetChange={onCustomTargetChange}
        testIDPrefix="wizard"
        errorTestID="wizard-step3-error"
      />

      <Text style={[styles.hint, { color: colors.textPlaceholder }]}>{t("wizard.paceHint")}</Text>
    </View>
  );
}
