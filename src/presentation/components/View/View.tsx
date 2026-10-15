/** @format */
/**
 * Memoized themed View whose background resolves from a ColorKey design token.
 */

import type { ViewProps as RNViewProps, StyleProp, ViewStyle } from "react-native";
import { View as RNView } from "react-native";
import { useUI } from "@hooks/useUI";
import type { ColorKey } from "@theme/types";
export interface ViewProps extends Omit<RNViewProps, "style"> {
  backgroundColor?: ColorKey;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}
export const View = ({ style, backgroundColor, children, ...props }: ViewProps) => {
  // Optimization: Removed React.memo since `children` always changes referentially, making memoization useless.
  const { colors, getColor } = useUI();
  const resolvedBackgroundColor = backgroundColor ? getColor(backgroundColor) : colors.surface;
  return (
    <RNView style={[{ backgroundColor: resolvedBackgroundColor }, style]} {...props}>
      {children}
    </RNView>
  );
};
View.displayName = "View";
