/** @format */
/**
 * Settings route — thin screen composing appearance, target, backup/sync, grace-day, and feedback sections.
 */
import { Platform } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";
import { Text } from "@components/Text/Text";
import { View } from "@components/View/View";
import { PageLayout } from "@presentation/components/PageLayout/PageLayout";
import { Card } from "@components/Card/Card";
import { SectionHeader } from "@components/SectionHeader/SectionHeader";
import { useMinimizeOnScroll } from "@features/layout/glass-tabs/minimize";
import { useSettingsViewModel } from "@features/settings/hooks/useSettingsViewModel";
import { LanguageToggle } from "./components/LanguageToggle/LanguageToggle";
import { NotificationPicker } from "./components/NotificationPicker/NotificationPicker";
import { ResetButton } from "./components/ResetButton/ResetButton";
import { AppearanceSection } from "./sections/AppearanceSection";
import { BackupSection } from "./sections/BackupSection";
import { FeedbackSection } from "./sections/FeedbackSection";
import { GraceDaySection } from "./sections/GraceDaySection";
import { TargetSection } from "./sections/TargetSection";
import { useSettingsTarget } from "./hooks/useSettingsTarget";
import { useSettingsSync } from "./hooks/useSettingsSync";
import { useSettingsLanguage } from "./hooks/useSettingsLanguage";
import { useSettingsNotification } from "./hooks/useSettingsNotification";
import { useSettingsReset } from "./hooks/useSettingsReset";
import { spacing } from "@presentation/theme/spacing";
import { useTabBarClearance } from "@hooks/useTabBarClearance";
export default function Settings() {
  const { t, isDark, toggleTheme, styles, graceUsed, graceStatus } = useSettingsViewModel();
  const { language, setLanguage } = useSettingsLanguage();
  const {
    preset,
    customTarget,
    isCustom,
    isValid,
    targetSaved,
    selectPreset,
    setCustomTarget,
    handleTargetSave,
  } = useSettingsTarget();
  const { notificationHour, notificationMinute, notificationAmPm, setNotificationTime } =
    useSettingsNotification();
  const { setSyncVisible, handleExport, handleImport } = useSettingsSync();
  const { resetAll } = useSettingsReset();
  const clearance = useTabBarClearance(spacing[2]);
  const onScroll = useMinimizeOnScroll();
  return (
    <PageLayout testID="settings-screen">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          <View
            style={{
              flexDirection: "column",
              gap: spacing[4],
              paddingBottom: clearance,
            }}
          >
            <View style={styles.header}>
              <Text variant="2xl" weight="bold">
                {t("settings.title")}
              </Text>
            </View>

            <Card>
              <SectionHeader label={t("settings.language")} />
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
            </Card>

            <AppearanceSection isDark={isDark} onToggleTheme={toggleTheme} />

            <TargetSection
              preset={preset}
              customTarget={customTarget}
              isCustom={isCustom}
              isValid={isValid}
              targetSaved={targetSaved}
              onSelectPreset={selectPreset}
              onCustomTargetChange={setCustomTarget}
              onSaveTarget={handleTargetSave}
            />

            <Card>
              <SectionHeader label={t("settings.notification")} />
              <NotificationPicker
                currentHour={notificationHour}
                currentMinute={notificationMinute}
                currentAmPm={notificationAmPm}
                onSave={setNotificationTime}
              />
            </Card>

            <BackupSection
              onOpenSync={() => setSyncVisible(true)}
              onExport={handleExport}
              onImport={handleImport}
            />

            <GraceDaySection graceUsed={graceUsed} graceStatus={graceStatus} />

            <FeedbackSection />

            <Card>
              <ResetButton onReset={resetAll} />
            </Card>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </PageLayout>
  );
}
