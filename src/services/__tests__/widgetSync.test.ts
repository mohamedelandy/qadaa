/** @format */
/**
 * Unit tests for the createWidgetSync factory: payload push, failure swallowing,
 * debounced fan-out and unsubscribe — all through injected fake ports (no jest.mock).
 */
import { createWidgetSync } from "@services/widgetSync";
import { buildWidgetPayload, type WidgetPayloadInput } from "@domain/widget";

const SNAPSHOT: WidgetPayloadInput = {
  prayers: {
    fajr: { recovered: 1 },
    dhuhr: { recovered: 2 },
    asr: { recovered: 3 },
    maghrib: { recovered: 4 },
    isha: { recovered: 5 },
  },
  todayPrayers: { fajr: true },
  totalMissedDays: 14,
  streak: 7,
  language: "ar",
  hadiths: ["حديث أ", "حديث ب"],
};

const makePorts = () => {
  const listeners: Array<() => void> = [];
  return {
    ports: {
      getSnapshot: jest.fn(() => SNAPSHOT),
      subscribe: jest.fn((l: () => void) => {
        listeners.push(l);
        return () => {
          listeners.splice(listeners.indexOf(l), 1);
        };
      }),
      push: jest.fn(async () => undefined),
    },
    emit: () => listeners.forEach((l) => l()),
  };
};

afterEach(() => {
  jest.useRealTimers();
});

test("pushWidgetPayload builds and pushes a payload", async () => {
  const { ports } = makePorts();
  const sync = createWidgetSync(ports);
  await sync.pushWidgetPayload();
  expect(ports.push).toHaveBeenCalledTimes(1); // arg === buildWidgetPayload(SNAPSHOT)
  expect(ports.push).toHaveBeenCalledWith(buildWidgetPayload(SNAPSHOT));
});

test("pushWidgetPayload swallows port failures", async () => {
  const { ports } = makePorts();
  ports.push.mockRejectedValueOnce(new Error("native boom"));
  const warn = jest.spyOn(require("../logger").Logger, "warn").mockImplementation(() => {});
  await expect(createWidgetSync(ports).pushWidgetPayload()).resolves.toBeUndefined();
  expect(warn).toHaveBeenCalled();
  warn.mockRestore();
});

test("subscribe fans changes out through debounced pushes", () => {
  jest.useFakeTimers();
  const { ports, emit } = makePorts();
  const sync = createWidgetSync(ports);
  const unsubscribe = sync.subscribeWidgetSync();
  emit();
  emit();
  emit();
  jest.advanceTimersByTime(300);
  expect(ports.push).toHaveBeenCalledTimes(1); // debounced, not 3x
  unsubscribe();
  emit();
  jest.advanceTimersByTime(300);
  expect(ports.push).toHaveBeenCalledTimes(1); // unsubscribed
});

test("pushWidgetPayload swallows port failures silently in production", async () => {
  const originalDev = global.__DEV__;
  global.__DEV__ = false;

  const { ports } = makePorts();
  ports.push.mockRejectedValueOnce(new Error("native boom"));
  const warn = jest.spyOn(require("../logger").Logger, "warn").mockImplementation(() => {});

  await expect(createWidgetSync(ports).pushWidgetPayload()).resolves.toBeUndefined();

  expect(warn).not.toHaveBeenCalled();

  warn.mockRestore();
  global.__DEV__ = originalDev;
});

test("scheduleWidgetPush resets existing timeout", () => {
  jest.useFakeTimers();
  const { ports } = makePorts();
  const sync = createWidgetSync(ports);

  sync.scheduleWidgetPush();
  jest.advanceTimersByTime(150); // Advance half the time
  sync.scheduleWidgetPush(); // Resets the timer
  jest.advanceTimersByTime(150);

  // The original timer would have fired now, but it was reset
  expect(ports.push).not.toHaveBeenCalled();

  jest.advanceTimersByTime(150);
  // Now the reset timer should fire
  expect(ports.push).toHaveBeenCalledTimes(1);
});

test("subscribeWidgetSync unsubscribe clears pending push", () => {
  jest.useFakeTimers();
  const { ports, emit } = makePorts();
  const sync = createWidgetSync(ports);
  const unsubscribe = sync.subscribeWidgetSync();

  emit(); // Triggers scheduleWidgetPush
  jest.advanceTimersByTime(150);

  unsubscribe(); // Should clear the timer
  jest.advanceTimersByTime(150);

  expect(ports.push).not.toHaveBeenCalled();
});
