import { WEEKS, DAYS } from "@/constants/habits";
import { Habit } from "@/store/useStore";

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
export function countOnDate(habits: Habit[], dateStr: string): number {
  return habits.filter((h) => h.completedDates.includes(dateStr)).length;
}

/**
 * Builds a WEEKS×DAYS matrix where each cell is the ratio of habits
 * completed on that day (0 = none, 1 = all habits done).
 */
export function buildAllHabitsMatrix(habits: Habit[]): number[][] {
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
  if (!history || history.length === 0) return 0;

  // Normalize all dates to YYYY-MM-DD to ignore times, and remove duplicates
  const dates = new Set(history.map((d) => d.slice(0, 10)));

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // If not done today AND not done yesterday, the current streak is broken (0)
  if (!dates.has(todayStr) && !dates.has(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  // Start checking from today if completed today, otherwise start from yesterday
  let checkDate = dates.has(todayStr) ? now : yesterday;

  while (true) {
    const checkStr = checkDate.toISOString().slice(0, 10);
    if (dates.has(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/** Calculates the longest all-time streak from a history array. */
export function calcLongestStreak(history: string[]): number {
  if (!history || history.length === 0) return 0;

  // Normalize to YYYY-MM-DD and sort chronologically
  const sorted = Array.from(new Set(history.map((d) => d.slice(0, 10)))).sort();
  
  let maxStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    
    // Difference in days between two UTC midnights is always an exact integer
    const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      currentStreak++;
    } else if (diff > 1) {
      if (currentStreak > maxStreak) maxStreak = currentStreak;
      currentStreak = 1;
    }
  }

  return Math.max(maxStreak, currentStreak);
}
