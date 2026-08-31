/** @format */
/**
 * Card teasing next badge to earn with icon, name and gradient progress bar; null when none pending.
 */
import { View, type DimensionValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNextBadgeHintViewModel } from "./NextBadgeHint.viewmodel";
import type { NextBadgeInfo } from "@features/stats/hooks/useStatsViewModel";
import { Text } from "@components/Text/Text";
import { LottieView } from "@components/Lottie/LottieView";
interface NextBadgeHintProps {
  nextBadge: NextBadgeInfo | null;
  testID?: string;
}
export function NextBadgeHint({ nextBadge, testID }: NextBadgeHintProps) {
  const { t, colors, styles, nextBadge: badge } = useNextBadgeHintViewModel(nextBadge);
  if (!badge) return null;
  return (
    <View testID={testID} style={styles.card}>
      <Text variant="xs" weight="medium" style={[styles.header, { color: colors.textMuted }]}>
        {t("stats.nextBadge")}
      </Text>
      <View style={styles.content}>
        <Text variant="3xl" style={styles.icon}>
          {badge.icon}
        </Text>
        <Text variant="base" weight="bold" style={[styles.name, { color: colors.textSub }]}>
          {t(`stats.badges_data.${badge.id}`)}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <LinearGradient
          colors={[colors.primary, colors.green]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${badge.progress}%` as DimensionValue }]}
        />
        <LottieView
          name="progress-fill"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${badge.progress}%` as DimensionValue,
          }}
          resizeMode="cover"
        />
      </View>
      <Text variant="xs" weight="medium" style={[styles.pct, { color: colors.textDim }]}>
        {t("stats.nextBadgeProgress", { pct: badge.progress })}
      </Text>
    </View>
  );
}
