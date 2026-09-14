/** @format */

import { renderHook } from "@testing-library/react-native";
import { useDashboardStyles } from "../useDashboardStyles";
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

describe("useDashboardStyles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the correct styles and gradients based on mock dependencies", async () => {
    const mockUI = {
      colors: { background: "red" },
      typography: { title1: { fontSize: 24 } },
      borderRadius: { md: 8 },
      gradients: { main: ["#000", "#FFF"] },
    };
    (useUI as jest.Mock).mockReturnValue(mockUI);

    const mockClearance = 100;
    (useTabBarClearance as jest.Mock).mockReturnValue(mockClearance);

    const { result } = await renderHook(() => useDashboardStyles());

    // Verify useTabBarClearance was called with spacing[6]
    expect(useTabBarClearance).toHaveBeenCalledWith(spacing[6]);

    // Verify gradients are returned from useUI
    expect(result.current.gradients).toEqual(mockUI.gradients);

    // Verify styles object shape
    expect(result.current.styles).toEqual({
      scrollView: { flex: 1 },
      scrollContent: { paddingBottom: mockClearance },
      header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: spacing[2],
        paddingBottom: spacing[4],
      },
      appName: {
        letterSpacing: -0.5,
      },
      sectionLabel: {
        letterSpacing: 1,
        textTransform: "uppercase",
        paddingTop: spacing[3],
        paddingBottom: spacing[2],
      },
    });
  });

  it("should update styles when dependencies change", async () => {
    const mockUI = {
      colors: { background: "red" },
      typography: { title1: { fontSize: 24 } },
      borderRadius: { md: 8 },
      gradients: { main: ["#000", "#FFF"] },
    };

    (useUI as jest.Mock).mockReturnValue(mockUI);
    (useTabBarClearance as jest.Mock).mockReturnValue(100);

    const { result, unmount } = await renderHook(() => useDashboardStyles());
    expect(result.current.styles.scrollContent.paddingBottom).toBe(100);

    unmount();

    // Simulate re-rendering the hook with new dependencies by rendering again
    (useTabBarClearance as jest.Mock).mockReturnValue(200);
    const { result: newResult } = await renderHook(() => useDashboardStyles());

    expect(newResult.current.styles.scrollContent.paddingBottom).toBe(200);
  });
});
