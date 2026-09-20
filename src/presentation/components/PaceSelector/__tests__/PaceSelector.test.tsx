/** @format */

import { render, screen, userEvent } from "@testing-library/react-native";
import { PaceSelector } from "../PaceSelector";

jest.mock("@hooks/useUI", () => ({
  useUI: () => ({
    t: (key: string) => key,
    colors: {
      primary: "primary",
      borderStrong: "borderStrong",
      greenSubtle: "greenSubtle",
      card: "card",
      shadow: "shadow",
      white: "white",
      textMuted: "textMuted",
      green: "green",
    },
    gradients: {
      primaryBtn: ["#000", "#FFF"],
    },
    typography: {
      fontSize: { base: 16 },
      fonts: { bold: "bold" },
    },
    borderRadius: { xl: 12 },
  }),
}));

describe("PaceSelector", () => {
  const defaultProps = {
    preset: 1,
    customTarget: "",
    isCustom: false,
    onSelectPreset: jest.fn(),
    onSelectCustom: jest.fn(),
    onCustomTargetChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders presets correctly", async () => {
    await render(<PaceSelector {...defaultProps} />);
    expect(screen.getByTestId("pace-1-btn")).toBeTruthy();
    expect(screen.getByTestId("pace-5-btn")).toBeTruthy();
    expect(screen.getByTestId("pace-10-btn")).toBeTruthy();
  });

  it("calls onSelectPreset when a preset is pressed", async () => {
    const user = userEvent.setup();
    await render(<PaceSelector {...defaultProps} />);
    await user.press(screen.getByTestId("pace-5-btn"));
    expect(defaultProps.onSelectPreset).toHaveBeenCalledWith(5);
  });

  it("calls onSelectCustom when custom button is pressed", async () => {
    const user = userEvent.setup();
    await render(<PaceSelector {...defaultProps} />);
    await user.press(screen.getByTestId("pace-custom-btn"));
    expect(defaultProps.onSelectCustom).toHaveBeenCalled();
  });

  it("shows custom input when isCustom is true", async () => {
    await render(<PaceSelector {...defaultProps} isCustom={true} />);
    expect(screen.getByTestId("pace-custom-input")).toBeTruthy();
  });

  it("displays custom error if provided", async () => {
    await render(<PaceSelector {...defaultProps} isCustom={true} customError="Invalid pace" />);
    expect(screen.getByText("Invalid pace")).toBeTruthy();
  });
});
