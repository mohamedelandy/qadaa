/** @format */
/**
 * Tests for notification-tap deep linking.
 */
import { renderHook, act } from "@testing-library/react-native";
import {
  REMINDER_ROUTE,
  reminderRouteFor,
  useNotificationDeepLink,
} from "../useNotificationDeepLink";
import * as Notifications from "expo-notifications";

const mockRouter = {
  navigate: jest.fn(),
  replace: jest.fn(),
};
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("expo-notifications", () => ({
  useLastNotificationResponse: jest.fn(),
}));

const mockUseLastNotificationResponse = Notifications.useLastNotificationResponse as jest.Mock;

describe("reminderRouteFor", () => {
  it("maps a response to the reminder route", () => {
    expect(reminderRouteFor({ actionIdentifier: "open" })).toBe(REMINDER_ROUTE);
  });
  it("returns null when there is no response", () => {
    expect(reminderRouteFor(null)).toBeNull();
    expect(reminderRouteFor(undefined)).toBeNull();
  });
});

describe("useNotificationDeepLink", () => {
  beforeEach(() => {
    mockRouter.navigate.mockClear();
    mockRouter.replace.mockClear();
    mockUseLastNotificationResponse.mockReset();
  });

  it("does not navigate if not enabled", async () => {
    mockUseLastNotificationResponse.mockReturnValue({ actionIdentifier: "open" });
    await renderHook(() => useNotificationDeepLink(false));

    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it("does not navigate if there is no notification response", async () => {
    mockUseLastNotificationResponse.mockReturnValue(null);
    await renderHook(() => useNotificationDeepLink(true));

    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it("replaces to the reminder route when there is a notification response and it is enabled", async () => {
    mockUseLastNotificationResponse.mockReturnValue({ actionIdentifier: "open" });
    await renderHook(() => useNotificationDeepLink(true));

    expect(mockRouter.replace).toHaveBeenCalledWith(REMINDER_ROUTE);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it("replaces to the reminder route when response changes dynamically", async () => {
    mockUseLastNotificationResponse.mockReturnValue(null);
    const { rerender } = await renderHook((props: { enabled: boolean }) => useNotificationDeepLink(props.enabled), {
      initialProps: { enabled: true },
    });

    expect(mockRouter.replace).not.toHaveBeenCalled();

    // Simulate response arriving
    mockUseLastNotificationResponse.mockReturnValue({ actionIdentifier: "open" });
    await act(async () => {
        await rerender({ enabled: true });
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(REMINDER_ROUTE);
    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
  });

  it("replaces to the reminder route when enabled state changes dynamically", async () => {
    mockUseLastNotificationResponse.mockReturnValue({ actionIdentifier: "open" });
    const { rerender } = await renderHook((props: { enabled: boolean }) => useNotificationDeepLink(props.enabled), {
      initialProps: { enabled: false },
    });

    expect(mockRouter.replace).not.toHaveBeenCalled();

    // Enable the hook
    await act(async () => {
        await rerender({ enabled: true });
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(REMINDER_ROUTE);
    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
  });
});
