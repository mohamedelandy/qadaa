/** @format */
/**
 * Destructive reset control with inline confirm/cancel state.
 */
import { View } from "react-native";
import { useResetButtonViewModel } from "./ResetButton.viewmodel";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { LottieView } from "@components/Lottie/LottieView";
interface ResetButtonProps {
  onReset: () => void;
}
export function ResetButton(props: ResetButtonProps) {
  const { t, styles, confirming, setConfirming, onReset } = useResetButtonViewModel(props);
  if (confirming) {
    return (
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <LottieView
            name="warning-pulse"
            loop
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          <Text style={styles.warning}>{t("settings.resetConfirm")}</Text>
        </View>
        <View style={styles.row}>
          <PressableScale
            testID="reset-cancel-btn"
            onPress={() => setConfirming(false)}
            accessibilityRole="button"
            style={[{ flex: 1 }, styles.cancelButton]}
          >
            <Text style={styles.cancelText}>{t("settings.cancel")}</Text>
          </PressableScale>
          <PressableScale
            testID="reset-confirm"
            onPress={() => {
              setConfirming(false);
              onReset();
            }}
            accessibilityRole="button"
            style={[{ flex: 1 }, styles.resetButton]}
          >
            <Text style={styles.resetText}>{t("settings.reset")}</Text>
          </PressableScale>
        </View>
      </View>
    );
  }
  return (
    <PressableScale
      testID="reset-btn"
      onPress={() => setConfirming(true)}
      accessibilityRole="button"
      style={styles.defaultButton}
    >
      <Text style={styles.defaultText}>{t("settings.reset")}</Text>
    </PressableScale>
  );
}
