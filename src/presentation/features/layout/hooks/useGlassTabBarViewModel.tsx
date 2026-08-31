/** @format */
/**
 * ViewModel for GlassTabBar: tab defs, RTL-mirrored items, theme, and animated hide-on-modal style.
 */
import { useMemo } from "react";
import type { Href } from "expo-router";
import { useAnimatedStyle, withSpring, type AnimatedStyle } from "react-native-reanimated";
import { StyleSheet, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTabLayoutViewModel } from "./useTabLayoutViewModel";
import { useModalVisibilityStore } from "@stores/useModalVisibilityStore";
import {
  buildGlassTabItems,
  buildGlassTabTheme,
  type GlassTabDef,
} from "@presentation/features/layout/glassTabs";
import type { GlassTabItem } from "../glass-tabs/glass-tab-bar";
const HIDE_SPRING = { damping: 18, stiffness: 180 };
const BAR_OFFSCREEN = 120;
type GlassTabBarItem = GlassTabItem & {
  href: Href;
};
export type GlassTabLayout = {
  tabDefs: GlassTabDef[];
  glassItems: GlassTabBarItem[];
  tabTheme: ReturnType<typeof buildGlassTabTheme>;
  isDark: boolean;
  barStyle: AnimatedStyle<ViewStyle>;
  hideDistance: number;
  activeOpen: boolean;
  direction: "ltr" | "rtl";
  wizardComplete: boolean;
  syncVisible: boolean | undefined;
  setSyncVisible: (visible: boolean) => void;
};
export function useGlassTabBarViewModel(): GlassTabLayout {
  const { t, colors, isDark, direction, wizardComplete, syncVisible, setSyncVisible } =
    useTabLayoutViewModel();
  const insets = useSafeAreaInsets();
  const activeOpen = useModalVisibilityStore((s) => s.activeOpen);
  const hideDistance = insets.bottom + BAR_OFFSCREEN;
  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(activeOpen ? hideDistance : 0, HIDE_SPRING) }],
  }));
  const tabDefs = useMemo(() => buildGlassTabItems(t), [t]);
  const ordered = useMemo(
    () => (direction === "rtl" ? [...tabDefs].reverse() : tabDefs),
    [direction, tabDefs]
  );
  const tabTheme = useMemo(() => buildGlassTabTheme(colors, isDark), [colors, isDark]);
  const glassItems = useMemo(
    () =>
      ordered.map(({ icon, ...rest }) => ({
        ...rest,
        renderIcon: ({ tint, size }: { tint: string; size: number }) => (
          <Ionicons name={icon} size={size} color={tint} />
        ),
      })),
    [ordered]
  );
  return {
    tabDefs,
    glassItems,
    tabTheme,
    isDark,
    barStyle,
    hideDistance,
    activeOpen,
    direction,
    wizardComplete,
    syncVisible,
    setSyncVisible,
  };
}
export const tabLayoutStyles = StyleSheet.create({
  primaryTabList: {
    display: "none",
  },
  hideRegion: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabSlot: { height: "100%" },
});
