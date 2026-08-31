/** @format */
/**
 * Locale-aware number formatting (Arabic-Indic vs Western digits).
 */
export function formatPlus(n: number, isRTL: boolean): string {
  return `+${new Intl.NumberFormat(isRTL ? "ar-EG" : "en-US").format(n)}`;
}
export function formatNumber(n: number, isRTL: boolean): string {
  return new Intl.NumberFormat(isRTL ? "ar-EG" : "en-US").format(n);
}
