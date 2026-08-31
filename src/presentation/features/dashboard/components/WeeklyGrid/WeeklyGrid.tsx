/** @format */
/**
 * Weekly heatmap grid of recovery days with weekday header row, intensity legend and today marker.
 */
import { View } from "react-native";
import { Text } from "@components/Text/Text";
import { useWeeklyGridViewModel, type WeeklyGridCell } from "./WeeklyGrid.viewmodel";
import { HeatmapCell } from "../HeatmapCell/HeatmapCell";
interface WeeklyGridProps {
  cells: WeeklyGridCell[];
}
export function WeeklyGrid({ cells }: WeeklyGridProps) {
  const { t, colors, styles, dayInitials, weeks, legendItems } = useWeeklyGridViewModel(cells);
  return (
    <View testID="dashboard-weekly-grid" style={styles.container}>
      <View style={styles.headerRow}>
        <Text
          variant="xs"
          weight="medium"
          style={[styles.sectionLabel, { color: colors.textMuted }]}
        >
          {t("dashboard.weeklyGrid")}
        </Text>
        <Text variant="xs" weight="medium" style={[styles.subLabel, { color: colors.textMuted }]}>
          {t("dashboard.lastWeeks")}
        </Text>
      </View>

      <View style={styles.headerDivider} />

      <View testID="heatmap-day-header" style={styles.dayHeaderRow}>
        {dayInitials.map((initial, i) => (
          <View key={i} style={styles.dayHeaderCell}>
            <Text
              variant="xs"
              weight="medium"
              style={[styles.dayHeader, { color: colors.textMuted }]}
            >
              {initial}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {weeks.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <HeatmapCell
                key={cell.date}
                intensity={cell.intensity}
                isToday={cell.isToday}
                placeholder={cell.placeholder}
                mountDelay={(rowIndex * 7 + cellIndex) * 12}
                style={styles.cell}
              />
            ))}
          </View>
        ))}
      </View>

      <View testID="dashboard-heatmap-legend" style={styles.legendRow}>
        <Text style={styles.legendLabel}>{t("dashboard.legendLess")}</Text>
        {legendItems.map((item, i) => (
          <View key={i} style={[styles.legendDot, { backgroundColor: item.fill }]} />
        ))}
        <Text style={styles.legendLabel}>{t("dashboard.legendMore")}</Text>
      </View>
    </View>
  );
}
