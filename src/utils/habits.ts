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

/**
 * Calculates the total elapsed days (day count) for a habit since tracking started.
 * Automatically increments by 1 each calendar day at midnight.
 */
export function getHabitDayCount(habit: Habit): number {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const [ty, tm, td] = todayStr.split("-").map(Number);
  const todayUtc = Date.UTC(ty, tm - 1, td);

  let startUtc: number;
  if (habit.createdAt) {
    const createdStr = habit.createdAt.slice(0, 10);
    const [cy, cm, cd] = createdStr.split("-").map(Number);
    startUtc = Date.UTC(cy, cm - 1, cd);
  } else if (habit.completedDates && habit.completedDates.length > 0) {
    const earliestStr = [...habit.completedDates].sort()[0].slice(0, 10);
    const [ey, em, ed] = earliestStr.split("-").map(Number);
    startUtc = Date.UTC(ey, em - 1, ed);
  } else {
    startUtc = todayUtc;
  }

  if (startUtc > todayUtc) {
    startUtc = todayUtc;
  }

  const diffDays = Math.floor((todayUtc - startUtc) / (1000 * 60 * 60 * 24));
  const dayCount = diffDays + 1;

  // Ensure dayCount is at least 1 and at least the count of recorded completion days
  const uniqueCompletions = new Set(habit.completedDates || []).size;
  return Math.max(1, dayCount, uniqueCompletions);
}

/**
 * Returns the count of days marked completed for a habit (the second variable).
 * Increases by 1 only on days the user marks the habit completed via streak button.
 */
export function getHabitCompletedDays(habit: Habit): number {
  if (!habit.completedDates || habit.completedDates.length === 0) return 0;
  return new Set(habit.completedDates.map((d) => d.slice(0, 10))).size;
}

export type HabitDisciplineStatus = "Disciplined" | "Consistent" | "Building" | "Slacking";

export interface HabitConsistency {
  dayCount: number;
  completedDays: number;
  consistencyScore: number; // 0 - 100
  status: HabitDisciplineStatus;
  statusColor: string;
  statusBg: string;
  statusBorder: string;
  statusBadge: string;
}

/**
 * Calculates consistency percentage and discipline status for a single habit:
 * consistencyScore = (completedDays / dayCount) * 100%
 */
export function calcHabitConsistency(habit: Habit): HabitConsistency {
  const dayCount = getHabitDayCount(habit);
  const completedDays = getHabitCompletedDays(habit);

  // Consistency percentage = (completedDays / dayCount) * 100
  const rawScore = dayCount > 0 ? (completedDays / dayCount) * 100 : 0;
  const consistencyScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let status: HabitDisciplineStatus;
  let statusColor: string;
  let statusBg: string;
  let statusBorder: string;
  let statusBadge: string;

  if (consistencyScore >= 80) {
    status = "Disciplined";
    statusColor = "#4caf7d";
    statusBg = "rgba(76, 175, 125, 0.12)";
    statusBorder = "rgba(76, 175, 125, 0.28)";
    statusBadge = "🛡️ Disciplined";
  } else if (consistencyScore >= 60) {
    status = "Consistent";
    statusColor = "#7c6af0";
    statusBg = "rgba(124, 106, 240, 0.12)";
    statusBorder = "rgba(124, 106, 240, 0.28)";
    statusBadge = "⚡ Consistent";
  } else if (consistencyScore >= 40) {
    status = "Building";
    statusColor = "#f0a44f";
    statusBg = "rgba(240, 164, 79, 0.12)";
    statusBorder = "rgba(240, 164, 79, 0.28)";
    statusBadge = "⏳ Building";
  } else {
    status = "Slacking";
    statusColor = "#f06a6a";
    statusBg = "rgba(240, 106, 106, 0.12)";
    statusBorder = "rgba(240, 106, 106, 0.28)";
    statusBadge = "⚠️ Slacking";
  }

  return {
    dayCount,
    completedDays,
    consistencyScore,
    status,
    statusColor,
    statusBg,
    statusBorder,
    statusBadge,
  };
}

