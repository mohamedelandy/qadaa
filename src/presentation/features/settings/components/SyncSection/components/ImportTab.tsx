/** @format */

import { useSyncViewModel } from "../SyncSection.viewmodel";
import { View, TextInput } from "react-native";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";

interface ImportTabProps {
  styles: ReturnType<typeof useSyncViewModel>["styles"];
  t: (key: string) => string;
  pasteText: string;
  setPasteText: (val: string) => void;
  importResult: "idle" | "success" | "error";
  handleImport: () => void;
}

export function ImportTab({
  styles,
  t,
  pasteText,
  setPasteText,
  importResult,
  handleImport,
}: ImportTabProps) {
  return (
    <View>
      <Text style={styles.instruction}>{t("share.importInstructions")}</Text>
      <TextInput
        style={styles.textarea}
        multiline
        testID="sync-paste-input"
        value={pasteText}
        onChangeText={(v) => {
          setPasteText(v);
        }}
        placeholder={t("share.pastePlaceholder")}
        placeholderTextColor={undefined}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />
      {importResult === "error" && (
        <Text testID="sync-import-error" style={styles.importError}>
          {t("share.importFailed")}
        </Text>
      )}
      {importResult === "success" && (
        <Text testID="sync-import-success" style={styles.importSuccess}>
          {t("share.importSuccess")}
        </Text>
      )}
      <PressableScale
        testID="sync-import-btn"
        onPress={handleImport}
        disabled={!pasteText.trim()}
        style={[styles.actionButton, !pasteText.trim() && styles.actionButtonDisabled]}
      >
        <Text style={styles.actionButtonText}>{t("share.importButton")}</Text>
      </PressableScale>
    </View>
  );
}
