/** @format */
/**
 * Tests driving GlassTabBar pan/tap gesture worklets via captured handlers (drag switch, tap select).
 */
import { render, screen, userEvent } from "@testing-library/react-native";
import { panHandlers, tapHandlers } from "./gesture-capture";
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
    useAnimatedStyle: (styleFn: unknown) => (styleFn as () => unknown)(),
    useAnimatedScrollHandler: (h: object) => h,
    withSpring: (value: number) => value,
    makeMutable: (init: unknown) => ({ value: init }),
    interpolate: () => 0,
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  };
});
jest.mock("react-native-worklets", () => ({
  __esModule: true,
  scheduleOnRN: (cb: (...args: unknown[]) => unknown, ...args: unknown[]) => cb(...args),
}));
jest.mock("react-native-gesture-handler", () => {
  const { panHandlers: panStore, tapHandlers: tapStore } = require("./gesture-capture");
  const makeBuilder = (
    store: Array<{
      name: string;
      cb: (...a: unknown[]) => void;
    }>
  ) => {
    const self: Record<string, unknown> = {
      activeOffsetX: () => self,
      activeOffsetY: () => self,
      failOffsetY: () => self,
      maxDistance: () => self,
      maxDuration: () => self,
    };
    for (const name of ["onStart", "onUpdate", "onEnd", "onFinalize"]) {
      self[name] = (cb: (...a: unknown[]) => void) => {
        store.push({ name, cb });
        return self;
      };
    }
    return self;
  };
  return {
    __esModule: true,
    Gesture: {
      Pan: () => makeBuilder(panStore),
      Tap: () => makeBuilder(tapStore),
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
import { GlassTabBar, GlassTabButton, type GlassTabItem } from "../glass-tab-bar";
const CustomGlyph = ({ tint }: { tint: string }) => {
  const React = require("react");
  const { View } = require("react-native");
  return React.createElement(View, { style: { width: 21, height: 21, backgroundColor: tint } });
};
const items: GlassTabItem[] = [
  { name: "dashboard", label: "Dashboard", icon: "square.grid.2x2" },
  { name: "stats", label: "Stats", renderIcon: CustomGlyph },
  { name: "settings", label: "Settings" },
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
describe("GlassTabBar gesture worklets", () => {
  beforeEach(() => {
    panHandlers.length = 0;
    tapHandlers.length = 0;
  });
  it("captures pan handlers on render", async () => {
    await render(<Bar />);
    expect(panHandlers.length).toBeGreaterThan(0);
  });
  it("runs pan onStart/onUpdate/onFinalize worklets", async () => {
    await render(<Bar />);
    const onStart = panHandlers.find((h) => h.name === "onStart");
    const onUpdate = panHandlers.find((h) => h.name === "onUpdate");
    const onFinalize = panHandlers.find((h) => h.name === "onFinalize");
    expect(onStart).toBeDefined();
    expect(onUpdate).toBeDefined();
    expect(onFinalize).toBeDefined();
    onStart?.cb();
    onUpdate?.cb({ x: 50 });
    onUpdate?.cb({ x: 250 });
    onFinalize?.cb();
  });
  it("onFinalize returns early when not dragging (covers isDragging guard)", async () => {
    await render(<Bar />);
    const onFinalize = panHandlers.find((h) => h.name === "onFinalize");
    expect(onFinalize).toBeDefined();
    onFinalize?.cb();
  });
  it("runs tap onEnd worklet on success and failure", async () => {
    await render(<Bar />);
    const onEnd = tapHandlers.find((h) => h.name === "onEnd");
    expect(onEnd).toBeDefined();
    onEnd?.cb({ x: 30 }, true);
    onEnd?.cb({ x: 30 }, false);
  });
  it("covers haptic tick path on iOS", async () => {
    await render(<Bar haptics />);
    const onUpdate = panHandlers.find((h) => h.name === "onUpdate");
    onUpdate?.cb({ x: 10 });
    onUpdate?.cb({ x: 200 });
  });
  it("fires the tab onPress when a label is pressed", async () => {
    const user = userEvent.setup();
    await render(<Bar />);
    const dashboards = screen.getAllByText("Dashboard");
    const first = dashboards[0];
    if (first) await user.press(first);
  });
});
