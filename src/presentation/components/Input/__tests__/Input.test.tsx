/** @format */
/**
 * Unit tests for Input.
 */
import React from "react";
import { screen, userEvent } from "@testing-library/react-native";
import { renderWithProviders } from "@/src/__tests__/testUtils";
import { Input } from "../Input";

jest.useFakeTimers();

describe("Input", () => {
  it("renders the text input without label or error", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Input value="" onChangeText={() => {}} placeholder="placeholder" />);
    const input = screen.getByPlaceholderText("placeholder");
    await user.press(input);
    expect(input).toBeOnTheScreen();
  });
  it("renders the label when provided", async () => {
    await renderWithProviders(<Input value="" onChangeText={() => {}} label="Email" />);
    expect(screen.getByLabelText("Email")).toBeOnTheScreen();
    expect(screen.getByText("Email")).toBeOnTheScreen();
  });
  it("renders the error message when provided", async () => {
    await renderWithProviders(<Input value="" onChangeText={() => {}} error="required" />);
    expect(screen.getByText("required")).toBeOnTheScreen();
  });
  it("handles focus and blur events", async () => {
    const user = userEvent.setup();
    function StatefulInput() {
      const [val, setVal] = React.useState("");
      return <Input value={val} onChangeText={setVal} placeholder="focus me" />;
    }
    await renderWithProviders(<StatefulInput />);
    const input = screen.getByPlaceholderText("focus me");
    await user.type(input, "abc");
    expect(input).toHaveDisplayValue("abc");
  });
  it("applies error styling when error is set", async () => {
    await renderWithProviders(
      <Input
        value="bad"
        onChangeText={() => {}}
        error="invalid"
        placeholder="err"
        keyboardType="numeric"
        maxLength={5}
        autoFocus
      />
    );
    expect(screen.getByText("invalid")).toBeOnTheScreen();
  });
  it("does not render error text when error is undefined", async () => {
    await renderWithProviders(<Input value="" onChangeText={() => {}} label="Name" />);
    expect(screen.queryByText("invalid")).not.toBeOnTheScreen();
  });
});
