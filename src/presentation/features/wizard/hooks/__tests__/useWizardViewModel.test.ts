/** @format */
import { renderHook, act } from "@testing-library/react-native";
import { useWizardViewModel } from "../useWizardViewModel";
import { useWizardStore } from "@stores/useWizardStore";

jest.mock("@hooks/useUI", () => ({
  useUI: () => ({ t: (k: string) => k }),
}));

describe("useWizardViewModel", () => {
  beforeEach(() => {
    useWizardStore.getState().resetAll();
  });

  it("initializes with default wizard state and hook form controls", async () => {
    const { result } = await renderHook(() => useWizardViewModel());

    expect(result.current.currentStep).toBe(0);
    expect(result.current.age).toBe("");
    expect(result.current.pubertyAge).toBe("");
    expect(result.current.step1Valid).toBe(false);

    // Check form controls are exposed
    expect(result.current.control).toBeDefined();
    expect(result.current.errors).toBeDefined();
    expect(result.current.step2Control).toBeDefined();
    expect(result.current.step2Errors).toBeDefined();
  });

  it("updates state appropriately via store actions", async () => {
    const { result } = await renderHook(() => useWizardViewModel());

    await act(async () => {
      result.current.setAge("25");
      result.current.setPubertyAge("15");
    });

    expect(result.current.age).toBe("25");
    expect(result.current.pubertyAge).toBe("15");
    expect(result.current.step1Valid).toBe(true);
  });

  it("sanitizes custom target input to allow only digits", async () => {
    const { result } = await renderHook(() => useWizardViewModel());

    await act(async () => {
      result.current.setCustomTarget("123abc456");
    });

    expect(result.current.customTarget).toBe("123456");
  });
});
