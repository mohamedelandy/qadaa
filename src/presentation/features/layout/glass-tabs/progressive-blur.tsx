/** @format */
/**
 * Stacked BlurViews with gradient overlay creating a progressive blur edge in dark/light modes.
 */
import { BlurView, type BlurTint } from "expo-blur";
import { View, StyleSheet, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
export type ProgressiveBlurTint = BlurTint;
export type ProgressiveBlurMode = "dark" | "light";
type Props = ViewProps & {
  intensity?: number;
  direction?: "top" | "bottom";
  mode?: ProgressiveBlurMode;
};
export function ProgressiveBlur({
  style,
  intensity = 5,
  direction = "top",
  mode = "dark",
  ...rest
}: Props) {
  const heights = ["100%", "45%"] as const;
  const anchor = direction === "top" ? { top: 0 } : { bottom: 0 };
  const tint: BlurTint = mode === "light" ? "systemThinMaterialLight" : "dark";
  const ramp = mode === "light" ? "255,255,255" : "0,0,0";
  const stop060 = mode === "light" ? 0.5 : 0.7;
  const stop025 = mode === "light" ? 0.22 : 0.32;
  return (
    <View pointerEvents="none" style={style} {...rest}>
      {heights.map((height, index) => (
        <BlurView
          key={index}
          tint={tint}
          intensity={intensity}
          style={{ position: "absolute", left: 0, right: 0, height, ...anchor }}
        />
      ))}
      <LinearGradient
        colors={[
          `rgba(${ramp},${stop060})`,
          `rgba(${ramp},${stop025})`,
          `rgba(${ramp},0.08)`,
          `rgba(${ramp},0)`,
        ]}
        locations={[0, 0.42, 0.68, 0.88]}
        start={direction === "top" ? { x: 0, y: 0 } : { x: 0, y: 1 }}
        end={direction === "top" ? { x: 0, y: 1 } : { x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
