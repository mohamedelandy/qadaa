const fs = require('fs');
const filepath = 'src/presentation/features/stats/hooks/useStatsViewModel.ts';
let content = fs.readFileSync(filepath, 'utf8');

const originalReturn = `  return { t, colors, styles, ...data };`;

const newReturn = `  return useMemo(() => ({ t, colors, styles, ...data }), [t, colors, styles, data]);`;

content = content.replace(originalReturn, newReturn);
fs.writeFileSync(filepath, content);
