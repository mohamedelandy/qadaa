/** @format */
/**
 * Dashboard hero card showing today's progress ring, journey percent and target segments.
 */
import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUI } from "@hooks/useUI";
import { ProgressRing } from "@components/ProgressRing/ProgressRing";
import { useHeroCardViewModel } from "./HeroCard.viewmodel";
import { Text } from "@components/Text/Text";
import { LottieView } from "@components/Lottie/LottieView";
import { spacing } from "@theme/spacing";
interface HeroCardProps {
  testID?: string;
  showCelebration?: boolean;
  onCelebrationFinish?: () => void;
}
export function HeroCard({ testID, showCelebration, onCelebrationFinish }: HeroCardProps) {
  const { t, colors, mode, gradients: g, typography, borderRadius: br } = useUI();
  const {
    loggedCount,
    dailyTarget,
    journeyPct,
    isDone,
    isBehind,
    behind,
    segments,
    filledSegments,
  } = useHeroCardViewModel();
  const isLight = mode === "light";
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderRadius: br["2xl"],
          padding: spacing[4],
          marginTop: spacing[3],
          borderWidth: 1,
          borderColor: colors.greenBorder,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isLight ? 0.05 : 0.25,
          shadowRadius: 12,
          elevation: 3,
        },
        innerContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing[4],
        },
        ringWrap: {
          width: 88,
          height: 88,
          justifyContent: "center",
          alignItems: "center",
        },
        ringCenter: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        },
        ringPct: {
          color: colors.green,
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fonts.bold,
          includeFontPadding: false,
        },
        ringLabel: {
          color: colors.textDim,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          marginTop: spacing[0.5],
        },
        todayPanel: {
          flex: 1,
          justifyContent: "center",
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: spacing[2],
        },
        todayTitle: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
          color: colors.text,
        },
        targetPill: {
          flexDirection: "row",
          alignItems: "baseline",
          paddingHorizontal: spacing[2.5],
          paddingVertical: spacing[1],
          borderRadius: br.full,
          backgroundColor: isLight ? colors.greenSurface : colors.greenSubtle,
        },
        countActive: {
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fonts.bold,
          color: colors.green,
          fontVariant: ["tabular-nums"],
        },
        countDivider: {
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fonts.medium,
          color: colors.textDim,
          marginHorizontal: spacing[0.5],
        },
        countTotal: {
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fonts.bold,
          color: colors.textMuted,
          fontVariant: ["tabular-nums"],
        },
        segments: {
          flexDirection: "row",
          gap: spacing[1.5],
          alignSelf: "stretch",
          marginVertical: spacing[1],
        },
        segment: {
          flex: 1,
          height: 6,
          borderRadius: br.full,
        },
        segmentFilled: {
          backgroundColor: colors.green,
        },
        segmentEmpty: {
          backgroundColor: colors.greenSubtle,
        },
        footerRow: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: spacing[1.5],
        },
        nudge: {
          color: colors.textMuted,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
        },
        done: {
          color: colors.green,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
        },
        confettiOverlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }),
    [colors, typography, br]
  );
  return (
    <LinearGradient
      testID={testID}
      colors={g.todayBanner}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.innerContent}>
        <View style={styles.ringWrap}>
          <ProgressRing
            progress={journeyPct}
            size={88}
            strokeWidth={7}
            color={colors.green}
            showLabel={false}
          />
          <View style={styles.ringCenter}>
            <Text style={styles.ringPct}>{journeyPct}%</Text>
            <Text style={styles.ringLabel}>{t("dashboard.journey")}</Text>
          </View>
        </View>

        <View style={styles.todayPanel}>
          <View style={styles.headerRow}>
            <Text style={styles.todayTitle}>{t("dashboard.today")}</Text>
            <View style={styles.targetPill}>
              <Text testID="dashboard-today-logged-count">
                <Text style={styles.countActive}>{loggedCount}</Text>
                <Text style={styles.countDivider}>/</Text>
                <Text style={styles.countTotal}>{dailyTarget}</Text>
              </Text>
            </View>
          </View>

          {segments > 0 && (
            <View style={styles.segments}>
              {Array.from({ length: segments }, (_, i) => (
                <View
                  key={i}
                  testID="dashboard-hero-segment"
                  style={[
                    styles.segment,
                    i < filledSegments ? styles.segmentFilled : styles.segmentEmpty,
                  ]}
                />
              ))}
            </View>
          )}

          <View style={styles.footerRow}>
            {isBehind ? (
              <Text testID="dashboard-hero-nudge" style={styles.nudge}>
                {t("dashboard.nudgeBehind", { count: behind })}
              </Text>
            ) : isDone ? (
              <Text testID="dashboard-hero-done" style={styles.done}>
                {t("dashboard.heroDone")}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      {showCelebration && (
        <View pointerEvents="none" style={styles.confettiOverlay}>
          <LottieView
            name="confetti"
            loop={false}
            onAnimationFinish={onCelebrationFinish}
            style={{ flex: 1 }}
            resizeMode="contain"
          />
        </View>
      )}
    </LinearGradient>
  );
}
