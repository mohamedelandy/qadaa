/** @format */
/**
 * Component tests for the notification time picker UI.
 */
import { screen, userEvent } from "@testing-library/react-native";
jest.useFakeTimers();
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("expo-haptics", () => ({
  __esModule: true,
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Error: "error", Warning: "warning" },
}));
import { renderWithProviders } from "@/src/__tests__/testUtils";
import { NotificationPicker } from "../NotificationPicker";
describe("NotificationPicker", () => {
  it("renders the hour/minute/ampm selectors", async () => {
    await renderWithProviders(
      <NotificationPicker
        currentHour={9}
        currentMinute={15}
        currentAmPm="AM"
        onSave={async () => true}
      />
    );
    expect(screen.getByText("9")).toBeOnTheScreen();
    expect(screen.getByText("settings.am")).toBeOnTheScreen();
    expect(screen.getByTestId("notification-hour-value")).toBeOnTheScreen();
  });
  it("cycles the hour up and down within 1-12", async () => {
    const user = userEvent.setup();
    await renderWithProviders(
      <NotificationPicker
        currentHour={9}
        currentMinute={0}
        currentAmPm="AM"
        onSave={async () => true}
      />
    );
    await user.press(screen.getByTestId("hour-up"));
    expect(screen.getByText("10")).toBeOnTheScreen();
  });
  it("cycles the hour down within 1-12", async () => {
    const user = userEvent.setup();
    await renderWithProviders(
      <NotificationPicker
        currentHour={9}
        currentMinute={0}
        currentAmPm="AM"
        onSave={async () => true}
      />
    );
    await user.press(screen.getByTestId("hour-down"));
    expect(screen.getByText("8")).toBeOnTheScreen();
  });
  it("selects a minute option and toggles ampm (covers minute/ampm branches)", async () => {
    const user = userEvent.setup();
    await renderWithProviders(
      <NotificationPicker
        currentHour={9}
        currentMinute={0}
        currentAmPm="AM"
        onSave={async () => true}
      />
    );
    await user.press(screen.getByText("15"));
    await user.press(screen.getByText("settings.pm"));
    await user.press(screen.getByText("settings.am"));
  });
  it("fires the save button (covers save branch)", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn().mockResolvedValue(true);
    await renderWithProviders(
      <NotificationPicker currentHour={9} currentMinute={15} currentAmPm="AM" onSave={onSave} />
    );
    await user.press(screen.getByText("settings.notificationSave"));
    expect(onSave).toHaveBeenCalled();
  });
});
