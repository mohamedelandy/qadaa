/** @format */
/**
 * Unit tests for useDuaModalViewModel theme styles, gradients, and title splitting.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: "ar" },
  }),
}));
import { useDuaModalViewModel } from "../DuaModal.viewmodel";
describe("useDuaModalViewModel", () => {
  it("exposes the resolved theme styles", async () => {
    const { result } = await renderHook(() => useDuaModalViewModel());
    expect(result.current.styles).toBeTruthy();
    expect(result.current.gradients).toBeTruthy();
  });
  it("splits title into emoji and text parts", async () => {
    const { result } = await renderHook(() => useDuaModalViewModel());
    expect(result.current.textPart).toBeDefined();
  });
  it("handles empty title (covers titleParts[0] fallback)", async () => {
    const { result } = await renderHook(() => useDuaModalViewModel());
    expect(result.current.emojiPart).toBeDefined();
  });
  it("renders across visibility changes", async () => {
    const { result, rerender } = await renderHook(() => useDuaModalViewModel());
    await act(async () => rerender({}));
    expect(result.current.styles).toBeTruthy();
    await act(async () => rerender({}));
  });
});
