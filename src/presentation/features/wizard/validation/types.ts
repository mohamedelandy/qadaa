/** @format */
/**
 * Types for i18n-aware validation: translation key path and t-injected zod schema factory signature.
 */
import type { z } from "zod/v4";
export type TxKeyPath = string;
export type ValidationSchemaFactory<T extends z.ZodType> = (
  t: (key: TxKeyPath, vars?: Record<string, string | number>) => string
) => T;
