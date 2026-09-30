/** @format */
/**
 * Pure streak state machine with monthly grace-day rule and logged-date pruning.
 */
export const LOGGED_DATES_RETENTION_DAYS = 60;
export function pruneLoggedDates(dates: string[], today: string): string[] {
  if (dates.length === 0) return [];
  // Parse date explicitly as UTC to ensure pure timezone-agnostic math
  const parts = today.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const cutoffTime = Date.UTC(year, month - 1, day) - (LOGGED_DATES_RETENTION_DAYS - 1) * 86400000;
  const cutoffISO = new Date(cutoffTime).toISOString().slice(0, 10);
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
