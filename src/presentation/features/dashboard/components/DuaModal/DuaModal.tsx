/** @format */
/**
 * Post-logging dua sheet with gradient "Ameen" dismiss button.
 */
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Sheet } from "@components/PageSheet/PageSheet";
import { useDuaModalViewModel } from "./DuaModal.viewmodel";
import { Text } from "@components/Text/Text";
import { LottieView } from "@components/Lottie/LottieView";
import { PressableScale } from "@components/PressableScale/PressableScale";
interface DuaModalProps {
  visible: boolean;
  onClose: () => void;
}
export function DuaModal({ visible, onClose }: DuaModalProps) {
  const { t, styles, accent, textPart, gradients: g } = useDuaModalViewModel();
  return (
    <Sheet visible={visible} onClose={onClose} topBorderColor={accent} testID="dua-modal">
      <LottieView name="lantern" loop style={{ width: 64, height: 64 }} resizeMode="contain" />
      <Text style={styles.subtitle}>{textPart}</Text>
      <Text style={styles.secondarySubtitle}>{t("dua.subtitle")}</Text>
      <Text style={styles.duaText}>{t("dua.text")}</Text>
      <Text style={styles.subtext}>{t("dua.subtext")}</Text>
      <LinearGradient
        colors={[g.primaryBtn[0], g.primaryBtn[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ameenBtn}
      >
        <PressableScale
          testID="dua-close-btn"
          style={styles.ameenPressable}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
          }}
        >
          <Text style={styles.ameenText}>{t("dua.close")}</Text>
        </PressableScale>
      </LinearGradient>
    </Sheet>
  );
}
