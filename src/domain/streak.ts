/** @format */
/**
 * Pure streak state machine with monthly grace-day rule and logged-date pruning.
 */
export const LOGGED_DATES_RETENTION_DAYS = 60;
export function pruneLoggedDates(dates: string[], today: string): string[] {
  if (dates.length === 0) return [];
  const cutoff = new Date(`${today}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - (LOGGED_DATES_RETENTION_DAYS - 1));
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  return dates.filter((d) => d >= cutoffISO).sort();
}
export interface ComputeStreakInput {
  currentStreak: number;
  graceUsedMonth: string | null;
  loggedDates: string[];
  lastLogDate: string | null;
  today: string;
  yesterday: string;
  twoDaysAgo: string;
  currentMonth: string;
}
export interface ComputeStreakState {
  streak: number;
  graceUsedMonth: string | null;
  lastLogDate: string;
  loggedDates: string[];
}
export function computeStreakState(input: ComputeStreakInput): ComputeStreakState {
  const { currentStreak, graceUsedMonth, loggedDates, lastLogDate } = input;
  const { today, yesterday, twoDaysAgo, currentMonth } = input;
  let streak = currentStreak;
  let nextGraceUsedMonth = graceUsedMonth;
  const len = loggedDates.length;
  let hasToday = false;
  if (len > 0) {
    if (loggedDates[len - 1] === today) {
      hasToday = true;
    } else {
      hasToday = loggedDates.includes(today);
    }
  }
  const nextLoggedDates = hasToday ? loggedDates : [...loggedDates, today];
  if (lastLogDate !== null && lastLogDate > today) {
    return {
      streak,
      graceUsedMonth: nextGraceUsedMonth,
      lastLogDate: today,
      loggedDates: nextLoggedDates,
    };
  }
  if (lastLogDate !== today) {
    if (lastLogDate === yesterday) {
      streak += 1;
    } else if (streak > 0 && lastLogDate === twoDaysAgo && graceUsedMonth !== currentMonth) {
      streak += 1;
      nextGraceUsedMonth = currentMonth;
    } else {
      streak = 1;
    }
  }
  return {
    streak,
    graceUsedMonth: nextGraceUsedMonth,
    lastLogDate: today,
    loggedDates: nextLoggedDates,
  };
}
