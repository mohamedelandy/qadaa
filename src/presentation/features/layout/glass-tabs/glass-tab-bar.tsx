/** @format */
/**
 * Liquid-glass floating tab bar with sliding highlight, pan/tap switching, minimize, and haptics.
 */
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Children, useCallback, useEffect, useMemo } from "react";
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { TabListProps, TabTriggerSlotProps } from "expo-router/ui";
import { setMinimized, useMinimizeState } from "./minimize";
import { ProgressiveBlur, type ProgressiveBlurMode } from "./progressive-blur";
import { DEFAULT_TAB_THEME, type GlassTabBarTheme } from "@theme/glassTabs";
import { useTabBarStore } from "./tab-bar-store";
import {
  BAR_MARGIN,
  BLUR_BLEED,
  EXPANDED_HEIGHT,
  ITEM_PAD_V,
  ROW_PAD_H,
  barHeight,
  bottomSafeOffset,
  highlightHeight,
  indexAtX,
  sideInset,
} from "./glass-tab-bar.viewmodel";
import { GlassTabHighlight } from "./glass-tab-highlight";
import { GlassTabButtonContent } from "./glass-tab-button-content";
import type { GlassTabItem } from "./glass-tab-item";
export type { GlassTabBarTheme } from "./tab-bar-store";
export type { GlassTabItem } from "./glass-tab-item";
const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);
const SLIDE_SPRING = {
  damping: 18,
  stiffness: 150,
  mass: 1.0,
};
function setSlideIndex(
  slideIndex: SharedValue<number>,
  targetIndex: SharedValue<number>,
  next: number
) {
  "worklet";
  if (targetIndex.value !== next) {
    targetIndex.value = next;
    slideIndex.value = withSpring(next, SLIDE_SPRING);
  }
}
export type GlassTabBarProps = TabListProps & {
  onIndexSelected?: (index: number) => void;
  theme?: Partial<GlassTabBarTheme>;
  haptics?: boolean;
  mode?: ProgressiveBlurMode;
};
export function GlassTabBar({
  children,
  onIndexSelected,
  theme: themeOverrides,
  haptics = true,
  mode = "dark",
  ...props
}: GlassTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const minimized = useMinimizeState();
  const progress = minimized.progress;
  const slideIndex = useTabBarStore((s) => s.slideIndex);
  const targetIndex = useTabBarStore((s) => s.targetIndex);
  const isDragging = useTabBarStore((s) => s.isDragging);
  const setTheme = useTabBarStore((s) => s.setTheme);
  const lastTicked = useSharedValue(-1);
  const tabCount = Math.max(Children.count(children), 1);
  const theme = useMemo(() => ({ ...DEFAULT_TAB_THEME, ...themeOverrides }), [themeOverrides]);
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);
  const tick = useCallback(() => {
    if (haptics && Platform.OS === "ios") {
      void Haptics.selectionAsync();
    }
  }, [haptics]);
  const selectIndex = useCallback((index: number) => onIndexSelected?.(index), [onIndexSelected]);
  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .activeOffsetX([-6, 6])
      .failOffsetY([-14, 14])
      .onStart(() => {
        isDragging.value = true;
        lastTicked.value = Math.round(slideIndex.value);
        setMinimized(minimized, 0);
      })
      .onUpdate((event) => {
        const index = indexAtX(event.x, windowWidth, tabCount, progress.value);
        slideIndex.value = index;
        const rounded = Math.round(index);
        if (rounded !== lastTicked.value) {
          lastTicked.value = rounded;
          scheduleOnRN(tick);
        }
      })
      .onFinalize(() => {
        if (!isDragging.value) {
          return;
        }
        const rounded = Math.round(slideIndex.value);
        setSlideIndex(slideIndex, targetIndex, rounded);
        scheduleOnRN(selectIndex, rounded);
        isDragging.value = false;
      });
    const tap = Gesture.Tap()
      .maxDistance(16)
      .maxDuration(400)
      .onEnd((event, success) => {
        if (!success) {
          return;
        }
        const index = Math.round(indexAtX(event.x, windowWidth, tabCount, progress.value));
        setSlideIndex(slideIndex, targetIndex, index);
        setMinimized(minimized, 0);
        scheduleOnRN(selectIndex, index);
      });
    return Gesture.Race(pan, tap);
  }, [
    windowWidth,
    tabCount,
    selectIndex,
    tick,
    isDragging,
    lastTicked,
    slideIndex,
    targetIndex,
    minimized,
    progress,
  ]);
  const barStyle = useAnimatedStyle(() => ({
    height: barHeight(progress.value),
    marginHorizontal: sideInset(progress.value),
  }));
  const shapeStyle = useAnimatedStyle(() => ({
    borderRadius: barHeight(progress.value) / 2,
  }));
  const bottomOffset = bottomSafeOffset(insets.bottom);
  return (
    <View
      {...props}
      pointerEvents="box-none"
      style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
    >
      <ProgressiveBlur
        direction="bottom"
        mode={mode}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: bottomOffset + EXPANDED_HEIGHT + BLUR_BLEED,
        }}
      />
      <View
        pointerEvents="box-none"
        style={{ marginHorizontal: BAR_MARGIN, marginBottom: bottomOffset }}
      >
        <GestureDetector gesture={gesture}>
          <Animated.View style={barStyle}>
            {isLiquidGlassAvailable() ? (
              <AnimatedGlassView
                glassEffectStyle="regular"
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: theme.glassTint, borderCurve: "continuous" },
                  shapeStyle,
                ]}
              />
            ) : (
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: theme.solidFallback, borderCurve: "continuous" },
                  shapeStyle,
                ]}
              />
            )}
            <GlassTabHighlight
              progress={progress}
              slideIndex={slideIndex}
              windowWidth={windowWidth}
              tabCount={tabCount}
              color={theme.highlight}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: ROW_PAD_H,
              }}
            >
              {children}
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}
export function GlassTabButton({
  item,
  index,
  isFocused,
  onPress,
  ...props
}: TabTriggerSlotProps & {
  item: GlassTabItem;
  index: number;
}) {
  const minimized = useMinimizeState();
  const progress = minimized.progress;
  const slideIndex = useTabBarStore((s) => s.slideIndex);
  const targetIndex = useTabBarStore((s) => s.targetIndex);
  const isDragging = useTabBarStore((s) => s.isDragging);
  const theme = useTabBarStore((s) => s.theme);
  useEffect(() => {
    if (isFocused && !isDragging.value) {
      setSlideIndex(slideIndex, targetIndex, index);
    }
  }, [isFocused, index, slideIndex, targetIndex, isDragging]);
  const boxStyle = useAnimatedStyle(() => ({
    height: highlightHeight(progress.value),
  }));
  return (
    <Pressable
      {...props}
      testID={`tab-${item.name}`}
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: !!isFocused }}
      onPress={(event) => {
        setSlideIndex(slideIndex, targetIndex, index);
        setMinimized(minimized, 0);
        onPress?.(event);
      }}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View
        style={[
          {
            alignSelf: "stretch",
            alignItems: "center",
            paddingTop: ITEM_PAD_V,
            overflow: "hidden",
          },
          boxStyle,
        ]}
      >
        <GlassTabButtonContent
          item={item}
          index={index}
          progress={progress}
          slideIndex={slideIndex}
          theme={theme}
        />
      </Animated.View>
    </Pressable>
  );
}
