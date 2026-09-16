/** @format */
import { render, screen } from "@testing-library/react-native";
import { ThemeProvider } from "@theme/ThemeProvider";
import { GraceDaySection } from "../GraceDaySection";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "en" } }),
}));

describe("GraceDaySection", () => {
  it("renders correctly when grace is available (graceUsed: false)", async () => {
    await render(
      <ThemeProvider>
        <GraceDaySection graceUsed={false} graceStatus="Available" />
      </ThemeProvider>
    );

    // Verify translations / hints
    expect(screen.getAllByText("settings.graceDay").length).toBeGreaterThan(0);
    expect(screen.getByText("settings.graceDayHint")).toBeOnTheScreen();

    // Verify status
    const statusText = screen.getByTestId("settings-grace-status");
    expect(statusText.props["children"]).toBe("Available");
  });

  it("renders correctly when grace is used (graceUsed: true)", async () => {
    await render(
      <ThemeProvider>
        <GraceDaySection graceUsed={true} graceStatus="Used" />
      </ThemeProvider>
    );

    // Verify translations / hints
    expect(screen.getAllByText("settings.graceDay").length).toBeGreaterThan(0);
    expect(screen.getByText("settings.graceDayHint")).toBeOnTheScreen();

    // Verify status
    const statusText = screen.getByTestId("settings-grace-status");
    expect(statusText.props["children"]).toBe("Used");
  });
});
