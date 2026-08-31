/** @format */
/**
 * Unit tests for sync section export/import restoring stores from valid backup JSON and rejecting invalid.
 */
import { screen, userEvent, waitFor } from "@testing-library/react-native";
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
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  const mockComponent = (name: string) => {
    const Comp = (props: object) => React.createElement(View, props);
    Comp.displayName = name;
    return Comp;
  };
  return {
    __esModule: true,
    default: mockComponent("Svg"),
    Svg: mockComponent("Svg"),
    SvgXml: mockComponent("SvgXml"),
    Circle: mockComponent("Circle"),
    Path: mockComponent("Path"),
    Rect: mockComponent("Rect"),
    Line: mockComponent("Line"),
    G: mockComponent("G"),
    Text: mockComponent("Text"),
  };
});
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("@hooks/usePressAnimation", () => ({
  usePressAnimation: () => ({
    scale: { value: 1 },
    handlePressIn: jest.fn(),
    handlePressOut: jest.fn(),
  }),
}));
import { renderWithProviders } from "@/src/__tests__/testUtils";
import { SyncSection } from "../SyncSection";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useAppStore } from "@stores/useAppStore";
const VALID_BACKUP = JSON.stringify({
  version: 1,
  wizardComplete: true,
  age: 25,
  pubertyAge: 15,
  periods: [],
  totalMissedDays: 100,
  prayers: {
    fajr: { recovered: 0 },
    dhuhr: { recovered: 0 },
    asr: { recovered: 0 },
    maghrib: { recovered: 0 },
    isha: { recovered: 0 },
  },
  streak: 0,
  lastLogDate: null,
  loggedDates: [],
  points: 0,
  badges: [],
  language: "ar",
});
describe("SyncSection", () => {
  beforeEach(() => {
    useSettingsStore.setState(useSettingsStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useAppStore.setState(useAppStore.getInitialState());
  });
  it("renders the sync tabs when visible", async () => {
    await renderWithProviders(<SyncSection visible onClose={() => {}} />);
    expect(screen.getByText("share.title")).toBeOnTheScreen();
  });
  it("switches to clipboard tab and shows copy button", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<SyncSection visible onClose={() => {}} />);
    await user.press(screen.getByText("share.tabClipboard"));
    expect(await screen.findByText("share.clipboardInstructions")).toBeOnTheScreen();
    expect(screen.getByText("share.copyButton")).toBeOnTheScreen();
    // The preview renders the app's own exported backup JSON (round-trip source).
    expect(screen.getByTestId("sync-preview-json")).toBeOnTheScreen();
    expect(screen.getByText(/wizardComplete/)).toBeOnTheScreen();
    expect(screen.getByText("share.clipboardHint")).toBeOnTheScreen();
  });
  it("shows copied state after pressing copy", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<SyncSection visible onClose={() => {}} />);
    await user.press(screen.getByText("share.tabClipboard"));
    expect(await screen.findByText("share.copyButton")).toBeOnTheScreen();
    await user.press(screen.getByText("share.copyButton"));
    expect(await screen.findByText("share.copied")).toBeOnTheScreen();
  });
  it("switches to import tab and shows textarea", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<SyncSection visible onClose={() => {}} />);
    await user.press(screen.getByText("share.tabImport"));
    expect(await screen.findByText("share.importInstructions")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("share.pastePlaceholder")).toBeOnTheScreen();
    expect(screen.getByText("share.importButton")).toBeOnTheScreen();
  });
  it("shows error when importing invalid JSON", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<SyncSection visible onClose={() => {}} />);
    await user.press(screen.getByText("share.tabImport"));
    expect(await screen.findByText("share.importButton")).toBeOnTheScreen();
    await user.paste(screen.getByPlaceholderText("share.pastePlaceholder"), "not valid json");
    await waitFor(() => {
      expect(screen.getByTestId("sync-import-btn").props["accessibilityState"]?.disabled).toBe(
        false
      );
    });
    await user.press(screen.getByText("share.importButton"));
    expect(await screen.findByText("share.importFailed")).toBeOnTheScreen();
  });
  it("shows success when importing valid backup", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<SyncSection visible onClose={() => {}} />);
    await user.press(screen.getByText("share.tabImport"));
    expect(await screen.findByText("share.importButton")).toBeOnTheScreen();
    await user.paste(screen.getByPlaceholderText("share.pastePlaceholder"), VALID_BACKUP);
    await waitFor(() => {
      expect(screen.getByTestId("sync-import-btn").props["accessibilityState"]?.disabled).toBe(
        false
      );
    });
    await user.press(screen.getByText("share.importButton"));
    expect(await screen.findByText("share.importSuccess")).toBeOnTheScreen();
  });
  it("disables import button when textarea is empty", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<SyncSection visible onClose={() => {}} />);
    await user.press(screen.getByText("share.tabImport"));
    expect(await screen.findByText("share.importButton")).toBeOnTheScreen();
    const importButton = screen.getByTestId("sync-import-btn");
    expect(importButton.props["accessibilityState"]?.disabled).toBe(true);
  });
});
