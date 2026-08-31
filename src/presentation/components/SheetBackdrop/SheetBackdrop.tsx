/** @format */
/**
 * Animated blurred sheet backdrop whose opacity follows a shared value and closes on press.
 */
import { StyleSheet, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import { useUI } from "@hooks/useUI";
interface SheetBackdropProps {
  opacity: SharedValue<number>;
  onClose: () => void;
}
export function SheetBackdrop({ opacity, onClose }: SheetBackdropProps) {
  const { colors, t } = useUI();
  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]} pointerEvents="box-none">
      <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("a11y.close")}
        onPress={onClose}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
      />
    </Animated.View>
  );
}
