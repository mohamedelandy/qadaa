/** @format */

/**
 * Test that useSyncStyles hook returns defined styles.
 */
import { renderHook } from "@testing-library/react-native";
import { useSyncStyles } from "../useSyncStyles";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "en" } }),
}));

describe("useSyncStyles", () => {
  it("returns defined styles with expected properties", async () => {
    const { result } = await renderHook(() => useSyncStyles());

    expect(result.current.styles).toBeDefined();
    expect(result.current.styles.title).toBeDefined();
    expect(result.current.styles.tabBar).toBeDefined();
    expect(result.current.styles.tab).toBeDefined();
    expect(result.current.styles.qrContainer).toBeDefined();
    expect(result.current.styles.actionButton).toBeDefined();
  });
});
