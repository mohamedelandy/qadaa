/** @format */
import { I18nManager, type ViewStyle, type StyleProp } from "react-native";
import RNLottieView, { type LottieViewProps } from "lottie-react-native";
import { useReducedMotion } from "react-native-reanimated";
import { ANIMATIONS, type AnimationName } from "@lottie-assets/animations";

interface LottieProps {
  name: AnimationName;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  onAnimationFinish?: LottieViewProps["onAnimationFinish"];
  style?: StyleProp<ViewStyle>;
  testID?: string;
  resizeMode?: LottieViewProps["resizeMode"];
}

export function LottieView({
  name,
  loop = false,
  autoplay = true,
  speed = 1,
  onAnimationFinish,
  style,
  testID,
  resizeMode,
}: LottieProps) {
  const reduced = useReducedMotion();

  if (reduced) return null;

  const source = ANIMATIONS[name];

  return (
    <RNLottieView
      source={source}
      loop={loop}
      autoPlay={autoplay}
      speed={speed}
      onAnimationFinish={onAnimationFinish}
      renderMode="HARDWARE"
      resizeMode={resizeMode}
      testID={testID ?? `lottie-${name}`}
      style={[{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }, style]}
    />
  );
}
