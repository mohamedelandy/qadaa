/** @format */
/**
 * Unit tests for the streak badge view model (prop passthrough and pill styling variants).
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useStreakBadgeViewModel } from "../StreakBadge.viewmodel";
import { useUI } from "@hooks/useUI";

async function renderColors() {
  const ui = await renderHook(() => useUI());
  return ui.result.current.colors;
}
describe("useStreakBadgeViewModel", () => {
  it("passes streak, at-risk and grace flags through unchanged", async () => {
    const { result } = await renderHook(() =>
      useStreakBadgeViewModel({ streak: 7, isAtRisk: true, graceUsed: false })
    );
    expect(result.current.streak).toBe(7);
    expect(result.current.isAtRisk).toBe(true);
    expect(result.current.graceUsed).toBe(false);
  });
  it("colors the streak number with the gold token", async () => {
    const { result } = await renderHook(() =>
      useStreakBadgeViewModel({ streak: 0, isAtRisk: false, graceUsed: false })
    );
    const colors = await renderColors();
    expect(result.current.styles.streakNumber.color).toBe(colors.gold);
  });
  it("provides an amber-bordered pill variant for the at-risk state", async () => {
    const { result } = await renderHook(() =>
      useStreakBadgeViewModel({ streak: 3, isAtRisk: true, graceUsed: false })
    );
    const colors = await renderColors();
    expect(result.current.styles.streakPill.borderColor).toBe(colors.borderStrong);
    expect(result.current.styles.streakPillAtRisk.borderColor).toBe(colors.amberBorder);
  });
  it("dims the pulsing flame and grace emoji", async () => {
    const { result } = await renderHook(() =>
      useStreakBadgeViewModel({ streak: 3, isAtRisk: true, graceUsed: true })
    );
    expect(result.current.styles.fireEmojiPulse.opacity).toBe(0.6);
    expect(result.current.styles.graceEmoji.opacity).toBe(0.7);
  });
});
