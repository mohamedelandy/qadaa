import { renderHook } from "@testing-library/react-native";
import { useHadithCardViewModel } from "../HadithCard.viewmodel";

jest.mock("@hooks/useUI", () => ({
  useUI: jest.fn(() => ({
    colors: {
      card: "#ffffff",
      border: "#cccccc",
      textDim: "#999999",
      textMuted: "#666666",
    },
    typography: {
      fontSize: {
        xs: 12,
        sm: 14,
      },
      fonts: {
        medium: "Inter-Medium",
        regular: "Inter-Regular",
      },
    },
    borderRadius: {
      xl: 16,
    },
  })),
}));

describe("useHadithCardViewModel", () => {
  it("returns styles based on UI theme", async () => {
    const { result } = await renderHook(() => useHadithCardViewModel());

    expect(result.current.styles.container.backgroundColor).toBe("#ffffff");
    expect(result.current.styles.container.borderColor).toBe("#cccccc");
    expect(result.current.styles.container.borderRadius).toBe(16);

    expect(result.current.styles.separator.color).toBe("#999999");
    expect(result.current.styles.separator.fontSize).toBe(12);
    expect(result.current.styles.separator.fontFamily).toBe("Inter-Medium");

    expect(result.current.styles.text.color).toBe("#666666");
    expect(result.current.styles.text.fontSize).toBe(14);
    expect(result.current.styles.text.fontFamily).toBe("Inter-Regular");
  });
});
