/** @format */
/**
 * Unit tests for the stat card view model (card theming and RTL flag).
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useThemeStore } from "@stores/useThemeStore";
import { useStatCardViewModel } from "../StatCard.viewmodel";
import { useUI } from "@hooks/useUI";

async function renderColors() {
  const ui = await renderHook(() => useUI());
  return ui.result.current.colors;
}
describe("useStatCardViewModel", () => {
  afterEach(() => {
    useThemeStore.getState().setDirection("ltr");
  });
  it("themes the card background and border from the active palette", async () => {
    const { result } = await renderHook(() => useStatCardViewModel());
    const colors = await renderColors();
    expect(result.current.styles.card.backgroundColor).toBe(colors.card);
    expect(result.current.styles.card.borderColor).toBe(colors.border);
  });
  it("keeps centered text with a compact hint line height", async () => {
    const { result } = await renderHook(() => useStatCardViewModel());
    expect(result.current.styles.label.textAlign).toBe("center");
    expect(result.current.styles.hint.lineHeight).toBe(13);
  });
  it("mirrors layout direction changes from the theme store", async () => {
    const { result } = await renderHook(() => useStatCardViewModel());
    expect(result.current.isRTL).toBe(false);
    await act(async () => {
      useThemeStore.getState().setDirection("rtl");
    });
    expect(result.current.isRTL).toBe(true);
  });
});
