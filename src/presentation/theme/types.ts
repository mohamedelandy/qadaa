/** @format */
/**
 * Theme type aliases: mode, color keys, text variants and weights derived from token files.
 */
import type { darkColors } from "./colors";
import type { fonts, fontSize, lineHeight } from "./typography";
export type { ThemeMode } from "@shared/theme";
export type ColorKey = {
  [K in keyof typeof darkColors]: (typeof darkColors)[K] extends string ? K : never;
}[keyof typeof darkColors];
export type TextVariant = keyof typeof fontSize;
export type TextWeight = keyof typeof fonts;
export interface TypographyTokens {
  readonly fontFamily: typeof fonts;
  readonly fontSize: typeof fontSize;
  readonly lineHeight: typeof lineHeight;
}
