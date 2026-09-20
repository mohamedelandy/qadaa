/** @format */
/**
 * Daily target card: preset chips, custom input, and save button.
 */
import { View as RnView } from "react-native";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { Text } from "@components/Text/Text";
import { Card } from "@components/Card/Card";
import { SectionHeader } from "@components/SectionHeader/SectionHeader";
import { useUI } from "@hooks/useUI";
import { useSettingsStyles } from "../hooks/useSettingsStyles";
import { LottieView } from "@components/Lottie/LottieView";
import { TargetSelector } from "@presentation/components/TargetSelector";

interface TargetSectionProps {
  preset: number;
  customTarget: string;
  isCustom: boolean;
  isValid: boolean;
  targetSaved: boolean;
  onSelectPreset: (n: number) => void;
  onCustomTargetChange: (value: string) => void;
  onSaveTarget: () => void;
}

export function TargetSection({
  preset,
  customTarget,
  isCustom,
  isValid,
  targetSaved,
  onSelectPreset,
  onCustomTargetChange,
  onSaveTarget,
}: TargetSectionProps) {
  const { t, colors } = useUI();
  const styles = useSettingsStyles();
  // Mirror the wizard's step-3 validation (validation/custom.*) so an invalid
  // custom target shows a visible error instead of silently disabling Save.
  const customError = isCustom
    ? !customTarget
      ? t("validation.custom.required")
      : !isValid
        ? t("validation.custom.range")
        : undefined
    : undefined;
  return (
    <Card>
      <SectionHeader label={t("settings.targetLabel")} />
      <RnView style={styles.targetSection}>
        <Text style={[styles.targetTitle, { color: colors.text }]}>
          {t("settings.targetTitle")}
        </Text>
        <Text style={[styles.targetSubtitle, { color: colors.textMuted }]}>
          {t("settings.targetSubtitle")}
        </Text>

        <TargetSelector
          activeTarget={preset}
          customTarget={customTarget}
          isCustom={isCustom}
          customError={customError}
          onSelectPreset={onSelectPreset}
          onSelectCustom={() => onSelectPreset(-1)}
          onCustomTargetChange={onCustomTargetChange}
          testIDPrefix="settings"
          errorTestID="settings-target-error"
        />

        <PressableScale
          testID="settings-target-save-btn"
          onPress={onSaveTarget}
          disabled={!isValid}
          style={[
            styles.targetSaveButton,
            targetSaved && styles.targetSaveButtonSaved,
            !isValid && styles.targetSaveButtonDisabled,
          ]}
        >
          {targetSaved ? (
            <LottieView
              name="checkmark-draw"
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          ) : (
            <Text variant="base" weight="bold" style={styles.targetSaveText}>
              {t("settings.targetSave")}
            </Text>
          )}
        </PressableScale>
      </RnView>
    </Card>
  );
}
