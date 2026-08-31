/** @format */

export const PERSIST_VERSION = 2;

export function migrateToCurrent(persisted: unknown, _version: number): unknown {
  return persisted;
}

export function migratePrayerToCurrent(
  persisted: unknown,
  _version: number
): Record<string, unknown> {
  const prev = (persisted ?? {}) as Record<string, unknown>;
  return {
    ...prev,
    ["todayUnits"]: prev["todayUnits"] ?? {},
    ["todayLogPoints"]: prev["todayLogPoints"] ?? {},
    ["todayDate"]: prev["todayDate"] ?? null,
  };
}

/**
 * Gamification v1 → v2: backfill the monotonic daysLogged counter from the
 * pruned loggedDates array (best available estimate for pre-v2 users).
 */
export function migrateGamificationToCurrent(
  persisted: unknown,
  version: number
): Record<string, unknown> {
  const prev = (persisted ?? {}) as Record<string, unknown>;
  if (version >= PERSIST_VERSION) {
    return prev;
  }
  const loggedDates = Array.isArray(prev["loggedDates"]) ? (prev["loggedDates"] as unknown[]) : [];
  return {
    ...prev,
    ["daysLogged"]:
      typeof prev["daysLogged"] === "number" ? prev["daysLogged"] : loggedDates.length,
  };
}
