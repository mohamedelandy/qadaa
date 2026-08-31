/** @format */
/**
 * One-shot celebration when every prayer for today becomes logged:
 * a success haptic in the same frame as a single HeroCard pulse.
 * Reduced motion keeps the haptic and drops the scale animation.
 */
import { useEffect, useRef, useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  useReducedMotion,
  ReduceMotion,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export function useDayCompletionCelebration(allPrayersDone: boolean) {
  const pulse = useSharedValue(1);
  const reduced = useReducedMotion();
  const celebrated = useRef(false);
  const mounted = useRef(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      celebrated.current = allPrayersDone;
      return;
    }
    if (!allPrayersDone) {
      celebrated.current = false;
      return;
    }
    if (celebrated.current) return;
    celebrated.current = true;
    setShowCelebration(true);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (reduced) return;
    pulse.set(1);
    pulse.set(
      withSequence(
        withTiming(1.04, { duration: 150 }),
        withSpring(1, { duration: 300, dampingRatio: 0.8, reduceMotion: ReduceMotion.System })
      )
    );
  }, [allPrayersDone, reduced, pulse]);

  useEffect(() => {
    if (!allPrayersDone) {
      setShowCelebration(false);
    }
  }, [allPrayersDone]);

  const celebrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.get() }],
  }));
  return { celebrationStyle, showCelebration, setShowCelebration };
}
