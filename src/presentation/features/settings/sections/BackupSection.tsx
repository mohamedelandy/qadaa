/** @format */
/**
 * Backup & sync card: open sync sheet, export and import actions.
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

interface BackupSectionProps {
  onOpenSync: () => void;
  onExport: () => Promise<unknown>;
  onImport: () => Promise<unknown>;
}

export function BackupSection({ onOpenSync, onExport, onImport }: BackupSectionProps) {
  const { t, colors } = useUI();
  const styles = useSettingsStyles();
  return (
    <Card>
      <SectionHeader label={t("settings.sync")} />
      <PressableScale
        testID="settings-sync-btn"
        onPress={onOpenSync}
        style={[{ marginTop: spacing[2] }, styles.syncButton]}
      >
        <RnView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing[2],
          }}
        >
          <Ionicons name="sync-outline" size={16} color={colors.white} />
          <Text variant="base" weight="bold" style={{ color: colors.white }}>
            {t("settings.sync")}
          </Text>
        </RnView>
      </PressableScale>
      <RnView style={styles.backupRow}>
        <PressableScale
          testID="settings-backup-export-btn"
          onPress={() => {
            void onExport();
          }}
          style={[{ flex: 1 }, styles.backupButton]}
        >
          <RnView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing[1.5],
            }}
          >
            <Ionicons name="share-social-outline" size={14} color={colors.textMuted} />
            <Text variant="base" weight="bold" style={{ color: colors.textMuted }}>
              {t("settings.export")}
            </Text>
          </RnView>
        </PressableScale>
        <PressableScale
          testID="settings-backup-import-btn"
          onPress={() => {
            void onImport();
          }}
          style={[{ flex: 1 }, styles.backupButton]}
        >
          <RnView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing[1.5],
            }}
          >
            <Ionicons name="download-outline" size={14} color={colors.textMuted} />
            <Text variant="base" weight="bold" style={{ color: colors.textMuted }}>
              {t("settings.import")}
            </Text>
          </RnView>
        </PressableScale>
      </RnView>
    </Card>
  );
}
