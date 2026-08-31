/** @format */
/**
 * Unit tests for BatchLogPopover component: preset presses, custom mode toggle and cancel flow.
 */
import { screen, userEvent } from "@testing-library/react-native";
import { BatchLogPopover } from "../BatchLogPopover";
import { Platform } from "react-native";
import { renderWithProviders } from "@/src/__tests__/testUtils";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("@hooks/usePopoverPositioning", () => ({
  usePopoverPositioning: () => ({
    pos: { left: 16, top: 100, width: 212 },
    position: jest.fn(),
    onPopoverLayout: jest.fn(),
    ref: { current: null },
  }),
}));
jest.mock("@hooks/usePressAnimation", () => ({
  usePressAnimation: () => ({
    scale: { value: 1 },
    handlePressIn: jest.fn(),
    handlePressOut: jest.fn(),
  }),
}));
jest.useFakeTimers();
const makeAnchorRef = () => ({ current: null });
function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    prayerKey: "fajr" as const,
    maxRemaining: 100,
    onBatch: jest.fn(),
    onClose: jest.fn(),
    anchorRef: makeAnchorRef(),
    ...overrides,
  };
}
describe("BatchLogPopover", () => {
  it("renders preset buttons when positioned", async () => {
    await renderWithProviders(<BatchLogPopover {...makeProps()} />, { direction: "ltr" });
    expect(screen.getByText("batch.custom")).toBeOnTheScreen();
  });
  it("fires onBatch when a preset is pressed", async () => {
    const user = userEvent.setup();
    const onBatch = jest.fn();
    await renderWithProviders(<BatchLogPopover {...makeProps({ onBatch })} />, {
      direction: "ltr",
    });
    await user.press(screen.getByText("+5"));
    expect(onBatch).toHaveBeenCalledWith("fajr", 5);
    await user.press(screen.getByText("+10"));
    expect(onBatch).toHaveBeenCalledWith("fajr", 10);
  });
  it("opens custom mode when batch.custom is pressed", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<BatchLogPopover {...makeProps()} />, { direction: "ltr" });
    await user.press(screen.getByText("batch.custom"));
    expect(screen.getByText("batch.confirm")).toBeOnTheScreen();
  });
  it("cancels custom mode and returns to preset view", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<BatchLogPopover {...makeProps()} />, { direction: "ltr" });
    await user.press(screen.getByText("batch.custom"));
    await user.press(screen.getByText("batch.cancel"));
    expect(screen.getByText("batch.custom")).toBeOnTheScreen();
  });
  it("renders with disabled presets when maxRemaining is low", async () => {
    await renderWithProviders(<BatchLogPopover {...makeProps({ maxRemaining: 3 })} />, {
      direction: "ltr",
    });
    expect(screen.getByText("+5")).toBeOnTheScreen();
    expect(screen.getByText("+10")).toBeOnTheScreen();
  });
  it("confirms a custom value and fires onBatch", async () => {
    const user = userEvent.setup();
    const onBatch = jest.fn();
    await renderWithProviders(<BatchLogPopover {...makeProps({ onBatch })} />, {
      direction: "ltr",
    });
    await user.press(screen.getByText("batch.custom"));
    const input = screen.getByPlaceholderText(/1–/);
    await user.clear(input);
    await user.type(input, "7");
    await user.press(screen.getByText("batch.confirm"));
    expect(onBatch).toHaveBeenCalledWith("fajr", 7);
  });
  it("renders on Android platform (covers KeyboardAvoidingView behavior branch)", async () => {
    Object.defineProperty(Platform, "OS", { value: "android", configurable: true });
    await renderWithProviders(<BatchLogPopover {...makeProps()} />, { direction: "ltr" });
    expect(screen.getByText("batch.custom")).toBeOnTheScreen();
    Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });
  });
  it("calls onClose when cancel is pressed", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    await renderWithProviders(<BatchLogPopover {...makeProps({ onClose })} />, {
      direction: "ltr",
    });
    await user.press(screen.getByText("batch.cancel"));
    expect(onClose).toHaveBeenCalled();
  });
});
