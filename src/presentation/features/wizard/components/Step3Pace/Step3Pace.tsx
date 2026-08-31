/** @format */
/**
 * Wizard step 3 screen: recovery pace presets plus custom target option.
 */
import { View } from "react-native";
import { useStep3PaceViewModel } from "./Step3Pace.viewmodel";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@components/Input/Input";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { Text } from "@components/Text/Text";
import { spacing } from "@theme/spacing";
export function Step3Pace() {
  const {
    t,
    colors,
    gradients: g,
    styles,
    isCustom,
    presets,
    br,
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

      <View testID="step3-presets-grid" style={styles.grid}>
        {presets.map((n) => {
          const active = dailyTarget === n;
          return (
            <PressableScale
              key={n}
              testID={`wizard-pace-${n}-btn`}
              onPress={() => onPreset(n)}
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
        testID="wizard-pace-custom-btn"
        onPress={onCustom}
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
        <View style={{ marginTop: spacing[2] }}>
          <Input
            testID="wizard-pace-custom-input"
            value={customTarget}
            onChangeText={onCustomTargetChange}
            placeholder="7"
            keyboardType="numeric"
            autoFocus
            error={customError}
            errorTestID="wizard-step3-error"
          />
        </View>
      )}

      <Text style={[styles.hint, { color: colors.textPlaceholder }]}>{t("wizard.paceHint")}</Text>
    </View>
  );
}
