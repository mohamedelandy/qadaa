/** @format */
/**
 * Input border-state resolver (error/focused/normal) plus focus/blur tracking hook.
 */
import { useCallback, useState } from "react";
export type InputBorderState = "error" | "focused" | "normal";
export function resolveInputBorderState(
  error: string | undefined,
  isFocused: boolean
): InputBorderState {
  if (error) return "error";
  if (isFocused) return "focused";
  return "normal";
}
export function useInputFocus() {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  return { isFocused, handleFocus, handleBlur };
}
