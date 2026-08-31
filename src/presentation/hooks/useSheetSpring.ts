/** @format */
/**
 * Reanimated spring/timing shared values plus dismiss helper animating bottom sheets in/out.
 */
import { useEffect } from "react";
import { Dimensions } from "react-native";
import { scheduleOnRN } from "react-native-worklets";
import {
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  type SharedValue,
} from "react-native-reanimated";
const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SHEET_SPRING = { damping: 26, stiffness: 300, mass: 0.9 };
const SHEET_IN_DURATION = 200;
const SHEET_OUT_DURATION = 150;
export interface SheetSpringResult {
  translateY: SharedValue<number>;
  opacity: SharedValue<number>;
}
export function useSheetSpring(visible: boolean): SheetSpringResult {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, SHEET_SPRING);
      opacity.value = withTiming(1, {
        duration: SHEET_IN_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [visible, translateY, opacity]);
  return { translateY, opacity };
}
export function dismissSheet(
  translateY: SharedValue<number>,
  opacity: SharedValue<number>,
  onDone: () => void
) {
  opacity.value = withTiming(0, { duration: SHEET_OUT_DURATION, easing: Easing.out(Easing.cubic) });
  translateY.value = withSpring(SCREEN_HEIGHT, SHEET_SPRING, (finished) => {
    if (finished) scheduleOnRN(onDone);
  });
}
