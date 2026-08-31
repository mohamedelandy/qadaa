/** @format */
/**
 * Dot row visualizing multi-step progress; current step gets an elongated pill.
 */
import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}
export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const { colors, typography, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: spacing[2],
          height: spacing[12],
        },
        currentDot: {
          width: 24,
          height: 8,
          borderRadius: br.sm,
        },
        pastDot: {
          width: 8,
          height: 8,
          borderRadius: br.sm,
        },
        futureDot: {
          width: 8,
          height: 8,
          borderRadius: br.sm,
        },
      }),
    [colors, typography, br]
  );
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCurrent = index === currentStep;
        const isPast = index < currentStep;
        const dotStyle = isCurrent
          ? [styles.currentDot, { backgroundColor: colors.primary }]
          : isPast
            ? [styles.pastDot, { backgroundColor: colors.green }]
            : [styles.futureDot, { backgroundColor: colors.surfaceAlt }];
        return <View key={index} style={dotStyle} />;
      })}
    </View>
  );
}
