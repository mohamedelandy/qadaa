/** @format */
/**
 * Unit tests for Button.
 */
import { screen, userEvent } from "@testing-library/react-native";
import { Button } from "@components/Button/Button";
import { renderWithProviders } from "@/src/__tests__/testUtils";

jest.useFakeTimers();

describe("Button", () => {
  const renderButton = (props = {}) =>
    renderWithProviders(<Button title="Test" onPress={() => {}} {...props} />);

  test("renders title", async () => {
    await renderButton();
    expect(screen.getByText("Test")).toBeOnTheScreen();
  });

  test("exposes role=button with accessible name", async () => {
    await renderButton();
    expect(screen.getByRole("button", { name: "Test" })).toBeOnTheScreen();
  });

  test("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await renderButton({ title: "Press", onPress });
    await user.press(screen.getByRole("button", { name: "Press" }));
    expect(onPress).toHaveBeenCalled();
  });

  test("does not call onPress when disabled", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await renderButton({ title: "Press", onPress, disabled: true });
    const button = screen.getByRole("button", { name: "Press", disabled: true });
    expect(button).toBeDisabled();
    await user.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  test("shows spinner and blocks onPress while loading", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await renderButton({ title: "Press", onPress, loading: true });
    const button = screen.getByRole("button", { name: "Press" });
    expect(button).toBeBusy();
    await user.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
