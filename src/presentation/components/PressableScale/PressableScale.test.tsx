/** @format */
/**
 * Unit tests for PressableScale.
 */
import { render, screen, userEvent, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import { PressableScale } from "@components/PressableScale/PressableScale";

jest.useFakeTimers();

describe("PressableScale", () => {
  it("renders its children", async () => {
    await render(
      <PressableScale onPress={() => {}}>
        <Text>hit</Text>
      </PressableScale>
    );
    expect(screen.getByText("hit")).toBeOnTheScreen();
  });
  it("fires onPress when pressed", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(
      <PressableScale onPress={onPress}>
        <Text>hit</Text>
      </PressableScale>
    );
    await user.press(screen.getByText("hit"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  it("forwards onPressIn and onPressOut to the inner pressable", async () => {
    const onIn = jest.fn();
    const onOut = jest.fn();
    await render(
      <PressableScale onPressIn={onIn} onPressOut={onOut}>
        <Text>hit</Text>
      </PressableScale>
    );
    fireEvent(screen.getByText("hit"), "pressIn");
    fireEvent(screen.getByText("hit"), "pressOut");
    expect(onIn).toHaveBeenCalledTimes(1);
    expect(onOut).toHaveBeenCalledTimes(1);
  });
});
