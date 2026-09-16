/** @format */

import { renderHook } from "@testing-library/react-native";
import { useStatsStyles } from "../useStatsStyles";
import { spacing } from "@theme/spacing";

// Mock the dependencies
jest.mock("@hooks/useUI", () => ({
  useUI: jest.fn(),
}));

jest.mock("@hooks/useTabBarClearance", () => ({
  useTabBarClearance: jest.fn(),
}));

import { useUI } from "@hooks/useUI";
import { useTabBarClearance } from "@hooks/useTabBarClearance";

describe("useStatsStyles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the correct styles based on mock dependencies", async () => {
    const mockUI = {
      colors: { background: "red" },
      typography: { title1: { fontSize: 24 } },
      borderRadius: { md: 8 },
    };
    (useUI as jest.Mock).mockReturnValue(mockUI);

    const mockClearance = 100;
    (useTabBarClearance as jest.Mock).mockReturnValue(mockClearance);

    const { result } = await renderHook(() => useStatsStyles());

    // Verify useTabBarClearance was called with spacing[6]
    expect(useTabBarClearance).toHaveBeenCalledWith(spacing[6]);

    // Verify styles object shape
    expect(result.current).toEqual({
      scrollView: { flex: 1 },
      scrollContent: { paddingBottom: mockClearance },
      header: { paddingBottom: spacing[4] },
      title: {
        letterSpacing: -0.5,
        paddingTop: spacing[2],
        paddingBottom: spacing[5],
      },
      row: {
        flexDirection: "row",
        gap: spacing[3],
        marginTop: spacing[3],
      },
      half: { flex: 1 },
      rankWrapper: { marginTop: spacing[3] },
      estimateWrapper: { marginTop: spacing[3] },
      nextBadgeWrapper: { marginTop: spacing[3] },
      badgesHeader: {
        letterSpacing: 0.5,
        textTransform: "uppercase",
        marginTop: spacing[3],
      },
      badgeGrid: {
        marginTop: spacing[2],
      },
    });
  });

  it("should update styles when dependencies change", async () => {
    const mockUI = {
      colors: { background: "red" },
      typography: { title1: { fontSize: 24 } },
      borderRadius: { md: 8 },
    };

    (useUI as jest.Mock).mockReturnValue(mockUI);
    (useTabBarClearance as jest.Mock).mockReturnValue(100);

    const { result, unmount } = await renderHook(() => useStatsStyles());
    expect(result.current.scrollContent.paddingBottom).toBe(100);

    unmount();

    // Simulate re-rendering the hook with new dependencies by rendering again
    (useTabBarClearance as jest.Mock).mockReturnValue(200);
    const { result: newResult } = await renderHook(() => useStatsStyles());

    expect(newResult.current.scrollContent.paddingBottom).toBe(200);
  });
});
