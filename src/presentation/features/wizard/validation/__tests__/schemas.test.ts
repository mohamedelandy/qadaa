/** @format */
/**
 * Unit tests for wizard zod schemas: age/pubertyAge bounds, cross-field rule, quickYears positivity.
 */
import { CreateStep1Schema, CreateStep2Schema } from "../schemas";
const t = (k: string) => k;
describe("CreateStep1Schema", () => {
  const schema = CreateStep1Schema(t);
  it("validates a correct age and pubertyAge", () => {
    const result = schema.safeParse({ age: "30", pubertyAge: "14" });
    expect(result.success).toBe(true);
  });
  it("fails when age is empty", () => {
    const result = schema.safeParse({ age: "", pubertyAge: "14" });
    expect(result.success).toBe(false);
  });
  it("fails when age is not numeric", () => {
    const result = schema.safeParse({ age: "abc", pubertyAge: "14" });
    expect(result.success).toBe(false);
  });
  it("fails when age is below 10", () => {
    const result = schema.safeParse({ age: "9", pubertyAge: "14" });
    expect(result.success).toBe(false);
  });
  it("fails when age is above 120", () => {
    const result = schema.safeParse({ age: "121", pubertyAge: "14" });
    expect(result.success).toBe(false);
  });
  it("fails when pubertyAge is empty", () => {
    const result = schema.safeParse({ age: "30", pubertyAge: "" });
    expect(result.success).toBe(false);
  });
  it("fails when pubertyAge is not numeric", () => {
    const result = schema.safeParse({ age: "30", pubertyAge: "abc" });
    expect(result.success).toBe(false);
  });
  it("fails when pubertyAge is below 9", () => {
    const result = schema.safeParse({ age: "30", pubertyAge: "8" });
    expect(result.success).toBe(false);
  });
  it("fails when pubertyAge is above 15", () => {
    const result = schema.safeParse({ age: "30", pubertyAge: "16" });
    expect(result.success).toBe(false);
  });
  it("fails when pubertyAge is greater than or equal to age", () => {
    const result = schema.safeParse({ age: "15", pubertyAge: "15" });
    expect(result.success).toBe(false);
  });
  it("fails when pubertyAge is greater than age", () => {
    const result = schema.safeParse({ age: "14", pubertyAge: "15" });
    expect(result.success).toBe(false);
  });
});
describe("CreateStep2Schema", () => {
  const schema = CreateStep2Schema(t);
  it("validates a correct quickYears integer", () => {
    const result = schema.safeParse({ quickYears: "5" });
    expect(result.success).toBe(true);
  });
  it("validates a correct quickYears decimal", () => {
    const result = schema.safeParse({ quickYears: "5.5" });
    expect(result.success).toBe(true);
  });
  it("fails when quickYears is empty", () => {
    const result = schema.safeParse({ quickYears: "" });
    expect(result.success).toBe(false);
  });
  it("fails when quickYears is not numeric", () => {
    const result = schema.safeParse({ quickYears: "abc" });
    expect(result.success).toBe(false);
  });
  it("fails when quickYears is zero", () => {
    const result = schema.safeParse({ quickYears: "0" });
    expect(result.success).toBe(false);
  });
  it("fails when quickYears is negative", () => {
    const result = schema.safeParse({ quickYears: "-1" });
    expect(result.success).toBe(false);
  });
});
