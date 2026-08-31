/** @format */
/**
 * Unit tests for weekly calendar grid data and hadith-of-day fallback to empty string.
 */
import { renderHook } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (
      k: string,
      opts?: {
        returnObjects?: boolean;
      }
    ) => {
      if (k === "hadiths" && opts?.returnObjects) {
        return [];
      }
      return k;
    },
    i18n: { language: "ar" },
  }),
}));
import { useDashboardCalendar } from "../useDashboardCalendar";
describe("useDashboardCalendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("returns empty string for hadith when array is empty", async () => {
    const { result } = await renderHook(() => useDashboardCalendar());
    expect(result.current.hadithData.text).toBe("");
  });
});
