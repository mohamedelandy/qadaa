/** @format */
/**
 * Pressable that scales its content down on touch using Reanimated springs.
 * The Pressable is the outer element carrying the visual style, so the entire
 * styled surface (background, border, padding) is tappable — not just the label.
 */
import {
  Pressable,
  PressableProps,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";
interface PressableScaleProps extends PressableProps {
  pressScale?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}
export function PressableScale({
  pressScale = 0.97,
  style,
  onPressIn,
  onPressOut,
  children,
  ...props
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const handlePressIn = (e: GestureResponderEvent) => {
    scale.value = withTiming(pressScale, { duration: 80, reduceMotion: ReduceMotion.System });
    onPressIn?.(e);
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    scale.value = withSpring(1, {
      duration: 150,
      dampingRatio: 0.8,
      reduceMotion: ReduceMotion.System,
    });
    onPressOut?.(e);
  };
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable style={style} onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <Animated.View style={pressStyle} collapsable={false}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
