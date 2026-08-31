/** @format */
/**
 * Unit tests for useSettingsNotification 12h/24h time parsing, conversion, and scheduling.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("@data/notifications", () => ({
  scheduleDailyNotification: jest.fn().mockResolvedValue("id"),
  requestNotificationPermissions: jest.fn().mockResolvedValue({ granted: true }),
}));
import { useSettingsStore } from "@stores/useSettingsStore";
import { useSettingsNotification } from "../useSettingsNotification";
describe("useSettingsNotification", () => {
  beforeEach(() => {
    useSettingsStore.setState(useSettingsStore.getInitialState());
  });
  it("defaults to 9:00 AM when no time is set", async () => {
    const { result } = await renderHook(() => useSettingsNotification());
    expect(result.current.notificationHour).toBe(9);
    expect(result.current.notificationMinute).toBe(0);
    expect(result.current.notificationAmPm).toBe("AM");
  });
  it("parses a morning time (h < 12)", async () => {
    useSettingsStore.setState({ notificationTime: "07:30" });
    const { result } = await renderHook(() => useSettingsNotification());
    expect(result.current.notificationHour).toBe(7);
    expect(result.current.notificationMinute).toBe(30);
    expect(result.current.notificationAmPm).toBe("AM");
  });
  it("parses midnight (h === 0) as 12 AM", async () => {
    useSettingsStore.setState({ notificationTime: "00:15" });
    const { result } = await renderHook(() => useSettingsNotification());
    expect(result.current.notificationHour).toBe(12);
    expect(result.current.notificationAmPm).toBe("AM");
  });
  it("parses noon (h === 12) as 12 PM", async () => {
    useSettingsStore.setState({ notificationTime: "12:00" });
    const { result } = await renderHook(() => useSettingsNotification());
    expect(result.current.notificationHour).toBe(12);
    expect(result.current.notificationAmPm).toBe("PM");
  });
  it("parses afternoon (h > 12) as PM", async () => {
    useSettingsStore.setState({ notificationTime: "15:45" });
    const { result } = await renderHook(() => useSettingsNotification());
    expect(result.current.notificationHour).toBe(3);
    expect(result.current.notificationMinute).toBe(45);
    expect(result.current.notificationAmPm).toBe("PM");
  });
  it("setNotificationTime converts 12 AM hour to 00:00", async () => {
    const { result } = await renderHook(() => useSettingsNotification());
    let ok = false;
    await act(async () => {
      ok = await result.current.setNotificationTime(12, 5, "AM");
    });
    expect(ok).toBe(true);
    expect(useSettingsStore.getState().notificationTime).toBe("00:05");
  });
  it("setNotificationTime converts PM hour to 24h", async () => {
    const { result } = await renderHook(() => useSettingsNotification());
    await act(async () => {
      await result.current.setNotificationTime(3, 30, "PM");
    });
    expect(useSettingsStore.getState().notificationTime).toBe("15:30");
  });
  it("setNotificationTime keeps 12 PM as 12:xx", async () => {
    const { result } = await renderHook(() => useSettingsNotification());
    await act(async () => {
      await result.current.setNotificationTime(12, 0, "PM");
    });
    expect(useSettingsStore.getState().notificationTime).toBe("12:00");
  });
  it("setNotificationTime handles malformed time string without colon", async () => {
    const { result } = await renderHook(() => useSettingsNotification());
    let ok = false;
    await act(async () => {
      ok = await result.current.setNotificationTime(9, 0, "AM");
    });
    expect(ok).toBe(true);
  });
  it("handles time string without minutes (covers parts[1] fallback)", async () => {
    useSettingsStore.setState({ notificationTime: "9" });
    const { result } = await renderHook(() => useSettingsNotification());
    expect(result.current.notificationHour).toBe(9);
    expect(result.current.notificationMinute).toBe(0);
  });
  it("handles falsy notificationTime (covers if branch)", async () => {
    useSettingsStore.setState({ notificationTime: "" });
    const { result } = await renderHook(() => useSettingsNotification());
    expect(result.current.notificationHour).toBe(9);
    expect(result.current.notificationMinute).toBe(0);
    expect(result.current.notificationAmPm).toBe("AM");
  });
  it("setNotificationTime returns false when scheduling fails", async () => {
    const notifications = jest.requireMock("@data/notifications") as {
      requestNotificationPermissions: jest.Mock;
    };
    notifications.requestNotificationPermissions.mockResolvedValue({ granted: false });
    const { result } = await renderHook(() => useSettingsNotification());
    let ok = false;
    await act(async () => {
      ok = await result.current.setNotificationTime(9, 0, "AM");
    });
    expect(ok).toBe(false);
  });
});
