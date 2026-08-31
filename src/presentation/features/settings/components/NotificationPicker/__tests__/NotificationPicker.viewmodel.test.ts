/** @format */
/**
 * Unit tests for the notification picker view model.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("expo-haptics", () => ({
  __esModule: true,
  selectionAsync: jest.fn(),
}));
import { useNotificationPickerViewModel } from "../NotificationPicker.viewmodel";
type PickerProps = {
  currentHour: number;
  currentMinute: number;
  currentAmPm: "AM" | "PM";
  onSave: () => Promise<boolean>;
};
const makeProps = (): PickerProps => ({
  currentHour: 9,
  currentMinute: 0,
  currentAmPm: "AM",
  onSave: jest.fn().mockResolvedValue(true),
});
describe("useNotificationPickerViewModel", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("cycleHour wraps within 1..12", async () => {
    const { result } = await renderHook(() =>
      useNotificationPickerViewModel({ ...makeProps(), currentHour: 12 })
    );
    await act(async () => {
      result.current.cycleHour(1);
    });
    expect(result.current.hour).toBe(1);
    await act(async () => {
      result.current.cycleHour(-1);
    });
    expect(result.current.hour).toBe(12);
  });
  it("handleSave sets saved on success and clears it after delay", async () => {
    const onSave = jest.fn().mockResolvedValue(true);
    const { result } = await renderHook(() =>
      useNotificationPickerViewModel({ ...makeProps(), onSave })
    );
    await act(async () => {
      await result.current.handleSave();
    });
    expect(onSave).toHaveBeenCalled();
    expect(result.current.saved).toBe(true);
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.saved).toBe(false);
  });
  it("handleSave sets error on denial (covers denied branch)", async () => {
    const onSave = jest.fn().mockResolvedValue(false);
    const { result } = await renderHook(() =>
      useNotificationPickerViewModel({ ...makeProps(), onSave })
    );
    await act(async () => {
      await result.current.handleSave();
    });
    expect(result.current.error).toBe("settings.notificationDenied");
  });
  it("handleSave swallows a throwing onSave and leaves no feedback state", async () => {
    const onSave = jest.fn().mockRejectedValue(new Error("permission flow crashed"));
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const { result } = await renderHook(() =>
      useNotificationPickerViewModel({ ...makeProps(), onSave })
    );
    await act(async () => {
      await result.current.handleSave();
    });
    expect(warnSpy).toHaveBeenCalled();
    expect(result.current.saved).toBe(false);
    expect(result.current.error).toBeNull();
    warnSpy.mockRestore();
  });
  it("syncs state when props change (covers useEffect)", async () => {
    const { result, rerender } = await renderHook(
      (props: PickerProps) => useNotificationPickerViewModel(props),
      { initialProps: makeProps() }
    );
    await act(async () => {
      rerender({ ...makeProps(), currentHour: 11, currentMinute: 30, currentAmPm: "PM" });
    });
    expect(result.current.hour).toBe(11);
    expect(result.current.minute).toBe(30);
    expect(result.current.amPm).toBe("PM");
  });
});
