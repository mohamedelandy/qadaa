/** @format */
/**
 * Bootstrap adapters for the route-level composition root (app/_layout).
 * Centralizes the only sanctioned imports of i18n and widget-sync services
 * so route files never touch data/services layers directly.
 */
import i18n from "@data/i18n/i18n";
import { AppState } from "react-native";
import { createWidgetSync } from "@services/widgetSync";
import { buildWidgetPayload, type WidgetPayloadInput } from "@domain/widget";
import { setWidgetData, reloadWidgets } from "@/modules/widget-bridge";
import { useSettingsStore } from "@stores/useSettingsStore";
import { usePrayerStore } from "@stores/usePrayerStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import {
  syncLanguage,
  syncLanguageAsync,
  type LanguageSync,
} from "@presentation/hooks/rootOrchestration";

export function applyStoredLanguage(forceRTL: (isRTL: boolean) => void): LanguageSync {
  return syncLanguage(useSettingsStore.getState().language, i18n, forceRTL);
}

/**
 * Boot-time variant: awaits the i18n switch so the route can hold the first
 * paint until the app renders in the persisted language. Call only after the
 * settings store has rehydrated (see app/_layout boot gating).
 */
export function applyStoredLanguageAsync(
  forceRTL: (isRTL: boolean) => void
): Promise<LanguageSync> {
  return syncLanguageAsync(useSettingsStore.getState().language, i18n, forceRTL);
}

export function onAppLanguageChanged(handler: (language: string) => void): () => void {
  i18n.on("languageChanged", handler);
  return () => {
    i18n.off("languageChanged", handler);
  };
}

function readHadiths(): string[] {
  const raw: unknown = i18n.t("hadiths", { returnObjects: true });
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string");
}

const widgetPorts = {
  getSnapshot: (): WidgetPayloadInput => ({
    prayers: usePrayerStore.getState().prayers,
    todayPrayers: usePrayerStore.getState().todayPrayers,
    totalMissedDays: usePrayerStore.getState().totalMissedDays,
    streak: useGamificationStore.getState().streak,
    language: useSettingsStore.getState().language,
    hadiths: readHadiths(),
  }),
  subscribe: (listener: () => void): (() => void) => {
    const unsubs = [
      usePrayerStore.subscribe(listener),
      useGamificationStore.subscribe(listener),
      useSettingsStore.subscribe((state, prevState) => {
        if (state.language !== prevState.language) {
          listener();
        }
      }),
    ];
    return () => unsubs.forEach((u) => u());
  },
  push: async (payload: ReturnType<typeof buildWidgetPayload>) => {
    await setWidgetData(payload);
    await reloadWidgets();
  },
};

const widgetSync = createWidgetSync(widgetPorts);

export function startWidgetSync(): () => void {
  const unsubscribe = widgetSync.subscribeWidgetSync();
  void widgetSync.pushWidgetPayload();
  return unsubscribe;
}

export function refreshDayIfNeeded(): boolean {
  const rolled = usePrayerStore.getState().refreshDay();
  if (rolled) {
    useGamificationStore.getState().updateStreak();
    void widgetSync.pushWidgetPayload();
  }
  return rolled;
}

export function installDayRolloverWatcher(): () => void {
  let unsubHydration: (() => void) | undefined;
  if (usePrayerStore.persist.hasHydrated()) {
    refreshDayIfNeeded();
  } else {
    unsubHydration = usePrayerStore.persist.onFinishHydration(() => {
      refreshDayIfNeeded();
    });
  }
  const sub = AppState.addEventListener("change", (next) => {
    if (next === "active") refreshDayIfNeeded();
  });
  return () => {
    sub.remove();
    unsubHydration?.();
  };
}
