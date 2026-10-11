/** @format */
/**
 * Themed bordered card container with default and elevated shadow variants.
 */
import { View, ViewStyle, StyleProp } from "react-native";
import { ReactNode, memo } from "react";
import { useSharedStyles } from "@theme/sharedStyles";
import { spacing } from "@theme/spacing";
interface CardProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  variant?: "default" | "elevated";
}
// Optimization: Memoized with React.memo to prevent unnecessary re-renders when parent components update but card props remain unchanged.
export const Card = memo(function Card({ style, children, variant = "default" }: CardProps) {
  const { colors, borderRadius: br } = useSharedStyles();
  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: br.xl,
    padding: spacing[4],
  };
  const elevatedStyle: ViewStyle =
    variant === "elevated"
      ? {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }
      : {};
  return <View style={[cardStyle, elevatedStyle, style]}>{children}</View>;
});
