/** @format */
/**
 * Modal popover anchored to a prayer cell offering +5/+10 or custom batch logging of missed prayers.
 */
import { useEffect } from "react";
import { View, Pressable, TextInput, Modal } from "react-native";
import { KeyboardAvoidingView } from "@components/KeyboardAvoidingView";
import { useBatchLogPopoverViewModel } from "./BatchLogPopover.viewmodel";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { useUI } from "@hooks/useUI";
import { formatPlus, formatNumber } from "@domain/format";
import { usePopoverPositioning } from "@hooks/usePopoverPositioning";
import type { PrayerKey } from "@domain/types";
import { Text } from "@components/Text/Text";
import { createBatchLogPopoverStyles } from "./BatchLogPopover.styles";

interface BatchLogPopoverProps {
  prayerKey: PrayerKey;
  maxRemaining: number;
  onBatch: (prayer: PrayerKey, count: number) => void;
  onClose: () => void;
  anchorRef: React.RefObject<View | null>;
}
const POPOVER_WIDTH = 212;
const GAP = 8;
const MARGIN = 16;

type PopoverStyles = ReturnType<typeof createBatchLogPopoverStyles>;

interface PresetModeProps {
  maxRemaining: number;
  isRTL: boolean;
  styles: PopoverStyles;
  t: (key: string) => string;
  handlePreset: (n: number) => void;
  openCustomMode: () => void;
  onClose: () => void;
}

function PresetMode({
  maxRemaining,
  isRTL,
  styles,
  t,
  handlePreset,
  openCustomMode,
  onClose,
}: PresetModeProps) {
  return (
    <>
      <View style={styles.presetRow}>
        <PressableScale
          testID="batch-preset-5-btn"
          style={[styles.presetBtn, maxRemaining < 5 && styles.presetBtnDisabled]}
          onPress={() => handlePreset(5)}
          disabled={maxRemaining < 5}
          accessibilityRole="button"
          accessibilityLabel={`+5`}
        >
          <Text style={[styles.presetText, maxRemaining < 5 && styles.presetTextDisabled]}>
            {formatPlus(5, isRTL)}
          </Text>
        </PressableScale>
        <PressableScale
          testID="batch-preset-10-btn"
          style={[styles.presetBtn, maxRemaining < 10 && styles.presetBtnDisabled]}
          onPress={() => handlePreset(10)}
          disabled={maxRemaining < 10}
          accessibilityRole="button"
          accessibilityLabel={`+10`}
        >
          <Text style={[styles.presetText, maxRemaining < 10 && styles.presetTextDisabled]}>
            {formatPlus(10, isRTL)}
          </Text>
        </PressableScale>
        <PressableScale
          testID="batch-custom-btn"
          style={styles.customBtn}
          onPress={openCustomMode}
          accessibilityRole="button"
          accessibilityLabel={t("batch.custom")}
        >
          <Text style={styles.customText}>{t("batch.custom")}</Text>
        </PressableScale>
      </View>
      <PressableScale
        testID="batch-cancel-btn"
        style={styles.cancelBtn}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={t("batch.cancel")}
      >
        <Text style={styles.cancelText}>{t("batch.cancel")}</Text>
      </PressableScale>
    </>
  );
}

interface CustomModeProps {
  maxRemaining: number;
  isRTL: boolean;
  styles: PopoverStyles;
  t: (key: string) => string;
  placeholderColor: string;
  customValue: string;
  setCustomValue: (val: string) => void;
  handleCustomConfirm: () => void;
  cancelCustomMode: () => void;
}

function CustomMode({
  maxRemaining,
  isRTL,
  styles,
  t,
  placeholderColor,
  customValue,
  setCustomValue,
  handleCustomConfirm,
  cancelCustomMode,
}: CustomModeProps) {
  return (
    <View style={styles.customRow}>
      <TextInput
        testID="batch-custom-input"
        style={styles.input}
        keyboardType="number-pad"
        returnKeyType="done"
        autoFocus
        placeholder={`1–${formatNumber(maxRemaining, isRTL)}`}
        placeholderTextColor={placeholderColor}
        value={customValue}
        onChangeText={setCustomValue}
        onSubmitEditing={handleCustomConfirm}
      />
      <PressableScale
        testID="batch-custom-confirm-btn"
        style={styles.confirmBtn}
        onPress={handleCustomConfirm}
      >
        <Text style={styles.confirmText}>{t("batch.confirm")}</Text>
      </PressableScale>
      <PressableScale testID="batch-cancel-btn" style={styles.cancelBtn} onPress={cancelCustomMode}>
        <Text style={styles.cancelText}>{t("batch.cancel")}</Text>
      </PressableScale>
    </View>
  );
}

export function BatchLogPopover(props: BatchLogPopoverProps) {
  const { isRTL } = useUI();
  const {
    t,
    styles,
    placeholderColor,
    customMode,
    openCustomMode,
    cancelCustomMode,
    customValue,
    setCustomValue,
    maxRemaining,
    handlePreset,
    handleCustomConfirm,
    dismissKeyboard,
  } = useBatchLogPopoverViewModel(props);
  const { pos, position, onPopoverLayout } = usePopoverPositioning({
    width: POPOVER_WIDTH,
    isRTL,
    gap: GAP,
    margin: MARGIN,
    preferBelow: true,
    mode: "absolute",
    anchorRef: props.anchorRef,
  });
  useEffect(() => {
    const raf = requestAnimationFrame(() => position());
    return () => cancelAnimationFrame(raf);
  }, [position]);
  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={props.onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView style={styles.scrim}>
        <Pressable
          style={styles.backdrop}
          onPress={dismissKeyboard}
          accessibilityLabel={t("a11y.close")}
        />
        {pos && (
          <View
            onLayout={onPopoverLayout}
            style={[styles.container, { left: pos.left, top: pos.top, width: POPOVER_WIDTH }]}
          >
            <Text style={styles.title}>{t("batch.title")}</Text>
            {!customMode ? (
              <PresetMode
                maxRemaining={maxRemaining}
                isRTL={isRTL}
                styles={styles}
                t={t}
                handlePreset={handlePreset}
                openCustomMode={openCustomMode}
                onClose={props.onClose}
              />
            ) : (
              <CustomMode
                maxRemaining={maxRemaining}
                isRTL={isRTL}
                styles={styles}
                t={t}
                placeholderColor={placeholderColor}
                customValue={customValue}
                setCustomValue={setCustomValue}
                handleCustomConfirm={handleCustomConfirm}
                cancelCustomMode={cancelCustomMode}
              />
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}
