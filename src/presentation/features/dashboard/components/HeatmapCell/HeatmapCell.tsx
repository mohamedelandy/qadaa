/** @format */
/**
 * Animated heatmap cell with tier fills, today pulse ring, and log burst effect.
 * Placeholders render as static views so they mount zero animated nodes.
 */
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { useSharedStyles } from "@theme/sharedStyles";
import { spacing } from "@theme/spacing";
import { LottieView } from "@components/Lottie/LottieView";
import { getHeatmapPalette, heatmapFill, heatmapGlow } from "./heatmapPalette";
const PULSE_DURATION = 1800;
const PULSE_OFFSET = 900;
interface HeatmapCellProps {
  intensity: number;
  isToday: boolean;
  placeholder?: boolean;
  mountDelay?: number;
  style?: StyleProp<ViewStyle>;
}
export function HeatmapCell(props: HeatmapCellProps) {
  if (props.placeholder) {
    return <PlaceholderCell style={props.style} />;
  }
  return <ActiveCell {...props} />;
}
function PlaceholderCell({ style }: { style?: StyleProp<ViewStyle> }) {
  const { borderRadius: br } = useSharedStyles();
  return (
    <View
      testID="heatmap-placeholder"
      style={[
        style,
        {
          borderRadius: br.md,
          backgroundColor: "transparent",
        },
      ]}
    />
  );
}
function ActiveCell({ intensity, isToday, mountDelay = 0, style }: HeatmapCellProps) {
  const { colors, borderRadius: br } = useSharedStyles();
  const mount = useSharedValue(0);
  const burst = useSharedValue(0);
  const ring = useSharedValue(0);
  const ringOuter = useSharedValue(0);
  const prevLogged = useRef(intensity > 0);
  const [showBurst, setShowBurst] = useState(false);
  useEffect(() => {
    mount.value = withDelay(
      mountDelay,
      withTiming(1, { duration: 240, easing: Easing.out(Easing.cubic) })
    );
  }, [mount, mountDelay]);
  useEffect(() => {
    const nowLogged = intensity > 0;
    if (nowLogged && !prevLogged.current) {
      setShowBurst(true);
      burst.value = withSequence(
        withTiming(1, { duration: 120, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 300, easing: Easing.inOut(Easing.quad) })
      );
    }
    prevLogged.current = nowLogged;
  }, [intensity, burst]);
  useEffect(() => {
    if (!isToday) return;
    ring.value = withRepeat(
      withTiming(1, { duration: PULSE_DURATION, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    ringOuter.value = withDelay(
      PULSE_OFFSET,
      withRepeat(
        withTiming(1, { duration: PULSE_DURATION, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, [isToday, ring, ringOuter]);
  const logged = intensity > 0;
  const palette = getHeatmapPalette(colors);
  const fillColor = logged ? (heatmapFill(palette, intensity) ?? colors.cardDim) : colors.cardDim;
  const glowColor = heatmapGlow(palette, intensity);
  const ringColor = palette.today;
  const ringOuterColor = palette.todayOuter;
  const todayGlowColor = palette.todayGlow;
  const hasGlow = logged && intensity >= 3 && glowColor != null;
  const cellStyle = useAnimatedStyle(
    () => ({
      opacity: mount.value,
      transform: [
        {
          scale: interpolate(mount.value, [0, 1], [0.6, 1]) * (1 + burst.value * 0.28),
        },
      ],
    }),
    []
  );
  const burstStyle = useAnimatedStyle(() => ({ opacity: burst.value * 0.65 }), []);
  const ringStyle = useAnimatedStyle(
    () => ({
      borderColor: ringColor,
      opacity: interpolate(ring.value, [0, 1], [0.45, 1.0]),
      transform: [{ scale: interpolate(ring.value, [0, 1], [1.0, 1.12]) }],
    }),
    [ringColor]
  );
  const ringOuterStyle = useAnimatedStyle(
    () => ({
      borderColor: ringOuterColor,
      opacity: interpolate(ringOuter.value, [0, 1], [0.0, 0.7]),
      transform: [{ scale: interpolate(ringOuter.value, [0, 1], [1.0, 1.28]) }],
    }),
    [ringOuterColor]
  );
  return (
    <Animated.View
      testID={isToday ? "heatmap-cell-today" : "heatmap-cell"}
      style={[
        style,
        cellStyle,
        {
          borderRadius: br.md,
          backgroundColor: fillColor,
          zIndex: isToday ? 2 : 1,
          overflow: "hidden",
          ...(hasGlow
            ? {
                shadowColor: glowColor,
                shadowOpacity: 1,
                shadowRadius: 7,
                shadowOffset: { width: 0, height: 2 },
                elevation: 5,
              }
            : {}),
        },
      ]}
    >
      {logged && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.white, borderRadius: br.md },
            burstStyle,
          ]}
        />
      )}

      {showBurst && (
        <LottieView
          name="cell-pop"
          loop={false}
          onAnimationFinish={() => setShowBurst(false)}
          style={{
            position: "absolute",
            top: -4,
            left: -4,
            width: 24,
            height: 24,
            pointerEvents: "none",
          }}
          resizeMode="contain"
        />
      )}

      {logged && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            start: 0,
            end: 0,
            height: "48%",
            backgroundColor: colors.glassHighlight,
            borderTopStartRadius: br.md,
            borderTopEndRadius: br.md,
          }}
        />
      )}

      {!logged && (
        <View
          testID="heatmap-ash"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: colors.cardDim,
              borderRadius: br.md,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        />
      )}

      {isToday && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: todayGlowColor, borderRadius: br.md },
          ]}
        />
      )}

      {isToday && (
        <Animated.View
          testID="heatmap-ring"
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              inset: -spacing[0.5],
              borderRadius: br.md + 2,
              borderWidth: 2,
            },
            ringStyle,
          ]}
        />
      )}

      {isToday && (
        <Animated.View
          testID="heatmap-ring-outer"
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              inset: -spacing[1],
              borderRadius: br.md + 4,
              borderWidth: 3,
            },
            ringOuterStyle,
          ]}
        />
      )}
    </Animated.View>
  );
}
