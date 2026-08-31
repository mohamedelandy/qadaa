/** @format */
/**
 * Unit tests for day rollover: the prayer store's refreshDay action and
 * appBootstrap's refreshDayIfNeeded streak/widget side effects — with
 * i18n/widget-bridge mocked and real zustand stores driven directly.
 */
jest.mock("@data/i18n/i18n", () => ({
  __esModule: true,
  default: {
    language: "en",
    t: jest.fn(() => []),
    on: jest.fn(),
    off: jest.fn(),
    changeLanguage: jest.fn(async () => undefined),
  },
}));
jest.mock("@/modules/widget-bridge", () => ({
  __esModule: true,
  setWidgetData: jest.fn(async () => undefined),
  reloadWidgets: jest.fn(async () => undefined),
}));

import { installDayRolloverWatcher, refreshDayIfNeeded } from "../../appBootstrap";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { toLocalISODate, addDays } from "@domain/date";

const today = (): string => toLocalISODate(new Date());
const yesterday = (): string => toLocalISODate(addDays(new Date(), -1));

describe("day rollover", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("refreshDay resets today flags when stored date is yesterday", () => {
    usePrayerStore.setState({ todayDate: yesterday(), todayPrayers: { fajr: true } });
    expect(usePrayerStore.getState().refreshDay()).toBe(true);
    const state = usePrayerStore.getState();
    expect(state.todayPrayers).toEqual({});
    expect(state.todayDate).toBe(today());
  });

  test("refreshDay is a no-op when stored date is already today", () => {
    usePrayerStore.setState({ todayDate: today(), todayPrayers: { fajr: true } });
    expect(usePrayerStore.getState().refreshDay()).toBe(false);
    const state = usePrayerStore.getState();
    expect(state.todayPrayers).toEqual({ fajr: true });
    expect(state.todayDate).toBe(today());
  });

  test("first launch (stored date null) is not a rollover and must not fabricate a streak", () => {
    // Fresh install: no stored date. refreshDay initializes today's flags but
    // must report NO rollover, otherwise refreshDayIfNeeded would call
    // updateStreak and fabricate streak=1 / loggedDates=[today] before any
    // prayer is ever logged (regression: stats empty state showed populated).
    usePrayerStore.setState({
      todayDate: null,
      todayPrayers: {},
      todayLogPoints: {},
      todayUnits: {},
    });
    expect(usePrayerStore.getState().refreshDay()).toBe(false);
    expect(usePrayerStore.getState().todayDate).toBe(today());
    // refreshDayIfNeeded skips updateStreak entirely on first launch
    const updateStreak = jest.spyOn(useGamificationStore.getState(), "updateStreak");
    expect(refreshDayIfNeeded()).toBe(false);
    expect(updateStreak).not.toHaveBeenCalled();
    expect(useGamificationStore.getState().streak).toBe(0);
    expect(useGamificationStore.getState().loggedDates).toEqual([]);
  });

  test("refreshDayIfNeeded calls updateStreak exactly once on rollover", () => {
    usePrayerStore.setState({ todayDate: yesterday() });
    const updateStreak = jest.spyOn(useGamificationStore.getState(), "updateStreak");
    expect(refreshDayIfNeeded()).toBe(true);
    expect(updateStreak).toHaveBeenCalledTimes(1);
  });

  test("refreshDayIfNeeded skips updateStreak when no rollover happened", () => {
    usePrayerStore.setState({ todayDate: today() });
    const updateStreak = jest.spyOn(useGamificationStore.getState(), "updateStreak");
    expect(refreshDayIfNeeded()).toBe(false);
    expect(updateStreak).not.toHaveBeenCalled();
  });
});

describe("installDayRolloverWatcher hydration gating", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePrayerStore.setState(usePrayerStore.getInitialState());
    useGamificationStore.setState(useGamificationStore.getInitialState());
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("defers rollover check until prayer-store hydration completes", () => {
    usePrayerStore.setState({ todayDate: yesterday(), todayPrayers: { fajr: true } });
    const hasHydratedSpy = jest.spyOn(usePrayerStore.persist, "hasHydrated").mockReturnValue(false);
    let finishHydration: () => void = () => {};
    const onFinishSpy = jest
      .spyOn(usePrayerStore.persist, "onFinishHydration")
      .mockImplementation((cb) => {
        finishHydration = cb as () => void;
        return () => {};
      });

    const uninstall = installDayRolloverWatcher();

    // Before hydration: yesterday's data still intact (no premature roll)
    expect(usePrayerStore.getState().todayDate).not.toBe(today());

    finishHydration();

    // After hydration: rolled to today
    expect(usePrayerStore.getState().todayDate).toBe(today());
    expect(usePrayerStore.getState().todayPrayers).toEqual({});

    uninstall();
    hasHydratedSpy.mockRestore();
    onFinishSpy.mockRestore();
  });

  test("runs the rollover check immediately when hydration already completed", () => {
    usePrayerStore.setState({ todayDate: yesterday(), todayPrayers: { fajr: true } });
    const hasHydratedSpy = jest.spyOn(usePrayerStore.persist, "hasHydrated").mockReturnValue(true);
    const onFinishSpy = jest.spyOn(usePrayerStore.persist, "onFinishHydration");

    const uninstall = installDayRolloverWatcher();

    expect(onFinishSpy).not.toHaveBeenCalled();
    expect(usePrayerStore.getState().todayDate).toBe(today());
    expect(usePrayerStore.getState().todayPrayers).toEqual({});

    uninstall();
    hasHydratedSpy.mockRestore();
  });

  test("rolls over when the app returns to the active state", () => {
    usePrayerStore.setState({ todayDate: yesterday(), todayPrayers: { fajr: true } });
    const { AppState } = require("react-native") as {
      AppState: { addEventListener: (...args: unknown[]) => { remove: () => void } };
    };
    // Keep hydration from rolling the day at install time so the AppState
    // listener is the only thing that can trigger the rollover.
    const hasHydratedSpy = jest.spyOn(usePrayerStore.persist, "hasHydrated").mockReturnValue(false);
    const onFinishSpy = jest
      .spyOn(usePrayerStore.persist, "onFinishHydration")
      .mockReturnValue(() => undefined);
    const addListenerSpy = jest.spyOn(AppState, "addEventListener");

    const uninstall = installDayRolloverWatcher();
    const firstCall = addListenerSpy.mock.calls[0];
    if (!firstCall) throw new Error("AppState listener was never registered");
    const handler = firstCall[1] as (next: string) => void;

    // A non-active transition must not trigger the rollover.
    handler("background");
    expect(usePrayerStore.getState().todayDate).toBe(yesterday());

    // Returning to active rolls the day and clears the today flags.
    handler("active");
    expect(usePrayerStore.getState().todayDate).toBe(today());
    expect(usePrayerStore.getState().todayPrayers).toEqual({});

    uninstall();
    hasHydratedSpy.mockRestore();
    onFinishSpy.mockRestore();
    addListenerSpy.mockRestore();
  });
});
