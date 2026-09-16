/** @format */
/**
 * Component tests for the FeedbackSection.
 */
import { render, screen, userEvent } from "@testing-library/react-native";
import { ThemeProvider } from "@theme/ThemeProvider";
import { Linking } from "react-native";
import { FeedbackSection } from "../FeedbackSection";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));

jest.useFakeTimers();

describe("FeedbackSection", () => {
  it("displays feedback texts correctly", async () => {
    await render(
      <ThemeProvider>
        <FeedbackSection />
      </ThemeProvider>
    );
    expect(screen.getByText("settings.feedbackHint")).toBeOnTheScreen();
    // The settings.feedback appears twice: once in the section header, once in the button
    expect(screen.getAllByText("settings.feedback").length).toBeGreaterThan(0);
  });

  it("calls Linking.openURL when the feedback button is pressed", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const openURLSpy = jest.spyOn(Linking, "openURL").mockResolvedValue(true);

    await render(
      <ThemeProvider>
        <FeedbackSection />
      </ThemeProvider>
    );

    await user.press(screen.getByTestId("settings-feedback-btn"));

    expect(openURLSpy).toHaveBeenCalledWith("mailto:support@qadaa.app");
    openURLSpy.mockRestore();
  });
});
