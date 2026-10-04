const fs = require('fs');
const filepath = 'src/presentation/features/dashboard/hooks/useDashboardOverlays.ts';
let content = fs.readFileSync(filepath, 'utf8');

const importReplacement = `import { useAppStore } from "@stores/useAppStore";
import { useGamificationStore } from "@stores/useGamificationStore";
import { usePrayerStore, PRAYER_KEYS } from "@stores/usePrayerStore";
import { toLocalISODate } from "@domain/date";
import { useMemo } from "react";`;

content = content.replace(
  `import { useAppStore } from "@stores/useAppStore";\nimport { useGamificationStore } from "@stores/useGamificationStore";\nimport { usePrayerStore, PRAYER_KEYS } from "@stores/usePrayerStore";\nimport { toLocalISODate } from "@domain/date";`,
  importReplacement
);

const originalReturn = `  const showIntention = wizardComplete && intentionSetDate !== today && loggedCount === 0;
  const showDua = loggedCount >= PRAYER_KEYS.length && lastDuaShownDate !== today;
  return { showIntention, showDua };`;

const newReturn = `  const showIntention = wizardComplete && intentionSetDate !== today && loggedCount === 0;
  const showDua = loggedCount >= PRAYER_KEYS.length && lastDuaShownDate !== today;
  const overlays = useMemo(() => ({ showIntention, showDua }), [showIntention, showDua]);
  return overlays;`;

content = content.replace(originalReturn, newReturn);
fs.writeFileSync(filepath, content);
