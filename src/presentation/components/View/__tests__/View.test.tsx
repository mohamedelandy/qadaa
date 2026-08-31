/** @format */
/**
 * Unit tests for View.
 */
import { screen } from "@testing-library/react-native";
import { Text } from "@components/Text/Text";
import { View } from "../View";
import { renderWithProviders } from "@/src/__tests__/testUtils";

describe("View", () => {
  it("renders with default background", async () => {
    await renderWithProviders(
      <View testID="test-view">
        <Text>content</Text>
      </View>
    );
    expect(screen.getByTestId("test-view")).toBeOnTheScreen();
  });
  it("renders with custom background color", async () => {
    await renderWithProviders(
      <View testID="test-view" backgroundColor="card">
        <Text>content</Text>
      </View>
    );
    expect(screen.getByTestId("test-view")).toBeOnTheScreen();
  });
});
