/** @format */
/**
 * View model for prayer rows: progress math, press/undo handlers, animations.
 */
import { useState, useMemo, useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ReduceMotion,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useUI } from "@hooks/useUI";
import { useAppStore } from "@stores/useAppStore";
import { usePressAnimation } from "@hooks/usePressAnimation";
import { usePrayerRowAnimations } from "./PrayerRow.animations";
import { createPrayerRowStyles } from "./PrayerRow.styles";
import type { PrayerKey } from "@domain/types";
interface PrayerRowProps {
  prayerKey: PrayerKey;
  emoji: string;
  name: string;
  recovered: number;
  remaining: number;
  isDone: boolean;
  loggedToday?: boolean;
  onLog: (prayer: PrayerKey) => void;
  onUndo: (prayer: PrayerKey) => void;
  onBatch: (prayer: PrayerKey, count: number) => void;
}
export function computeRecoveryProgress(recovered: number, remaining: number): number {
  const total = recovered + remaining;
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, recovered / total));
}
export function usePrayerRowViewModel(props: PrayerRowProps) {
  const { prayerKey, remaining, isDone, onLog, recovered } = props;
  const { t, colors, typography, borderRadius: br, isRTL, gradients: g } = useUI();
  const dashboardTourComplete = useAppStore((s) => s.dashboardTourComplete);
  const [showBatch, setShowBatch] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const progress = computeRecoveryProgress(recovered, remaining);
  const progressSV = useSharedValue(progress);
  useEffect(() => {
    progressSV.value = withSpring(progress, {
      duration: 350,
      dampingRatio: 0.85,
      reduceMotion: ReduceMotion.System,
    });
  }, [progress, progressSV]);
  const progressFillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: Math.max(progressSV.value, 0) }],
  }));
  const {
    pressStyle: plusPressStyle,
    handlePressIn: plusPressIn,
    handlePressOut: plusPressOut,
  } = usePressAnimation(0.92);
  const { playEntrance, triggerPop, buttonStyle, bubbleStyle, entranceStyles } =
    usePrayerRowAnimations();
  const handlePress = () => {
    if (!isDone) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onLog(prayerKey);
      setShowSparkle(true);
    }
  };
  const handleLongPress = () => {
    if (!isDone && remaining > 0) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShowBatch(true);
    }
  };
  const handleUndo = () => {
    if (props.loggedToday && props.recovered > 0) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      props.onUndo(prayerKey);
    }
  };
  const styles = useMemo(
    () => createPrayerRowStyles({ colors, typography, borderRadius: br, isRTL }),
    [colors, typography, br, isRTL]
  );
  return {
    t,
    styles,
    ...props,
    progress,
    progressFillStyle,
    dashboardTourComplete,
    gradients: g,
    handlePress,
    handleLongPress,
    handleUndo,
    showBatch,
    setShowBatch,
    showSparkle,
    setShowSparkle,
    plusPressStyle,
    plusPressIn,
    plusPressOut,
    playEntrance,
    triggerPop,
    buttonStyle,
    bubbleStyle,
    entranceStyles,
  };
}
