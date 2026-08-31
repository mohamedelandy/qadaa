/** @format */
/**
 * Icon and label column of a glass tab button, crossfading with slide position and collapse.
 */
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import { TabGlyph } from "./tab-glyph";
import {
  ICON_SIZE,
  ITEM_GAP,
  LABEL_HEIGHT,
  activeGlyphOpacity,
  labelPairOpacity,
} from "./glass-tab-bar.viewmodel";
import type { GlassTabItem } from "./glass-tab-item";
import type { GlassTabBarTheme } from "./tab-bar-store";
import { fonts, fontSize } from "@theme/typography";

export function GlassTabButtonContent({
  item,
  index,
  progress,
  slideIndex,
  theme,
}: {
  item: GlassTabItem;
  index: number;
  progress: SharedValue<number>;
  slideIndex: SharedValue<number>;
  theme: GlassTabBarTheme;
}) {
  const activeGlyphStyle = useAnimatedStyle(() => ({
    opacity: activeGlyphOpacity(slideIndex.value, index),
  }));
  const activeLabelStyle = useAnimatedStyle(() => ({
    opacity: labelPairOpacity(progress.value, slideIndex.value, index).active,
  }));
  const inactiveLabelStyle = useAnimatedStyle(() => ({
    opacity: labelPairOpacity(progress.value, slideIndex.value, index).inactive,
  }));
  return (
    <>
      <View
        style={{
          height: ICON_SIZE,
          width: ICON_SIZE,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TabGlyph item={item} tint={theme.inactiveTint} />
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { alignItems: "center", justifyContent: "center" },
            activeGlyphStyle,
          ]}
        >
          <TabGlyph item={item} tint={theme.activeTint} />
        </Animated.View>
      </View>

      <View
        style={{
          height: LABEL_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          marginTop: ITEM_GAP,
        }}
      >
        <Animated.Text
          numberOfLines={1}
          style={[
            {
              fontSize: fontSize.xs,
              fontFamily: fonts.medium,
              color: theme.inactiveTint,
              position: "absolute",
            },
            inactiveLabelStyle,
          ]}
        >
          {item.label}
        </Animated.Text>
        <Animated.Text
          numberOfLines={1}
          style={[
            {
              fontSize: fontSize.xs,
              fontFamily: fonts.medium,
              color: theme.activeTint,
              position: "absolute",
            },
            activeLabelStyle,
          ]}
        >
          {item.label}
        </Animated.Text>
      </View>
    </>
  );
}
