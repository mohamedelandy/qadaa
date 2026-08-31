/** @format */
/**
 * Modal bottom sheet with fading backdrop, spring entrance/exit, and drag-to-dismiss pan gesture.
 */
import { useMemo, useCallback, useEffect, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import { SheetBackdrop } from "../SheetBackdrop/SheetBackdrop";
import { useSheetSpring, dismissSheet, SHEET_SPRING } from "@hooks/useSheetSpring";
import {
  useSheetMounted,
  useSheetOverlayVisibility,
  shouldDismissSheet,
} from "./PageSheet.viewmodel";
interface SheetProps {
  visible: boolean;
  onClose: () => void;
  topBorderColor?: string;
  testID?: string;
  children: ReactNode;
}
export function Sheet({ visible, onClose, topBorderColor, testID, children }: SheetProps) {
  const { colors } = useUI();
  const insets = useSafeAreaInsets();
  const { mounted, hide } = useSheetMounted(visible);
  const { translateY, opacity } = useSheetSpring(visible);
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
  useSheetOverlayVisibility(visible);
  useEffect(() => {
    if (!visible && mounted) {
      dismissSheet(translateY, opacity, () => {
        hide();
      });
    }
  }, [visible, mounted, translateY, opacity, hide]);
  const close = useCallback(() => {
    dismissSheet(translateY, opacity, () => {
      hide();
      onClose();
    });
  }, [translateY, opacity, onClose, hide]);
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-8, 8])
        .onUpdate((e) => {
          if (e.translationY > 0) {
            translateY.value = Math.max(e.translationY, 0);
          }
        })
        .onEnd((e) => {
          if (shouldDismissSheet(e.translationY, e.velocityY)) {
            scheduleOnRN(close);
          } else {
            translateY.value = withSpring(0, SHEET_SPRING);
          }
        }),
    [translateY, close]
  );
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + keyboardHeight.value }],
  }));
  if (!mounted) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <SheetBackdrop opacity={opacity} onClose={close} />
      <GestureDetector gesture={pan}>
        {/* NOTE: do NOT set `accessible` here — it groups all children into one
            accessibility element on iOS, hiding interactive children (e.g. the
            sheet's close button) from both VoiceOver and UI automation. */}
        <Animated.View
          testID={testID}
          role={visible ? "dialog" : undefined}
          aria-modal={visible ? true : undefined}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.card,
              borderTopColor: topBorderColor ?? colors.border,
              paddingBottom: spacing[8.5] + insets.bottom,
            },
            sheetStyle,
          ]}
        >
          <View style={styles.dragTarget} hitSlop={{ top: -8, bottom: 4 }}>
            <View style={[styles.handle, { backgroundColor: colors.surfaceAlt }]} />
          </View>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: spacing[0],
    start: 0,
    end: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingTop: spacing[3],
    paddingHorizontal: spacing[6],
  },
  dragTarget: {
    alignItems: "center",
    justifyContent: "center",
    height: spacing[6],
    marginBottom: spacing[2],
  },
  handle: {
    width: spacing[10],
    height: spacing[1],
    borderRadius: spacing[0.5],
  },
});
