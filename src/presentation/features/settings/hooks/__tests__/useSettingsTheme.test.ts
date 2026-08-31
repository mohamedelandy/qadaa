/** @format */
/**
 * Unit tests for theme toggle flipping isDark and firing selection haptics.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("expo-haptics", () => ({
  __esModule: true,
  selectionAsync: jest.fn(),
}));
import * as Haptics from "expo-haptics";
import { useSettingsTheme } from "../useSettingsTheme";
describe("useSettingsTheme", () => {
  it("handleToggleTheme fires haptics and toggles", async () => {
    const { result } = await renderHook(() => useSettingsTheme());
    const before = result.current.isDark;
    await act(async () => {
      result.current.toggleTheme();
    });
    expect(Haptics.selectionAsync).toHaveBeenCalled();
    expect(result.current.isDark).toBe(!before);
  });
});
