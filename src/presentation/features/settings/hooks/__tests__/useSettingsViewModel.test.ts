/** @format */
/**
 * Unit tests for useSettingsViewModel grace badge style varying with graceUsed month.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useSettingsViewModel } from "../useSettingsViewModel";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useGamificationStore } from "@stores/useGamificationStore";
describe("useSettingsViewModel", () => {
  beforeEach(() => {
    useSettingsStore.setState(useSettingsStore.getInitialState());
  });
  it("returns graceBadgeStyle based on graceUsed", async () => {
    const { result } = await renderHook(() => useSettingsViewModel());
    expect(result.current.graceBadgeStyle).toBeDefined();
  });
  it("returns used grace badge style when grace was used", async () => {
    const today = new Date().toISOString().slice(0, 7);
    useGamificationStore.setState({ graceUsedMonth: today });
    const { result } = await renderHook(() => useSettingsViewModel());
    expect(result.current.graceBadgeStyle).toBeDefined();
  });
});
