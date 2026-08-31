/** @format */
/**
 * Themed text component mapping variant, weight, color and RTL writing direction onto RN Text.
 */
import { memo, useMemo } from "react";
import type { TextProps as RNTextProps, StyleProp, TextStyle } from "react-native";
import { Text as RNText } from "react-native";
import { useUI } from "@hooks/useUI";
import type { TextVariant, TextWeight } from "@theme/types";
export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
  centered?: boolean;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}
export const Text = memo<TextProps>(
  ({
    children,
    style,
    variant = "base",
    weight = "regular",
    color,
    centered,
    accessibilityRole = "text",
    ...props
  }) => {
    const { colors, typography, direction } = useUI();
    const textStyle = useMemo<TextStyle>(() => {
      return {
        fontFamily: typography.fonts[weight],
        fontSize: typography.fontSize[variant],
        color: color ?? colors.text,
        textAlign: centered ? "center" : "auto",
        writingDirection: direction,
      };
    }, [
      color,
      colors.text,
      typography.fonts,
      typography.fontSize,
      weight,
      variant,
      centered,
      direction,
    ]);
    return (
      <RNText
        accessible
        accessibilityRole={accessibilityRole}
        style={[textStyle, style]}
        {...props}
      >
        {children}
      </RNText>
    );
  }
);
Text.displayName = "Text";
