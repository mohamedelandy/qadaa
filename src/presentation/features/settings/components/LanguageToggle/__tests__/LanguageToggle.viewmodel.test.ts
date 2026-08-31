/** @format */
/**
 * Unit tests for the language toggle view model.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useLanguageToggleViewModel } from "../LanguageToggle.viewmodel";
describe("useLanguageToggleViewModel", () => {
  it("returns styles and handlers", async () => {
    const onLanguageChange = jest.fn();
    const { result } = await renderHook(() =>
      useLanguageToggleViewModel({ language: "ar", onLanguageChange })
    );
    expect(result.current.styles).toBeDefined();
    expect(result.current.language).toBe("ar");
  });
});
