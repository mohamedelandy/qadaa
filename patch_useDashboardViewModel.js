const fs = require('fs');
const filepath = 'src/presentation/features/dashboard/hooks/useDashboardViewModel.ts';
let content = fs.readFileSync(filepath, 'utf8');

const importReplacement = `import { useDashboardOverlays } from "./useDashboardOverlays";
import { useDashboardActions } from "./useDashboardActions";
import { useDashboardStyles } from "./useDashboardStyles";
import { useMemo } from "react";`;

content = content.replace(
  `import { useDashboardOverlays } from "./useDashboardOverlays";\nimport { useDashboardActions } from "./useDashboardActions";\nimport { useDashboardStyles } from "./useDashboardStyles";`,
  importReplacement
);

const originalLines = `  const { weeklyGridData, hadithData } = useDashboardCalendar();
  const { showIntention, showDua } = useDashboardOverlays();
  const { actions } = useDashboardActions();
  const { styles, gradients } = useDashboardStyles();
  return {
    t,
    colors,
    prayerRows,
    todayData,
    streakData,
    weeklyGridData,
    hadithData,
    allPrayersDone,
    overlays: { showIntention, showDua },
    actions,
    styles,
    gradients,
  };`;

const newLines = `  const { weeklyGridData, hadithData } = useDashboardCalendar();
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

  return viewModel;`;

content = content.replace(originalLines, newLines);
fs.writeFileSync(filepath, content);
