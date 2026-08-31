/** @format */
/**
 * Reanimated pulsing opacity bar used as a loading placeholder with configurable size/color.
 */
import { useEffect } from "react";
import { type ViewStyle, type StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { useUI } from "@hooks/useUI";
import { LottieView } from "@components/Lottie/LottieView";
const PULSE_DURATION = 1200;
interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  color?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  useLottie?: boolean;
}
export function Skeleton({
  width = 100,
  height = 16,
  borderRadius,
  color,
  testID = "skeleton-bar",
  style,
  useLottie = false,
}: SkeletonProps) {
  const { colors, borderRadius: br } = useUI();
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, {
        duration: PULSE_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [pulse]);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.4, 1]),
  }));

  if (useLottie) {
    return <LottieView name="shimmer" loop style={[{ width, height }, style]} resizeMode="cover" />;
  }

  const barStyle: ViewStyle = {
    width,
    height,
    borderRadius: borderRadius ?? br.sm,
    backgroundColor: color ?? colors.surfaceAlt,
  };
  return (
    <Animated.View
      testID={testID}
      style={[barStyle, animatedStyle, style]}
      accessibilityRole="text"
    />
  );
}
