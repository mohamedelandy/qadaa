/** @format */
/**
 * Unit tests for grace-day usage flag and localized status in useSettingsGraceDay.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useGamificationStore } from "@stores/useGamificationStore";
import { useSettingsGraceDay } from "../useSettingsGraceDay";
describe("useSettingsGraceDay", () => {
  beforeEach(() => {
    useGamificationStore.setState(useGamificationStore.getInitialState());
  });
  it("graceUsed is false when no month is recorded", async () => {
    const { result } = await renderHook(() => useSettingsGraceDay());
    expect(result.current.graceUsed).toBe(false);
  });
  it("graceUsed is true when the current month matches", async () => {
    const today = new Date().toISOString().slice(0, 10);
    useGamificationStore.setState({ graceUsedMonth: today.slice(0, 7) });
    const { result } = await renderHook(() => useSettingsGraceDay());
    expect(result.current.graceUsed).toBe(true);
  });
});
