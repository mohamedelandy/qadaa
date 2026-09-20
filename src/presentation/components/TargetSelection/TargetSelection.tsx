/** @format */
/**
 * Shared component for selecting a target (preset chips or custom input).
 */
import { View as RnView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@components/Input/Input";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { Text } from "@components/Text/Text";
import { useUI } from "@hooks/useUI";
import { useTargetSelectionStyles } from "./useTargetSelectionStyles";

interface TargetSelectionProps {
  preset: number;
  customTarget: string;
  isCustom: boolean;
  customError?: string;
  onSelectPreset: (n: number) => void;
  onCustomTargetChange: (value: string) => void;
  testIDPrefix: string;
  presets?: readonly number[];
  errorTestID?: string;
}

export function TargetSelection({
  preset,
  customTarget,
  isCustom,
  customError,
  onSelectPreset,
  onCustomTargetChange,
  testIDPrefix,
  presets = [1, 5, 10],
  errorTestID,
}: TargetSelectionProps) {
  const { t, colors, gradients } = useUI();
  const styles = useTargetSelectionStyles();

  return (
    <>
      <RnView testID={`${testIDPrefix}-presets-grid`} style={styles.presetsGrid}>
        {presets.map((n) => {
          const active = preset === n;
          return (
            <PressableScale
              key={n}
              testID={`${testIDPrefix}-pace-${n}-btn`}
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
        testID={`${testIDPrefix}-pace-custom-btn`}
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
            testID={`${testIDPrefix}-pace-custom-input`}
            value={customTarget}
            onChangeText={onCustomTargetChange}
            placeholder="7"
            keyboardType="numeric"
            autoFocus
            error={customError}
            errorTestID={errorTestID}
          />
        </RnView>
      )}
    </>
  );
}
