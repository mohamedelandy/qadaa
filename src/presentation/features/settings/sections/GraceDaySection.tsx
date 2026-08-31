/** @format */
/**
 * Grace-day card: used/available badge and remaining hint.
 */
import { View as RnView } from "react-native";
import { Text } from "@components/Text/Text";
import { View } from "@components/View/View";
import { Card } from "@components/Card/Card";
import { SectionHeader } from "@components/SectionHeader/SectionHeader";
import { spacing } from "@theme/spacing";
import { useUI } from "@hooks/useUI";
import { useSettingsStyles } from "../hooks/useSettingsStyles";

interface GraceDaySectionProps {
  graceUsed: boolean;
  graceStatus: string;
}

export function GraceDaySection({ graceUsed, graceStatus }: GraceDaySectionProps) {
  const { t, colors } = useUI();
  const styles = useSettingsStyles();
  const graceBadgeStyle = graceUsed ? styles.graceBadgeUsed : styles.graceBadgeAvailable;
  return (
    <Card>
      <SectionHeader label={t("settings.graceDay")} />
      <RnView style={styles.graceRow}>
        <Text variant="xs" weight="medium" style={{ color: colors.textMuted }}>
          {t("settings.graceDay")}
        </Text>
        <View style={[styles.graceBadge, graceBadgeStyle]}>
          <Text
            testID="settings-grace-status"
            variant="xs"
            weight="medium"
            style={[styles.graceBadgeText, graceUsed && styles.graceBadgeTextUsed]}
          >
            {graceStatus}
          </Text>
        </View>
      </RnView>
      <Text variant="xs" weight="medium" style={{ marginTop: spacing[3], color: colors.textMuted }}>
        {t("settings.graceDayHint")}
      </Text>
    </Card>
  );
}
