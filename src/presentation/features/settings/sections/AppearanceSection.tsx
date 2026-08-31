/** @format */
/**
 * Appearance card: light/dark theme toggle button.
 */
import { PressableScale } from "@components/PressableScale/PressableScale";
import { Text } from "@components/Text/Text";
import { Card } from "@components/Card/Card";
import { SectionHeader } from "@components/SectionHeader/SectionHeader";
import { spacing } from "@theme/spacing";
import { useUI } from "@hooks/useUI";
import { useSettingsStyles } from "../hooks/useSettingsStyles";

interface AppearanceSectionProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function AppearanceSection({ isDark, onToggleTheme }: AppearanceSectionProps) {
  const { t, colors } = useUI();
  const styles = useSettingsStyles();
  return (
    <Card>
      <SectionHeader label={t("settings.appearance")} />
      <PressableScale
        testID="settings-theme-toggle"
        onPress={onToggleTheme}
        style={[{ marginTop: spacing[2] }, styles.themeButton]}
      >
        <Text variant="base" weight="bold" style={{ color: colors.textSub }}>
          {isDark ? t("settings.lightMode") : t("settings.darkMode")}
        </Text>
      </PressableScale>
    </Card>
  );
}
