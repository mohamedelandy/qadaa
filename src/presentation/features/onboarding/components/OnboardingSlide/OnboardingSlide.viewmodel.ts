/** @format */
/**
 * Onboarding slide styles plus entrance animation values for container, emoji, and text fade/scale/translate.
 */
import { useEffect, useState, useMemo } from "react";
import { StyleSheet } from "react-native";
import {
  Easing,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
export function useOnboardingSlideViewModel() {
  const { colors, typography, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: spacing[6],
        },
        emojiShadowContainer: {
          width: 112,
          height: 112,
          borderRadius: 56,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.18,
          shadowRadius: 48,
          elevation: 24,
          shadowColor: colors.primary,
        },
        emojiCircle: {
          width: 112,
          height: 112,
          borderRadius: 56,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          overflow: "hidden",
        },
        emojiGradient: {
          position: "absolute",
          top: spacing[0],
          start: 0,
          end: 0,
          bottom: spacing[0],
          borderRadius: 56,
        },
        emoji: { fontSize: typography.fontSize["5xl"] },
        textBlock: { marginTop: spacing[10], alignItems: "center", gap: spacing[3] },
        title: {
          fontSize: typography.fontSize["2xl"],
          fontFamily: typography.fonts.bold,
          lineHeight: 33,
          textAlign: "center",
        },
        body: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.regular,
          lineHeight: 26,
          textAlign: "center",
        },
      }),
    [colors, typography, br]
  );
  return { colors, styles };
}
export function useOnboardingSlideAnimation() {
  const containerX = useSharedValue<number>(50);
  const containerOpacity = useSharedValue<number>(0);
  const emojiScale = useSharedValue<number>(0.5);
  const emojiOpacity = useSharedValue<number>(0);
  const textY = useSharedValue<number>(14);
  const textOpacity = useSharedValue<number>(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const RM = { reduceMotion: ReduceMotion.System };
    containerX.value = withTiming(0, {
      duration: 280,
      easing: Easing.out(Easing.ease),
      ...RM,
    });
    containerOpacity.value = withTiming(1, {
      duration: 280,
      easing: Easing.out(Easing.ease),
      ...RM,
    });
    emojiScale.value = withDelay(80, withSpring(1, { duration: 260, dampingRatio: 0.75, ...RM }));
    emojiOpacity.value = withDelay(80, withTiming(1, { duration: 200, ...RM }));
    textY.value = withDelay(
      150,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.ease), ...RM })
    );
    textOpacity.value = withDelay(
      150,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease), ...RM })
    );
  }, []);
  return { mounted, containerX, containerOpacity, emojiScale, emojiOpacity, textY, textOpacity };
}
