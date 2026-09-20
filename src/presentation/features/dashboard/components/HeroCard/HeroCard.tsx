/** @format */
/**
 * Dashboard hero card showing today's progress ring, journey percent and target segments.
 */
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUI } from "@hooks/useUI";
import { ProgressRing } from "@components/ProgressRing/ProgressRing";
import { useHeroCardViewModel } from "./HeroCard.viewmodel";
import { useHeroCardStyles } from "./HeroCard.styles";
import { Text } from "@components/Text/Text";
import { LottieView } from "@components/Lottie/LottieView";
import { spacing } from "@theme/spacing";
interface HeroCardProps {
  testID?: string;
  showCelebration?: boolean;
  onCelebrationFinish?: () => void;
}
export function HeroCard({ testID, showCelebration, onCelebrationFinish }: HeroCardProps) {
  const { t, colors, gradients: g } = useUI();
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
  const { styles } = useHeroCardStyles();

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
