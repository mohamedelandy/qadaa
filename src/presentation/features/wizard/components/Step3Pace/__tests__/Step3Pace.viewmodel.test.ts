/** @format */
/**
 * Unit tests for step 3 pace view model (preset/custom target selection and validation errors).
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useWizardStore } from "@stores/useWizardStore";
import { useStep3PaceViewModel } from "../Step3Pace.viewmodel";
describe("useStep3PaceViewModel", () => {
  beforeEach(() => {
    useWizardStore.getState().resetAll();
  });
  it("starts on the preset of 5 with no error and offers 1/5/10 presets", async () => {
    const { result } = await renderHook(() => useStep3PaceViewModel());
    expect(result.current.dailyTarget).toBe(5);
    expect(result.current.isCustom).toBe(false);
    expect(result.current.customError).toBe("");
    expect(result.current.presets).toEqual([1, 5, 10]);
  });
  it("onPreset selects a target and clears any typed custom entry", async () => {
    const { result } = await renderHook(() => useStep3PaceViewModel());
    await act(async () => {
      result.current.onCustom();
      result.current.onCustomTargetChange("7");
    });
    await act(async () => {
      result.current.onPreset(10);
    });
    expect(useWizardStore.getState().dailyTarget).toBe(10);
    expect(useWizardStore.getState().customTarget).toBe("");
  });
  it("switching to custom requires a value before one is typed", async () => {
    const { result } = await renderHook(() => useStep3PaceViewModel());
    await act(async () => {
      result.current.onCustom();
    });
    expect(result.current.isCustom).toBe(true);
    expect(result.current.customError).toBe("validation.custom.required");
  });
  it("rejects custom targets above the allowed maximum", async () => {
    const { result } = await renderHook(() => useStep3PaceViewModel());
    await act(async () => {
      result.current.onCustom();
      result.current.onCustomTargetChange("60");
    });
    expect(useWizardStore.getState().customTarget).toBe("60");
    expect(result.current.customError).toBe("validation.custom.range");
  });
  it("clears the error once an in-range custom target is entered", async () => {
    const { result } = await renderHook(() => useStep3PaceViewModel());
    await act(async () => {
      result.current.onCustom();
      result.current.onCustomTargetChange("7");
    });
    expect(result.current.customTarget).toBe("7");
    expect(result.current.customError).toBe("");
  });
});
