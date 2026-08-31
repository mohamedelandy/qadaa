/** @format */
/**
 * Flex-1 container applying themed horizontal padding around screen content.
 */
import type { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { spacing } from "@theme/spacing";
interface ContentContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}
export function ContentContainer({ children, style }: ContentContainerProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
});
