/** @format */
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useMinimizeOnScroll } from "@features/layout/glass-tabs/minimize";

interface PageScrollViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: "always" | "never" | "handled";
  keyboardDismissMode?: "none" | "interactive" | "on-drag";
}

export function PageScrollView({
  children,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps,
  keyboardDismissMode,
}: PageScrollViewProps) {
  const onScroll = useMinimizeOnScroll();

  return (
    <Animated.ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      keyboardDismissMode={keyboardDismissMode}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {children}
    </Animated.ScrollView>
  );
}
