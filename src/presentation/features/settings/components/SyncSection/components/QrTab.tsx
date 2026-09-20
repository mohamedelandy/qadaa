/** @format */

import { useSyncViewModel } from "../SyncSection.viewmodel";
import { View } from "react-native";
import { LottieView } from "@components/Lottie/LottieView";
import { SvgXml } from "react-native-svg";
import { Text } from "@components/Text/Text";

interface QrTabProps {
  styles: ReturnType<typeof useSyncViewModel>["styles"];
  t: (key: string) => string;
  qrLoading: boolean;
  qrError: boolean;
  qrSvg: string | null;
}

export function QrTab({ styles, t, qrLoading, qrError, qrSvg }: QrTabProps) {
  return (
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
  );
}
