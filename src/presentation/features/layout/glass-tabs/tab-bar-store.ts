/** @format */
/**
 * Zustand store holding Reanimated shared values (minimize progress, slide index, dragging) and bar theme.
 */
import { create } from "zustand";
import { makeMutable, type SharedValue } from "react-native-reanimated";
import { DEFAULT_TAB_THEME, type GlassTabBarTheme } from "@theme/glassTabs";
export type { GlassTabBarTheme };
type TabBarStoreValues = {
  progress: SharedValue<number>;
  target: SharedValue<number>;
  slideIndex: SharedValue<number>;
  targetIndex: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  theme: GlassTabBarTheme;
};
type TabBarStoreActions = {
  setTheme: (theme: GlassTabBarTheme) => void;
};
export const useTabBarStore = create<TabBarStoreValues & TabBarStoreActions>((set) => ({
  progress: makeMutable(0),
  target: makeMutable(0),
  slideIndex: makeMutable(0),
  targetIndex: makeMutable(0),
  isDragging: makeMutable(false),
  theme: DEFAULT_TAB_THEME,
  setTheme: (theme) => set({ theme }),
}));
