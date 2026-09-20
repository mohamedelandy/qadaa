/** @format */
import { render, screen, userEvent } from "@testing-library/react-native";
import { ThemeProvider } from "@theme/ThemeProvider";
import { TargetSelection } from "../TargetSelection";

jest.useFakeTimers();
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

describe("TargetSelection", () => {
  function makeProps(overrides: Record<string, unknown> = {}) {
    return {
      preset: 5,
      customTarget: "",
      isCustom: false,
      onSelectPreset: jest.fn(),
      onCustomTargetChange: jest.fn(),
      ...overrides,
    };
  }

  it("renders the three preset chips and the custom button", async () => {
    await render(
      <ThemeProvider>
        <TargetSelection {...makeProps()} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("wizard-pace-1-btn")).toBeOnTheScreen();
    expect(screen.getByTestId("wizard-pace-5-btn")).toBeOnTheScreen();
    expect(screen.getByTestId("wizard-pace-10-btn")).toBeOnTheScreen();
    expect(screen.getByTestId("wizard-pace-custom-btn")).toBeOnTheScreen();
  });

  it("supports testIDPrefix for settings", async () => {
    await render(
      <ThemeProvider>
        <TargetSelection {...makeProps({ testIDPrefix: "settings" })} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("settings-pace-1-btn")).toBeOnTheScreen();
    expect(screen.getByTestId("settings-pace-custom-btn")).toBeOnTheScreen();
  });

  it("selects a preset when a chip is pressed", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    await render(
      <ThemeProvider>
        <TargetSelection {...props} />
      </ThemeProvider>
    );

    await user.press(screen.getByTestId("wizard-pace-1-btn"));
    expect(props.onSelectPreset).toHaveBeenCalledWith(1);
  });

  it("selects the custom preset when the custom button is pressed", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    await render(
      <ThemeProvider>
        <TargetSelection {...props} />
      </ThemeProvider>
    );

    await user.press(screen.getByTestId("wizard-pace-custom-btn"));
    expect(props.onSelectPreset).toHaveBeenCalledWith(-1);
  });

  it("reveals the custom input when isCustom and forwards text changes", async () => {
    const user = userEvent.setup();
    const props = makeProps({ isCustom: true });
    await render(
      <ThemeProvider>
        <TargetSelection {...props} />
      </ThemeProvider>
    );

    const input = screen.getByTestId("wizard-pace-custom-input");
    await user.type(input, "7");
    expect(props.onCustomTargetChange).toHaveBeenCalledWith("7");
  });

  it("displays custom error if provided", async () => {
    const props = makeProps({ isCustom: true, customError: "Invalid target" });
    await render(
      <ThemeProvider>
        <TargetSelection {...props} />
      </ThemeProvider>
    );

    expect(screen.getByText("Invalid target")).toBeOnTheScreen();
  });
});
