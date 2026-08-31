/** @format */
/**
 * Unit tests for PageLayout.
 */
import { screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { PageLayout } from "../PageLayout";
import { renderWithProviders } from "@/src/__tests__/testUtils";

describe("PageLayout", () => {
  it("renders children", async () => {
    await renderWithProviders(
      <PageLayout>
        <Text>Content</Text>
      </PageLayout>
    );
    expect(screen.getByText("Content")).toBeOnTheScreen();
  });
  it("forwards testID", async () => {
    await renderWithProviders(
      <PageLayout testID="page-root">
        <Text>Content</Text>
      </PageLayout>
    );
    expect(screen.getByTestId("page-root")).toBeOnTheScreen();
  });
});
