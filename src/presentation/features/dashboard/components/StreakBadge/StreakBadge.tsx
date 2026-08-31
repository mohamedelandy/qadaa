/** @format */
/**
 * Streak pill showing current streak with at-risk and grace indicators.
 */
import { View } from "react-native";
import { useStreakBadgeViewModel } from "./StreakBadge.viewmodel";
import { Text } from "@components/Text/Text";
import { LottieView } from "@components/Lottie/LottieView";
interface StreakBadgeProps {
  streak: number;
  isAtRisk: boolean;
  graceUsed: boolean;
  testID?: string;
}
export function StreakBadge(props: StreakBadgeProps) {
  const { testID } = props;
  const { styles, streak, isAtRisk, graceUsed } = useStreakBadgeViewModel(props);
  return (
    <View style={styles.container}>
      <View
        testID={isAtRisk ? "dashboard-streak-pill-at-risk" : "dashboard-streak-pill"}
        style={[styles.streakPill, isAtRisk && styles.streakPillAtRisk]}
      >
        <LottieView
          name="animated-flame"
          loop
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text testID={testID} style={styles.streakNumber}>
          {streak}
        </Text>
        {graceUsed && <Text style={styles.graceEmoji}>🤲</Text>}
      </View>
    </View>
  );
}
