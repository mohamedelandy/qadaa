/** @format */
/**
 * Unit tests for useWizardStyles hook ensuring themed styles object is returned.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useWizardStyles } from "../useWizardStyles";
describe("useWizardStyles", () => {
  it("returns styles", async () => {
    const { result } = await renderHook(() => useWizardStyles());
    expect(result.current).toBeDefined();
  });
});
