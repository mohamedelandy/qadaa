/** @format */
/**
 * Unit tests for useSettingsLanguage store updates with haptic feedback.
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
import { useSettingsStore } from "@stores/useSettingsStore";
import { useSettingsLanguage } from "../useSettingsLanguage";
describe("useSettingsLanguage", () => {
  beforeEach(() => {
    useSettingsStore.setState(useSettingsStore.getInitialState());
  });
  it("reflects language from the store", async () => {
    const { result } = await renderHook(() => useSettingsLanguage());
    expect(result.current.language).toBe("ar");
  });
  it("setLanguage updates store and fires haptics", async () => {
    const { result } = await renderHook(() => useSettingsLanguage());
    await act(async () => {
      result.current.setLanguage("en");
    });
    expect(useSettingsStore.getState().language).toBe("en");
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });
});
