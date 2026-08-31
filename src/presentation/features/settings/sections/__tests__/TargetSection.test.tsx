/** @format */
/**
 * Component tests for the daily-target card: preset chips, custom input,
 * invalid/valid save states, and the saved checkmark state.
 */
import { render, screen, userEvent } from "@testing-library/react-native";
import { ThemeProvider } from "@theme/ThemeProvider";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { TargetSection } from "../TargetSection";

jest.useFakeTimers();

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    preset: 5,
    customTarget: "",
    isCustom: false,
    isValid: true,
    targetSaved: false,
    onSelectPreset: jest.fn(),
    onCustomTargetChange: jest.fn(),
    onSaveTarget: jest.fn(),
    ...overrides,
  };
}

describe("TargetSection", () => {
  it("renders the three preset chips and the custom button", async () => {
    await render(
      <ThemeProvider>
        <TargetSection {...makeProps()} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("settings-pace-1-btn")).toBeOnTheScreen();
    expect(screen.getByTestId("settings-pace-5-btn")).toBeOnTheScreen();
    expect(screen.getByTestId("settings-pace-10-btn")).toBeOnTheScreen();
    expect(screen.getByTestId("settings-pace-custom-btn")).toBeOnTheScreen();
    expect(screen.getByTestId("settings-target-save-btn")).toBeOnTheScreen();
  });

  it("selects a preset when a chip is pressed", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    await render(
      <ThemeProvider>
        <TargetSection {...props} />
      </ThemeProvider>
    );
    await user.press(screen.getByTestId("settings-pace-1-btn"));
    expect(props.onSelectPreset).toHaveBeenCalledWith(1);
    await user.press(screen.getByTestId("settings-pace-10-btn"));
    expect(props.onSelectPreset).toHaveBeenCalledWith(10);
  });

  it("selects the custom preset when the custom button is pressed", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    await render(
      <ThemeProvider>
        <TargetSection {...props} />
      </ThemeProvider>
    );
    await user.press(screen.getByTestId("settings-pace-custom-btn"));
    expect(props.onSelectPreset).toHaveBeenCalledWith(-1);
  });

  it("reveals the custom input when isCustom and forwards text changes", async () => {
    const user = userEvent.setup();
    const props = makeProps({ isCustom: true });
    await render(
      <ThemeProvider>
        <TargetSection {...props} />
      </ThemeProvider>
    );
    const input = screen.getByTestId("settings-pace-custom-input");
    await user.type(input, "7");
    expect(props.onCustomTargetChange).toHaveBeenCalledWith("7");
  });

  it("keeps the save button inert while the target is invalid", async () => {
    const user = userEvent.setup();
    const props = makeProps({ isValid: false });
    await render(
      <ThemeProvider>
        <TargetSection {...props} />
      </ThemeProvider>
    );
    await user.press(screen.getByTestId("settings-target-save-btn"));
    expect(props.onSaveTarget).not.toHaveBeenCalled();
  });

  it("saves when the target is valid", async () => {
    const user = userEvent.setup();
    const props = makeProps();
    await render(
      <ThemeProvider>
        <TargetSection {...props} />
      </ThemeProvider>
    );
    await user.press(screen.getByTestId("settings-target-save-btn"));
    expect(props.onSaveTarget).toHaveBeenCalledTimes(1);
  });

  it("renders the checkmark draw animation once saved", async () => {
    await render(
      <ThemeProvider>
        <TargetSection {...makeProps({ targetSaved: true })} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("lottie-checkmark-draw")).toBeOnTheScreen();
  });
});
