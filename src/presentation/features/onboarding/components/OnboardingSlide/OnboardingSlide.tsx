/** @format */
/**
 * Animated onboarding slide component rendering a glowing emoji circle with title and body text.
 */
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import {
  useOnboardingSlideViewModel,
  useOnboardingSlideAnimation,
} from "./OnboardingSlide.viewmodel";
import { Text } from "@components/Text/Text";
import { LottieView } from "@components/Lottie/LottieView";
import type { AnimationName } from "@components/Lottie";
interface OnboardingSlideProps {
  emoji: string;
  title: string;
  body: string;
  animationName?: AnimationName;
  testID?: string;
}
export function OnboardingSlide({
  emoji,
  title,
  body,
  animationName,
  testID,
}: OnboardingSlideProps) {
  const { colors, styles } = useOnboardingSlideViewModel();
  const { mounted, containerX, containerOpacity, emojiScale, emojiOpacity, textY, textOpacity } =
    useOnboardingSlideAnimation();
  if (!mounted) return null;
  return (
    <Animated.View
      testID={testID}
      style={[
        styles.container,
        { opacity: containerOpacity, transform: [{ translateX: containerX }] },
      ]}
    >
      <View style={styles.emojiShadowContainer}>
        <Animated.View
          style={[
            styles.emojiCircle,
            { borderColor: colors.primaryGlowBorder },
            { opacity: emojiOpacity, transform: [{ scale: emojiScale }] },
          ]}
        >
          <LinearGradient
            colors={[colors.primaryGlowBg[0], colors.primaryGlowBg[1]]}
            style={styles.emojiGradient}
          />
          {animationName ? (
            <LottieView
              name={animationName}
              loop
              style={{ position: "absolute", width: 120, height: 120 }}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.emoji}>{emoji}</Text>
          )}
        </Animated.View>
      </View>
      <Animated.View
        style={[styles.textBlock, { opacity: textOpacity, transform: [{ translateY: textY }] }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.body, { color: colors.textDim }]}>{body}</Text>
      </Animated.View>
    </Animated.View>
  );
}
