/** @format */
/**
 * Unit tests for useSettingsReset clearing every store back to initial state.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import i18n from "i18next";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useAppStore } from "@stores/useAppStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useWizardStore } from "@stores/useWizardStore";
import { useModalVisibilityStore } from "@stores/useModalVisibilityStore";
import { PRAYER_KEYS } from "@domain/types";
import { useSettingsReset } from "../useSettingsReset";
describe("useSettingsReset", () => {
  beforeEach(() => {
    useSettingsStore.setState(useSettingsStore.getInitialState());
    useAppStore.setState(useAppStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useWizardStore.setState(useWizardStore.getInitialState());
    useModalVisibilityStore.setState(useModalVisibilityStore.getInitialState());
  });
  it("resetAll clears every store back to initial state", async () => {
    useSettingsStore.getState().setDailyTarget(9);
    useSettingsStore.getState().setLanguage("en");
    useGamificationStore.getState().incrementPoints(50);
    usePrayerStore.getState().completeWizard(30, 14, [{ type: "missed", years: 1 }]);
    usePrayerStore.getState().logPrayer("fajr");
    useWizardStore.getState().setAge("44");
    useWizardStore.getState().nextStep();
    useModalVisibilityStore.getState().setOverlayOpen(true);
    const { result } = await renderHook(() => useSettingsReset());
    (i18n.changeLanguage as jest.Mock).mockClear();
    result.current.resetAll();
    const s = useSettingsStore.getState();
    expect(s.dailyTarget).toBe(5);
    expect(useGamificationStore.getState().points).toBe(0);
    expect(usePrayerStore.getState().age).toBe(0);
    expect(usePrayerStore.getState().totalMissedDays).toBe(0);
    expect(usePrayerStore.getState().prayers).toEqual(
      Object.fromEntries(PRAYER_KEYS.map((k) => [k, { recovered: 0 }]))
    );
    expect(usePrayerStore.getState().todayPrayers).toEqual({});
    expect(usePrayerStore.getState().todayLogPoints).toEqual({});
    expect(usePrayerStore.getState().todayUnits).toEqual({});
    expect(usePrayerStore.getState().todayDate).toBeNull();
    expect(useWizardStore.getState().age).toBe("");
    expect(useWizardStore.getState().currentStep).toBe(0);
    expect(useModalVisibilityStore.getState().activeOpen).toBe(false);
    expect(s.language).toBe("en");
    expect(i18n.changeLanguage).not.toHaveBeenCalled();
  });
});
