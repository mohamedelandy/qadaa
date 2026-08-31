/** @format */
/**
 * Themed primary/secondary/ghost button with gradient fill, press scale, spinner, and disabled blocking.
 */
import { useMemo } from "react";
import { Pressable, ActivityIndicator, StyleSheet, ViewStyle, StyleProp } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useUI } from "@hooks/useUI";
import { usePressAnimation } from "@hooks/usePressAnimation";
import { spacing } from "@theme/spacing";
import { Text } from "@components/Text/Text";
import { resolveButtonInteraction } from "./Button.viewmodel";
type ButtonVariant = "primary" | "secondary" | "ghost";
interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
export function Button({
  title,
  variant = "primary",
  onPress,
  disabled,
  loading,
  style,
  testID,
}: ButtonProps) {
  const { colors, gradients: g, typography, borderRadius: br } = useUI();
  const { pressStyle, handlePressIn, handlePressOut } = usePressAnimation();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        gradientFill: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[6],
        },
        text: {
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
      }),
    [typography]
  );
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const containerStyle: ViewStyle = {
    minHeight: 52,
    borderRadius: br.xl,
    overflow: "hidden",
  };
  const nonPrimaryStyle: ViewStyle = {
    minHeight: 52,
    borderRadius: br.xl,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    backgroundColor: isSecondary ? colors.surface : "transparent",
    borderWidth: isSecondary ? 1 : 0,
    borderColor: isSecondary ? colors.borderStrong : undefined,
  };
  const textColor = isPrimary ? colors.white : colors.textMuted;
  const { isDisabled, opacity, showSpinner } = resolveButtonInteraction(disabled, loading);
  return (
    <Animated.View style={[pressStyle, style, { opacity }]}>
      {isPrimary ? (
        <Pressable
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityState={{ disabled: isDisabled, busy: !!loading }}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          style={containerStyle}
        >
          <LinearGradient
            colors={[g.primaryBtn[0], g.primaryBtn[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientFill, { borderRadius: br.xl }]}
          >
            {showSpinner ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.text, { color: colors.white }]}>{title}</Text>
            )}
          </LinearGradient>
        </Pressable>
      ) : (
        <Pressable
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityState={{ disabled: isDisabled, busy: !!loading }}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          style={nonPrimaryStyle}
        >
          {showSpinner ? (
            <ActivityIndicator color={colors.textMuted} />
          ) : (
            <Text style={[styles.text, { color: textColor }]}>{title}</Text>
          )}
        </Pressable>
      )}
    </Animated.View>
  );
}
