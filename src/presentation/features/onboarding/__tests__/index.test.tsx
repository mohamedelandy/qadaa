/** @format */
/**
 * Unit tests for onboarding screen rendering the first slide title and next button.
 */
jest.mock("expo-linear-gradient", () => ({
  __esModule: true,
  LinearGradient: "LinearGradient",
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (
      k: string,
      opts?: {
        returnObjects?: boolean;
      }
    ) => {
      if (k === "onboarding.slides" && opts?.returnObjects) {
        return [
          { emoji: "a", title: "T1", body: "B1" },
          { emoji: "b", title: "T2", body: "B2" },
        ];
      }
      return k;
    },
    i18n: { language: "ar" },
  }),
}));
import { screen } from "@testing-library/react-native";
import OnboardingScreen from "../index";
import { renderWithProviders, resetAppStore } from "@/src/__tests__/testUtils";
describe("OnboardingScreen", () => {
  beforeEach(() => {
    resetAppStore();
  });
  it("renders the first slide title", async () => {
    await renderWithProviders(<OnboardingScreen />);
    expect(screen.getByText("T1")).toBeOnTheScreen();
  });
  it("renders the next button", async () => {
    await renderWithProviders(<OnboardingScreen />);
    expect(screen.getByText("onboarding.next")).toBeOnTheScreen();
  });
});
