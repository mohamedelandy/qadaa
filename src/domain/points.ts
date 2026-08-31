/** @format */
/**
 * Pure gamification point helpers: add amount, subtract with floor at zero.
 */
export function addPoints(current: number, amount: number): number {
  return current + amount;
}
export function subtractPoints(current: number, amount: number): number {
  return Math.max(0, current - amount);
}
