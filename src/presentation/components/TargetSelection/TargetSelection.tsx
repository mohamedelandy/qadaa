/** @format */
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@components/Input/Input";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { Text } from "@components/Text/Text";
import { useUI } from "@hooks/useUI";
import { useTargetSelectionStyles } from "./TargetSelection.styles";

interface TargetSelectionProps {
  preset: number;
  customTarget: string;
  isCustom: boolean;
  customError?: string;
  testIDPrefix?: string;
  presets?: readonly number[];
  onSelectPreset: (n: number) => void;
  onCustomTargetChange: (value: string) => void;
}

export function TargetSelection({
  preset,
  customTarget,
  isCustom,
  customError,
  testIDPrefix = "wizard",
  presets = [1, 5, 10],
  onSelectPreset,
  onCustomTargetChange,
}: TargetSelectionProps) {
  const { t, colors, gradients: g, borderRadius: br } = useUI();
  const styles = useTargetSelectionStyles();

  return (
    <View>
      <View
        testID={testIDPrefix === "settings" ? "settings-presets-grid" : "step3-presets-grid"}
        style={styles.grid}
      >
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
                  colors={[g.primaryBtn[0], g.primaryBtn[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.gradientFill, { borderRadius: br.xl }]}
                >
                  <Text style={styles.presetLabel}>{t(`wizard.pace${n}` as const)}</Text>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.presetInactive,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.borderStrong,
                      borderRadius: br.xl,
                    },
                  ]}
                >
                  <Text style={[styles.presetLabel, { color: colors.textMuted }]}>
                    {t(`wizard.pace${n}` as const)}
                  </Text>
                </View>
              )}
            </PressableScale>
          );
        })}
      </View>

      <PressableScale
        testID={`${testIDPrefix}-pace-custom-btn`}
        onPress={() => onSelectPreset(-1)}
        style={[
          styles.customBtn,
          {
            borderRadius: br.xl,
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
        <View style={styles.customInputWrap}>
          <Input
            testID={`${testIDPrefix}-pace-custom-input`}
            value={customTarget}
            onChangeText={onCustomTargetChange}
            placeholder="7"
            keyboardType="numeric"
            autoFocus
            error={customError}
            errorTestID={
              testIDPrefix === "settings" ? "settings-target-error" : "wizard-step3-error"
            }
          />
        </View>
      )}
    </View>
  );
}
