/** @format */
/**
 * View-model owning reset button confirm/cancel state and themed style computation.
 */
import { useState, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
interface ResetButtonProps {
  onReset: () => void;
}
export function useResetButtonViewModel(props: ResetButtonProps) {
  const { onReset } = props;
  const { t, colors, typography, borderRadius: br } = useUI();
  const [confirming, setConfirming] = useState(false);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        warning: {
          color: colors.red,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          textAlign: "center",
        },
        row: { marginTop: spacing[3], flexDirection: "row", gap: spacing[2] },
        cancelButton: {
          flex: 1,
          paddingVertical: spacing[3],
          borderRadius: br.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          alignItems: "center",
          minHeight: 44,
          justifyContent: "center",
        },
        cancelText: {
          color: colors.text,
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
        resetButton: {
          flex: 1,
          paddingVertical: spacing[3],
          borderRadius: br.lg,
          backgroundColor: colors.red,
          alignItems: "center",
          minHeight: 44,
          justifyContent: "center",
        },
        resetText: {
          color: colors.white,
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
        defaultButton: {
          width: "100%",
          paddingVertical: spacing[3],
          borderRadius: br.lg,
          alignItems: "center",
          minHeight: 44,
          justifyContent: "center",
        },
        defaultText: {
          color: colors.red,
          fontSize: typography.fontSize.base,
          fontFamily: typography.fonts.bold,
        },
      }),
    [colors, typography, br]
  );
  return { t, styles, confirming, setConfirming, onReset };
}
