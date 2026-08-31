/** @format */
/**
 * Unit tests for reset button confirm prompt firing onReset only after user confirmation.
 */
import { screen, userEvent } from "@testing-library/react-native";
jest.useFakeTimers();
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { renderWithProviders } from "@/src/__tests__/testUtils";
import { ResetButton } from "../ResetButton";
describe("ResetButton", () => {
  it("shows the confirm prompt when pressed", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<ResetButton onReset={() => {}} />);
    await user.press(screen.getByText(/settings.reset/));
    expect(screen.getByText("settings.resetConfirm")).toBeOnTheScreen();
  });
  it("calls onReset when confirmed", async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    await renderWithProviders(<ResetButton onReset={onReset} />);
    await user.press(screen.getByText(/settings.reset/));
    await user.press(screen.getByTestId("reset-confirm"));
    expect(onReset).toHaveBeenCalled();
  });
  it("cancels the confirmation without resetting", async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    await renderWithProviders(<ResetButton onReset={onReset} />);
    await user.press(screen.getByText(/settings.reset/));
    expect(screen.getByText("settings.resetConfirm")).toBeOnTheScreen();
    await user.press(screen.getByText("settings.cancel"));
    expect(onReset).not.toHaveBeenCalled();
    expect(screen.getByText(/settings.reset/)).toBeOnTheScreen();
  });
});
