/** @format */
/**
 * Smoke test that useSettingsStyles hook returns defined styles.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useSettingsStyles } from "../useSettingsStyles";
describe("useSettingsStyles", () => {
  it("returns styles", async () => {
    const { result } = await renderHook(() => useSettingsStyles());
    expect(result.current).toBeDefined();
  });
});
