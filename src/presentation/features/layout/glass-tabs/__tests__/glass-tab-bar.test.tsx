/** @format */
/**
 * Render tests for GlassTabBar labels, sliding highlight, glass layers, and no haptics on mount.
 */
import { render } from "@testing-library/react-native";
jest.mock("react-native-reanimated", () => {
  const { View, Text } = require("react-native") as typeof import("react-native");
  return {
    __esModule: true,
    default: {
      View,
      Text,
      interpolate: () => 0,
      Extrapolate: { CLAMP: "clamp" },
      createAnimatedComponent: (C: unknown) => C,
    },
    useSharedValue: (init: unknown) => ({ value: init }),
    useAnimatedStyle: (style: unknown) => style,
    useAnimatedScrollHandler: (h: object) => h,
    withSpring: (value: number) => value,
    makeMutable: (init: unknown) => ({ value: init }),
    interpolate: () => 0,
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  };
});
jest.mock("react-native-worklets", () => ({
  __esModule: true,
  scheduleOnRN: (cb: () => void) => cb(),
}));
jest.mock("react-native-gesture-handler", () => {
  const buildGesture = () => {
    const self = {
      activeOffsetX: () => self,
      failOffsetY: () => self,
      maxDistance: () => self,
      maxDuration: () => self,
      onStart: () => self,
      onUpdate: () => self,
      onEnd: () => self,
      onFinalize: () => self,
    };
    return self;
  };
  return {
    __esModule: true,
    Gesture: {
      Pan: () => buildGesture(),
      Tap: () => buildGesture(),
      Race: () => ({ type: "Root" }),
    },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock("expo-glass-effect", () => ({
  __esModule: true,
  GlassView: "GlassView",
  isLiquidGlassAvailable: () => true,
}));
jest.mock("expo-symbols", () => ({
  __esModule: true,
  SymbolView: "SymbolView",
}));
jest.mock("expo-blur", () => ({
  __esModule: true,
  BlurView: "BlurView",
}));
jest.mock("expo-linear-gradient", () => ({
  __esModule: true,
  LinearGradient: "LinearGradient",
}));
jest.mock("expo-haptics", () => ({
  __esModule: true,
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Error: "error", Warning: "warning" },
}));
import * as Haptics from "expo-haptics";
import { GlassTabBar, GlassTabButton, type GlassTabItem } from "../glass-tab-bar";
const items: GlassTabItem[] = [
  { name: "dashboard", label: "Dashboard", icon: "square.grid.2x2" },
  { name: "stats", label: "Stats", icon: "chart.bar" },
];
function Bar({ haptics = true }: { haptics?: boolean }) {
  return (
    <GlassTabBar haptics={haptics} onIndexSelected={jest.fn()}>
      {items.map((item, index) => (
        <GlassTabButton
          key={item.name}
          item={item}
          index={index}
          isFocused={index === 0}
          onPress={jest.fn()}
        />
      ))}
    </GlassTabBar>
  );
}
describe("GlassTabBar render states", () => {
  it("renders the tab labels", async () => {
    const { getAllByText } = await render(<Bar />);
    expect(getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(getAllByText("Stats").length).toBeGreaterThan(0);
  });
  it("renders the sliding highlight and glass layers", async () => {
    const tree = await render(<Bar />);
    const root = tree.root;
    if (!root) throw new Error("no root");
    expect(root.queryAll((n) => String(n.type) === "GlassView").length).toBe(1);
    expect(root.queryAll((n) => String(n.type) === "SymbolView").length).toBeGreaterThan(0);
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
  });
  it("renders with haptics enabled without calling them on mount", async () => {
    await render(<Bar haptics={true} />);
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
  });
});
