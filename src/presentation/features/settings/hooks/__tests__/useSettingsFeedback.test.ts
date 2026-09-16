/** @format */
/**
 * Unit tests for feedback handler opening the https feedback URL via Linking.openURL.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { Linking } from "react-native";
import { useSettingsFeedback } from "../useSettingsFeedback";
describe("useSettingsFeedback", () => {
  it("handleFeedback opens the feedback URL", async () => {
    const spy = jest.spyOn(Linking, "openURL").mockImplementation(() => Promise.resolve(true));
    const { result } = await renderHook(() => useSettingsFeedback());
    await act(async () => {
      result.current.handleFeedback();
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("https://"));
    spy.mockRestore();
  });
});
