/** @format */
/**
 * Unit tests for Card.
 */
import { screen } from "@testing-library/react-native";
import { Text } from "@components/Text/Text";
import { Card } from "../Card";
import { renderWithProviders } from "@/src/__tests__/testUtils";

describe("Card", () => {
  it("renders children", async () => {
    await renderWithProviders(
      <Card>
        <Text>Test content</Text>
      </Card>
    );
    expect(screen.getByText("Test content")).toBeOnTheScreen();
  });
  it("applies elevated style when variant is elevated", async () => {
    await renderWithProviders(
      <Card variant="elevated">
        <Text>Elevated</Text>
      </Card>
    );
    expect(screen.getByText("Elevated")).toBeOnTheScreen();
  });
  it("applies default style when variant is default", async () => {
    await renderWithProviders(
      <Card variant="default">
        <Text>Default</Text>
      </Card>
    );
    expect(screen.getByText("Default")).toBeOnTheScreen();
  });
});
