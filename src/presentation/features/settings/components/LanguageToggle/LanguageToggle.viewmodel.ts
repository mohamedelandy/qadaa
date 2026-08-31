/** @format */
/**
 * View model and styles for the language toggle row.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import type { Language } from "@domain/types";
interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}
export function useLanguageToggleViewModel(props: LanguageToggleProps) {
  const { language, onLanguageChange } = props;
  const { t, colors, typography, borderRadius: br } = useUI();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: "row",
          gap: spacing[2],
          marginTop: spacing[2],
        },
        button: {
          flex: 1,
          paddingVertical: spacing[2.5],
          borderRadius: br.lg,
          minHeight: spacing[12],
          alignItems: "center",
          justifyContent: "center",
        },
        activeButton: {
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        },
        inactiveButton: {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.borderStrong,
        },
        buttonText: { fontSize: typography.fontSize.base, fontFamily: typography.fonts.bold },
        activeText: { color: colors.white },
        inactiveText: { color: colors.textDim },
      }),
    [colors, typography, br]
  );
  return { t, styles, language, onLanguageChange };
}
