/** @format */
/**
 * Component tests for the PrayerRow card incl. batch popover open/close.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  const clampInterpolate = (value: number, input: number[], output: number[]) => {
    const first = input[0] ?? 0;
    const firstOut = output[0] ?? value;
    const lastIn = input[input.length - 1] ?? 1;
    const lastOut = output[output.length - 1] ?? value;
    if (value <= first) return firstOut;
    if (value >= lastIn) return lastOut;
    return value;
  };
  return {
    __esModule: true,
    default: {
      View,
      interpolate: clampInterpolate,
      Extrapolate: { CLAMP: "clamp" },
      createAnimatedComponent: (C: unknown) => C,
    },
    useSharedValue: (init: unknown) => ({ value: init }),
    useAnimatedStyle: (fn: unknown) => (typeof fn === "function" ? (fn as () => unknown)() : fn),
    withSpring: (v: number) => v,
    withTiming: (v: number) => v,
    withDelay: (_d: number, v: number) => v,
    withRepeat: (v: number) => v,
    withSequence: (...anims: unknown[]) => anims[0],
    ReduceMotion: { System: "system", Always: "always", Never: "never" },
    useReducedMotion: () => false,
    interpolate: clampInterpolate,
    interpolateColor: () => "color",
    Easing: {
      out: (e: unknown) => e,
      in: (e: unknown) => e,
      quad: {},
      cubic: {},
      bezier: () => undefined,
    },
    Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  };
});
jest.mock("expo-haptics", () => ({
  __esModule: true,
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
}));
jest.mock("expo-linear-gradient", () => ({
  __esModule: true,
  LinearGradient: "LinearGradient",
}));
import { act, screen, fireEvent, userEvent } from "@testing-library/react-native";
import { useAppStore } from "@stores/useAppStore";
import { PrayerRow } from "../PrayerRow";
import { renderWithProviders } from "@/src/__tests__/testUtils";

function first<T>(items: T[]): T {
  if (items.length === 0) throw new Error("Expected at least one matching element");
  return items[0] as T;
}
jest.mock("lottie-react-native", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => {
      const React = require("react");
      return React.createElement(View, { testID: (props["testID"] as string) ?? "lottie" });
    },
  };
});
jest.mock("@components/Lottie/LottieView", () => ({
  LottieView: (props: Record<string, unknown>) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, {
      testID: (props["testID"] as string) ?? "lottie",
      onAnimationFinish: props["onAnimationFinish"],
    });
  },
}));
jest.mock("../../BatchLogPopover/BatchLogPopover", () => ({
  BatchLogPopover: ({ onClose }: { onClose: () => void }) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, { testID: "batch-close", onPress: onClose });
  },
}));
describe("PrayerRow", () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState());
  });
  const makeProps = (overrides: Record<string, unknown> = {}) => ({
    prayerKey: "fajr" as const,
    emoji: "🌙",
    name: "Fajr",
    recovered: 0,
    remaining: 100,
    isDone: false,
    onLog: jest.fn(),
    onUndo: jest.fn(),
    onBatch: jest.fn(),
    ...overrides,
  });
  it("renders the prayer name and responds to press (covers triggerPop branch)", async () => {
    const user = userEvent.setup();
    const onLog = jest.fn();
    await renderWithProviders(<PrayerRow {...makeProps({ onLog })} />, { direction: "ltr" });
    expect(screen.getByText("Fajr")).toBeOnTheScreen();
    const plusBtns = screen.getAllByText("+1");
    await user.press(first(plusBtns));
    expect(onLog).toHaveBeenCalledWith("fajr");
  });
  it("plays the sparkle after logging and clears it on animation finish", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<PrayerRow {...makeProps()} />, { direction: "ltr" });
    const plusBtns = screen.getAllByText("+1");
    await user.press(first(plusBtns));
    const sparkle = screen.getByTestId("lottie");
    expect(sparkle).toBeOnTheScreen();
    await act(async () => {
      sparkle.props["onAnimationFinish"]?.();
    });
    expect(screen.queryByTestId("lottie")).not.toBeOnTheScreen();
  });
  it("opens the batch popover on long press and closes it (covers showBatch + onClose)", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 0, remaining: 100 })} />, {
      direction: "ltr",
    });
    const plusBtns = screen.getAllByText("+1");
    await act(async () => {
      fireEvent(first(plusBtns), "longPress");
    });
    expect(screen.getByTestId("batch-close")).toBeOnTheScreen();
    await user.press(screen.getByTestId("batch-close"));
  });
  it("renders done state when isDone is true", async () => {
    await renderWithProviders(
      <PrayerRow {...makeProps({ isDone: true, recovered: 100, remaining: 0 })} />
    );
    expect(screen.getByText("✓")).toBeOnTheScreen();
  });
  it("renders the clean row without a per-prayer ring", async () => {
    await renderWithProviders(<PrayerRow {...makeProps()} />);
    expect(screen.getByText("Fajr")).toBeOnTheScreen();
    expect(screen.getByTestId("dashboard-fajr-increment-btn")).toBeOnTheScreen();
  });
  it("renders the progress fill sized to the recovered fraction", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 25, remaining: 75 })} />);
    const fill = screen.getByTestId("dashboard-fajr-progress-fill");
    expect(fill.props["style"]).toEqual(
      expect.arrayContaining([expect.objectContaining({ transform: [{ scaleX: 0.25 }] })])
    );
  });
  it("renders the recovered/remaining status line with clear labels", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 25, remaining: 75 })} />);
    expect(screen.getByText(/25 dashboard.recovered/)).toBeOnTheScreen();
    expect(screen.getByText("dashboard.remaining")).toBeOnTheScreen();
  });
  it("renders an empty progress bar when nothing is recovered", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 0, remaining: 100 })} />);
    const fill = screen.getByTestId("dashboard-fajr-progress-fill");
    expect(fill.props["style"]).toEqual(
      expect.arrayContaining([expect.objectContaining({ transform: [{ scaleX: 0 }] })])
    );
  });
  it("hides the undo button when the prayer was not logged today", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 3, loggedToday: false })} />);
    expect(screen.queryByTestId("dashboard-fajr-undo-btn")).not.toBeOnTheScreen();
  });
  it("shows the undo button only for prayers logged today", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 3, loggedToday: true })} />);
    expect(screen.getByTestId("dashboard-fajr-undo-btn")).toBeOnTheScreen();
  });

  // ── remaining / recovered / progress-label testIDs ──────────────────────

  it("renders the remaining testID when remaining > 0", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 2, remaining: 8 })} />);
    expect(screen.getByTestId("dashboard-fajr-remaining")).toBeOnTheScreen();
  });

  it("hides the remaining testID when remaining is 0", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 10, remaining: 0 })} />);
    expect(screen.queryByTestId("dashboard-fajr-remaining")).not.toBeOnTheScreen();
  });

  it("renders the recovered testID when recovered > 0", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 3, remaining: 7 })} />);
    expect(screen.getByTestId("dashboard-fajr-recovered")).toBeOnTheScreen();
  });

  it("hides the recovered testID when recovered is 0", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 0, remaining: 10 })} />);
    expect(screen.queryByTestId("dashboard-fajr-recovered")).not.toBeOnTheScreen();
  });

  it("renders the progress-label with the correct percentage", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 25, remaining: 75 })} />);
    const label = screen.getByTestId("dashboard-fajr-progress-label");
    expect(label).toBeOnTheScreen();
    // 25 / (25+75) = 25% → children is [25, "%"]
    expect(label.props["children"]).toEqual([25, "%"]);
  });

  it("progress-label shows 100% when fully recovered", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 10, remaining: 0 })} />);
    const label = screen.getByTestId("dashboard-fajr-progress-label");
    expect(label.props["children"]).toEqual([100, "%"]);
  });

  it("progress-label shows 0% when nothing is recovered", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 0, remaining: 10 })} />);
    const label = screen.getByTestId("dashboard-fajr-progress-label");
    expect(label.props["children"]).toEqual([0, "%"]);
  });

  it("progress-label shows 20% for 1 recovered / 4 remaining", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 1, remaining: 4 })} />);
    expect(screen.getByTestId("dashboard-fajr-progress-label").props["children"]).toEqual([
      20,
      "%",
    ]);
  });

  it("progress-label shows 60% for 3 recovered / 2 remaining", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 3, remaining: 2 })} />);
    expect(screen.getByTestId("dashboard-fajr-progress-label").props["children"]).toEqual([
      60,
      "%",
    ]);
  });

  it("progress-label shows 80% for 4 recovered / 1 remaining", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 4, remaining: 1 })} />);
    expect(screen.getByTestId("dashboard-fajr-progress-label").props["children"]).toEqual([
      80,
      "%",
    ]);
  });

  it("remaining testID renders the t() output for the remaining key", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 2, remaining: 8 })} />);
    const remaining = screen.getByTestId("dashboard-fajr-remaining");
    expect(remaining).toBeOnTheScreen();
    // Mock t() returns the key itself, so the text is "dashboard.remaining"
    expect(remaining.props["children"]).toBe("dashboard.remaining");
  });

  it("recovered testID renders the count and t() output for the recovered key", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 7, remaining: 3 })} />);
    const recovered = screen.getByTestId("dashboard-fajr-recovered");
    expect(recovered).toBeOnTheScreen();
    // Mock t() returns the key itself, so text is "7 dashboard.recovered"
    expect(recovered.props["children"]).toEqual([7, " ", "dashboard.recovered"]);
  });

  it("both remaining and recovered testIDs visible when partial recovery", async () => {
    await renderWithProviders(<PrayerRow {...makeProps({ recovered: 5, remaining: 5 })} />);
    expect(screen.getByTestId("dashboard-fajr-recovered")).toBeOnTheScreen();
    expect(screen.getByTestId("dashboard-fajr-remaining")).toBeOnTheScreen();
  });

  it("remaining testID uses a different prayer key", async () => {
    await renderWithProviders(
      <PrayerRow {...makeProps({ prayerKey: "dhuhr", recovered: 1, remaining: 9 })} />
    );
    expect(screen.getByTestId("dashboard-dhuhr-remaining")).toBeOnTheScreen();
    expect(screen.queryByTestId("dashboard-fajr-remaining")).not.toBeOnTheScreen();
  });
});
