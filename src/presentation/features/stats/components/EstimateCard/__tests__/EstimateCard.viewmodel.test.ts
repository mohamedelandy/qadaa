/** @format */
/**
 * Unit tests for the recovery estimate card view model (estimate passthrough and card styling).
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useEstimateCardViewModel } from "../EstimateCard.viewmodel";
import { useUI } from "@hooks/useUI";
import type { EstimateInfo } from "../../../hooks/useStatsViewModel";

const ESTIMATE: EstimateInfo = {
  show: true,
  years: "1",
  date: "2027-08-23",
  pace: "5",
  avgPerDay: 3.2,
  remaining: 300,
  totalPrayers: 1825,
  recoveredPrayers: 25,
};
async function renderColors() {
  const ui = await renderHook(() => useUI());
  return ui.result.current.colors;
}
describe("useEstimateCardViewModel", () => {
  it("passes the estimate payload through unchanged", async () => {
    const { result } = await renderHook(() => useEstimateCardViewModel(ESTIMATE));
    expect(result.current.estimate).toBe(ESTIMATE);
    expect(result.current.estimate.remaining).toBe(300);
  });
  it("themes the card from the active palette", async () => {
    const { result } = await renderHook(() => useEstimateCardViewModel(ESTIMATE));
    const colors = await renderColors();
    expect(result.current.styles.card.backgroundColor).toBe(colors.card);
    expect(result.current.styles.card.borderColor).toBe(colors.border);
  });
  it("renders an uppercase spaced header above stacked lines", async () => {
    const { result } = await renderHook(() => useEstimateCardViewModel(ESTIMATE));
    expect(result.current.styles.header.textTransform).toBe("uppercase");
    expect(result.current.styles.header.letterSpacing).toBe(0.5);
    expect(result.current.styles.noData.marginTop).toBeDefined();
  });
});
