/** @format */
/**
 * Unit tests for appBootstrap: language sync bridge, i18n event wiring, and
 * widget-sync startup — with i18n/widget-bridge/createWidgetSync mocked and
 * real zustand stores driven directly.
 */
jest.mock("@data/i18n/i18n", () => ({
  __esModule: true,
  default: {
    language: "en",
    t: jest.fn(() => ["حديث أ", 42, "حديث ب"]),
    on: jest.fn(),
    off: jest.fn(),
    changeLanguage: jest.fn(async () => undefined),
  },
}));
type WidgetSyncInstance = {
  subscribeWidgetSync: jest.Mock;
  pushWidgetPayload: jest.Mock;
};
jest.mock("@services/widgetSync", () => ({
  __esModule: true,
  createWidgetSync: jest.fn((ports: unknown) => {
    const unsubscribe = jest.fn();
    const instance: WidgetSyncInstance & { capturedPorts?: unknown; unsubscribe: jest.Mock } = {
      subscribeWidgetSync: jest.fn(() => unsubscribe),
      pushWidgetPayload: jest.fn(async () => undefined),
      capturedPorts: ports,
      unsubscribe,
    };
    return instance;
  }),
}));
jest.mock("@/modules/widget-bridge", () => ({
  __esModule: true,
  setWidgetData: jest.fn(async () => undefined),
  reloadWidgets: jest.fn(async () => undefined),
}));

import i18n from "@data/i18n/i18n";
const i18nMock = jest.requireMock("@data/i18n/i18n") as {
  default: { t: jest.Mock; on: jest.Mock; off: jest.Mock; changeLanguage: jest.Mock };
};
import { setWidgetData, reloadWidgets } from "@/modules/widget-bridge";
import {
  applyStoredLanguage,
  applyStoredLanguageAsync,
  onAppLanguageChanged,
  startWidgetSync,
} from "../appBootstrap";
import { useSettingsStore } from "@stores/useSettingsStore";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useGamificationStore } from "@stores/useGamificationStore";

type PortsBag = {
  getSnapshot: () => Record<string, unknown>;
  subscribe: (l: () => void) => () => void;
  push: (payload: unknown) => Promise<void>;
};
type SyncInstanceWithMeta = WidgetSyncInstance & {
  unsubscribe: jest.Mock;
  capturedPorts?: unknown;
};
function firstSyncInstance(): SyncInstanceWithMeta {
  const mod = jest.requireMock("@services/widgetSync") as { createWidgetSync: jest.Mock };
  return mod.createWidgetSync.mock.results[0]?.value as SyncInstanceWithMeta;
}
const syncInstance: SyncInstanceWithMeta = firstSyncInstance();
const capturedPorts = (): PortsBag => (syncInstance.capturedPorts ?? {}) as PortsBag;

describe("appBootstrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    i18nMock.default.t.mockClear();
    useSettingsStore.setState({ language: "ar" });
    usePrayerStore.getState().resetAll();
    useGamificationStore.getState().resetAll();
  });

  describe("applyStoredLanguage", () => {
    it("passes the stored settings language to syncLanguage with the i18n instance", () => {
      const forceRTL = jest.fn();
      const result = applyStoredLanguage(forceRTL);
      expect(i18n.language).toBe("en");
      expect(useSettingsStore.getState().language).toBe("ar");
      expect(typeof result.alreadyMatched).toBe("boolean");
      expect(typeof result.isRtl).toBe("boolean");
    });
  });

  describe("applyStoredLanguageAsync", () => {
    it("awaits the i18n switch to the stored language (boot gate contract)", async () => {
      const forceRTL = jest.fn();
      const result = await applyStoredLanguageAsync(forceRTL);
      // Store state is "ar" (beforeEach) while the i18n mock reports "en".
      expect(i18nMock.default.changeLanguage).toHaveBeenCalledWith("ar");
      expect(result).toEqual({ isRtl: true, alreadyMatched: false });
      expect(forceRTL).toHaveBeenCalledWith(true);
    });

    it("is a no-op when i18n already matches the stored language", async () => {
      useSettingsStore.setState({ language: "en" });
      const forceRTL = jest.fn();
      const result = await applyStoredLanguageAsync(forceRTL);
      expect(i18nMock.default.changeLanguage).not.toHaveBeenCalled();
      expect(result).toEqual({ isRtl: false, alreadyMatched: true });
      expect(forceRTL).toHaveBeenCalledWith(false);
    });
  });

  describe("onAppLanguageChanged", () => {
    it("subscribes to languageChanged and unsubscribes on cleanup", () => {
      const handler = (language: string) => language;
      const unsub = onAppLanguageChanged(handler);
      expect(i18n.on).toHaveBeenCalledWith("languageChanged", handler);
      unsub();
      expect(i18n.off).toHaveBeenCalledWith("languageChanged", handler);
    });
  });

  describe("startWidgetSync", () => {
    it("builds the sync once, subscribes, pushes immediately and returns unsubscribe", () => {
      const unsubscribe = startWidgetSync();
      const instance = syncInstance;
      expect(instance.subscribeWidgetSync).toHaveBeenCalled();
      expect(instance.pushWidgetPayload).toHaveBeenCalled();
      expect(unsubscribe).toBe(syncInstance.unsubscribe);
    });

    it("exposes a snapshot sourcing live stores and sanitizing hadiths to strings", () => {
      startWidgetSync();
      const ports = capturedPorts();
      const snapshot = ports.getSnapshot() as {
        language: string;
        hadiths: string[];
        totalMissedDays: number;
        streak: number;
      };
      expect(snapshot.language).toBe("ar");
      expect(snapshot.hadiths).toEqual(["حديث أ", "حديث ب"]);
      expect(snapshot.totalMissedDays).toBe(usePrayerStore.getState().totalMissedDays);
      expect(snapshot.streak).toBe(useGamificationStore.getState().streak);
    });

    it("push routes payload through setWidgetData then reloadWidgets", async () => {
      startWidgetSync();
      const ports = capturedPorts();
      const payload = { language: "ar" };
      await ports.push(payload);
      expect(setWidgetData).toHaveBeenCalledWith(payload);
      expect(reloadWidgets).toHaveBeenCalled();
    });

    it("snapshots empty hadiths when the translation is not an array", () => {
      i18nMock.default.t.mockReturnValueOnce("not-an-array");
      startWidgetSync();
      const ports = capturedPorts();
      const snapshot = ports.getSnapshot() as { hadiths: string[] };
      expect(snapshot.hadiths).toEqual([]);
    });

    it("subscribes the listener to prayer/gamification stores and language-gated settings", () => {
      startWidgetSync();
      const ports = capturedPorts();
      const listener = jest.fn();
      const unsubscribe = ports.subscribe(listener);

      // Language change triggers the settings-gated listener.
      useSettingsStore.setState({ language: "en" });
      expect(listener).toHaveBeenCalledTimes(1);

      // Non-language settings changes are ignored by the gated listener.
      useSettingsStore.setState({ dailyTarget: 3 });
      expect(listener).toHaveBeenCalledTimes(1);

      // Prayer and gamification changes always trigger.
      usePrayerStore.setState({ totalMissedDays: 1 });
      useGamificationStore.setState({ points: 5 });
      expect(listener).toHaveBeenCalledTimes(3);

      // Unsubscribing stops all three listeners.
      unsubscribe();
      useSettingsStore.setState({ language: "ar" });
      usePrayerStore.setState({ totalMissedDays: 2 });
      useGamificationStore.setState({ points: 6 });
      expect(listener).toHaveBeenCalledTimes(3);
    });
  });
});
