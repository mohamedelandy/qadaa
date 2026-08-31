/** @format */
/**
 * Unit tests for LottieView.
 */
import { screen } from "@testing-library/react-native";

jest.mock("lottie-react-native", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,

    default: (props: Record<string, unknown>) => <View testID={props["testID"] as string} />,
  };
});

const mockUseReducedMotion = jest.fn(() => false);
jest.mock("react-native-reanimated", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

import { LottieView } from "../LottieView";
import { renderWithProviders } from "@/src/__tests__/testUtils";

describe("LottieView", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("renders with default testID based on animation name", async () => {
    await renderWithProviders(<LottieView name="confetti" />);
    expect(screen.getByTestId("lottie-confetti")).toBeOnTheScreen();
  });

  it("renders with custom testID when provided", async () => {
    await renderWithProviders(<LottieView name="confetti" testID="my-custom-id" />);
    expect(screen.getByTestId("my-custom-id")).toBeOnTheScreen();
  });

  it("renders nothing when reduced motion is enabled", async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderWithProviders(<LottieView name="confetti" />);
    expect(screen.queryByTestId("lottie-confetti")).not.toBeOnTheScreen();
  });

  it("renders different animation names", async () => {
    await renderWithProviders(<LottieView name="sparkle-pop" />);
    expect(screen.getByTestId("lottie-sparkle-pop")).toBeOnTheScreen();
  });

  it("renders with all optional props", async () => {
    const onFinish = jest.fn();
    await renderWithProviders(
      <LottieView
        name="lantern"
        loop
        autoplay={false}
        speed={2}
        onAnimationFinish={onFinish}
        resizeMode="contain"
        style={{ width: 100 }}
      />
    );
    expect(screen.getByTestId("lottie-lantern")).toBeOnTheScreen();
  });
});
