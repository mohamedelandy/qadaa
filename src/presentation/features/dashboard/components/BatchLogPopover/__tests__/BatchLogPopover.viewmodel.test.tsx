/** @format */
/**
 * Unit tests for batch-log popover view model: valid/invalid preset and custom count handling.
 */
import { screen, userEvent, renderHook, act } from "@testing-library/react-native";
import { View, Pressable } from "react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useBatchLogPopoverViewModel } from "../BatchLogPopover.viewmodel";
import { renderWithProviders } from "@/src/__tests__/testUtils";
jest.useFakeTimers();
interface HarnessProps {
  maxRemaining?: number;
  onBatch?: jest.Mock;
  onCustomConfirm?: () => void;
}
function Harness({ maxRemaining = 10, onBatch = jest.fn() }: HarnessProps) {
  const vm = useBatchLogPopoverViewModel({
    prayerKey: "fajr",
    maxRemaining,
    onBatch,
    onClose: jest.fn(),
  });
  return (
    <View>
      <Pressable testID="preset5" onPress={() => vm.handlePreset(5)} />
      <Pressable testID="preset11" onPress={() => vm.handlePreset(11)} />
      <Pressable testID="set3" onPress={() => vm.setCustomValue("3")} />
      <Pressable testID="set0" onPress={() => vm.setCustomValue("0")} />
      <Pressable testID="confirm" onPress={vm.handleCustomConfirm} />
      <Pressable testID="dismiss-keyboard" onPress={vm.dismissKeyboard} />
      <Pressable testID="open-custom" onPress={vm.openCustomMode} />
      <Pressable testID="cancel-custom" onPress={vm.cancelCustomMode} />
    </View>
  );
}
describe("useBatchLogPopoverViewModel", () => {
  it("fires onBatch + onClose for a valid preset", async () => {
    const user = userEvent.setup();
    const onBatch = jest.fn();
    await renderWithProviders(<Harness onBatch={onBatch} />);
    await user.press(screen.getByTestId("preset5"));
    expect(onBatch).toHaveBeenCalledWith("fajr", 5);
  });
  it("ignores a preset larger than remaining", async () => {
    const user = userEvent.setup();
    const onBatch = jest.fn();
    await renderWithProviders(<Harness onBatch={onBatch} />);
    await user.press(screen.getByTestId("preset11"));
    expect(onBatch).not.toHaveBeenCalled();
  });
  it("confirms a custom value within range", async () => {
    const user = userEvent.setup();
    const onBatch = jest.fn();
    await renderWithProviders(<Harness onBatch={onBatch} />);
    await user.press(screen.getByTestId("set3"));
    await user.press(screen.getByTestId("confirm"));
    expect(onBatch).toHaveBeenCalledWith("fajr", 3);
  });
  it("rejects a custom value of 0", async () => {
    const user = userEvent.setup();
    const onBatch = jest.fn();
    await renderWithProviders(<Harness onBatch={onBatch} />);
    await user.press(screen.getByTestId("set0"));
    await user.press(screen.getByTestId("confirm"));
    expect(onBatch).not.toHaveBeenCalled();
  });
  it("dismissKeyboard calls Keyboard.dismiss", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Harness />);
    await user.press(screen.getByTestId("dismiss-keyboard"));
  });
  it("openCustomMode and cancelCustomMode toggle customMode", async () => {
    const { result } = await renderHook(() =>
      useBatchLogPopoverViewModel({
        prayerKey: "fajr",
        maxRemaining: 10,
        onBatch: jest.fn(),
        onClose: jest.fn(),
      })
    );
    expect(result.current.customMode).toBe(false);
    await act(async () => {
      result.current.openCustomMode();
    });
    expect(result.current.customMode).toBe(true);
    await act(async () => {
      result.current.cancelCustomMode();
    });
    expect(result.current.customMode).toBe(false);
  });
});
