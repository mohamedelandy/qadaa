/** @format */
/**
 * Component tests for the language toggle options and change callbacks.
 */
import { screen, userEvent } from "@testing-library/react-native";
jest.useFakeTimers();
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { renderWithProviders } from "@/src/__tests__/testUtils";
import { LanguageToggle } from "../LanguageToggle";
describe("LanguageToggle", () => {
  it("renders both language options", async () => {
    await renderWithProviders(<LanguageToggle language="ar" onLanguageChange={() => {}} />);
    expect(screen.getByText("settings.ar")).toBeOnTheScreen();
    expect(screen.getByText("settings.en")).toBeOnTheScreen();
  });
  it("calls onLanguageChange when English is pressed", async () => {
    const user = userEvent.setup();
    const onLanguageChange = jest.fn();
    await renderWithProviders(<LanguageToggle language="ar" onLanguageChange={onLanguageChange} />);
    await user.press(screen.getByText("settings.en"));
    expect(onLanguageChange).toHaveBeenCalledWith("en");
  });
  it("calls onLanguageChange when Arabic is pressed", async () => {
    const user = userEvent.setup();
    const onLanguageChange = jest.fn();
    await renderWithProviders(<LanguageToggle language="en" onLanguageChange={onLanguageChange} />);
    await user.press(screen.getByText("settings.ar"));
    expect(onLanguageChange).toHaveBeenCalledWith("ar");
  });
});
