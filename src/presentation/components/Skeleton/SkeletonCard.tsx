/** @format */
/**
 * Card-shaped loading placeholder combining an optional header bar and body skeleton lines.
 */
import { View, type ViewStyle, type StyleProp } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import { Skeleton } from "./Skeleton";
interface SkeletonCardProps {
  lines?: number;
  showHeader?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}
export function SkeletonCard({
  lines = 3,
  showHeader = true,
  testID = "skeleton-card",
  style,
}: SkeletonCardProps) {
  const { colors, borderRadius: br } = useUI();
  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: br.xl,
    padding: spacing[4],
    gap: spacing[3],
  };
  return (
    <View style={[cardStyle, style]} testID={testID}>
      {showHeader && (
        <Skeleton width={140} height={20} borderRadius={br.sm} testID={`${testID}-header`} />
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? 180 : undefined}
          height={14}
          borderRadius={br.sm}
          testID={`${testID}-line-${i}`}
        />
      ))}
    </View>
  );
}
