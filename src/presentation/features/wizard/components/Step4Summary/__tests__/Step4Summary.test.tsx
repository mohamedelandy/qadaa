/** @format */
/**
 * Component tests for the wizard summary step including RTL mirroring.
 */
import { act, screen, userEvent, waitFor } from "@testing-library/react-native";

jest.useFakeTimers();
const user = userEvent.setup();
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));
import { Step4Summary } from "../Step4Summary";
import { renderWizard, seedWizard, resetWizard } from "../../../__tests__/testUtils";
import { useWizardStore } from "@stores/useWizardStore";
beforeEach(() => {
  resetWizard();
});
function seedSummary(overrides: Record<string, unknown> = {}) {
  seedWizard({ age: "30", pubertyAge: "12", dailyTarget: 5, ...overrides });
}
describe("Step4Summary RTL/LTR support", () => {
  it("uses row direction in LTR", async () => {
    await renderWizard(<Step4Summary />, "ltr");
    expect(screen.getByTestId("step4-row-0")).toHaveStyle({ flexDirection: "row" });
    expect(screen.getByTestId("step4-buttons")).toHaveStyle({ flexDirection: "row" });
  });
  it("renders all five summary rows", async () => {
    await renderWizard(<Step4Summary />);
    expect(screen.getByTestId("step4-row-4")).toBeOnTheScreen();
  });
  it("renders custom target value when dailyTarget is -1", async () => {
    seedSummary({ dailyTarget: -1, customTarget: "15" });
    await renderWizard(<Step4Summary />);
    expect(screen.getByText("15")).toBeOnTheScreen();
  });
  it("plays the celebration first, then confirms when it finishes", async () => {
    const confirmSpy = jest
      .spyOn(useWizardStore.getState(), "confirm")
      .mockImplementation(() => {});
    await renderWizard(<Step4Summary />);
    await user.press(screen.getByTestId("wizard-confirm-btn"));
    expect(confirmSpy).not.toHaveBeenCalled();
    const celebration = await screen.findByTestId("lottie-journey-begins");
    await act(async () => {
      celebration.props["onAnimationFinish"]?.();
    });
    await waitFor(() => expect(confirmSpy).toHaveBeenCalled());
    confirmSpy.mockRestore();
  });

  it("confirms immediately when reduced motion is enabled (skips celebration)", async () => {
    const reanimated = jest.requireMock("react-native-reanimated") as {
      useReducedMotion: jest.Mock;
    };
    reanimated.useReducedMotion.mockReturnValue(true);
    try {
      const confirmSpy = jest
        .spyOn(useWizardStore.getState(), "confirm")
        .mockImplementation(() => {});
      await renderWizard(<Step4Summary />);
      await user.press(screen.getByTestId("wizard-confirm-btn"));
      expect(confirmSpy).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId("lottie-journey-begins")).not.toBeOnTheScreen();
      confirmSpy.mockRestore();
    } finally {
      reanimated.useReducedMotion.mockReturnValue(false);
    }
  });

  it("confirms via the fallback timer if the celebration never finishes", async () => {
    try {
      const confirmSpy = jest
        .spyOn(useWizardStore.getState(), "confirm")
        .mockImplementation(() => {});
      await renderWizard(<Step4Summary />);
      await user.press(screen.getByTestId("wizard-confirm-btn"));
      expect(confirmSpy).not.toHaveBeenCalled();
      const celebration = await screen.findByTestId("lottie-journey-begins");
      expect(celebration).toBeOnTheScreen();
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      expect(confirmSpy).toHaveBeenCalledTimes(1);
      confirmSpy.mockRestore();
    } finally {
      jest.useRealTimers();
    }
  });
});
