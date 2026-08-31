/** @format */
/**
 * Unit tests for EstimateCard no-data and estimate-details render states.
 */
import { render, screen } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { EstimateCard } from "./EstimateCard";
describe("EstimateCard", () => {
  it("renders the no-data state", async () => {
    const estimate = {
      show: false,
      years: "",
      date: "",
      pace: "",
      avgPerDay: 0,
      remaining: 0,
      totalPrayers: 0,
      recoveredPrayers: 0,
    };
    await render(<EstimateCard estimate={estimate} />);
    expect(screen.getByText("stats.estimateNoData")).toBeOnTheScreen();
    expect(screen.queryByTestId("stats-estimate-years")).not.toBeOnTheScreen();
  });
  it("renders the estimate details when show is true", async () => {
    const estimate = {
      show: true,
      years: "1.5",
      date: "2027-01-01",
      pace: "5",
      avgPerDay: 5,
      remaining: 2700,
      totalPrayers: 3000,
      recoveredPrayers: 300,
    };
    await render(<EstimateCard estimate={estimate} />);
    expect(screen.queryByText("stats.estimateNoData")).not.toBeOnTheScreen();
    expect(screen.getByText("stats.estimateYears")).toBeOnTheScreen();
    expect(screen.getByText("stats.estimateDate")).toBeOnTheScreen();
    expect(screen.getByText("stats.estimatePace")).toBeOnTheScreen();
    expect(screen.getByTestId("stats-estimate-years")).toBeOnTheScreen();
    expect(screen.getByTestId("stats-estimate-date")).toBeOnTheScreen();
    expect(screen.getByTestId("stats-estimate-pace")).toBeOnTheScreen();
  });
});
