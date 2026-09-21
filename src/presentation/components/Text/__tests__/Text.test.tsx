/** @format */
/**
 * Unit tests for Text.
 */
import { screen } from "@testing-library/react-native";
import { fontSize } from "@theme/typography";
import { Text } from "../Text";
import { renderWithProviders } from "@/src/__tests__/testUtils";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));

describe("Text", () => {
  it("renders children", async () => {
    await renderWithProviders(<Text>Hello</Text>);
    expect(screen.getByText("Hello")).toBeOnTheScreen();
  });
  it("defaults to accessibilityRole text", async () => {
    await renderWithProviders(<Text>Hello</Text>);
    expect(screen.getByRole("text", { name: "Hello" })).toBeOnTheScreen();
  });
  it("passes custom accessibilityRole through", async () => {
    await renderWithProviders(<Text accessibilityRole="header">Title</Text>);
    expect(screen.getByRole("header", { name: "Title" })).toBeOnTheScreen();
  });
  it("applies centered textAlign", async () => {
    await renderWithProviders(<Text centered>Center</Text>);
    expect(screen.getByText("Center")).toHaveStyle({ textAlign: "center" });
  });
  it("applies color override", async () => {
    await renderWithProviders(<Text color="#FF0000">Red</Text>);
    expect(screen.getByText("Red")).toHaveStyle({ color: "#FF0000" });
  });
  it("maps variant to theme font size", async () => {
    await renderWithProviders(<Text variant="base">Base</Text>);
    expect(screen.getByText("Base")).toHaveStyle({ fontSize: fontSize.base });
    await renderWithProviders(<Text variant="lg">Large</Text>);
    expect(screen.getByText("Large")).toHaveStyle({ fontSize: fontSize.lg });
  });
});
