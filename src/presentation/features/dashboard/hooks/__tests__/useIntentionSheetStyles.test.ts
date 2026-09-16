/** @format */

import { renderHook } from "@testing-library/react-native";
import { useIntentionSheetStyles } from "../useIntentionSheetStyles";
import { spacing } from "@theme/spacing";
import { useUI } from "@hooks/useUI";

jest.mock("@hooks/useUI", () => ({
  useUI: jest.fn(),
}));

describe("useIntentionSheetStyles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the correct styles, translations, and gradients based on mock dependencies", async () => {
    const mockT = jest.fn();
    const mockUI = {
      t: mockT,
      colors: {
        textMuted: "#888",
        textSub: "#666",
        white: "#FFF",
        textPlaceholder: "#CCC",
        greenBorder: "#0F0",
      },
      typography: {
        fontSize: { xs: 12, base: 16, xl: 24 },
        fonts: { regular: "Inter-Regular", medium: "Inter-Medium", bold: "Inter-Bold" },
      },
      borderRadius: { xl: 16 },
      gradients: {
        main: ["#000", "#FFF"],
      },
    };

    (useUI as jest.Mock).mockReturnValue(mockUI);

    const { result } = await renderHook(() => useIntentionSheetStyles());

    expect(result.current.t).toBe(mockT);
    expect(result.current.accent).toBe(mockUI.colors.greenBorder);
    expect(result.current.gradients).toBe(mockUI.gradients);

    expect(result.current.styles).toEqual({
      title: {
        color: mockUI.colors.textMuted,
        fontSize: mockUI.typography.fontSize.base,
        fontFamily: mockUI.typography.fonts.bold,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginTop: spacing[5],
      },
      intentionText: {
        color: mockUI.colors.textSub,
        fontSize: mockUI.typography.fontSize.xl,
        lineHeight: spacing[8.5],
        letterSpacing: 0.5,
        textAlign: "center",
        marginTop: spacing[3],
        fontFamily: mockUI.typography.fonts.regular,
      },
      ameenBtn: { width: "100%", borderRadius: mockUI.borderRadius.xl, marginTop: spacing[5] },
      ameenPressable: {
        paddingVertical: spacing[3.5],
        borderRadius: mockUI.borderRadius.xl,
        alignItems: "center",
        justifyContent: "center",
      },
      ameenText: {
        color: mockUI.colors.white,
        fontFamily: mockUI.typography.fonts.bold,
        fontSize: mockUI.typography.fontSize.base,
      },
      autoHint: {
        color: mockUI.colors.textPlaceholder,
        fontSize: mockUI.typography.fontSize.xs,
        marginTop: spacing[2],
        fontFamily: mockUI.typography.fonts.medium,
      },
    });
  });

  it("should update styles when dependencies change", async () => {
    const mockUI1 = {
      t: jest.fn(),
      colors: {
        textMuted: "#888",
        textSub: "#666",
        white: "#FFF",
        textPlaceholder: "#CCC",
        greenBorder: "#0F0",
      },
      typography: {
        fontSize: { xs: 12, base: 16, xl: 24 },
        fonts: { regular: "Inter-Regular", medium: "Inter-Medium", bold: "Inter-Bold" },
      },
      borderRadius: { xl: 16 },
      gradients: {
        main: ["#000", "#FFF"],
      },
    };

    (useUI as jest.Mock).mockReturnValue(mockUI1);

    const { result, unmount } = await renderHook(() => useIntentionSheetStyles());
    expect(result.current.styles.title.color).toBe("#888");

    unmount();

    const mockUI2 = {
      ...mockUI1,
      colors: {
        ...mockUI1.colors,
        textMuted: "#999",
      },
    };
    (useUI as jest.Mock).mockReturnValue(mockUI2);

    const { result: newResult } = await renderHook(() => useIntentionSheetStyles());
    expect(newResult.current.styles.title.color).toBe("#999");
  });
});
