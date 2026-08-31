/** @format */
/**
 * Unit tests for Input.viewmodel.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { renderHook, act } from "@testing-library/react-native";
import { resolveInputBorderState, useInputFocus } from "../Input.viewmodel";
describe("resolveInputBorderState", () => {
  it("returns error when an error is present", () => {
    expect(resolveInputBorderState("required", false)).toBe("error");
  });
  it("returns focused when no error and focused", () => {
    expect(resolveInputBorderState(undefined, true)).toBe("focused");
  });
  it("returns normal when no error and not focused", () => {
    expect(resolveInputBorderState(undefined, false)).toBe("normal");
  });
});
describe("useInputFocus", () => {
  it("toggles focus state", async () => {
    const { result } = await renderHook(() => useInputFocus());
    expect(result.current.isFocused).toBe(false);
    await act(async () => {
      result.current.handleFocus();
    });
    expect(result.current.isFocused).toBe(true);
    await act(async () => {
      result.current.handleBlur();
    });
    expect(result.current.isFocused).toBe(false);
  });
});
