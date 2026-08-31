/** @format */
/**
 * Unit tests for onboarding view model slide advancement, last-slide flag, skip, and completion.
 */
import { render, screen, userEvent } from "@testing-library/react-native";
import { View, Pressable } from "react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (
      k: string,
      opts?: {
        returnObjects?: boolean;
      }
    ) => {
      if (k === "onboarding.slides" && opts?.returnObjects) {
        return [
          { emoji: "a", title: "T1", body: "B1" },
          { emoji: "b", title: "T2", body: "B2" },
          { emoji: "c", title: "T3", body: "B3" },
        ];
      }
      return k;
    },
    i18n: { language: "ar" },
  }),
}));
import { useOnboardingViewModel } from "../hooks/useOnboardingViewModel";
import { useAppStore } from "@stores/useAppStore";
const SLIDES: string[] = [];
function Harness() {
  const vm = useOnboardingViewModel();
  return (
    <View>
      <Pressable
        testID="state"
        onPress={() =>
          SLIDES.push(`cur=${vm.currentSlide} last=${vm.isLastSlide} total=${vm.totalSlides}`)
        }
      />
      <Pressable testID="next" onPress={() => vm.nextSlide()} />
      <Pressable testID="skip" onPress={() => vm.skip()} />
    </View>
  );
}
jest.useFakeTimers();
describe("useOnboardingViewModel", () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
    SLIDES.length = 0;
    useAppStore.setState(useAppStore.getInitialState());
  });
  it("starts on the first of three slides", async () => {
    await render(<Harness />);
    await user.press(screen.getByTestId("state"));
    expect(SLIDES[0]).toBe("cur=0 last=false total=3");
  });
  it("advances on next until the last slide", async () => {
    await render(<Harness />);
    await user.press(screen.getByTestId("next"));
    await user.press(screen.getByTestId("state"));
    expect(SLIDES[0]).toBe("cur=1 last=false total=3");
    await user.press(screen.getByTestId("next"));
    await user.press(screen.getByTestId("state"));
    expect(SLIDES[1]).toBe("cur=2 last=true total=3");
  });
  it("finishes (completeOnboarding) when next is pressed on the last slide", async () => {
    await render(<Harness />);
    await user.press(screen.getByTestId("next"));
    await user.press(screen.getByTestId("next"));
    await user.press(screen.getByTestId("next"));
    expect(useAppStore.getState().onboardingComplete).toBe(true);
  });
  it("skip also completes onboarding", async () => {
    await render(<Harness />);
    await user.press(screen.getByTestId("skip"));
    expect(useAppStore.getState().onboardingComplete).toBe(true);
  });
});
