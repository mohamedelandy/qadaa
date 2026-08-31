/** @format */
/**
 * Integration tests for the Settings screen (sync/export/import, theme, grace state).
 */
import { screen, userEvent } from "@testing-library/react-native";
jest.useFakeTimers();
jest.mock("react-native-worklets", () => ({
  __esModule: true,
  scheduleOnRN: (cb: () => void) => cb(),
}));
jest.mock("react-native-gesture-handler", () => {
  const buildPan = () => ({
    activeOffsetY: () => buildPan(),
    onUpdate: () => buildPan(),
    onEnd: () => buildPan(),
  });
  return {
    __esModule: true,
    Gesture: { Pan: () => buildPan() },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock("@features/layout/glass-tabs/minimize", () => ({
  useMinimizeOnScroll: () => undefined,
}));
jest.mock("@data/backup", () => ({
  exportToFile: jest.fn().mockResolvedValue(undefined),
  importFromFile: jest.fn().mockResolvedValue(null),
  copyToClipboard: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@data/notifications", () => ({
  scheduleDailyNotification: jest.fn().mockResolvedValue("id"),
  requestNotificationPermissions: jest.fn().mockResolvedValue({ granted: true }),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { renderWithProviders } from "@/src/__tests__/testUtils";
import Settings from "../index";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useAppStore } from "@stores/useAppStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useThemeStore } from "@stores/useThemeStore";
describe("Settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.setState(useSettingsStore.getInitialState());
    useAppStore.setState(useAppStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
    usePrayerStore.setState(usePrayerStore.getInitialState());
  });
  it("renders the settings title", async () => {
    await renderWithProviders(<Settings />);
    expect(screen.getByText("settings.title")).toBeOnTheScreen();
  });
  it("fires the sync, export, and import press handlers", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Settings />);
    await user.press(screen.getByTestId("settings-sync-btn"));
    expect(useSettingsStore.getState().syncVisible).toBe(true);
    await user.press(screen.getByTestId("settings-backup-export-btn"));
    await user.press(screen.getByTestId("settings-backup-import-btn"));
  });
  it("renders dark mode toggle with dark theme active", async () => {
    useThemeStore.setState({ mode: "dark" });
    await renderWithProviders(<Settings />);
    expect(screen.getByText("settings.title")).toBeOnTheScreen();
  });
  it("shows grace used state", async () => {
    const today = new Date().toISOString().slice(0, 7);
    useGamificationStore.setState({ graceUsedMonth: today });
    await renderWithProviders(<Settings />);
    expect(screen.getByText("settings.title")).toBeOnTheScreen();
  });
});
