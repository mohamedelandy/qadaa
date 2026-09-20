/** @format */

import { render, screen } from "@testing-library/react-native";
import { KeyboardAvoidingView } from "../KeyboardAvoidingView";
import { View, Platform } from "react-native";

describe("KeyboardAvoidingView", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("passes padding behavior on iOS", async () => {
    Platform.OS = "ios";
    await render(
      <KeyboardAvoidingView testID="kav">
        <View />
      </KeyboardAvoidingView>
    );

    const kav = screen.getByTestId("kav");
    expect(kav.props["behavior"]).toBe("padding");
  });

  it("passes undefined behavior on Android", async () => {
    Platform.OS = "android";
    await render(
      <KeyboardAvoidingView testID="kav">
        <View />
      </KeyboardAvoidingView>
    );

    const kav = screen.getByTestId("kav");
    expect(kav.props["behavior"]).toBeUndefined();
  });
});
