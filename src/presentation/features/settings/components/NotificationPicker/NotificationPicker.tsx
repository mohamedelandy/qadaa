/** @format */
/**
 * Daily reminder picker (hour cycler, minute presets, AM/PM, save).
 */
import { View } from "react-native";
import { useNotificationPickerViewModel } from "./NotificationPicker.viewmodel";
import { Text } from "@components/Text/Text";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { LottieView } from "@components/Lottie/LottieView";
interface NotificationPickerProps {
  currentHour: number;
  currentMinute: number;
  currentAmPm: "AM" | "PM";
  onSave: (hour: number, minute: number, amPm: "AM" | "PM") => Promise<boolean>;
}
export function NotificationPicker(props: NotificationPickerProps) {
  const {
    t,
    isRTL,
    styles,
    hour,
    minute,
    amPm,
    setMinute,
    setAmPm,
    saved,
    error,
    cycleHour,
    handleSave,
    MINUTE_OPTIONS,
  } = useNotificationPickerViewModel(props);
  return (
    <View style={styles.root}>
      <View style={styles.pickerRow}>
        <View style={styles.selectorGroup}>
          <PressableScale
            testID="hour-down"
            accessibilityRole="button"
            accessibilityLabel={t("a11y.hourDecrease")}
            onPress={() => cycleHour(-1)}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>{isRTL ? "▶" : "◀"}</Text>
          </PressableScale>
          <View style={styles.valueBox}>
            <Text testID="notification-hour-value" style={styles.valueText}>
              {hour}
            </Text>
          </View>
          <PressableScale
            testID="hour-up"
            accessibilityRole="button"
            accessibilityLabel={t("a11y.hourIncrease")}
            onPress={() => cycleHour(1)}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>{isRTL ? "◀" : "▶"}</Text>
          </PressableScale>
        </View>

        <View style={styles.ampmGroup}>
          <PressableScale
            testID="notification-ampm-am-btn"
            accessibilityRole="button"
            accessibilityState={{ selected: amPm === "AM" }}
            onPress={() => setAmPm("AM")}
            style={[styles.ampmButton, amPm === "AM" && styles.ampmActive]}
          >
            <Text style={[styles.ampmText, amPm === "AM" && styles.ampmTextActive]}>
              {t("settings.am")}
            </Text>
          </PressableScale>
          <PressableScale
            testID="notification-ampm-pm-btn"
            accessibilityRole="button"
            accessibilityState={{ selected: amPm === "PM" }}
            onPress={() => setAmPm("PM")}
            style={[styles.ampmButton, amPm === "PM" && styles.ampmActive]}
          >
            <Text style={[styles.ampmText, amPm === "PM" && styles.ampmTextActive]}>
              {t("settings.pm")}
            </Text>
          </PressableScale>
        </View>
      </View>

      <View style={styles.minuteRow}>
        {MINUTE_OPTIONS.map((opt) => {
          const val = parseInt(opt, 10);
          const selected = val === minute;
          return (
            <PressableScale
              key={opt}
              testID={`settings-minute-${opt}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setMinute(val)}
              style={[styles.minuteButton, selected && styles.minuteButtonSelected]}
            >
              <Text style={[styles.minuteText, selected && styles.minuteTextSelected]}>{opt}</Text>
            </PressableScale>
          );
        })}
      </View>

      <PressableScale
        testID="notification-save-btn"
        onPress={() => {
          void handleSave();
        }}
        style={[styles.saveButton, saved && styles.saveButtonSaved]}
      >
        {saved ? (
          <LottieView
            name="checkmark-draw"
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.saveText}>{t("settings.notificationSave")}</Text>
        )}
      </PressableScale>

      {error && (
        <Text testID="notification-error" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}
