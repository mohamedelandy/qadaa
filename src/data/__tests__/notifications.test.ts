/** @format */
/**
 * Unit tests for scheduling, canceling, and permission handling of daily reminders.
 */
jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue("notification-id"),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  SchedulableTriggerInputTypes: { DAILY: "daily" },
}));
import {
  scheduleNotificationAsync,
  cancelAllScheduledNotificationsAsync,
  requestPermissionsAsync,
} from "expo-notifications";
import {
  scheduleDailyNotification,
  cancelAllNotifications,
  requestNotificationPermissions,
} from "../notifications";
const mockedSchedule = scheduleNotificationAsync as jest.Mock;
const mockedCancel = cancelAllScheduledNotificationsAsync as jest.Mock;
const mockedRequest = requestPermissionsAsync as jest.Mock;
describe("data/notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("scheduleDailyNotification cancels existing then schedules daily", async () => {
    await scheduleDailyNotification(9, 15);
    expect(mockedCancel).toHaveBeenCalledTimes(1);
    expect(mockedSchedule).toHaveBeenCalledTimes(1);
    const call = mockedSchedule.mock.calls[0][0];
    expect(call.trigger).toEqual({ type: "daily", hour: 9, minute: 15 });
    expect(call.content.title).toBeTruthy();
    expect(call.content.body).toBeTruthy();
  });
  it("cancelAllNotifications cancels all", async () => {
    await cancelAllNotifications();
    expect(mockedCancel).toHaveBeenCalledTimes(1);
  });
  it("requestNotificationPermissions maps granted", async () => {
    mockedRequest.mockResolvedValueOnce({ granted: false });
    await expect(requestNotificationPermissions()).resolves.toEqual({ granted: false });
    await expect(requestNotificationPermissions()).resolves.toEqual({ granted: true });
  });
});
