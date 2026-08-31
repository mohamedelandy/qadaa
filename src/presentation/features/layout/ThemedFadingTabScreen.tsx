/** @format */
/**
 * Tab scene renderer: themed background, blur freeze/detach, and fade+scale entrance on focus.
 */
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Screen } from "react-native-screens";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useUI } from "@hooks/useUI";
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
function FadeIn({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  const progress = useSharedValue(1);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (focused) {
      progress.value = 0;
      progress.value = withTiming(1, { duration: 220, easing: EASE_OUT });
    } else {
      progress.value = 0;
    }
  }, [focused, progress]);
  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.985, 1]) }],
  }));
  return <Animated.View style={[{ flex: 1 }, style]}>{children}</Animated.View>;
}
function ThemedFadingScreen({
  isFocused,
  detachInactiveScreens,
  freezeOnBlur,
  children,
}: {
  isFocused: boolean;
  detachInactiveScreens: boolean;
  freezeOnBlur?: boolean;
  children: React.ReactNode;
}) {
  const { colors } = useUI();
  return (
    <Screen
      enabled={detachInactiveScreens}
      activityState={isFocused ? 2 : 0}
      freezeOnBlur={freezeOnBlur}
      style={[
        styles.screen,
        isFocused ? styles.focused : styles.unfocused,
        { backgroundColor: colors.surfaceDim },
      ]}
    >
      <FadeIn focused={isFocused}>{children}</FadeIn>
    </Screen>
  );
}
interface TabSceneDescriptor {
  options: {
    lazy?: boolean;
    unmountOnBlur?: boolean;
    freezeOnBlur?: boolean;
  };
  render: () => React.ReactNode;
  route: {
    key: string;
  };
}
export function themedFadingTabScreen(
  descriptor: TabSceneDescriptor,
  ctx: {
    isFocused: boolean;
    loaded: boolean;
    detachInactiveScreens: boolean;
  }
) {
  const { isFocused, loaded, detachInactiveScreens } = ctx;
  const { lazy = true, unmountOnBlur, freezeOnBlur } = descriptor.options;
  if (unmountOnBlur && !isFocused) {
    return null;
  }
  if (lazy && !loaded && !isFocused) {
    return null;
  }
  return (
    <ThemedFadingScreen
      key={descriptor.route.key}
      isFocused={isFocused}
      detachInactiveScreens={detachInactiveScreens}
      freezeOnBlur={freezeOnBlur}
    >
      {descriptor.render()}
    </ThemedFadingScreen>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
    height: "100%",
  },
  focused: {
    zIndex: 1,
    display: "flex",
    flexShrink: 0,
    flexGrow: 1,
  },
  unfocused: {
    zIndex: -1,
    display: "none",
    flexShrink: 1,
    flexGrow: 0,
  },
});
