/** @format */
import { renderHook } from "@testing-library/react-native";
import { useTheme } from "../useTheme";
import { useThemeStore } from "@stores/useThemeStore";

jest.mock("@stores/useThemeStore", () => ({
  useThemeStore: jest.fn(),
}));

describe("useTheme hook", () => {
  const mockUseThemeStore = useThemeStore as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns light mode and LTR direction correctly", async () => {
    const mockToggleTheme = jest.fn();

    mockUseThemeStore.mockImplementation((selector) => {
      const state = {
        mode: "light",
        direction: "ltr",
        toggleTheme: mockToggleTheme,
      };
      return selector(state);
    });

    const { result } = await renderHook(() => useTheme());

    expect(result.current.mode).toBe("light");
    expect(result.current.direction).toBe("ltr");
    expect(result.current.isDark).toBe(false);
    expect(result.current.isRTL).toBe(false);
    expect(result.current.textAlign).toBe("left");
    expect(result.current.toggleTheme).toBe(mockToggleTheme);
  });

  it("returns dark mode and RTL direction correctly", async () => {
    const mockToggleTheme = jest.fn();

    mockUseThemeStore.mockImplementation((selector) => {
      const state = {
        mode: "dark",
        direction: "rtl",
        toggleTheme: mockToggleTheme,
      };
      return selector(state);
    });

    const { result } = await renderHook(() => useTheme());

    expect(result.current.mode).toBe("dark");
    expect(result.current.direction).toBe("rtl");
    expect(result.current.isDark).toBe(true);
    expect(result.current.isRTL).toBe(true);
    expect(result.current.textAlign).toBe("right");
    expect(result.current.toggleTheme).toBe(mockToggleTheme);
  });
});
