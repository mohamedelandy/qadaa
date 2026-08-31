/** @format */
/**
 * Unit tests for the tab bar minimize state machine driven by scroll events.
 */
import { render, renderHook, act } from "@testing-library/react-native";
const mockStoreState: {
  progress: {
    value: number;
  };
  target: {
    value: number;
  };
} = {
  progress: { value: 0 },
  target: { value: 0 },
};
jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  useSharedValue: (init: number) => ({ value: init }),
  withSpring: (toValue: number) => toValue,
  useAnimatedScrollHandler: (handlers: object) => handlers,
  useAnimatedStyle: (t: unknown) => t,
  makeMutable: (init: number) => ({ value: init }),
}));
jest.mock("../tab-bar-store", () => ({
  useTabBarStore: (selector?: unknown) =>
    typeof selector === "function" ? selector(mockStoreState) : mockStoreState,
}));
import { setMinimized, useTabBarMinimized, useMinimizeOnScroll } from "../minimize";
type ScrollEvent = {
  contentOffset: {
    y: number;
  };
  contentSize: {
    height: number;
  };
  layoutMeasurement: {
    height: number;
  };
};
let scrollHandler:
  | {
      onScroll: (e: ScrollEvent) => void;
    }
  | undefined;
function MinimizeHarness() {
  scrollHandler = useMinimizeOnScroll() as unknown as {
    onScroll: (e: ScrollEvent) => void;
  };
  return null;
}
function fireScroll(event: ScrollEvent) {
  act(() => {
    scrollHandler?.onScroll(event);
  });
}
type MockState = {
  progress: {
    value: number;
  };
  target: {
    value: number;
  };
};
describe("minimize state machine", () => {
  beforeEach(() => {
    mockStoreState.progress.value = 0;
    mockStoreState.target.value = 0;
  });
  it("useTabBarMinimized returns the progress shared value", async () => {
    const { result } = await renderHook(() => useTabBarMinimized());
    expect(result.current).toBeDefined();
  });
  it("scrolling down past the top threshold minimizes the bar", async () => {
    await render(<MinimizeHarness />);
    fireScroll({
      contentOffset: { y: 30 },
      contentSize: { height: 1000 },
      layoutMeasurement: { height: 500 },
    });
    expect(mockStoreState.target.value).toBe(1);
    expect(mockStoreState.progress.value).toBe(1);
  });
  it("scrolling up expands the bar again", async () => {
    mockStoreState.target.value = 1;
    mockStoreState.progress.value = 1;
    await render(<MinimizeHarness />);
    fireScroll({
      contentOffset: { y: 18 },
      contentSize: { height: 1000 },
      layoutMeasurement: { height: 500 },
    });
    fireScroll({
      contentOffset: { y: 20 },
      contentSize: { height: 1000 },
      layoutMeasurement: { height: 500 },
    });
    expect(mockStoreState.target.value).toBe(0);
    expect(mockStoreState.progress.value).toBe(0);
  });
  it("scrolling up while below the top threshold expands via dy", async () => {
    await render(<MinimizeHarness />);
    fireScroll({
      contentOffset: { y: 60 },
      contentSize: { height: 1000 },
      layoutMeasurement: { height: 500 },
    });
    expect(mockStoreState.target.value).toBe(1);
    fireScroll({
      contentOffset: { y: 40 },
      contentSize: { height: 1000 },
      layoutMeasurement: { height: 500 },
    });
    expect(mockStoreState.target.value).toBe(0);
  });
  it("near the top always expands even while scrolling down", async () => {
    mockStoreState.target.value = 1;
    mockStoreState.progress.value = 1;
    await render(<MinimizeHarness />);
    fireScroll({
      contentOffset: { y: 10 },
      contentSize: { height: 1000 },
      layoutMeasurement: { height: 500 },
    });
    expect(mockStoreState.target.value).toBe(0);
  });
  it("clamps overscroll so rubber-banding cannot flip direction", async () => {
    mockStoreState.target.value = 1;
    mockStoreState.progress.value = 1;
    await render(<MinimizeHarness />);
    fireScroll({
      contentOffset: { y: -50 },
      contentSize: { height: 1000 },
      layoutMeasurement: { height: 500 },
    });
    expect(mockStoreState.target.value).toBe(0);
  });
  it("setMinimized updates target and progresses toward next", () => {
    const state: MockState = { progress: { value: 0 }, target: { value: 0 } };
    act(() => {
      setMinimized(state as never, 1);
    });
    expect(state.target.value).toBe(1);
    expect(state.progress.value).toBe(1);
  });
  it("setMinimized is a no-op when already heading to next", () => {
    const state: MockState = { progress: { value: 1 }, target: { value: 1 } };
    act(() => {
      setMinimized(state as never, 1);
    });
    expect(state.target.value).toBe(1);
    expect(state.progress.value).toBe(1);
  });
});
