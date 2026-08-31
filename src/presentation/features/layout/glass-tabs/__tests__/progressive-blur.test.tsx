/** @format */
/**
 * Render tests covering ProgressiveBlur dark/light modes and top/bottom directions.
 */
import { render } from "@testing-library/react-native";
import { ThemeProvider } from "@theme/ThemeProvider";
import { ProgressiveBlur } from "../progressive-blur";
jest.mock("expo-blur", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    BlurView: (props: object) => React.createElement(View, props),
  };
});
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    LinearGradient: (props: object) => React.createElement(View, props),
  };
});
describe("ProgressiveBlur", () => {
  it("renders with default props (dark mode, top direction)", async () => {
    const tree = await render(
      <ThemeProvider>
        <ProgressiveBlur />
      </ThemeProvider>
    );
    expect(tree.root).toBeOnTheScreen();
  });
  it("renders with light mode (covers light mode branches)", async () => {
    const tree = await render(
      <ThemeProvider>
        <ProgressiveBlur mode="light" />
      </ThemeProvider>
    );
    expect(tree.root).toBeOnTheScreen();
  });
  it("renders with bottom direction (covers bottom direction branches)", async () => {
    const tree = await render(
      <ThemeProvider>
        <ProgressiveBlur direction="bottom" />
      </ThemeProvider>
    );
    expect(tree.root).toBeOnTheScreen();
  });
});
