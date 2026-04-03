import { WEEKS, DAYS } from "@/constants/habits";
import type { HabitCard } from "@/utils/habits.types";

/** Returns today's date as an ISO YYYY-MM-DD string. */
export const today = () => new Date().toISOString().slice(0, 10);

/** Maps a completion ratio (0–1) to a heatmap colour. */
export const intensityColor = (ratio: number): string => {
  if (ratio <= 0) return "#1a1a1a";
  if (ratio <= 0.25) return "#1e2a4a";
  if (ratio <= 0.5) return "#2e4080";
  if (ratio <= 0.75) return "#5a4fd4";
  return "#9d8ff5";
};

/**
 * Returns the ISO date string for the cell at grid position (week w, day d),
 * measured backwards from today.
 */
export function cellDate(w: number, d: number): string {
  const date = new Date();
  date.setDate(date.getDate() - (WEEKS - 1 - w) * 7 - (DAYS - 1 - d));
  return date.toISOString().slice(0, 10);
}

/** How many habits were completed on a given date. */
export function countOnDate(habits: HabitCard[], dateStr: string): number {
  return habits.filter((h) => h.history.includes(dateStr)).length;
}

/**
 * Builds a WEEKS×DAYS matrix where each cell is the ratio of habits
 * completed on that day (0 = none, 1 = all habits done).
 */
export function buildAllHabitsMatrix(habits: HabitCard[]): number[][] {
  const total = habits.length;
  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: DAYS }, (_, d) => {
      if (total === 0) return 0;
      const dateStr = cellDate(w, d);
      return countOnDate(habits, dateStr) / total;
    }),
  );
}

/** Calculates the current daily streak from a history array. */
export function calcStreak(history: string[]): number {
  let streak = 0;
  const sorted = [...history].sort().reverse();
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (sorted[i] === expected.toISOString().slice(0, 10)) streak++;
    else break;
  }
  return streak;
}
