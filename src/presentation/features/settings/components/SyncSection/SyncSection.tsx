/** @format */
/**
 * Sync bottom sheet: QR / clipboard / paste-import tabs.
 */
import { View, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { LottieView } from "@components/Lottie/LottieView";

import { SvgXml } from "react-native-svg";
import { BottomSheet } from "@components/BottomSheet/BottomSheet";
import { useSyncViewModel } from "./SyncSection.viewmodel";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";
interface SyncSectionProps {
  visible: boolean;
  onClose: () => void;
}
export function SyncSection({ visible, onClose }: SyncSectionProps) {
  const {
    t,
    styles,
    activeTab,
    setActiveTab,
    copied,
    pasteText,
    setPasteText,
    importResult,
    qrSvg,
    qrLoading,
    qrError,
    handleCopy,
    handleImport,
    getJson,
    tabs,
  } = useSyncViewModel(visible, onClose);
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>{t("share.title")}</Text>

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          return (
            <PressableScale
              key={tab.key}
              testID={`sync-tab-${tab.key}`}
              onPress={() => setActiveTab(tab.key)}
              style={[{ flex: 1 }, styles.tab, activeTab === tab.key && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      <KeyboardAwareScrollView
        style={styles.tabContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "qr" && (
          <View style={styles.columnCenter}>
            <Text style={styles.instruction}>{t("share.qrInstructions")}</Text>
            <View testID="sync-qr-container" style={styles.qrContainer}>
              {qrLoading && !qrSvg && (
                <LottieView
                  name="orbiting-dots"
                  loop
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
              )}
              {qrError && <Text style={styles.qrErrorText}>{t("share.qrTooLarge")}</Text>}
              {qrSvg && !qrError && <SvgXml xml={qrSvg} width={256} height={256} />}
            </View>
            <Text style={styles.hint}>{t("share.qrScanHint")}</Text>
          </View>
        )}

        {activeTab === "clipboard" && (
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
        )}

        {activeTab === "import" && (
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
        )}
      </KeyboardAwareScrollView>

      <PressableScale testID="sync-close-btn" onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>{t("share.close")}</Text>
      </PressableScale>
    </BottomSheet>
  );
}
