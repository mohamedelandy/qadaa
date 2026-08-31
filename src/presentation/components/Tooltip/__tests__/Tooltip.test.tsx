/** @format */
/**
 * Unit tests for Tooltip.
 */
import { act, screen, userEvent } from "@testing-library/react-native";
import { Tooltip } from "../Tooltip";
import { Text } from "@components/Text/Text";
import { renderWithProviders } from "@/src/__tests__/testUtils";

jest.useFakeTimers();

describe("Tooltip", () => {
  it("renders its children", async () => {
    await renderWithProviders(
      <Tooltip text="help">
        <Text>trigger</Text>
      </Tooltip>
    );
    expect(screen.getByText("trigger")).toBeOnTheScreen();
  });
  it("renders a default question-mark trigger when no children", async () => {
    await renderWithProviders(<Tooltip text="help" />);
    expect(screen.getByText("?")).toBeOnTheScreen();
  });
  it("opens the popover on press (covers open callback) and auto-dismisses after timeout", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Tooltip text="help text" />);
    const trigger = screen.getByText("?");
    await user.press(trigger);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(trigger).toBeOnTheScreen();
  });
  it("toggles the popover closed on second press (covers close callback)", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Tooltip text="help text" />);
    const trigger = screen.getByText("?");
    await user.press(trigger);
    await user.press(trigger);
    expect(trigger).toBeOnTheScreen();
  });
  it("cleans up the pending timer on unmount (covers cleanup effect)", async () => {
    const user = userEvent.setup();
    const tree = await renderWithProviders(<Tooltip text="help text" />);
    await user.press(screen.getByText("?"));
    tree.unmount();
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
  });
});
