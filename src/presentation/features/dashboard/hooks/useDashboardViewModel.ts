/** @format */
/**
 * Composes all dashboard sub-hooks (data, streak, calendar, overlays, actions, styles) into one view model.
 */
import { useUI } from "@hooks/useUI";
import { useDashboardPrayerData } from "./useDashboardPrayerData";
import { useDashboardStreak } from "./useDashboardStreak";
import { useDashboardCalendar } from "./useDashboardCalendar";
import { useDashboardOverlays } from "./useDashboardOverlays";
import { useDashboardActions } from "./useDashboardActions";
import { useDashboardStyles } from "./useDashboardStyles";
import { useMemo } from "react";
export function useDashboardViewModel() {
  const { t, colors } = useUI();
  const { prayerRows, allPrayersDone, todayData } = useDashboardPrayerData();
  const { streakData } = useDashboardStreak();
  const { weeklyGridData, hadithData } = useDashboardCalendar();
  const overlays = useDashboardOverlays();
  const { actions } = useDashboardActions();
  const { styles, gradients } = useDashboardStyles();

  const viewModel = useMemo(
    () => ({
      t,
      colors,
      prayerRows,
      todayData,
      streakData,
      weeklyGridData,
      hadithData,
      allPrayersDone,
      overlays,
      actions,
      styles,
      gradients,
    }),
    [
      t,
      colors,
      prayerRows,
      todayData,
      streakData,
      weeklyGridData,
      hadithData,
      allPrayersDone,
      overlays,
      actions,
      styles,
      gradients,
    ]
  );

  return viewModel;
}
