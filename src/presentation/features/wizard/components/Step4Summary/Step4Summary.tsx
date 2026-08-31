/** @format */
/**
 * Wizard step 4 summary card with back and confirm actions.
 */
import { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { useStep4SummaryViewModel } from "./Step4Summary.viewmodel";
import { Button } from "@components/Button/Button";
import { Text } from "@components/Text/Text";
import { LottieView } from "@components/Lottie/LottieView";

const CELEBRATION_FALLBACK_MS = 2000;

export function Step4Summary() {
  const { t, colors, styles, rows, onBack, onConfirm } = useStep4SummaryViewModel();
  const reduced = useReducedMotion();
  const [showCelebration, setShowCelebration] = useState(false);

  const finish = () => {
    setShowCelebration(false);
    onConfirm();
  };

  const handleConfirm = () => {
    if (reduced) {
      onConfirm();
      return;
    }
    setShowCelebration(true);
  };

  useEffect(() => {
    if (!showCelebration) return;
    const timer = setTimeout(() => {
      setShowCelebration(false);
      onConfirm();
    }, CELEBRATION_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [showCelebration, onConfirm]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{t("wizard.step4Title")}</Text>

      <View style={styles.card}>
        {rows.map((row, idx) => (
          <View
            key={idx}
            testID={`step4-row-${idx}`}
            style={[
              styles.row,
              idx < rows.length - 1
                ? { borderBottomWidth: 1, borderBottomColor: colors.border }
                : undefined,
            ]}
          >
            <Text style={styles.label}>{row.label}</Text>
            <Text style={[styles.value, { color: row.valueColor }]}>{row.value}</Text>
          </View>
        ))}
      </View>

      <View testID="step4-buttons" style={styles.buttons}>
        <Button
          testID="wizard-step4-back-btn"
          title={t("wizard.back")}
          variant="secondary"
          onPress={onBack}
          style={styles.flexBtn}
        />
        <Button
          testID="wizard-confirm-btn"
          title={t("wizard.confirm")}
          variant="primary"
          onPress={handleConfirm}
          style={styles.flexBtn}
        />
      </View>

      <Modal
        testID="wizard-celebration-modal"
        visible={showCelebration}
        transparent
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={finish}
      >
        <View style={styles.celebrationScene}>
          <LottieView
            name="journey-begins"
            loop={false}
            onAnimationFinish={finish}
            style={{
              width: 300,
              height: 300,
            }}
          />
        </View>
      </Modal>
    </View>
  );
}
