/** @format */
/**
 * Bottom sheet showing pre-logging intention text; confirms on press or auto-confirms after 4s with haptics.
 */
import { useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Sheet } from "@components/PageSheet/PageSheet";
import { useIntentionSheetStyles } from "../../hooks/useIntentionSheetStyles";
import { useTimeout } from "@hooks/useTimeout";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { LottieView } from "@components/Lottie/LottieView";

const AUTO_CONFIRM_TIMEOUT_MS = 4000;

interface IntentionSheetProps {
  visible: boolean;
  onConfirm: () => void;
}
export function IntentionSheet({ visible, onConfirm }: IntentionSheetProps) {
  const { t, styles, accent, gradients: g } = useIntentionSheetStyles();
  const confirmedRef = useRef(false);
  const onConfirmRef = useRef(onConfirm);
  const timeout = useTimeout();
  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);
  const confirm = () => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;
    onConfirmRef.current();
  };
  useEffect(() => {
    timeout.clear();
    confirmedRef.current = false;
    if (visible) {
      timeout.set(confirm, AUTO_CONFIRM_TIMEOUT_MS);
    }
  }, [visible, timeout]);
  return (
    <Sheet visible={visible} onClose={confirm} topBorderColor={accent} testID="intention-sheet">
      <LottieView name="lantern" loop style={{ width: 64, height: 64 }} resizeMode="contain" />
      <Text style={styles.title}>{t("intention.title")}</Text>
      <Text style={styles.intentionText}>{t("intention.text")}</Text>
      <LinearGradient
        colors={[g.primaryBtn[0], g.primaryBtn[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ameenBtn}
      >
        <PressableScale
          testID="intention-confirm-btn"
          style={styles.ameenPressable}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            confirm();
          }}
        >
          <Text style={styles.ameenText}>{t("intention.confirm")}</Text>
        </PressableScale>
      </LinearGradient>
      <Text style={styles.autoHint}>{t("intention.auto")}</Text>
    </Sheet>
  );
}
