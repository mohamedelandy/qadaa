/** @format */
/**
 * Hook exposing flattened shared style tokens from the active theme for quick styling.
 */
import { useUI } from "@hooks/useUI";
import type { Theme } from "@presentation/theme/ThemeProvider";
export type SharedStyles = {
  colors: Theme["colors"];
  borderRadius: Theme["borderRadius"];
  spacing: Theme["spacing"];
  typography: Theme["typography"];
  gradients: Theme["gradients"];
  borderColor: string;
  borderWidth: number;
  cardBg: string;
  cardDimBg: string;
  borderStrong: string;
  borderFocus: string;
  textPrimary: string;
  textMuted: string;
  textDim: string;
  textSub: string;
  radiusXL: number;
  radiusFull: number;
  isRTL: boolean;
};
export const useSharedStyles = (): SharedStyles => {
  const { colors, borderRadius, spacing, typography, gradients, isRTL } = useUI();
  return {
    colors,
    borderRadius,
    spacing,
    typography,
    gradients,
    borderColor: colors.border,
    borderWidth: 1,
    cardBg: colors.card,
    cardDimBg: colors.cardDim,
    borderStrong: colors.borderStrong,
    borderFocus: colors.borderFocus,
    textPrimary: colors.text,
    textMuted: colors.textMuted,
    textDim: colors.textDim,
    textSub: colors.textSub,
    radiusXL: borderRadius.xl,
    radiusFull: borderRadius.full,
    isRTL,
  };
};
