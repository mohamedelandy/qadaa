/** @format */
/**
 * Unit tests for Stats screen rendering of title against default store state.
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
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
const mockNavigate = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ navigate: mockNavigate }),
}));
import { renderWithProviders } from "@/src/__tests__/testUtils";
import Stats from "../index";
import { useGamificationStore } from "@stores/useGamificationStore";
import { usePrayerStore } from "@stores/usePrayerStore";
describe("Stats", () => {
  beforeEach(() => {
    useGamificationStore.setState(useGamificationStore.getInitialState());
    usePrayerStore.setState(usePrayerStore.getInitialState());
  });
  it("renders the stats title", async () => {
    await renderWithProviders(<Stats />);
    expect(screen.getByText("stats.title")).toBeOnTheScreen();
  });
  it("shows the empty state and navigates to the dashboard from its action", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Stats />);
    expect(screen.getByTestId("stats-empty-state")).toBeOnTheScreen();
    await user.press(screen.getByText("stats.emptyAction"));
    expect(mockNavigate).toHaveBeenCalledWith("/(tabs)/dashboard");
  });
});
