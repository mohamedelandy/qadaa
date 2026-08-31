/** @format */
/**
 * Stat card displaying an emoji, large formatted number, label and optional hint line.
 */
import { View, ViewStyle } from "react-native";
import { useStatCardViewModel } from "./StatCard.viewmodel";
import { formatNumber } from "@domain/format";
import { Text } from "@components/Text/Text";
import type { ColorKey } from "@theme/types";
interface StatCardProps {
  emoji: string;
  value: number;
  label: string;
  valueColor: ColorKey;
  hint?: string;
  style?: ViewStyle;
  testID?: string;
}
export function StatCard({ emoji, value, label, valueColor, hint, style, testID }: StatCardProps) {
  const { colors, styles, isRTL } = useStatCardViewModel();
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text
        testID={testID}
        variant="2xl"
        weight="bold"
        style={[styles.number, { color: colors[valueColor], fontVariant: ["tabular-nums"] }]}
      >
        {formatNumber(value, isRTL)}
      </Text>
      <Text variant="xs" weight="medium" style={[styles.label, { color: colors.textDim }]}>
        {label}
      </Text>
      {hint && (
        <Text variant="xs" weight="medium" style={[styles.hint, { color: colors.textPlaceholder }]}>
          {hint}
        </Text>
      )}
    </View>
  );
}
