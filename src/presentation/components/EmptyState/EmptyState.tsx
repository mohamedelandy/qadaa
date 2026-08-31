/** @format */
/**
 * Centered icon/title/subtitle block for empty lists, with optional action button.
 */
import { useMemo } from "react";
import type { ComponentProps } from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUI } from "@hooks/useUI";
import { spacing, borderRadius } from "@theme/spacing";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { LottieView } from "@components/Lottie";
import type { AnimationName } from "@components/Lottie";
type IoniconsName = ComponentProps<typeof Ionicons>["name"];
interface EmptyStateProps {
  icon: IoniconsName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  animationName?: AnimationName;
  testID?: string;
}
export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  animationName,
  testID = "empty-state",
}: EmptyStateProps) {
  const { colors } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: spacing[8],
          paddingHorizontal: spacing[6],
        },
        icon: {
          marginBottom: spacing[4],
        },
        title: {
          marginBottom: subtitle || actionLabel ? spacing[2] : 0,
        },
        subtitle: {
          marginBottom: actionLabel ? spacing[5] : 0,
        },
        actionButton: {
          marginTop: spacing[2],
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[6],
          backgroundColor: colors.primary,
          borderRadius: borderRadius.full,
        },
        actionText: {
          color: colors.white,
        },
      }),
    [colors, subtitle, actionLabel]
  );
  return (
    <View style={styles.container} testID={testID}>
      {animationName ? (
        <LottieView
          name={animationName}
          loop
          style={{ width: 200, height: 200, marginBottom: spacing[4] }}
          resizeMode="contain"
        />
      ) : (
        <Ionicons
          name={icon}
          size={48}
          color={colors.textDim}
          style={styles.icon}
          testID="empty-state-icon"
        />
      )}
      <Text variant="lg" weight="bold" color={colors.textMuted} centered style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="base" color={colors.textDim} centered style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <PressableScale onPress={onAction} style={styles.actionButton}>
          <Text variant="base" weight="bold" color={colors.white}>
            {actionLabel}
          </Text>
        </PressableScale>
      ) : null}
    </View>
  );
}
