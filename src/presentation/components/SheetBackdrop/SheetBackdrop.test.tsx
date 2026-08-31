/** @format */
/**
 * Unit tests for SheetBackdrop — scrim press triggers onClose.
 */
jest.useFakeTimers();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      interpolate: () => 0,
      Extrapolate: { CLAMP: "clamp" },
      createAnimatedComponent: (C: unknown) => C,
    },
    useSharedValue: (init: unknown) => ({ value: init }),
    useAnimatedStyle: (style: unknown) => style,
    interpolate: () => 0,
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  };
});
jest.mock("expo-blur", () => ({
  __esModule: true,
  BlurView: "BlurView",
}));
import { screen, userEvent } from "@testing-library/react-native";
import { renderWithProviders } from "@/src/__tests__/testUtils";
import { SheetBackdrop } from "./SheetBackdrop";

describe("SheetBackdrop", () => {
  const user = userEvent.setup();
  it("renders and calls onClose when the scrim is pressed", async () => {
    const onClose = jest.fn();
    const opacity = { value: 1 };
    await renderWithProviders(<SheetBackdrop opacity={opacity as never} onClose={onClose} />);
    await user.press(screen.getByRole("button", { name: /a11y\.close/ }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
