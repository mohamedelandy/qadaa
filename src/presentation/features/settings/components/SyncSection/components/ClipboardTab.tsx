/** @format */

import { useSyncViewModel } from "../SyncSection.viewmodel";
import { View } from "react-native";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";

interface ClipboardTabProps {
  styles: ReturnType<typeof useSyncViewModel>["styles"];
  t: (key: string) => string;
  copied: boolean;
  handleCopy: () => void | Promise<void>;
  getJson: () => string;
}

export function ClipboardTab({ styles, t, copied, handleCopy, getJson }: ClipboardTabProps) {
  return (
    <View>
      <Text style={styles.instruction}>{t("share.clipboardInstructions")}</Text>
      <PressableScale
        testID="sync-copy-btn"
        onPress={() => {
          void handleCopy();
        }}
        style={[styles.actionButton, copied && styles.actionButtonDone]}
      >
        <Text style={[styles.actionButtonText, copied && styles.actionButtonTextDone]}>
          {copied ? t("share.copied") : t("share.copyButton")}
        </Text>
      </PressableScale>
      <View style={styles.previewBox}>
        <Text testID="sync-preview-json" style={styles.previewText} selectable>
          {getJson()}
        </Text>
      </View>
      <Text style={styles.hint}>{t("share.clipboardHint")}</Text>
    </View>
  );
}
