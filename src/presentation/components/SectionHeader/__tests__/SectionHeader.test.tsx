/** @format */
/**
 * Unit tests for SectionHeader.
 */
import { screen } from "@testing-library/react-native";
import { SectionHeader } from "../SectionHeader";
import { renderWithProviders } from "@/src/__tests__/testUtils";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));

describe("SectionHeader", () => {
  it("renders its label text", async () => {
    await renderWithProviders(<SectionHeader label="Prayers" />);
    expect(screen.getByText("Prayers")).toBeOnTheScreen();
  });
  it("exposes heading accessibility role", async () => {
    await renderWithProviders(<SectionHeader label="Prayers" />);
    expect(screen.getByRole("header", { name: "Prayers" })).toBeOnTheScreen();
  });
});
