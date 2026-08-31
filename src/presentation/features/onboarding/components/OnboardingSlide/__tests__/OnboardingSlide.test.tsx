/** @format */
/**
 * Render tests for OnboardingSlide: verifies emoji, title, and body text appear.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: "ar" },
  }),
}));
jest.mock("expo-linear-gradient", () => ({
  __esModule: true,
  LinearGradient: "LinearGradient",
}));

import { screen } from "@testing-library/react-native";
import { OnboardingSlide } from "../OnboardingSlide";
import { renderWithProviders } from "@/src/__tests__/testUtils";

const slide = { emoji: "📖", title: "Welcome", body: "Track your prayers" };

describe("OnboardingSlide", () => {
  it("renders the emoji text", async () => {
    await renderWithProviders(<OnboardingSlide {...slide} />);
    expect(screen.getByText("📖")).toBeOnTheScreen();
  });

  it("renders the title text", async () => {
    await renderWithProviders(<OnboardingSlide {...slide} />);
    expect(screen.getByText("Welcome")).toBeOnTheScreen();
  });

  it("renders the body text", async () => {
    await renderWithProviders(<OnboardingSlide {...slide} />);
    expect(screen.getByText("Track your prayers")).toBeOnTheScreen();
  });
});
