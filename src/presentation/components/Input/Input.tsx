/** @format */
/**
 * Themed text input with uppercase label, RTL alignment, and error/focus border coloring.
 */
import { useMemo } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useSharedStyles } from "@theme/sharedStyles";
import { spacing } from "@theme/spacing";
import { Text } from "@components/Text/Text";
import { useInputFocus, resolveInputBorderState } from "./Input.viewmodel";
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  errorTestID?: string;
}
export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  keyboardType,
  maxLength,
  autoFocus,
  style,
  testID,
  errorTestID,
}: InputProps) {
  const { colors, typography, borderRadius: br, isRTL } = useSharedStyles();
  const { isFocused, handleFocus, handleBlur } = useInputFocus();
  const border = resolveInputBorderState(error, isFocused);
  const borderColor =
    border === "error"
      ? colors.red
      : border === "focused"
        ? colors.borderFocus
        : colors.borderStrong;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        label: {
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.bold,
          textTransform: "uppercase",
          letterSpacing: 0.64,
          textAlign: isRTL ? "right" : "left",
        },
        input: {
          borderWidth: 1,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3.5],
          fontSize: typography.fontSize.lg,
          minHeight: 52,
          fontFamily: typography.fonts.regular,
          marginTop: spacing[2],
          textAlign: isRTL ? "right" : "left",
        },
        error: {
          fontSize: typography.fontSize.xs,
          marginTop: spacing[4],
          fontFamily: typography.fonts.regular,
          textAlign: isRTL ? "right" : "left",
        },
      }),
    [typography, isRTL]
  );
  return (
    <View style={style}>
      {label && <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>}
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        accessibilityState={{ disabled: false }}
        accessibilityLabel={label ?? placeholder ?? undefined}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor,
            borderRadius: br.lg,
          },
        ]}
      />
      {error && (
        <Text testID={errorTestID} style={[styles.error, { color: colors.red }]}>
          {error}
        </Text>
      )}
    </View>
  );
}
