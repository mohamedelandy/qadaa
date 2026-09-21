/** @format */
/**
 * Question-mark info tooltip with auto-dismissing popover, RTL-aware placement, and optional custom trigger.
 */
import { useState, useMemo, useCallback, useRef, ReactNode } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUI } from "@hooks/useUI";
import { useSafeTimeouts } from "@hooks/useSafeTimeouts";
import { spacing, borderRadius } from "@theme/spacing";
import { Text } from "@components/Text/Text";
import { useTooltipPositioning, POPOVER_WIDTH } from "./Tooltip.viewmodel";
interface TooltipProps {
  text: string;
  testID?: string;
  children?: ReactNode;
}
const AUTO_DISMISS_MS = 3000;
export function Tooltip({ text, testID, children }: TooltipProps) {
  const { colors, typography, isRTL, t } = useUI();
  const safeInsets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const { ref, pos, position, onPopoverLayout } = useTooltipPositioning(safeInsets, isRTL);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setSafeTimeout, clearSafeTimeout } = useSafeTimeouts();

  const open = useCallback(() => {
    position();
    setIsOpen(true);
    if (timerRef.current) clearSafeTimeout(timerRef.current);
    timerRef.current = setSafeTimeout(() => setIsOpen(false), AUTO_DISMISS_MS);
  }, [position, setSafeTimeout, clearSafeTimeout]);

  const close = useCallback(() => {
    setIsOpen(false);
    if (timerRef.current) {
      clearSafeTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [clearSafeTimeout]);

  const toggle = () => {
    if (isOpen) close();
    else open();
  };
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: "relative",
          marginHorizontal: spacing[1],
        },
        trigger: {
          width: 20,
          height: 20,
          borderRadius: borderRadius.full,
          justifyContent: "center",
          alignItems: "center",
        },
        triggerText: {
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          lineHeight: 14,
        },
        popover: {
          position: "absolute",
          width: POPOVER_WIDTH,
          borderWidth: 1,
          padding: spacing[3],
          backgroundColor: colors.card,
          borderRadius: spacing[4],
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 50,
        },
        text: {
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          lineHeight: 18,
          textAlign: isRTL ? "right" : "left",
        },
      }),
    [typography, isRTL, colors.card]
  );
  return (
    <View ref={ref} style={styles.container}>
      <Pressable
        testID={testID ? `${testID}-trigger` : undefined}
        onPress={toggle}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel={t("a11y.info")}
        style={[styles.trigger, { backgroundColor: colors.surfaceAlt }]}
      >
        {children ?? <Text style={[styles.triggerText, { color: colors.textMuted }]}>?</Text>}
      </Pressable>
      {isOpen && pos && (
        <View onLayout={onPopoverLayout} style={[styles.popover, { ...pos }]}>
          <Text
            testID={testID ? `${testID}-popover` : undefined}
            style={[styles.text, { color: colors.textMuted }]}
          >
            {text}
          </Text>
        </View>
      )}
    </View>
  );
}
