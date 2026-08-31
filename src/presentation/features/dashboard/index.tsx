/** @format */
/**
 * Dashboard route — hydration-gated screen with streak badge, hero card, prayer rows, weekly grid.
 */
import { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useFocusEffect } from "expo-router";
import { useMinimizeOnScroll } from "@features/layout/glass-tabs/minimize";
import { Text } from "@components/Text/Text";
import { PageLayout } from "@presentation/components/PageLayout/PageLayout";
import { useDashboardViewModel } from "@presentation/features/dashboard/hooks/useDashboardViewModel";
import { useDayCompletionCelebration } from "./hooks/useDayCompletionCelebration";
import { usePrayerStore } from "@stores/usePrayerStore";
import { SkeletonCard } from "@presentation/components/Skeleton/SkeletonCard";
import { StreakBadge } from "./components/StreakBadge/StreakBadge";
import { HeroCard } from "./components/HeroCard/HeroCard";
import { PrayerRow } from "./components/PrayerRow/PrayerRow";
import { WeeklyGrid } from "./components/WeeklyGrid/WeeklyGrid";
import { HadithCard } from "./components/HadithCard/HadithCard";
import { IntentionSheet } from "./components/IntentionSheet/IntentionSheet";
import { DuaModal } from "./components/DuaModal/DuaModal";
import { LogFullDayBar } from "./components/LogFullDayBar/LogFullDayBar";
import { EmptyState } from "@presentation/components/EmptyState/EmptyState";
export default function Dashboard() {
  const [hydrated, setHydrated] = useState(usePrayerStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = usePrayerStore.persist.onFinishHydration(() => setHydrated(true));
    if (usePrayerStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  if (!hydrated) {
    return (
      <PageLayout testID="dashboard-screen">
        <SkeletonCard testID="dashboard-skeleton" />
      </PageLayout>
    );
  }
  return <DashboardContent />;
}

function DashboardContent() {
  const [screenFocused, setScreenFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => setScreenFocused(false);
    }, [])
  );
  const {
    t,
    colors,
    prayerRows,
    streakData,
    weeklyGridData,
    hadithData,
    allPrayersDone,
    overlays,
    actions,
    styles,
  } = useDashboardViewModel();
  const { celebrationStyle, showCelebration, setShowCelebration } =
    useDayCompletionCelebration(allPrayersDone);
  const onScroll = useMinimizeOnScroll();
  const allLoggedToday = prayerRows.every((row) => row.loggedToday);
  const canLogFullDay = prayerRows.some((row) => row.remaining > 0) && !allLoggedToday;
  const totalMissedDays = prayerRows[0]?.totalMissedDays ?? 0;
  return (
    <PageLayout testID="dashboard-screen">
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <Text variant="2xl" weight="bold" style={styles.appName}>
            {t("app.name")}
          </Text>
          <StreakBadge
            testID="dashboard-streak-count"
            streak={streakData.streak}
            isAtRisk={streakData.isAtRisk}
            graceUsed={streakData.graceUsed}
          />
        </View>

        {totalMissedDays === 0 ? (
          <>
            <EmptyState
              testID="dashboard-caught-up"
              icon="sparkles"
              title={t("dashboard.allCaughtUpTitle")}
              subtitle={t("dashboard.allCaughtUpSubtitle")}
              animationName="sparkles"
            />
            <HadithCard testID="dashboard-hadith-card" text={hadithData.text} />
          </>
        ) : (
          <>
            <Animated.View style={celebrationStyle}>
              <HeroCard
                testID="dashboard-hero-card"
                showCelebration={showCelebration}
                onCelebrationFinish={() => setShowCelebration(false)}
              />
            </Animated.View>

            <Text
              variant="xs"
              weight="medium"
              style={[styles.sectionLabel, { color: colors.textMuted }]}
            >
              {t("dashboard.prayers")}
            </Text>

            {prayerRows.map((row) => (
              <PrayerRow
                key={row.key}
                prayerKey={row.key}
                emoji={row.emoji}
                name={row.name}
                recovered={row.recovered}
                remaining={row.remaining}
                isDone={row.isDone}
                loggedToday={row.loggedToday}
                onLog={actions.handleLogPrayer}
                onUndo={actions.handleUndo}
                onBatch={actions.handleBatch}
              />
            ))}

            <WeeklyGrid cells={weeklyGridData} />

            <HadithCard testID="dashboard-hadith-card" text={hadithData.text} />
          </>
        )}
      </Animated.ScrollView>

      <LogFullDayBar
        testID="dashboard-fullday-btn"
        visible={screenFocused && canLogFullDay && !overlays.showIntention && !overlays.showDua}
        onPress={actions.handleLogFullDay}
      />

      <IntentionSheet visible={overlays.showIntention} onConfirm={actions.dismissIntention} />
      <DuaModal visible={overlays.showDua} onClose={actions.dismissDua} />
    </PageLayout>
  );
}
