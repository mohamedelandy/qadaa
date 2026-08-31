/** @format */
/**
 * Unit tests for dashboard overlay gating (daily intention prompt and once-per-day dua after full completion).
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useDashboardOverlays } from "../useDashboardOverlays";
import { useAppStore } from "@stores/useAppStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { usePrayerStore } from "@stores/usePrayerStore";
import { toLocalISODate } from "@domain/date";
const today = toLocalISODate(new Date());
describe("useDashboardOverlays", () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
    usePrayerStore.setState(usePrayerStore.getInitialState());
  });
  it("shows intention when wizard complete, no intention set today, and nothing logged", async () => {
    useAppStore.setState({ wizardComplete: true });
    const { result } = await renderHook(() => useDashboardOverlays());
    expect(result.current.showIntention).toBe(true);
    expect(result.current.showDua).toBe(false);
  });
  it("hides intention when intention was already set today", async () => {
    useAppStore.setState({ wizardComplete: true });
    useGamificationStore.setState({ intentionSetDate: today });
    const { result } = await renderHook(() => useDashboardOverlays());
    expect(result.current.showIntention).toBe(false);
  });
  it("hides intention when wizard is not complete", async () => {
    useAppStore.setState({ wizardComplete: false });
    const { result } = await renderHook(() => useDashboardOverlays());
    expect(result.current.showIntention).toBe(false);
  });
  it("shows dua when 5+ prayers logged and dua not shown today", async () => {
    usePrayerStore.setState({
      todayPrayers: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
    });
    const { result } = await renderHook(() => useDashboardOverlays());
    expect(result.current.showDua).toBe(true);
  });
  it("hides dua when fewer than 5 prayers logged", async () => {
    usePrayerStore.setState({ todayPrayers: { fajr: true } });
    const { result } = await renderHook(() => useDashboardOverlays());
    expect(result.current.showDua).toBe(false);
  });
  it("hides dua when dua was already shown today", async () => {
    usePrayerStore.setState({
      todayPrayers: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
    });
    useGamificationStore.setState({ lastDuaShownDate: today });
    const { result } = await renderHook(() => useDashboardOverlays());
    expect(result.current.showDua).toBe(false);
  });
});
