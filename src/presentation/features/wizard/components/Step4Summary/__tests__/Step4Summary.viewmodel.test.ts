/** @format */
/**
 * Unit tests for the step 4 summary view model (summary rows, target display, back navigation).
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useWizardStore } from "@stores/useWizardStore";
import { useAppStore } from "@stores/useAppStore";
import { useStep4SummaryViewModel } from "../Step4Summary.viewmodel";
describe("useStep4SummaryViewModel", () => {
  beforeEach(() => {
    useWizardStore.getState().resetAll();
  });
  it("builds five rows from store state with locale-formatted prayer totals", async () => {
    const { result } = await renderHook(() => useStep4SummaryViewModel());
    await act(async () => {
      useWizardStore.getState().setAge("25");
      useWizardStore.getState().setPubertyAge("12");
      useWizardStore.getState().setQuickYears("1");
    });
    const rows = result.current.rows;
    expect(rows).toHaveLength(5);
    expect(rows[0]).toMatchObject({ label: "wizard.ageLabel", value: "25" });
    expect(rows[2]?.label).toBe("wizard.totalMissed");
    expect(rows[2]?.value).toBe("365");
    expect(rows[3]?.value).toBe("1,825");
  });
  it("shows the selected preset as the daily target row value", async () => {
    const { result } = await renderHook(() => useStep4SummaryViewModel());
    await act(async () => {
      useWizardStore.getState().setPreset(10);
    });
    expect(result.current.rows[4]?.value).toBe("10");
  });
  it("falls back to the typed custom target when target is custom", async () => {
    const { result } = await renderHook(() => useStep4SummaryViewModel());
    await act(async () => {
      useWizardStore.getState().setCustom();
      useWizardStore.getState().setCustomTarget("12");
    });
    expect(result.current.rows[4]?.value).toBe("12");
  });
  it("onBack navigates the wizard back one step", async () => {
    const { result } = await renderHook(() => useStep4SummaryViewModel());
    await act(async () => {
      useWizardStore.getState().nextStep();
      useWizardStore.getState().nextStep();
    });
    expect(useWizardStore.getState().currentStep).toBe(2);
    await act(async () => {
      result.current.onBack();
    });
    expect(useWizardStore.getState().currentStep).toBe(1);
  });
  it("onConfirm writes store state then navigates to the dashboard", async () => {
    const expoRouter = jest.requireMock("expo-router");
    const replace = jest.fn();
    const useRouterSpy = jest.spyOn(expoRouter, "useRouter").mockReturnValue({
      replace,
      push: jest.fn(),
      back: jest.fn(),
    });
    try {
      const { result } = await renderHook(() => useStep4SummaryViewModel());
      await act(async () => {
        useWizardStore.getState().setAge("25");
        useWizardStore.getState().setPubertyAge("12");
        useWizardStore.getState().setQuickYears("1");
      });
      await act(async () => {
        result.current.onConfirm();
      });
      expect(replace).toHaveBeenCalledWith("/(tabs)/dashboard");
      expect(useAppStore.getState().wizardComplete).toBe(true);
    } finally {
      useRouterSpy.mockRestore();
    }
  });
});
