/** @format */
/**
 * Shared item descriptor for glass tabs (name, label, and icon source).
 */
import type { ReactNode } from "react";
import type { SymbolViewProps } from "expo-symbols";

export type GlassTabItem = {
  name: string;
  label: string;
  icon?: SymbolViewProps["name"];
  renderIcon?: (props: { tint: string; size: number }) => ReactNode;
};
