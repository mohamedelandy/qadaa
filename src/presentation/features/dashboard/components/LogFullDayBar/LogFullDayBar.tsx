/** @format */
/**
 * Animated gradient pill floating above the tab bar to log all five prayers for a full day.
 * Motion design: springy rise-and-scale entrance, then a single specular light
 * pass (double gradient gleam, skewed, clipped to the pill) — no infinite loops.
 * Tappability is guaranteed by mounting: the pill exists in the tree only when it may be tapped,
 * so no dynamic pointerEvents gating can ever desync visibility from touch handling.
 */
import { useEffect, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { LinearGradient } from "expo-linear-gradient";
import { useUI } from "@hooks/useUI";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { useTabBarMinimized } from "@features/layout/glass-tabs/minimize";
import { useTabBarClearance } from "@hooks/useTabBarClearance";
import { useSafeTimeouts } from "@hooks/useSafeTimeouts";
import { Text } from "@components/Text/Text";
import { spacing, borderRadius } from "@theme/spacing";

const SHEEN_MAIN = [
  "rgba(255,255,255,0)",
  "rgba(255,255,255,0.78)",
  "rgba(255,255,255,0)",
] as const;
const SHEEN_TRAIL = [
  "rgba(255,255,255,0)",
  "rgba(255,255,255,0.3)",
  "rgba(255,255,255,0)",
] as const;
const FLASH_COLOR = "rgba(252,232,166,0.28)";
const HAIRLINE = "rgba(255,255,255,0.3)";
const SWEEP_EASE = Easing.inOut(Easing.cubic);

interface LogFullDayBarProps {
  visible: boolean;
  onPress: () => void;
  testID?: string;
}
export function LogFullDayBar({ visible, onPress, testID }: LogFullDayBarProps) {
  const { t, colors, gradients: g } = useUI();
  const { width: screenW } = useWindowDimensions();
  const progress = useTabBarMinimized();
  const bottom = useTabBarClearance(spacing[3]);
  const [scrolledAway, setScrolledAway] = useState(false);
  const opacity = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(spacing[6]);
  const enterScale = useSharedValue<number>(0.8);
  const sweep = useSharedValue<number>(0);
  const flash = useSharedValue<number>(0);
  const { setSafeTimeout, clearSafeTimeout } = useSafeTimeouts();

  useAnimatedReaction(
    () => progress.value > 0.5,
    (minimized) => {
      scheduleOnRN(setScrolledAway, minimized);
    }
  );
  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      translateY.value = spacing[6];
      enterScale.value = 0.8;
      sweep.value = 0;
      flash.value = 0;
      return;
    }
    opacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) });
    translateY.value = withSpring(0, { damping: 12, stiffness: 170 });
    enterScale.value = withSpring(1, { damping: 13, stiffness: 180 });
    // warm gold bloom as the pill lands — quick kiss of light, long soft release
    flash.value = withDelay(
      240,
      withSequence(
        withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 580, easing: Easing.out(Easing.quad) })
      )
    );
    // double specular pass once the entrance settles:
    // bold sweep -> short rest (parked offscreen) -> snappier echo pass
    const timer = setSafeTimeout(() => {
      sweep.value = withSequence(
        withTiming(1, { duration: 1050, easing: SWEEP_EASE }),
        withDelay(480, withTiming(0, { duration: 0 })),
        withTiming(1, { duration: 780, easing: SWEEP_EASE })
      );
    }, 620);
    return () => clearSafeTimeout(timer);
  }, [visible, opacity, translateY, enterScale, sweep, flash, setSafeTimeout, clearSafeTimeout]);
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * interpolate(progress.value, [0, 1], [1, 0]),
    transform: [
      {
        translateY: translateY.value + interpolate(progress.value, [0, 1], [0, spacing[3]]),
      },
      { scale: enterScale.value },
    ],
  }));
  const sheenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -screenW * 0.75 + sweep.value * screenW * 1.5 }],
  }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }));
  if (!visible || scrolledAway) return null;
  return (
    <Animated.View style={[styles.wrapper, { bottom }, fadeStyle]}>
      <View style={[styles.shadowShell, { shadowColor: colors.shadow }]}>
        <LinearGradient
          colors={[g.primaryBtn[0], g.primaryBtn[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.pill, { borderColor: HAIRLINE }]}
        >
          <View pointerEvents="none" style={styles.sheenClip}>
            <Animated.View style={[styles.sheenTrack, sheenStyle]}>
              <LinearGradient
                colors={SHEEN_TRAIL}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sheenTrail}
              />
              <LinearGradient
                colors={SHEEN_MAIN}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sheenMain}
              />
            </Animated.View>
          </View>
          <Animated.View pointerEvents="none" style={[styles.flash, flashStyle]} />
          <PressableScale
            testID={testID}
            style={styles.pressable}
            onPress={onPress}
            accessibilityRole="button"
          >
            <Text variant="base" weight="bold" style={{ color: colors.white }}>
              ✓ {t("dashboard.logFullDay")}
            </Text>
          </PressableScale>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 50,
  },
  shadowShell: {
    borderRadius: borderRadius.full,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  pill: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    overflow: "hidden",
  },
  pressable: {
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[3],
    alignItems: "center",
    justifyContent: "center",
    minHeight: spacing[12],
  },
  sheenClip: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    borderRadius: borderRadius.full,
  },
  sheenTrack: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheenMain: {
    position: "absolute",
    left: -55,
    width: 110,
    height: "170%",
    top: "-35%",
    transform: [{ skewX: "-16deg" }],
  },
  sheenTrail: {
    position: "absolute",
    left: -200,
    width: 240,
    height: "155%",
    top: "-27%",
    transform: [{ skewX: "-16deg" }],
  },
  flash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: FLASH_COLOR,
    borderRadius: borderRadius.full,
    opacity: 0,
  },
});
