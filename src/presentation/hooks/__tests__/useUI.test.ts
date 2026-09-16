/** @format */
import { renderHook } from "@testing-library/react-native";
import { useUI } from "../useUI";
import { useTheme } from "../useTheme";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useTranslation } from "react-i18next";

jest.mock("../useTheme", () => ({
  useTheme: jest.fn(),
}));

jest.mock("@stores/useSettingsStore", () => ({
  useSettingsStore: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

describe("useUI hook", () => {
  const mockUseTheme = useTheme as jest.Mock;
  const mockUseSettingsStore = useSettingsStore as unknown as jest.Mock;
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("aggregates theme, translation, and language correctly", async () => {
    const mockTheme = {
      isDark: true,
      isRTL: false,
      mode: "dark",
      direction: "ltr",
      textAlign: "left",
      toggleTheme: jest.fn(),
    };
    const mockT = jest.fn();
    const mockLanguage = "en";

    mockUseTheme.mockReturnValue(mockTheme);

    mockUseSettingsStore.mockImplementation((selector) => {
      const state = {
        language: mockLanguage,
      };
      return selector(state);
    });

    mockUseTranslation.mockReturnValue({
      t: mockT,
    });

    const { result } = await renderHook(() => useUI());

    expect(result.current.isDark).toBe(true);
    expect(result.current.isRTL).toBe(false);
    expect(result.current.mode).toBe("dark");
    expect(result.current.direction).toBe("ltr");
    expect(result.current.textAlign).toBe("left");
    expect(result.current.t).toBe(mockT);
    expect(result.current.language).toBe(mockLanguage);
  });
});
