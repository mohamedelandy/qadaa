/** @format */

/**
 * Dashboard prayer card showing progress with log, undo, and batch actions.
 */
import { useEffect, useRef } from "react";
import { View, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { usePrayerRowViewModel } from "./PrayerRow.viewmodel";
import { BatchLogPopover } from "../BatchLogPopover/BatchLogPopover";
import { useUI } from "@hooks/useUI";
import { formatPlus } from "@domain/format";
import type { PrayerKey } from "@domain/types";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { LottieView } from "@components/Lottie/LottieView";
import { borderRadius } from "@theme/spacing";

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

export function PrayerRow(props: PrayerRowProps) {
  const viewModel = usePrayerRowViewModel(props);
  const { isRTL } = useUI();
  const plusRef = useRef<View>(null);

  useEffect(() => {
    viewModel.playEntrance();
  }, [viewModel.playEntrance]);

  return (
    <Animated.View style={viewModel.entranceStyles}>
      <View
        testID={`dashboard-${viewModel.prayerKey}-row`}
        style={[viewModel.styles.container, viewModel.isDone && viewModel.styles.containerDone]}
      >
        {viewModel.isDone && <View style={viewModel.styles.doneAccentBar} pointerEvents="none" />}

        <View style={viewModel.styles.topRow}>
          <PrayerInfo viewModel={viewModel} />
          <PrayerActions viewModel={viewModel} isRTL={isRTL} plusRef={plusRef} />
        </View>

        <PrayerProgress viewModel={viewModel} isRTL={isRTL} />
      </View>
    </Animated.View>
  );
}

type ViewModel = ReturnType<typeof usePrayerRowViewModel>;

function PrayerInfo({ viewModel }: { viewModel: ViewModel }) {
  const { t, styles, prayerKey, emoji, name, recovered, remaining, isDone } = viewModel;

  return (
    <View style={styles.leftSection}>
      <View style={[styles.emojiChip, isDone && styles.emojiChipDone]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.prayerName, isDone && styles.prayerNameDone]} numberOfLines={1}>
          {name}
        </Text>

        <View style={styles.statusRow}>
          {recovered > 0 && (
            <Text testID={`dashboard-${prayerKey}-recovered`} style={styles.recoveredText}>
              {recovered} {t("dashboard.recovered")}
            </Text>
          )}
          {recovered > 0 && remaining > 0 && <Text style={styles.separator}>·</Text>}
          {remaining > 0 && (
            <Text testID={`dashboard-${prayerKey}-remaining`} style={styles.remainingTextUrgent}>
              {t("dashboard.remaining", { count: remaining })}
            </Text>
          )}
          {isDone && <Text style={styles.allDoneText}>{t("dashboard.allDone")}</Text>}
        </View>
      </View>
    </View>
  );
}

function PrayerActions({
  viewModel,
  isRTL,
  plusRef,
}: {
  viewModel: ViewModel;
  isRTL: boolean;
  plusRef: React.RefObject<View | null>;
}) {
  const {
    t,
    styles,
    gradients,
    prayerKey,
    name,
    recovered,
    remaining,
    isDone,
    loggedToday,
    onBatch,
    handlePress,
    handleLongPress,
    handleUndo,
    showBatch,
    setShowBatch,
    plusPressStyle,
    plusPressIn,
    plusPressOut,
    triggerPop,
    buttonStyle,
    bubbleStyle,
    showSparkle,
    setShowSparkle,
  } = viewModel;

  return (
    <View style={styles.rightSection}>
      {loggedToday && recovered > 0 && (
        <PressableScale
          testID={`dashboard-${prayerKey}-undo-btn`}
          style={styles.undoBtn}
          onPress={handleUndo}
          accessibilityRole="button"
          accessibilityLabel={t("dashboard.undo")}
        >
          <Text style={styles.undoText}>−</Text>
        </PressableScale>
      )}

      <View ref={plusRef} style={styles.plusContainer}>
        <Animated.View style={buttonStyle}>
          <Animated.View style={plusPressStyle}>
            <LinearGradient
              colors={isDone ? gradients.progressBar : gradients.primaryBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.plusBtn, isDone && styles.plusBtnDone]}
            >
              <Pressable
                testID={`dashboard-${prayerKey}-increment-btn`}
                style={styles.plusPressable}
                onPress={() => {
                  handlePress();
                  if (!isDone) triggerPop();
                }}
                onLongPress={handleLongPress}
                onPressIn={plusPressIn}
                onPressOut={plusPressOut}
                delayLongPress={500}
                accessibilityRole="button"
                accessibilityLabel={`${name} · ${t("a11y.logPrayer")}`}
              >
                <Text style={[styles.plusText, isDone && styles.plusTextDone]}>
                  {isDone ? "✓" : formatPlus(1, isRTL)}
                </Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.bubble, bubbleStyle]} pointerEvents="none">
        <Text style={styles.bubbleText}>{formatPlus(1, isRTL)}</Text>
      </Animated.View>

      {showSparkle && (
        <LottieView
          name="sparkle-pop"
          loop={false}
          onAnimationFinish={() => setShowSparkle(false)}
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 44,
            height: 44,
            pointerEvents: "none",
          }}
          resizeMode="contain"
        />
      )}

      {showBatch && (
        <BatchLogPopover
          prayerKey={prayerKey}
          maxRemaining={remaining}
          onBatch={onBatch}
          onClose={() => setShowBatch(false)}
          anchorRef={plusRef}
        />
      )}
    </View>
  );
}

function PrayerProgress({ viewModel, isRTL }: { viewModel: ViewModel; isRTL: boolean }) {
  const { styles, gradients, prayerKey, progress, progressFillStyle } = viewModel;
  const progressPercent = Math.round(progress * 100);

  return (
    <View style={styles.progressBarSection}>
      <View style={styles.progressBarWrap} testID={`dashboard-${prayerKey}-progress`}>
        <Animated.View
          testID={`dashboard-${prayerKey}-progress-fill`}
          style={[
            styles.progressFill,
            { transformOrigin: isRTL ? "right" : "left" },
            progressFillStyle,
          ]}
        >
          <LinearGradient
            colors={gradients.progressBar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: borderRadius.full }}
          />
        </Animated.View>
      </View>

      <Text testID={`dashboard-${prayerKey}-progress-label`} style={styles.progressLabel}>
        {progressPercent}%
      </Text>
    </View>
  );
}
