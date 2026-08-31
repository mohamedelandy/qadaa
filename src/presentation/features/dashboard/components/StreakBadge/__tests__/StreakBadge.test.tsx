/** @format */
/**
 * Unit tests for StreakBadge streak number, absent level pill, and grace emoji states.
 */
import { screen } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { StreakBadge } from "../StreakBadge";
import { renderWithProviders } from "@/src/__tests__/testUtils";
describe("StreakBadge", () => {
  it("renders the streak number", async () => {
    await renderWithProviders(<StreakBadge streak={7} isAtRisk={false} graceUsed={false} />);
    expect(screen.getByText("7")).toBeOnTheScreen();
  });
  it("does not render the level pill", async () => {
    await renderWithProviders(<StreakBadge streak={7} isAtRisk={false} graceUsed={false} />);
    expect(screen.queryByText("⭐")).not.toBeOnTheScreen();
  });
  it("shows the grace emoji when grace was used", async () => {
    await renderWithProviders(<StreakBadge streak={3} isAtRisk graceUsed />);
    expect(screen.getByText("🤲")).toBeOnTheScreen();
  });
  it("reveals the at-risk state through its pill testID", async () => {
    await renderWithProviders(<StreakBadge streak={3} isAtRisk graceUsed={false} />);
    expect(screen.getByTestId("dashboard-streak-pill-at-risk")).toBeOnTheScreen();
    expect(screen.queryByTestId("dashboard-streak-pill")).not.toBeOnTheScreen();
  });
  it("uses the safe pill testID when not at risk", async () => {
    await renderWithProviders(<StreakBadge streak={3} isAtRisk={false} graceUsed={false} />);
    expect(screen.getByTestId("dashboard-streak-pill")).toBeOnTheScreen();
    expect(screen.queryByTestId("dashboard-streak-pill-at-risk")).not.toBeOnTheScreen();
  });
});
