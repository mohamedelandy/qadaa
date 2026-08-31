/** @format */
/**
 * Sanitizes decimal input: strips bad chars, fixes dots/zeros, normalizes Arabic-Indic digits.
 */
export function cleanDecimal(val: string): string {
  const normalized = val
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/٫/g, ".");
  let cleaned = normalized.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = `${parts[0]}.${parts.slice(1).join("")}`;
  }
  if (cleaned.startsWith(".")) {
    cleaned = "0" + cleaned;
  }
  if (cleaned.length > 1 && cleaned.startsWith("0") && !cleaned.startsWith("0.")) {
    cleaned = cleaned.replace(/^0+/, "");
  }
  return cleaned;
}
