/** @format */
/**
 * Unit tests for RankCard rendering rank label and points value.
 */
import { render, screen } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { RankCard } from "./RankCard";
describe("RankCard", () => {
  it("renders rank and points", async () => {
    const rank = {
      label: "knight",
      bg: "primary" as const,
      color: "gold" as const,
      border: "primary" as const,
    };
    await render(<RankCard rank={rank} points={100} />);
    expect(screen.getByText("100")).toBeOnTheScreen();
    expect(screen.getByTestId("stats-rank-points")).toBeOnTheScreen();
  });
});
