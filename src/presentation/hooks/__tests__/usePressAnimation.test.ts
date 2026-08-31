/** @format */
/**
 * Unit tests for press animation handlers and scale value exposure.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { renderHook, act } from "@testing-library/react-native";
import { usePressAnimation } from "../usePressAnimation";
describe("usePressAnimation", () => {
  it("returns scale and press handlers", async () => {
    const { result } = await renderHook(() => usePressAnimation());
    expect(result.current.scale).toBeDefined();
    expect(typeof result.current.handlePressIn).toBe("function");
    expect(typeof result.current.handlePressOut).toBe("function");
  });
  it("invokes the press-in and press-out handlers without throwing", async () => {
    const { result } = await renderHook(() => usePressAnimation(0.95));
    await act(async () => {
      result.current.handlePressIn();
      result.current.handlePressOut();
    });
    expect(result.current.scale).toBeDefined();
  });
});
