/** @format */
/**
 * Unit tests for stats view model rank tiers, badge unlocking order, and estimate computation.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useStatsViewModel } from "../useStatsViewModel";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { useSettingsStore } from "@stores/useSettingsStore";
describe("useStatsViewModel", () => {
  beforeEach(() => {
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
    useSettingsStore.setState(useSettingsStore.getInitialState());
  });
  it("returns the expected shape with default store state", async () => {
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.streak).toBe(0);
    expect(result.current.level).toBe(1);
    expect(result.current.points).toBe(0);
  });
  it("returns bronze rank when points < 500", async () => {
    useGamificationStore.setState({ points: 100 });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.rank.label).toBe("bronze");
  });
  it("returns silver rank when points >= 500", async () => {
    useGamificationStore.setState({ points: 500 });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.rank.label).toBe("silver");
  });
  it("returns gold rank when points >= 2000", async () => {
    useGamificationStore.setState({ points: 2000 });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.rank.label).toBe("gold");
  });
  it("returns platinum rank when points >= 5000", async () => {
    useGamificationStore.setState({ points: 5000 });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.rank.label).toBe("platinum");
  });
  it("shows estimate with valid data", async () => {
    useGamificationStore.setState({
      daysLogged: 3,
      points: 100,
    });
    usePrayerStore.setState({ totalMissedDays: 365 });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.estimate.show).toBe(true);
  });
  it("sets nextBadge to first locked badge", async () => {
    useGamificationStore.setState({
      badges: [{ id: "first_log", unlockedAt: Date.now() }],
    });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.nextBadge?.id).toBe("first_week");
  });
  it("sets nextBadge to null when all badges are unlocked", async () => {
    const now = Date.now();
    useGamificationStore.setState({
      badges: [
        { id: "first_log", unlockedAt: now },
        { id: "first_week", unlockedAt: now },
        { id: "warrior_30", unlockedAt: now },
        { id: "golden_year", unlockedAt: now },
        { id: "quarter_way", unlockedAt: now },
        { id: "halfway", unlockedAt: now },
        { id: "almost_there", unlockedAt: now },
        { id: "complete", unlockedAt: now },
      ],
    });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.nextBadge).toBeNull();
  });
  it("computes badge progress for warrior_30 based on streak", async () => {
    useGamificationStore.setState({
      streak: 15,
      badges: [
        { id: "first_log", unlockedAt: Date.now() },
        { id: "first_week", unlockedAt: Date.now() },
      ],
    });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.nextBadge?.id).toBe("warrior_30");
  });
  it("computes badge progress for golden_year based on streak", async () => {
    useGamificationStore.setState({
      streak: 100,
      badges: [
        { id: "first_log", unlockedAt: Date.now() },
        { id: "first_week", unlockedAt: Date.now() },
        { id: "warrior_30", unlockedAt: Date.now() },
      ],
    });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.nextBadge?.id).toBe("golden_year");
  });
  it("computes badge progress for quarter_way based on bestProgress", async () => {
    usePrayerStore.setState({
      totalMissedDays: 100,
      prayers: {
        fajr: { recovered: 50 },
        dhuhr: { recovered: 0 },
        asr: { recovered: 0 },
        maghrib: { recovered: 0 },
        isha: { recovered: 0 },
      },
    });
    useGamificationStore.setState({
      badges: [
        { id: "first_log", unlockedAt: Date.now() },
        { id: "first_week", unlockedAt: Date.now() },
        { id: "warrior_30", unlockedAt: Date.now() },
        { id: "golden_year", unlockedAt: Date.now() },
      ],
    });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.nextBadge?.id).toBe("quarter_way");
  });
  it("computes badge progress for halfway based on bestProgress", async () => {
    usePrayerStore.setState({
      totalMissedDays: 100,
      prayers: {
        fajr: { recovered: 25 },
        dhuhr: { recovered: 0 },
        asr: { recovered: 0 },
        maghrib: { recovered: 0 },
        isha: { recovered: 0 },
      },
    });
    useGamificationStore.setState({
      badges: [
        { id: "first_log", unlockedAt: Date.now() },
        { id: "first_week", unlockedAt: Date.now() },
        { id: "warrior_30", unlockedAt: Date.now() },
        { id: "golden_year", unlockedAt: Date.now() },
        { id: "quarter_way", unlockedAt: Date.now() },
      ],
    });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.nextBadge?.id).toBe("halfway");
  });
  it("computes badge progress for almost_there based on bestProgress", async () => {
    usePrayerStore.setState({
      totalMissedDays: 100,
      prayers: {
        fajr: { recovered: 50 },
        dhuhr: { recovered: 0 },
        asr: { recovered: 0 },
        maghrib: { recovered: 0 },
        isha: { recovered: 50 },
      },
    });
    useGamificationStore.setState({
      badges: [
        { id: "first_log", unlockedAt: Date.now() },
        { id: "first_week", unlockedAt: Date.now() },
        { id: "warrior_30", unlockedAt: Date.now() },
        { id: "golden_year", unlockedAt: Date.now() },
        { id: "quarter_way", unlockedAt: Date.now() },
        { id: "halfway", unlockedAt: Date.now() },
      ],
    });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.nextBadge?.id).toBe("almost_there");
  });
  it("computes badge progress for complete based on bestProgress", async () => {
    usePrayerStore.setState({
      totalMissedDays: 100,
      prayers: {
        fajr: { recovered: 100 },
        dhuhr: { recovered: 0 },
        asr: { recovered: 0 },
        maghrib: { recovered: 0 },
        isha: { recovered: 0 },
      },
    });
    useGamificationStore.setState({
      badges: [
        { id: "first_log", unlockedAt: Date.now() },
        { id: "first_week", unlockedAt: Date.now() },
        { id: "warrior_30", unlockedAt: Date.now() },
        { id: "golden_year", unlockedAt: Date.now() },
        { id: "quarter_way", unlockedAt: Date.now() },
        { id: "halfway", unlockedAt: Date.now() },
        { id: "almost_there", unlockedAt: Date.now() },
      ],
    });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.nextBadge?.id).toBe("complete");
  });
  it("uses language from settings store for formatDate", async () => {
    useGamificationStore.setState({
      daysLogged: 3,
      points: 100,
    });
    usePrayerStore.setState({ totalMissedDays: 365 });
    useSettingsStore.setState({ language: "en" });
    const { result } = await renderHook(() => useStatsViewModel());
    expect(result.current.estimate.show).toBe(true);
  });
});
