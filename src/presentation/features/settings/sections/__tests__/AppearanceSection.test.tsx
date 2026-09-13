/** @format */
/**
 * Component tests for the AppearanceSection.
 */
import { render, screen, userEvent } from "@testing-library/react-native";
import { ThemeProvider } from "@theme/ThemeProvider";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { AppearanceSection } from "../AppearanceSection";

jest.useFakeTimers();

describe("AppearanceSection", () => {
  it("displays lightMode text when isDark is true", async () => {
    await render(
      <ThemeProvider>
        <AppearanceSection isDark={true} onToggleTheme={jest.fn()} />
      </ThemeProvider>
    );
    expect(screen.getByText("settings.lightMode")).toBeOnTheScreen();
  });

  it("displays darkMode text when isDark is false", async () => {
    await render(
      <ThemeProvider>
        <AppearanceSection isDark={false} onToggleTheme={jest.fn()} />
      </ThemeProvider>
    );
    expect(screen.getByText("settings.darkMode")).toBeOnTheScreen();
  });

  it("calls onToggleTheme when the button is pressed", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onToggleThemeMock = jest.fn();

    await render(
      <ThemeProvider>
        <AppearanceSection isDark={false} onToggleTheme={onToggleThemeMock} />
      </ThemeProvider>
    );

    await user.press(screen.getByTestId("settings-theme-toggle"));

    expect(onToggleThemeMock).toHaveBeenCalledTimes(1);
  });
});
