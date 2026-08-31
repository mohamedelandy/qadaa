/** @format */
/**
 * Unit tests for HadithCard hadith text rendering.
 */
import { screen } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { HadithCard } from "../HadithCard";
import { renderWithProviders } from "@/src/__tests__/testUtils";
describe("HadithCard", () => {
  it("renders the hadith text", async () => {
    await renderWithProviders(<HadithCard text="Patience is a virtue" />);
    expect(screen.getByText("Patience is a virtue")).toBeOnTheScreen();
  });
});
