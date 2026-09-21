/** @format */
/**
 * Backup adapters: export to shared file, import via document picker, clipboard copy/paste.
 */
import { File, Paths } from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { getDocumentAsync } from "expo-document-picker";
import * as Clipboard from "expo-clipboard";
import { toLocalISODate } from "@domain/date";
export async function exportToFile(json: string): Promise<void> {
  if (json.length > 250_000) {
    throw new Error("Backup is too large to export");
  }
  const date = toLocalISODate(new Date());
  const file = new File(Paths.cache, `qadaa-backup-${date}.json`);
  file.write(json);
  await shareAsync(file.uri);
}
export async function importFromFile(): Promise<string | null> {
  const result = await getDocumentAsync({ type: "application/json" });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset) return null;
  const file = new File(asset.uri);
  return file.text();
}
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await Clipboard.setStringAsync(text);
  } catch (error) {
    console.error("Failed to copy to clipboard", error);
  }
}
