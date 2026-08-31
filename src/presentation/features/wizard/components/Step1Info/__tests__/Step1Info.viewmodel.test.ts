/** @format */
/**
 * Unit tests for wizard step 1 view model (form control exposure via context and age store bindings).
 */
import { createElement, type ComponentProps, type ReactNode } from "react";
import { renderHook, act } from "@testing-library/react-native";
import type { Control } from "react-hook-form";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useWizardStore } from "@stores/useWizardStore";
import { WizardFormsProvider } from "../../../WizardFormsContext";
import { useStep1InfoViewModel } from "../Step1Info.viewmodel";

function wrapperWith(control?: Control<{ age: string; pubertyAge: string }>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      WizardFormsProvider,
      { control } as ComponentProps<typeof WizardFormsProvider>,
      children
    );
  };
}

describe("useStep1InfoViewModel", () => {
  beforeEach(() => {
    useWizardStore.getState().resetAll();
  });
  it("exposes no form control when context provides none", async () => {
    const { result } = await renderHook(() => useStep1InfoViewModel(), {
      wrapper: wrapperWith(),
    });
    expect(result.current.control).toBeUndefined();
  });
  it("exposes the form control provided via context", async () => {
    const mockControl = {} as Control<{ age: string; pubertyAge: string }>;
    const { result } = await renderHook(() => useStep1InfoViewModel(), {
      wrapper: wrapperWith(mockControl),
    });
    expect(result.current.control).toBeDefined();
  });
  it("onAgeChange writes the age into the wizard store", async () => {
    const { result } = await renderHook(() => useStep1InfoViewModel());
    await act(async () => {
      result.current.onAgeChange("27");
    });
    expect(useWizardStore.getState().age).toBe("27");
  });
  it("onPubertyAgeChange writes the puberty age into the wizard store", async () => {
    const { result } = await renderHook(() => useStep1InfoViewModel());
    await act(async () => {
      result.current.onPubertyAgeChange("12");
    });
    expect(useWizardStore.getState().pubertyAge).toBe("12");
  });
  it("returns themed styles and translator for labels", async () => {
    const { result } = await renderHook(() => useStep1InfoViewModel());
    expect(result.current.t("wizard.ageLabel")).toBe("wizard.ageLabel");
    expect(result.current.styles.title).toBeDefined();
    expect(result.current.colors.text).toBeDefined();
  });
});
