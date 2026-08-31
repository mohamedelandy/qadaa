/** @format */
/**
 * Zod schema factories validating wizard step 1 (age/pubertyAge ranges) and step 2 (quickYears > 0).
 */
import { z } from "zod/v4";
import type { ValidationSchemaFactory } from "./types";
export const CreateStep1Schema: ValidationSchemaFactory<
  z.ZodObject<{
    age: z.ZodString;
    pubertyAge: z.ZodString;
  }>
> = (t) => {
  return z
    .object({
      age: z
        .string()
        .trim()
        .min(1, t("validation.age.required"))
        .refine((val) => /^\d+$/.test(val), t("validation.age.numeric"))
        .refine((val) => {
          const n = Number(val);
          return n >= 10 && n <= 120;
        }, t("validation.age.range")),
      pubertyAge: z
        .string()
        .trim()
        .min(1, t("validation.pubertyAge.required"))
        .refine((val) => /^\d+$/.test(val), t("validation.pubertyAge.numeric"))
        .refine((val) => {
          const pubertyAge = Number(val);
          return pubertyAge >= 9 && pubertyAge <= 15;
        }, t("validation.pubertyAge.range")),
    })
    .superRefine((val, ctx) => {
      const age = Number(val.age);
      const pubertyAge = Number(val.pubertyAge);
      if (age >= 10 && age <= 120 && pubertyAge >= 9 && pubertyAge <= 15 && pubertyAge >= age) {
        ctx.addIssue({
          code: "custom" as const,
          message: t("validation.pubertyAge.lessThanAge"),
        });
      }
    });
};
export const CreateStep2Schema: ValidationSchemaFactory<
  z.ZodObject<{
    quickYears: z.ZodString;
  }>
> = (t) => {
  return z.object({
    quickYears: z
      .string()
      .trim()
      .min(1, t("validation.quickYears.required"))
      .refine((val) => /^\d+(\.\d+)?$/.test(val), t("validation.quickYears.numeric"))
      .refine((val) => {
        const n = Number(val);
        return n > 0;
      }, t("validation.quickYears.min")),
  });
};
