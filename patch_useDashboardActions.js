const fs = require('fs');
const filepath = 'src/presentation/features/dashboard/hooks/useDashboardActions.ts';
let content = fs.readFileSync(filepath, 'utf8');

const importReplacement = `import { useCallback, useMemo } from "react";`;

content = content.replace(
  `import { useCallback } from "react";`,
  importReplacement
);

const originalReturn = `  return {
    actions: {
      handleLogPrayer,
      handleLogFullDay,
      handleUndo,
      handleBatch,
      dismissIntention,
      dismissDua,
    },
  };`;

const newReturn = `  const actions = useMemo(() => ({
    handleLogPrayer,
    handleLogFullDay,
    handleUndo,
    handleBatch,
    dismissIntention,
    dismissDua,
  }), [handleLogPrayer, handleLogFullDay, handleUndo, handleBatch, dismissIntention, dismissDua]);

  return { actions };`;

content = content.replace(originalReturn, newReturn);
fs.writeFileSync(filepath, content);
