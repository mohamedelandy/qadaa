/** @format */
/**
 * Debounced sync of prayer/gamification/settings snapshots into native home-screen widgets.
 * Pure orchestration over injected ports (DIP): concrete store/i18n/native wiring
 * lives at the composition root in src/appBootstrap.ts.
 */
import { buildWidgetPayload, type WidgetPayload, type WidgetPayloadInput } from "@domain/widget";
const PUSH_DELAY_MS = 300;

export interface WidgetSyncPorts {
  getSnapshot(): WidgetPayloadInput;
  subscribe(listener: () => void): () => void;
  push(payload: WidgetPayload): Promise<void>;
}

export function createWidgetSync(ports: WidgetSyncPorts): {
  pushWidgetPayload(): Promise<void>;
  scheduleWidgetPush(): void;
  subscribeWidgetSync(): () => void;
} {
  let pendingTimeout: ReturnType<typeof setTimeout> | null = null;
  function clearPendingPush(): void {
    if (pendingTimeout !== null) {
      clearTimeout(pendingTimeout);
      pendingTimeout = null;
    }
  }
  async function pushWidgetPayload(): Promise<void> {
    try {
      const payload = buildWidgetPayload(ports.getSnapshot());
      await ports.push(payload);
    } catch {
      if (__DEV__) {
        console.warn("[widgetSync] sync failed");
      }
    }
  }
  function scheduleWidgetPush(): void {
    clearPendingPush();
    pendingTimeout = setTimeout(() => {
      void pushWidgetPayload();
      pendingTimeout = null;
    }, PUSH_DELAY_MS);
  }
  function subscribeWidgetSync(): () => void {
    const unsubscribe = ports.subscribe(() => {
      scheduleWidgetPush();
    });
    return () => {
      unsubscribe();
      clearPendingPush();
    };
  }
  return { pushWidgetPayload, scheduleWidgetPush, subscribeWidgetSync };
}