export interface OverallConsistencySummary {
  overallScore: number;
  maxDayCount: number;
  totalCompletedDays: number;
  totalHabits: number;
  checkedToday: number;
  disciplinedCount: number;
  consistentCount: number;
  buildingCount: number;
  slackingCount: number;
  status: HabitDisciplineStatus;
  statusColor: string;
  statusBg: string;
  statusBorder: string;
  statusBadge: string;
  habitScores: Array<{
    habit: Habit;
    consistency: HabitConsistency;
  }>;
}

export function calcOverallConsistency(habits: Habit[]): OverallConsistencySummary {
  if (!habits || habits.length === 0) {
    return {
      overallScore: 0,
      maxDayCount: 0,
      totalCompletedDays: 0,
      totalHabits: 0,
      checkedToday: 0,
      disciplinedCount: 0,
      consistentCount: 0,
      buildingCount: 0,
      slackingCount: 0,
      status: "Building",
      statusColor: "#555",
      statusBg: "rgba(85, 85, 85, 0.12)",
      statusBorder: "rgba(85, 85, 85, 0.25)",
      statusBadge: "⏳ No habits",
      habitScores: [],
    };
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const habitScores = habits.map((habit) => ({
    habit,
    consistency: calcHabitConsistency(habit),
  }));

  const checkedToday = habits.filter((h) =>
    h.completedDates?.some((d) => d.slice(0, 10) === todayStr)
  ).length;

  const totalScore = habitScores.reduce(
    (sum, item) => sum + item.consistency.consistencyScore,
    0
  );
  const overallScore = Math.round(totalScore / habits.length);

  const maxDayCount = Math.max(
    1,
    ...habitScores.map((item) => item.consistency.dayCount)
  );

  const totalCompletedDays = habitScores.reduce(
    (sum, item) => sum + item.consistency.completedDays,
    0
  );

  const disciplinedCount = habitScores.filter(
    (item) => item.consistency.status === "Disciplined"
  ).length;
  const consistentCount = habitScores.filter(
    (item) => item.consistency.status === "Consistent"
  ).length;
  const buildingCount = habitScores.filter(
    (item) => item.consistency.status === "Building"
  ).length;
  const slackingCount = habitScores.filter(
    (item) => item.consistency.status === "Slacking"
  ).length;

  let status: HabitDisciplineStatus;
  let statusColor: string;
  let statusBg: string;
  let statusBorder: string;
  let statusBadge: string;

  if (overallScore >= 80) {
    status = "Disciplined";
    statusColor = "#4caf7d";
    statusBg = "rgba(76, 175, 125, 0.12)";
    statusBorder = "rgba(76, 175, 125, 0.28)";
    statusBadge = "🛡️ Disciplined";
  } else if (overallScore >= 60) {
    status = "Consistent";
    statusColor = "#7c6af0";
    statusBg = "rgba(124, 106, 240, 0.12)";
    statusBorder = "rgba(124, 106, 240, 0.28)";
    statusBadge = "⚡ Consistent";
  } else if (overallScore >= 40) {
    status = "Building";
    statusColor = "#f0a44f";
    statusBg = "rgba(240, 164, 79, 0.12)";
    statusBorder = "rgba(240, 164, 79, 0.28)";
    statusBadge = "⏳ Building";
  } else {
    status = "Slacking";
    statusColor = "#f06a6a";
    statusBg = "rgba(240, 106, 106, 0.12)";
    statusBorder = "rgba(240, 106, 106, 0.28)";
    statusBadge = "⚠️ Slacking";
  }

  return {
    overallScore,
    maxDayCount,
    totalCompletedDays,
    totalHabits: habits.length,
    checkedToday,
    disciplinedCount,
    consistentCount,
    buildingCount,
    slackingCount,
    status,
    statusColor,
    statusBg,
    statusBorder,
    statusBadge,
    habitScores,
  };
}
