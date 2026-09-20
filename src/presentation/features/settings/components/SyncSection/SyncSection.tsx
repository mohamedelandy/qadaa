/** @format */
/**
 * Sync bottom sheet: QR / clipboard / paste-import tabs.
 */
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { BottomSheet } from "@components/BottomSheet/BottomSheet";
import { useSyncViewModel } from "./SyncSection.viewmodel";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";

import { QrTab, ClipboardTab, ImportTab } from "./components";

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
          <QrTab styles={styles} t={t} qrLoading={qrLoading} qrError={qrError} qrSvg={qrSvg} />
        )}

        {activeTab === "clipboard" && (
          <ClipboardTab
            styles={styles}
            t={t}
            copied={copied}
            handleCopy={handleCopy}
            getJson={getJson}
          />
        )}

        {activeTab === "import" && (
          <ImportTab
            styles={styles}
            t={t}
            pasteText={pasteText}
            setPasteText={setPasteText}
            importResult={importResult}
            handleImport={handleImport}
          />
        )}
      </KeyboardAwareScrollView>

      <PressableScale testID="sync-close-btn" onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>{t("share.close")}</Text>
      </PressableScale>
    </BottomSheet>
  );
}
