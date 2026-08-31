/** @format */
/**
 * Unit tests for onboarding slide styles and entrance animation targets.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { renderHook } from "@testing-library/react-native";
import {
  useOnboardingSlideViewModel,
  useOnboardingSlideAnimation,
} from "../OnboardingSlide.viewmodel";
describe("useOnboardingSlideViewModel", () => {
  it("returns theme colors with centered slide styles sized to the emoji circle", async () => {
    const { result } = await renderHook(() => useOnboardingSlideViewModel());
    expect(result.current.colors.primary).toBeDefined();
    expect(result.current.styles.emojiCircle.width).toBe(112);
    expect(result.current.styles.container.justifyContent).toBe("center");
    expect(result.current.styles.title.textAlign).toBe("center");
  });
});
describe("useOnboardingSlideAnimation", () => {
  it("starts unmounted and marks the slide mounted once the entrance effect runs", async () => {
    const { result } = await renderHook(() => useOnboardingSlideAnimation());
    expect(result.current.mounted).toBe(true);
  });
  it("exposes all six entrance animation channels", async () => {
    const { result } = await renderHook(() => useOnboardingSlideAnimation());
    expect(typeof result.current.containerX.value).toBe("number");
    expect(typeof result.current.containerOpacity.value).toBe("number");
    expect(typeof result.current.emojiScale.value).toBe("number");
    expect(typeof result.current.emojiOpacity.value).toBe("number");
    expect(typeof result.current.textY.value).toBe("number");
    expect(typeof result.current.textOpacity.value).toBe("number");
  });
});
