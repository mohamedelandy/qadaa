/** @format */
/**
 * Stats route screen rendering stat/rank/estimate cards and badge grid, with empty state fallback.
 */
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useMinimizeOnScroll } from "@features/layout/glass-tabs/minimize";
import { Text } from "@components/Text/Text";
import { View } from "@components/View/View";
import { PageLayout } from "@presentation/components/PageLayout/PageLayout";
import { useStatsViewModel } from "@presentation/features/stats/hooks/useStatsViewModel";
import { StatCard } from "./components/StatCard/StatCard";
import { RankCard } from "./components/RankCard/RankCard";
import { EstimateCard } from "./components/EstimateCard/EstimateCard";
import { NextBadgeHint } from "./components/NextBadgeHint/NextBadgeHint";
import { BadgeGrid } from "./components/BadgeGrid/BadgeGrid";
import { EmptyState } from "@presentation/components/EmptyState/EmptyState";
export default function Stats() {
  const { t, colors, styles, streak, level, points, rank, badges, nextBadge, estimate } =
    useStatsViewModel();
  const router = useRouter();
  const onScroll = useMinimizeOnScroll();
  const hasData = points > 0 || streak > 0;
  return (
    <PageLayout testID="stats-screen">
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <Text variant="2xl" weight="bold" style={styles.title}>
            {t("stats.title")}
          </Text>
        </View>

        {!hasData ? (
          <EmptyState
            testID="stats-empty-state"
            icon="bar-chart-outline"
            title={t("stats.emptyTitle")}
            subtitle={t("stats.emptySubtitle")}
            actionLabel={t("stats.emptyAction")}
            onAction={() => router.navigate("/(tabs)/dashboard")}
            animationName="empty-chart"
          />
        ) : (
          <>
            <View style={styles.row}>
              <View style={styles.half}>
                <StatCard
                  testID="stats-streak-count"
                  emoji={"\u{1F525}"}
                  value={streak}
                  label={t("stats.streak")}
                  valueColor="gold"
                  style={{ flex: 1 }}
                />
              </View>
              <View style={styles.half}>
                <StatCard
                  testID="stats-level-count"
                  emoji={"\u{2B50}"}
                  value={level}
                  label={t("stats.level")}
                  valueColor="green"
                  hint={t("stats.levelHint")}
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            <View style={styles.rankWrapper}>
              <RankCard testID="stats-rank-text" rank={rank} points={points} />
            </View>

            <View style={styles.estimateWrapper}>
              <EstimateCard testID="stats-estimate-text" estimate={estimate} />
            </View>

            {nextBadge && (
              <View style={styles.nextBadgeWrapper}>
                <NextBadgeHint testID="stats-next-badge-hint" nextBadge={nextBadge} />
              </View>
            )}

            <Text
              variant="xs"
              weight="medium"
              style={[styles.badgesHeader, { textTransform: "uppercase", color: colors.textMuted }]}
            >
              {t("stats.badges")}
            </Text>
            <View style={styles.badgeGrid}>
              <BadgeGrid badges={badges} />
            </View>
          </>
        )}
      </Animated.ScrollView>
    </PageLayout>
  );
}
