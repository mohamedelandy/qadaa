/** @format */
/**
 * Feedback card: feedback button and hint.
 */
import { View as RnView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { Text } from "@components/Text/Text";
import { Card } from "@components/Card/Card";
import { SectionHeader } from "@components/SectionHeader/SectionHeader";
import { spacing } from "@theme/spacing";
import { useUI } from "@hooks/useUI";
import { useSettingsStyles } from "../hooks/useSettingsStyles";

interface FeedbackSectionProps {
  onFeedback: () => void;
}

export function FeedbackSection({ onFeedback }: FeedbackSectionProps) {
  const { t, colors } = useUI();
  const styles = useSettingsStyles();
  return (
    <Card>
      <SectionHeader label={t("settings.feedback")} />
      <PressableScale
        testID="settings-feedback-btn"
        onPress={onFeedback}
        style={[{ marginTop: spacing[2] }, styles.feedbackButton]}
      >
        <RnView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing[2],
          }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.white} />
          <Text variant="base" weight="bold" style={{ color: colors.white }}>
            {t("settings.feedback")}
          </Text>
        </RnView>
      </PressableScale>
      <Text variant="xs" weight="medium" style={{ marginTop: spacing[3], color: colors.textMuted }}>
        {t("settings.feedbackHint")}
      </Text>
    </Card>
  );
}
