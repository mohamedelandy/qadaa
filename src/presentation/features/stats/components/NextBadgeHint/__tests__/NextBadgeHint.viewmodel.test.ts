/** @format */
/**
 * Unit tests for the next badge hint view model (badge passthrough and progress track styling).
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useNextBadgeHintViewModel } from "../NextBadgeHint.viewmodel";
import type { NextBadgeInfo } from "../../../hooks/useStatsViewModel";

const NEXT_BADGE: NextBadgeInfo = {
  id: "warrior_30",
  icon: "\u2694\uFE0F",
  progress: 0.42,
};
describe("useNextBadgeHintViewModel", () => {
  it("passes a next badge through unchanged", async () => {
    const { result } = await renderHook(() => useNextBadgeHintViewModel(NEXT_BADGE));
    expect(result.current.nextBadge).toBe(NEXT_BADGE);
    expect(result.current.nextBadge?.progress).toBe(0.42);
  });
  it("passes null through so the view can skip rendering the hint", async () => {
    const { result } = await renderHook(() => useNextBadgeHintViewModel(null));
    expect(result.current.nextBadge).toBeNull();
  });
  it("themes an 8pt-clipped progress track and fill", async () => {
    const { result } = await renderHook(() => useNextBadgeHintViewModel(NEXT_BADGE));
    expect(result.current.styles.progressTrack.height).toBe(8);
    expect(result.current.styles.progressTrack.overflow).toBe("hidden");
    expect(result.current.styles.progressFill.height).toBe(8);
    expect(result.current.styles.progressFill.borderRadius).toBe(
      result.current.styles.progressTrack.borderRadius
    );
  });
});
