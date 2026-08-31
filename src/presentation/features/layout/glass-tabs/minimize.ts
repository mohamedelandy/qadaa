/** @format */
/**
 * Shared-value minimize machine collapsing/expanding the tab bar from scroll direction and top offset.
 */
import {
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { useTabBarStore } from "./tab-bar-store";
export const MINIMIZE_SPRING = { duration: 380, dampingRatio: 1 };
export type MinimizeState = {
  progress: SharedValue<number>;
  target: SharedValue<number>;
};
export function useMinimizeState(): MinimizeState {
  return useTabBarStore();
}
export function useTabBarMinimized(): SharedValue<number> {
  return useTabBarStore((s) => s.progress);
}
export function setMinimized(state: MinimizeState, next: 0 | 1) {
  "worklet";
  if (state.target.value !== next) {
    state.target.value = next;
    state.progress.value = withSpring(next, MINIMIZE_SPRING);
  }
}
export function useMinimizeOnScroll() {
  const state = useMinimizeState();
  const previousY = useSharedValue(0);
  return useAnimatedScrollHandler({
    onScroll: (event) => {
      const maxY = Math.max(event.contentSize.height - event.layoutMeasurement.height, 0);
      const y = Math.min(Math.max(event.contentOffset.y, 0), maxY);
      const dy = y - previousY.value;
      previousY.value = y;
      if (y < 24) {
        setMinimized(state, 0);
      } else if (dy > 3) {
        setMinimized(state, 1);
      } else if (dy < -3) {
        setMinimized(state, 0);
      }
    },
  });
}
