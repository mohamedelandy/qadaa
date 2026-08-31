/** @format */
/**
 * Sliding highlight pill behind the active glass tab, sized by minimize progress.
 */
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import { highlightLayout } from "./glass-tab-bar.viewmodel";

export function GlassTabHighlight({
  progress,
  slideIndex,
  windowWidth,
  tabCount,
  color,
}: {
  progress: SharedValue<number>;
  slideIndex: SharedValue<number>;
  windowWidth: number;
  tabCount: number;
  color: string;
}) {
  const highlightStyle = useAnimatedStyle(() => {
    const layout = highlightLayout(progress.value, slideIndex.value, windowWidth, tabCount);
    return {
      height: layout.height,
      width: layout.width,
      borderRadius: layout.borderRadius,
      top: layout.top,
      transform: [{ translateX: layout.translateX }],
    };
  });
  return (
    <Animated.View
      style={[
        { position: "absolute", left: 0, backgroundColor: color, borderCurve: "continuous" },
        highlightStyle,
      ]}
    />
  );
}
