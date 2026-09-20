/** @format */
/**
 * Shared pace selector component: recovery pace presets plus custom target option.
 */
import { useMemo } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@components/Input/Input";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { Text } from "@components/Text/Text";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";

export interface PaceSelectorProps {
  preset: number;
  customTarget: string;
  isCustom: boolean;
  customError?: string;
  onSelectPreset: (n: number) => void;
  onSelectCustom: () => void;
  onCustomTargetChange: (value: string) => void;
  testIDPrefix?: string;
  style?: StyleProp<ViewStyle>;
}

export function PaceSelector({
  preset,
  customTarget,
  isCustom,
  customError,
  onSelectPreset,
  onSelectCustom,
  onCustomTargetChange,
  testIDPrefix = "pace",
  style,
}: PaceSelectorProps) {
  const { t, colors, gradients, typography, borderRadius: br } = useUI();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        grid: {
          flexDirection: "row",
          gap: spacing[2],
          marginTop: spacing[3],
        },
        presetBtn: { flex: 1, minHeight: 52 },
        gradientFill: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[2],
          borderRadius: br.xl,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        },
        presetInactive: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[2],
          borderWidth: 1,
          borderColor: colors.borderStrong,
          borderRadius: br.xl,
          backgroundColor: colors.card,
        },
        presetLabelActive: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          color: colors.white,
        },
        presetLabelInactive: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          color: colors.textMuted,
        },
        customBtn: {
          marginTop: spacing[2],
          borderWidth: 1,
          paddingVertical: spacing[3],
          alignItems: "center",
          minHeight: 44,
          justifyContent: "center",
          borderRadius: br.xl,
        },
        customText: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
        customInputWrap: { marginTop: spacing[2] },
      }),
    [colors, typography, br]
  );

  return (
    <View style={style}>
      <View testID={`${testIDPrefix}-presets-grid`} style={styles.grid}>
        {([1, 5, 10] as const).map((n) => {
          const active = preset === n;
          return (
            <PressableScale
              key={n}
              testID={`${testIDPrefix}-${n}-btn`}
              onPress={() => onSelectPreset(n)}
              style={styles.presetBtn}
            >
              {active ? (
                <LinearGradient
                  colors={[gradients.primaryBtn[0], gradients.primaryBtn[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientFill}
                >
                  <Text style={styles.presetLabelActive}>{t(`wizard.pace${n}` as const)}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.presetInactive}>
                  <Text style={styles.presetLabelInactive}>{t(`wizard.pace${n}` as const)}</Text>
                </View>
              )}
            </PressableScale>
          );
        })}
      </View>

      <PressableScale
        testID={`${testIDPrefix}-custom-btn`}
        onPress={onSelectCustom}
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
        <View style={styles.customInputWrap}>
          <Input
            testID={`${testIDPrefix}-custom-input`}
            value={customTarget}
            onChangeText={onCustomTargetChange}
            placeholder="7"
            keyboardType="numeric"
            autoFocus
            error={customError}
            errorTestID={`${testIDPrefix}-error`}
          />
        </View>
      )}
    </View>
  );
}
