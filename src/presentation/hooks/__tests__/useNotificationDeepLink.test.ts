/** @format */
/**
 * Tests for notification-tap deep linking.
 *
 * `reminderRouteFor` is pure and covered exhaustively; the warm-tap wiring
 * is verified through one integration render (listener registration +
 * navigate), which is the path React schedules synchronously.
 */
import { renderHook, act } from "@testing-library/react-native";
import {
  REMINDER_ROUTE,
  reminderRouteFor,
  useNotificationDeepLink,
} from "../useNotificationDeepLink";

const mockRouter = {
  navigate: jest.fn(),
  replace: jest.fn(),
};
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));
jest.mock("expo-notifications", () => ({
  addNotificationResponseReceivedListener: jest.fn(),
  getLastNotificationResponse: jest.fn().mockReturnValue(null),
}));
const Notifications = jest.requireMock("expo-notifications") as {
  addNotificationResponseReceivedListener: jest.Mock;
  getLastNotificationResponse: jest.Mock;
};
const remove = jest.fn();

describe("reminderRouteFor", () => {
  it("maps a cold-start response to the reminder route", () => {
    expect(reminderRouteFor({ actionIdentifier: "open" })).toBe(REMINDER_ROUTE);
  });
  it("returns null when there is no launch response", () => {
    expect(reminderRouteFor(null)).toBeNull();
    expect(reminderRouteFor(undefined)).toBeNull();
  });
});

describe("useNotificationDeepLink", () => {
  beforeEach(() => {
    mockRouter.navigate.mockClear();
    mockRouter.replace.mockClear();
    Notifications.addNotificationResponseReceivedListener.mockReset();
    Notifications.addNotificationResponseReceivedListener.mockReturnValue({ remove });
  });

  it("registers exactly one warm-tap listener while enabled", async () => {
    const { unmount } = await renderHook(() => useNotificationDeepLink(true));
    await act(async () => {
      await Promise.resolve();
    });
    expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalledTimes(1);
    const tapHandler = Notifications.addNotificationResponseReceivedListener.mock.calls[0][0] as (
      response: unknown
    ) => void;
    await act(async () => {
      tapHandler({ actionIdentifier: "tap" });
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(REMINDER_ROUTE);
    expect(mockRouter.replace).not.toHaveBeenCalled();
    await unmount();
  });

  it("does not register anything when disabled", async () => {
    await renderHook(() => useNotificationDeepLink(false));
    await act(async () => {
      await Promise.resolve();
    });
    expect(Notifications.addNotificationResponseReceivedListener).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("navigates for every received response payload (route decision)", () => {
    [true, false].forEach((truthy) => {
      expect(reminderRouteFor(truthy ? {} : null)).toBe(truthy ? REMINDER_ROUTE : null);
    });
  });

  it("replaces to the reminder route on a cold-start notification response", async () => {
    Notifications.getLastNotificationResponse.mockReturnValueOnce({ actionIdentifier: "open" });
    await renderHook(() => useNotificationDeepLink(true));
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockRouter.replace).toHaveBeenCalledWith(REMINDER_ROUTE);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it("does not replace when there is no cold-start response", async () => {
    Notifications.getLastNotificationResponse.mockReturnValueOnce(null);
    await renderHook(() => useNotificationDeepLink(true));
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
