/** @format */
/**
 * Arabic/English segmented toggle.
 */
import { View } from "react-native";
import { useLanguageToggleViewModel } from "./LanguageToggle.viewmodel";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";
import type { Language } from "@domain/types";
interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}
export function LanguageToggle(props: LanguageToggleProps) {
  const { t, styles, language, onLanguageChange } = useLanguageToggleViewModel(props);
  return (
    <View style={styles.row}>
      <PressableScale
        testID="settings-lang-ar-btn"
        onPress={() => onLanguageChange("ar")}
        accessibilityRole="button"
        accessibilityState={{ selected: language === "ar" }}
        style={[styles.button, language === "ar" ? styles.activeButton : styles.inactiveButton]}
      >
        <Text
          style={[styles.buttonText, language === "ar" ? styles.activeText : styles.inactiveText]}
        >
          {t("settings.ar")}
        </Text>
      </PressableScale>
      <PressableScale
        testID="settings-lang-en-btn"
        onPress={() => onLanguageChange("en")}
        accessibilityRole="button"
        accessibilityState={{ selected: language === "en" }}
        style={[styles.button, language === "en" ? styles.activeButton : styles.inactiveButton]}
      >
        <Text
          style={[styles.buttonText, language === "en" ? styles.activeText : styles.inactiveText]}
        >
          {t("settings.en")}
        </Text>
      </PressableScale>
    </View>
  );
}
