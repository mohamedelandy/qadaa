/** @format */
/**
 * Animated SVG circular progress ring with threshold colors and optional upright percentage label.
 */
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useUI } from "@hooks/useUI";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
}
export function ProgressRing({
  progress,
  size = 40,
  strokeWidth = 3.5,
  color,
  showLabel = true,
}: ProgressRingProps) {
  const { colors, typography } = useUI();
  const clampedPct = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const progressSV = useSharedValue(0);
  useEffect(() => {
    progressSV.value = withTiming(clampedPct, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      reduceMotion: ReduceMotion.System,
    });
  }, [clampedPct, progressSV]);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progressSV.value / 100) * circumference,
  }));
  const displayColor =
    color ?? (clampedPct >= 100 ? colors.green : clampedPct >= 50 ? colors.primary : colors.gold);
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.cardDim}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          stroke={displayColor}
        />
      </Svg>
      {showLabel && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: displayColor,
              fontSize: typography.fontSize.micro,
              fontFamily: typography.fonts.bold,
              textAlign: "center",
              writingDirection: "auto",
              includeFontPadding: false,
            }}
          >
            {Math.round(clampedPct)}%
          </Text>
        </View>
      )}
    </View>
  );
}
