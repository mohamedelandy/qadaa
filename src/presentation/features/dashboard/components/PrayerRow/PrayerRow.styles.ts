/** @format */
/**
 * Styles for prayer rows, built from live UI theme tokens.
 */
import { StyleSheet } from "react-native";
import { spacing } from "@theme/spacing";
type UITokens = {
  colors: {
    border: string;
    card: string;
    cardDim: string;
    text: string;
    green: string;
    greenSurface: string;
    greenBorder: string;
    greenSubtle: string;
    amber: string;
    textMuted: string;
    textDim: string;
    white: string;
    primary: string;
    primaryGlow: string;
    primaryGlowBg: readonly string[];
    primaryGlowBorder: string;
    borderStrong: string;
  };
  typography: {
    fontSize: Record<"xs" | "sm" | "base" | "lg" | "xl", number>;
    fonts: { medium: string; bold: string };
  };
  borderRadius: Record<"full" | "xl", number>;
};
export const BTN_SIZE = 44;
export function createPrayerRowStyles({
  colors,
  typography,
  borderRadius: br,
  isRTL,
}: UITokens & { isRTL: boolean }) {
  return StyleSheet.create({
    container: {
      borderRadius: br.xl,
      padding: spacing[4],
      marginBottom: spacing[3],
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      overflow: "hidden",
    },
    containerDone: {
      backgroundColor: colors.greenSurface,
      borderColor: colors.greenBorder,
    },
    doneAccentBar: {
      position: "absolute",
      top: 0,
      bottom: 0,
      start: 0,
      width: 3,
      backgroundColor: colors.green,
      borderTopStartRadius: br.xl,
      borderBottomStartRadius: br.xl,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      minWidth: 0,
      marginEnd: spacing[3],
    },
    emojiChip: {
      width: BTN_SIZE,
      height: BTN_SIZE,
      borderRadius: br.full,
      backgroundColor: colors.primaryGlowBg[0],
      borderWidth: 1,
      borderColor: colors.primaryGlowBorder,
      alignItems: "center",
      justifyContent: "center",
      marginEnd: spacing[3],
      flexShrink: 0,
    },
    emojiChipDone: {
      backgroundColor: colors.greenSubtle,
      borderColor: colors.greenBorder,
    },
    emoji: {
      fontSize: typography.fontSize.xl,
      textAlign: "center",
      includeFontPadding: false,
    },
    info: {
      flex: 1,
      minWidth: 0,
      justifyContent: "center",
    },
    prayerName: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fonts.bold,
      color: colors.text,
      includeFontPadding: false,
      writingDirection: isRTL ? "rtl" : "ltr",
      marginBottom: spacing[0.5],
    },
    prayerNameDone: { color: colors.green },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    recoveredText: {
      color: colors.green,
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fonts.medium,
      includeFontPadding: false,
    },
    separator: {
      color: colors.textMuted,
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fonts.medium,
      marginHorizontal: spacing[1.5],
    },
    remainingTextUrgent: {
      color: colors.amber,
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fonts.medium,
      includeFontPadding: false,
    },
    allDoneText: {
      color: colors.green,
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fonts.medium,
      includeFontPadding: false,
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
      flexShrink: 0,
      position: "relative",
    },
    undoBtn: {
      width: BTN_SIZE,
      height: BTN_SIZE,
      borderRadius: br.full,
      backgroundColor: colors.cardDim,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      alignItems: "center",
      justifyContent: "center",
    },
    undoText: {
      color: colors.textMuted,
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fonts.bold,
      includeFontPadding: false,
      lineHeight: typography.fontSize.lg,
    },
    plusContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    plusBtn: {
      width: BTN_SIZE,
      height: BTN_SIZE,
      borderRadius: br.full,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primaryGlow,
      shadowOpacity: 0.5,
      shadowRadius: spacing[2],
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    plusBtnDone: {
      shadowColor: colors.green,
      shadowOpacity: 0.4,
    },
    plusPressable: {
      width: BTN_SIZE,
      height: BTN_SIZE,
      alignItems: "center",
      justifyContent: "center",
    },
    plusText: {
      color: colors.white,
      fontFamily: typography.fonts.bold,
      fontSize: typography.fontSize.base,
      includeFontPadding: false,
      lineHeight: typography.fontSize.base,
    },
    plusTextDone: { color: colors.white },
    progressBarSection: {
      marginTop: spacing[3],
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2.5],
    },
    progressBarWrap: {
      flex: 1,
      height: 6,
      borderRadius: br.full,
      backgroundColor: colors.cardDim,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: br.full,
    },
    progressLabel: {
      color: colors.textDim,
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fonts.medium,
      fontVariant: ["tabular-nums"],
      minWidth: 32,
      textAlign: isRTL ? "left" : "right",
      includeFontPadding: false,
    },
    bubble: {
      position: "absolute",
      bottom: spacing[8],
      zIndex: 10,
      alignSelf: "center",
      end: spacing[1],
    },
    bubbleText: {
      fontFamily: typography.fonts.bold,
      color: colors.primary,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.fontSize.sm,
      includeFontPadding: false,
      textAlign: "center",
    },
  });
}
