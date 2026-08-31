/** @format */
/**
 * Grid of achievement badge cards showing icon, name, unlock date or locked state per badge.
 */
import { View } from "react-native";
import { useState, useRef } from "react";
import { useBadgeGridViewModel } from "./BadgeGrid.viewmodel";
import type { BadgeInfo } from "@features/stats/hooks/useStatsViewModel";
import { Text } from "@components/Text/Text";
import { LottieView } from "@components/Lottie/LottieView";
interface BadgeGridProps {
  badges: BadgeInfo[];
}
export function BadgeGrid({ badges }: BadgeGridProps) {
  const { t, colors, styles, badges: items, language } = useBadgeGridViewModel(badges);
  const initialUnlockedRef = useRef<Set<string> | null>(null);
  initialUnlockedRef.current ??= new Set(
    items.filter((b) => b.unlockedAt !== null).map((b) => b.id)
  );
  const [shownIds, setShownIds] = useState<Set<string>>(new Set());
  const handleAnimationFinish = (badgeId: string) => {
    setShownIds((prev) => new Set(prev).add(badgeId));
  };
  return (
    <View style={styles.grid}>
      {items.map((badge) => {
        const unlocked = badge.unlockedAt !== null;
        const isNewlyUnlocked =
          unlocked &&
          initialUnlockedRef.current !== null &&
          !initialUnlockedRef.current.has(badge.id) &&
          !shownIds.has(badge.id);
        return (
          <View
            key={badge.id}
            testID={`stats-badge-${badge.id}`}
            style={[styles.card, unlocked ? styles.cardUnlocked : styles.cardLocked]}
          >
            <Text style={[styles.icon, !unlocked && styles.iconLocked]}>{badge.icon}</Text>
            <Text
              variant="base"
              weight="bold"
              style={[styles.name, { color: unlocked ? colors.textSub : colors.textMuted }]}
            >
              {t(`stats.badges_data.${badge.id}`)}
            </Text>
            {unlocked ? (
              <Text
                testID={`stats-badge-${badge.id}-date`}
                variant="xs"
                weight="medium"
                style={[styles.date, { color: colors.green }]}
              >
                {new Date(badge.unlockedAt as number).toLocaleDateString(
                  language === "ar" ? "ar-EG" : "en-US"
                )}
              </Text>
            ) : (
              <Text
                testID={`stats-badge-${badge.id}-locked`}
                variant="xs"
                weight="medium"
                style={[styles.locked, { color: colors.textMuted }]}
              >
                {t("stats.lockedBadge")}
              </Text>
            )}
            {isNewlyUnlocked && (
              <LottieView
                name="star-burst"
                loop={false}
                onAnimationFinish={() => handleAnimationFinish(badge.id)}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                resizeMode="contain"
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
