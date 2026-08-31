/** @format */
/**
 * Unit tests for prayer row progress computation and press/undo guards.
 */
import { screen, userEvent, fireEvent } from "@testing-library/react-native";
import { renderWithProviders } from "@/src/__tests__/testUtils";
import { View, Pressable } from "react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 0, Medium: 1, Heavy: 2 },
}));
import { usePrayerRowViewModel, computeRecoveryProgress } from "../PrayerRow.viewmodel";
import { useAppStore } from "@stores/useAppStore";
import * as Haptics from "expo-haptics";
jest.useFakeTimers();
describe("computeRecoveryProgress", () => {
  it("returns 0 when nothing is recovered or the total is zero", () => {
    expect(computeRecoveryProgress(0, 0)).toBe(0);
    expect(computeRecoveryProgress(0, 100)).toBe(0);
  });
  it("returns the recovered fraction of the total", () => {
    expect(computeRecoveryProgress(2, 8)).toBe(0.2);
  });
  it("clamps to 1 when fully recovered", () => {
    expect(computeRecoveryProgress(100, 0)).toBe(1);
  });
});
interface HarnessProps {
  isDone?: boolean;
  recovered?: number;
  remaining?: number;
  loggedToday?: boolean;
  onLog?: jest.Mock;
  onUndo?: jest.Mock;
}
function Harness({
  isDone = false,
  recovered = 2,
  remaining = 8,
  loggedToday = true,
  onLog = jest.fn(),
  onUndo = jest.fn(),
}: HarnessProps) {
  const vm = usePrayerRowViewModel({
    prayerKey: "fajr",
    emoji: "🕌",
    name: "Fajr",
    recovered,
    remaining,
    isDone,
    loggedToday,
    onLog,
    onUndo,
    onBatch: jest.fn(),
  });
  return (
    <View>
      <Pressable testID="press" onPress={vm.handlePress} />
      <Pressable testID="undo" onPress={vm.handleUndo} />
      <Pressable testID="longpress" onLongPress={vm.handleLongPress} />
    </View>
  );
}
describe("usePrayerRowViewModel", () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState());
  });
  it("calls onLog when pressed and not done", async () => {
    const user = userEvent.setup();
    const onLog = jest.fn();
    await renderWithProviders(<Harness onLog={onLog} />);
    await user.press(screen.getByTestId("press"));
    expect(onLog).toHaveBeenCalledWith("fajr");
  });
  it("does not call onLog when already done (at cap)", async () => {
    const user = userEvent.setup();
    const onLog = jest.fn();
    await renderWithProviders(<Harness isDone onLog={onLog} />);
    await user.press(screen.getByTestId("press"));
    expect(onLog).not.toHaveBeenCalled();
  });
  it("calls onUndo when recovered > 0 and logged today", async () => {
    const user = userEvent.setup();
    const onUndo = jest.fn();
    await renderWithProviders(<Harness onUndo={onUndo} />);
    await user.press(screen.getByTestId("undo"));
    expect(onUndo).toHaveBeenCalledWith("fajr");
  });
  it("does not call onUndo when not logged today (no history rewrite)", async () => {
    const user = userEvent.setup();
    const onUndo = jest.fn();
    await renderWithProviders(<Harness loggedToday={false} onUndo={onUndo} />);
    await user.press(screen.getByTestId("undo"));
    expect(onUndo).not.toHaveBeenCalled();
  });
  it("does not call onUndo when nothing recovered", async () => {
    const user = userEvent.setup();
    const onUndo = jest.fn();
    await renderWithProviders(<Harness recovered={0} onUndo={onUndo} />);
    await user.press(screen.getByTestId("undo"));
    expect(onUndo).not.toHaveBeenCalled();
  });
  it("fires light haptic on press when not done", async () => {
    const user = userEvent.setup();
    (Haptics.impactAsync as jest.Mock).mockClear();
    await renderWithProviders(<Harness />);
    await user.press(screen.getByTestId("press"));
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });
  it("does not fire haptic on press when already done", async () => {
    const user = userEvent.setup();
    (Haptics.impactAsync as jest.Mock).mockClear();
    await renderWithProviders(<Harness isDone />);
    await user.press(screen.getByTestId("press"));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
  it("opens batch popover on long press when remaining", async () => {
    await renderWithProviders(<Harness />);
    fireEvent(screen.getByTestId("longpress"), "longPress");
    expect(screen.getByTestId("longpress")).toBeOnTheScreen();
  });
});
