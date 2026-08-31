/** @format */
/**
 * Unit tests for Step2Periods view models exposing t/colors/styles.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("@features/wizard/hooks/useWizardStyles", () => ({
  useWizardStyles: jest.fn(() => ({
    t: (k: string) => k,
    colors: {},
    styles: {},
    br: {},
  })),
}));
import { renderHook } from "@testing-library/react-native";
import { useWizardStyles } from "@features/wizard/hooks/useWizardStyles";
import { usePeriodRowViewModel, useStep2PeriodsViewModel } from "../Step2Periods.viewmodel";
describe("usePeriodRowViewModel", () => {
  it("returns t, colors, and styles", async () => {
    const { result } = await renderHook(() => usePeriodRowViewModel());
    expect(result.current.t).toBeDefined();
    expect(result.current.colors).toBeDefined();
    expect(result.current.styles).toBeDefined();
  });
});
describe("useStep2PeriodsViewModel", () => {
  it("returns the result of useWizardStyles", async () => {
    const { result } = await renderHook(() => useStep2PeriodsViewModel());
    expect(useWizardStyles).toHaveBeenCalled();
    expect(result.current.t).toBeDefined();
    expect(result.current.colors).toBeDefined();
    expect(result.current.styles).toBeDefined();
    expect(result.current.br).toBeDefined();
  });
});
