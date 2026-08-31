/** @format */
/**
 * Daily target card: preset chips, custom input, and save button.
 */
import { View as RnView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@components/Input/Input";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { Text } from "@components/Text/Text";
import { Card } from "@components/Card/Card";
import { SectionHeader } from "@components/SectionHeader/SectionHeader";
import { useUI } from "@hooks/useUI";
import { useSettingsStyles } from "../hooks/useSettingsStyles";
import { LottieView } from "@components/Lottie/LottieView";

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
  const { t, colors, gradients } = useUI();
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

        <RnView testID="settings-presets-grid" style={styles.presetsGrid}>
          {([1, 5, 10] as const).map((n) => {
            const active = preset === n;
            return (
              <PressableScale
                key={n}
                testID={`settings-pace-${n}-btn`}
                onPress={() => onSelectPreset(n)}
                style={styles.presetBtn}
              >
                {active ? (
                  <LinearGradient
                    colors={gradients.primaryBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.presetGradient}
                  >
                    <Text style={styles.presetLabel}>{t(`wizard.pace${n}` as const)}</Text>
                  </LinearGradient>
                ) : (
                  <RnView style={styles.presetInactive}>
                    <Text style={styles.presetLabelInactive}>{t(`wizard.pace${n}` as const)}</Text>
                  </RnView>
                )}
              </PressableScale>
            );
          })}
        </RnView>

        <PressableScale
          testID="settings-pace-custom-btn"
          onPress={() => onSelectPreset(-1)}
          style={[
            styles.customBtn,
            {
              borderColor: isCustom ? colors.primary : colors.borderStrong,
              backgroundColor: isCustom ? colors.greenSubtle : colors.card,
            },
          ]}
        >
          <Text style={[styles.customText, { color: isCustom ? colors.green : colors.textMuted }]}>
            {t("wizard.paceCustom")}
          </Text>
        </PressableScale>

        {isCustom && (
          <RnView style={styles.customInputWrap}>
            <Input
              testID="settings-pace-custom-input"
              value={customTarget}
              onChangeText={onCustomTargetChange}
              placeholder="7"
              keyboardType="numeric"
              autoFocus
              error={customError}
              errorTestID="settings-target-error"
            />
          </RnView>
        )}

        <Text style={[styles.targetHint, { color: colors.textPlaceholder }]}>
          {t("wizard.paceHint")}
        </Text>

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
