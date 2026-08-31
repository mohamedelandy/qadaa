/** @format */
/**
 * Press-in/out scale feedback hook built on Reanimated springs (UI thread).
 * Returns `scale` for composition and a ready-to-spread `pressStyle`.
 */
import { useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";
export function usePressAnimation(scaleTo: number = 0.97) {
  const scale = useSharedValue(1);
  const handlePressIn = useCallback(() => {
    scale.value = withTiming(scaleTo, { duration: 80, reduceMotion: ReduceMotion.System });
  }, [scale, scaleTo]);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      duration: 150,
      dampingRatio: 0.8,
      reduceMotion: ReduceMotion.System,
    });
  }, [scale]);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return {
    scale,
    pressStyle,
    handlePressIn,
    handlePressOut,
  };
}
