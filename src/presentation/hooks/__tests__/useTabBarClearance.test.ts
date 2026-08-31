/** @format */
/**
 * Unit tests computing tab bar clearance from mocked safe-area insets.
 */
import { renderHook } from "@testing-library/react-native";
import { useTabBarClearance } from "../useTabBarClearance";
import { useSafeAreaInsets } from "react-native-safe-area-context";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe("useTabBarClearance hook", () => {
  const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;

  it("calculates clearance when insets.bottom is 0 (uses GLASS_BAR_MARGIN fallback)", async () => {
    mockUseSafeAreaInsets.mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0 });
    const { result } = await renderHook(() => useTabBarClearance());
    expect(result.current).toBe(70);
  });

  it("calculates clearance when insets.bottom is 40 (uses insets.bottom - 16)", async () => {
    mockUseSafeAreaInsets.mockReturnValue({ top: 0, bottom: 40, left: 0, right: 0 });
    const { result } = await renderHook(() => useTabBarClearance(10));
    expect(result.current).toBe(92);
  });
});
