/** @format */

import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@components/Input/Input";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { Text } from "@components/Text/Text";
import { useUI } from "@hooks/useUI";
import { useTargetSelectorStyles } from "./TargetSelector.styles";

interface TargetSelectorProps {
  activeTarget: number;
  customTarget: string;
  isCustom: boolean;
  customError?: string;
  onSelectPreset: (n: number) => void;
  onSelectCustom: () => void;
  onCustomTargetChange: (value: string) => void;
  testIDPrefix: string;
  gridTestID?: string;
  errorTestID?: string;
}

export function TargetSelector({
  activeTarget,
  customTarget,
  isCustom,
  customError,
  onSelectPreset,
  onSelectCustom,
  onCustomTargetChange,
  testIDPrefix,
  gridTestID,
  errorTestID,
}: TargetSelectorProps) {
  const { t, colors, gradients, borderRadius } = useUI();
  const styles = useTargetSelectorStyles();

  return (
    <>
      <View testID={gridTestID ?? `${testIDPrefix}-presets-grid`} style={styles.grid}>
        {([1, 5, 10] as const).map((n) => {
          const active = activeTarget === n;
          return (
            <PressableScale
              key={n}
              testID={`${testIDPrefix}-pace-${n}-btn`}
              onPress={() => onSelectPreset(n)}
              style={styles.presetBtn}
            >
              {active ? (
                <LinearGradient
                  colors={[gradients.primaryBtn[0], gradients.primaryBtn[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.gradientFill, { borderRadius: borderRadius.xl }]}
                >
                  <Text style={[styles.presetLabel, { color: colors.white }]}>
                    {t(`wizard.pace${n}` as const)}
                  </Text>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.presetInactive,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.borderStrong,
                      borderRadius: borderRadius.xl,
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
        onPress={onSelectCustom}
        style={[
          styles.customBtn,
          {
            borderRadius: borderRadius.xl,
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
            errorTestID={errorTestID ?? `${testIDPrefix}-error`}
          />
        </View>
      )}

      <Text style={[styles.hint, { color: colors.textPlaceholder }]}>{t("wizard.paceHint")}</Text>
    </>
  );
}
