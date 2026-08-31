/** @format */
/**
 * Rank summary card pairing a colored rank badge with the total accumulated points.
 */
import { View } from "react-native";
import { useRankCardViewModel } from "./RankCard.viewmodel";
import type { RankInfo } from "@features/stats/hooks/useStatsViewModel";
import { formatNumber } from "@domain/format";
import { Text } from "@components/Text/Text";
interface RankCardProps {
  rank: RankInfo;
  points: number;
  testID?: string;
}
export function RankCard({ rank, points, testID }: RankCardProps) {
  const { t, colors, isRTL, styles, rank: r, points: pts } = useRankCardViewModel(rank, points);
  return (
    <View style={styles.card}>
      <View
        style={[styles.badge, { backgroundColor: colors[r.bg], borderColor: colors[r.border] }]}
      >
        <Text
          testID={testID}
          variant="base"
          weight="bold"
          style={[styles.badgeText, { color: colors[r.color] }]}
        >
          {t(`stats.ranks.${r.label}`)}
        </Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text
          variant="xs"
          weight="medium"
          style={[styles.pointsLabel, { color: colors.textMuted }]}
        >
          {t("stats.points")}
        </Text>
        <Text
          testID="stats-rank-points"
          variant="3xl"
          weight="bold"
          style={[styles.pointsNumber, { color: colors.gold, fontVariant: ["tabular-nums"] }]}
        >
          {formatNumber(pts, isRTL)}
        </Text>
      </View>
    </View>
  );
}
