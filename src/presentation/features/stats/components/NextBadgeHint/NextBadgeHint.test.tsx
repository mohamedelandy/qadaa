/** @format */
/**
 * Unit tests for NextBadgeHint: renders nothing without a next badge, and
 * renders the hint card (header, icon, name, progress) when one is pending.
 */
import { render, screen } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { NextBadgeHint } from "./NextBadgeHint";

describe("NextBadgeHint", () => {
  it("renders nothing when no next badge", async () => {
    await render(<NextBadgeHint nextBadge={null} />);
    expect(screen.queryByText("stats.nextBadge")).not.toBeOnTheScreen();
  });

  it("renders the hint card with icon, name and progress when a badge is pending", async () => {
    await render(
      <NextBadgeHint
        nextBadge={{ id: "first_week", icon: "🏆", progress: 50 }}
        testID="stats-next-badge-hint"
      />
    );
    expect(screen.getByTestId("stats-next-badge-hint")).toBeOnTheScreen();
    expect(screen.getByText("stats.nextBadge")).toBeOnTheScreen();
    expect(screen.getByText("stats.badges_data.first_week")).toBeOnTheScreen();
    expect(screen.getByText("stats.nextBadgeProgress")).toBeOnTheScreen();
    expect(screen.getByText("🏆")).toBeOnTheScreen();
  });
});
