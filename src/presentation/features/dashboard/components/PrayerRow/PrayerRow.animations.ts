/** @format */
/**
 * Animated entrance, pop-wiggle, and +1 bubble effects for prayer rows (Reanimated, UI thread).
 */
import { useCallback } from "react";
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";
const REDUCE = { reduceMotion: ReduceMotion.System };
export function usePrayerRowAnimations() {
  const entrance = useSharedValue(0);
  const pop = useSharedValue(1);
  const bubble = useSharedValue(0);
  const wiggle = useSharedValue(0);
  const playEntrance = useCallback(() => {
    entrance.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic), ...REDUCE });
  }, [entrance]);
  const triggerPop = useCallback(() => {
    pop.value = withSequence(
      withTiming(1.08, { duration: 90, easing: Easing.out(Easing.quad), ...REDUCE }),
      withSpring(1, { duration: 220, dampingRatio: 0.7, ...REDUCE })
    );
    wiggle.value = 0;
    wiggle.value = withSequence(
      withTiming(1, { duration: 55, easing: Easing.out(Easing.quad), ...REDUCE }),
      withTiming(-1, { duration: 80, ...REDUCE }),
      withTiming(0.5, { duration: 65, ...REDUCE }),
      withTiming(0, { duration: 70, ...REDUCE })
    );
    bubble.value = 0;
    bubble.value = withSequence(
      withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic), ...REDUCE }),
      withDelay(140, withTiming(0, { duration: 240, easing: Easing.in(Easing.quad), ...REDUCE }))
    );
  }, [pop, wiggle, bubble]);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pop.value },
      { rotate: `${interpolate(wiggle.value, [-1, 0, 1], [-4, 0, 4])}deg` },
    ],
  }));
  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(bubble.value, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
    transform: [
      { translateY: interpolate(bubble.value, [0, 1], [0, -28]) },
      { scale: interpolate(bubble.value, [0, 0.3, 1], [0.7, 1.15, 1]) },
    ],
  }));
  const entranceStyles = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ translateY: (1 - entrance.value) * 20 }],
  }));
  return {
    entrance,
    pop,
    bubble,
    wiggle,
    playEntrance,
    triggerPop,
    buttonStyle,
    bubbleStyle,
    entranceStyles,
  };
}
