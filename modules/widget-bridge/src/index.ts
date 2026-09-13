/** @format */
/**
 * WidgetBridge — local Expo module.
 * Writes the widget payload to shared storage and reloads widget timelines.
 * Safe to import on any platform: calls are no-ops when the native module is
 * unavailable (Expo Go, web, tests).
 */

import { Platform } from "react-native";
import { requireNativeModule } from "expo-modules-core";
import type { WidgetPayload } from "../../../src/domain/widget";
import { Logger } from "../../../src/services/logger";

interface WidgetBridgeNative {
  setData: (jsonString: string) => Promise<void>;
  reloadAllTimelines: () => Promise<void>;
}

let nativeModule: WidgetBridgeNative | null = null;

try {
  nativeModule = requireNativeModule<WidgetBridgeNative>("WidgetBridge");
} catch {
  Logger.warn("Native module unavailable; widget sync disabled.", { module: "widget-bridge" });
}

export async function setWidgetData(data: WidgetPayload): Promise<void> {
  await nativeModule?.setData(JSON.stringify(data));
}

export async function reloadWidgets(): Promise<void> {
  if (Platform.OS !== "ios") return;
  await nativeModule?.reloadAllTimelines();
}
