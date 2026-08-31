/** @format */
/**
 * View model building the 28-day flame grid: streak tiers, Saturday-aligned padding and row chunking.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useUI } from "@hooks/useUI";
import { spacing } from "@theme/spacing";
import type { ColorKey } from "@theme/types";
import { getHeatmapPalette } from "../HeatmapCell/heatmapPalette";
export interface WeeklyGridCell {
  date: string;
  logged: boolean;
  isToday: boolean;
}
export interface FlameCell extends WeeklyGridCell {
  intensity: number;
  placeholder: boolean;
}
const MINI_GRID_DAYS = 28;
const SATURDAY = 6;
const DEFAULT_DAY_INITIALS = ["S", "S", "M", "T", "W", "T", "F"];
export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};
export function weekdayOffset(dateStr: string): number {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return 0;
  return (d.getDay() - SATURDAY + 7) % 7;
}
export function computeFlameTier(runLength: number): number {
  if (runLength <= 0) return 0;
  if (runLength === 1) return 1;
  if (runLength <= 2) return 2;
  if (runLength <= 4) return 3;
  if (runLength <= 6) return 4;
  return 5;
}
export function consecutiveRun(cells: WeeklyGridCell[], from: number): number {
  let run = 0;
  for (let i = from; i >= 0; i--) {
    if (!cells[i]?.logged) break;
    run++;
    if (run >= 8) break;
  }
  return run;
}
export function buildFlameGrid(cells: WeeklyGridCell[]): FlameCell[] {
  if (cells.length === 0) return [];
  const start = Math.max(0, cells.length - MINI_GRID_DAYS);
  const tail = cells.slice(start);
  const pad = weekdayOffset(tail[0]?.date ?? "");
  const placeholders: FlameCell[] = Array.from({ length: pad }, (_, i) => ({
    date: `placeholder-${i}`,
    logged: false,
    isToday: false,
    intensity: 0,
    placeholder: true,
  }));
  const real: FlameCell[] = tail.map((c, i) => ({
    ...c,
    intensity: computeFlameTier(consecutiveRun(cells, start + i)),
    placeholder: false,
  }));
  const grid = [...placeholders, ...real];
  const remainder = grid.length % 7;
  const trailing: FlameCell[] =
    remainder === 0
      ? []
      : Array.from({ length: 7 - remainder }, (_, i) => ({
          date: `placeholder-trailing-${i}`,
          logged: false,
          isToday: false,
          intensity: 0,
          placeholder: true,
        }));
  return [...grid, ...trailing];
}
export interface LegendItem {
  fill: string;
}
export function getLegendItems(colors: Record<ColorKey, string>): LegendItem[] {
  const { fills } = getHeatmapPalette(colors);
  return [
    { fill: colors.legendZero },
    { fill: fills[0] },
    { fill: fills[2] },
    { fill: fills[3] },
    { fill: fills[4] },
  ];
}
export function useWeeklyGridViewModel(cells: WeeklyGridCell[]) {
  const { t, colors, borderRadius: br, typography, isDark } = useUI();
  const rawInitials = t("dashboard.dayInitials", { returnObjects: true });
  const dayInitials: string[] = Array.isArray(rawInitials)
    ? (rawInitials as string[])
    : DEFAULT_DAY_INITIALS;
  const weeks = useMemo(() => chunkArray(buildFlameGrid(cells), 7), [cells]);
  const legendItems = useMemo(() => getLegendItems(colors), [colors]);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { marginTop: spacing[4] },
        headerRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: spacing[3],
          paddingBottom: spacing[2],
        },
        sectionLabel: {
          letterSpacing: 1,
          textTransform: "uppercase",
        },
        subLabel: {
          letterSpacing: 0.5,
        },
        headerDivider: {
          height: 1,
          backgroundColor: colors.border,
          marginBottom: spacing[2],
          opacity: 0.7,
        },
        dayHeaderRow: {
          flexDirection: "row",
          gap: spacing[1.5],
          marginTop: spacing[1],
          marginBottom: spacing[2],
          alignItems: "center",
        },
        dayHeaderCell: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 20,
        },
        dayHeader: {
          textAlign: "center",
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
        },
        grid: {
          gap: spacing[1.5],
        },
        row: {
          flexDirection: "row",
          gap: spacing[1.5],
          alignItems: "center",
        },
        cell: {
          flex: 1,
          aspectRatio: 1,
          borderRadius: br.md,
        },
        legendRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: spacing[3],
          gap: spacing[1.5],
        },
        legendLabel: {
          color: colors.textMuted,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fonts.medium,
          marginEnd: spacing[1],
        },
        legendDot: {
          width: 10,
          height: 10,
          borderRadius: br.sm,
        },
      }),
    [colors, br, typography]
  );
  return { t, colors, styles, cells, dayInitials, weeks, isDark, legendItems };
}
