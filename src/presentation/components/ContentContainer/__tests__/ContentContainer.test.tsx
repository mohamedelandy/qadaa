/** @format */
/**
 * Unit tests for ContentContainer.
 */
import { screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { ContentContainer } from "../ContentContainer";
import { renderWithProviders } from "@/src/__tests__/testUtils";

describe("ContentContainer", () => {
  it("renders children", async () => {
    await renderWithProviders(
      <ContentContainer>
        <Text>Child</Text>
      </ContentContainer>
    );
    expect(screen.getByText("Child")).toBeOnTheScreen();
  });
  it("applies horizontal padding", async () => {
    await renderWithProviders(
      <ContentContainer>
        <Text>Padded</Text>
      </ContentContainer>
    );
    expect(screen.getByText("Padded").parent).toHaveStyle({ paddingHorizontal: 16 });
  });
});
