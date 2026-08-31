/** @format */
/**
 * Unit tests for the null-rendering notification tap bridge: it must mount
 * the deep-link hook with its active flag while rendering nothing itself.
 */
jest.mock("@hooks/useNotificationDeepLink", () => ({
  __esModule: true,
  useNotificationDeepLink: jest.fn(),
}));
import { render } from "@testing-library/react-native";
import { NotificationTapBridge } from "../NotificationTapBridge";
const { useNotificationDeepLink } = jest.requireMock("@hooks/useNotificationDeepLink") as {
  useNotificationDeepLink: jest.Mock;
};
describe("NotificationTapBridge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("mounts the deep-link hook with active=true and renders nothing", async () => {
    const { toJSON } = await render(<NotificationTapBridge active />);
    expect(toJSON()).toBeNull();
    expect(useNotificationDeepLink).toHaveBeenCalledTimes(1);
    expect(useNotificationDeepLink).toHaveBeenCalledWith(true);
  });
  it("still mounts the hook when inactive, passing the flag through untouched", async () => {
    const { toJSON } = await render(<NotificationTapBridge active={false} />);
    expect(toJSON()).toBeNull();
    expect(useNotificationDeepLink).toHaveBeenCalledTimes(1);
    expect(useNotificationDeepLink).toHaveBeenCalledWith(false);
  });
});
