import type {
  StatCard,
  DayActivity,
  ProductivityData,
  AIInsight,
  AnalyticsData,
} from "@/utils/analytics.types";
import type { Task, Habit } from "@/store/useStore";
import type { Goal } from "@/utils/goals.types";
import { deriveGoalStats } from "@/utils/goals.types";

// ─── Date helpers ────────────────────────────────────────────────────────────

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Returns "YYYY-MM-DD" for a given Date object */
export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Returns the last N days as ISO date strings, oldest first */
export function lastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return toISODate(d);
  });
}

/** Returns the ISO dates for the current Mon-Sun week */
export function currentWeekDates(): { isoDate: string; label: string }[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun
  // We want Mon as the start, so shift: Mon=0 … Sun=6
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      isoDate: toISODate(d),
      label: DAY_LABELS[d.getDay()],
    };
  });
}

// ─── Stat card computation ────────────────────────────────────────────────────

export function computeStatCards(
  tasks: Task[],
  habits: Habit[],
  goals: Goal[],
): StatCard[] {
  const completedTasks = tasks.filter((t) => t.completed).length;

  // Habit consistency: across last 7 days, how many completions vs expected
  const last7 = lastNDays(7);
  const totalExpected = habits.length * 7;
  const totalActual = habits.reduce(
    (sum, h) =>
      sum + (h.completedDates ?? []).filter((d) => last7.includes(d)).length,
    0,
  );
  const habitPct =
    totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

  const activeGoals = goals.length;

  return [
    {
      label: "Tasks Completed",
      val: completedTasks.toString(),
      sub: completedTasks > 0 ? "total completed" : "no tasks yet",
      up: completedTasks > 0 ? true : null,
    },
    {
      label: "Habit Consistency",
      val: totalExpected > 0 ? `${habitPct}%` : "--",
      sub: totalExpected > 0 ? "last 7 days" : "no habits tracked",
      up: habitPct >= 70 ? true : habitPct > 0 ? false : null,
    },
    {
      label: "Focus Hours",
      val: "--", // focus timer not wired yet; placeholder
      sub: "focus timer coming soon",
      up: null,
    },
    {
      label: "Goals Active",
      val: activeGoals > 0 ? activeGoals.toString() : "--",
      sub: activeGoals > 0 ? `${activeGoals} in progress` : "no goals yet",
      up: null,
    },
  ];
}

// ─── Weekly bar chart data ───────────────────────────────────────────────────

export function computeWeekActivity(
  tasks: Task[],
  habits: Habit[],
): DayActivity[] {
  const week = currentWeekDates();

  return week.map(({ isoDate, label }) => {
    const dayTasks = tasks.filter((t) => t.completedAt === isoDate).length;
    const dayHabits = habits.reduce(
      (sum, h) => sum + ((h.completedDates ?? []).includes(isoDate) ? 1 : 0),
      0,
    );
    return {
      day: label,
      tasks: dayTasks,
      habits: dayHabits,
      focusHours: 0, // placeholder until focus timer exists
    };
  });
}

// ─── Productivity score ──────────────────────────────────────────────────────

/**
 * Simple scoring formula:
 * Each day score = (tasks done that day / 5 capped at 1) * 60
 *               + (habit completions that day / habits.length capped at 1) * 40
 * This gives 0-100 per day.
 */
export function computeProductivity(
  tasks: Task[],
  habits: Habit[],
): ProductivityData {
  const last30 = lastNDays(30);

  const trend = last30.map((isoDate) => {
    const dayTasks = tasks.filter((t) => t.completedAt === isoDate).length;
    const dayHabits = habits.reduce(
      (sum, h) => sum + ((h.completedDates ?? []).includes(isoDate) ? 1 : 0),
      0,
    );
    const taskScore = Math.min(dayTasks / 5, 1) * 60;
    const habitScore = habits.length > 0 ? (dayHabits / habits.length) * 40 : 0;
    return Math.round(taskScore + habitScore);
  });

  const nonZero = trend.filter((s) => s > 0);
  const avgDailyScore =
    nonZero.length > 0
      ? Math.round(nonZero.reduce((a, b) => a + b, 0) / nonZero.length)
      : 0;

  const latestScore = trend[trend.length - 1];

  return {
    score: latestScore,
    trend,
    taskCount: tasks.length,
    habitCount: habits.length,
    deepWorkSessions: 0,
    avgDailyScore,
  };
}

// ─── Habit stats ─────────────────────────────────────────────────────────────

export function computeHabitStats(habits: Habit[]): Habit[] {
  const last30 = lastNDays(30);
  return habits
    .map((h) => ({
      ...h,
      pct: Math.round(
        ((h.completedDates ?? []).filter((d) => last30.includes(d)).length /
          30) *
          100,
      ),
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);
}

// ─── Goal stats ──────────────────────────────────────────────────────────────

export function computeGoalStats(goals: Goal[]): Goal[] {
  return goals;
}

// ─── AI insights ─────────────────────────────────────────────────────────────

/**
 * These are deterministic pattern-based insights generated from the data.
 * In a future iteration this can call Gemini with the computed stats as context
 * and ask it to return 3 actionable insights as JSON.
 */
export function computeAIInsights(
  tasks: Task[],
  habits: Habit[],
  goals: Goal[],
): AIInsight[] {
  const insights: AIInsight[] = [];

  // Most productive day
  const week = currentWeekDates();
  const dayTaskCounts = week.map(({ isoDate, label }) => ({
    label,
    count: tasks.filter((t) => t.completedAt === isoDate).length,
  }));
  const bestDay = dayTaskCounts.reduce(
    (best, d) => (d.count > best.count ? d : best),
    { label: "", count: 0 },
  );
  if (bestDay.count > 0) {
    insights.push({
      icon: "📈",
      text: `You completed the most tasks on ${bestDay.label} this week. Schedule challenging work on that day.`,
    });
  }

  // Habit streak encouragement based on longest streak
  const bestHabit = habits
    .map((h) => ({ name: h.label, longestStreak: h.longestStreak ?? 0 }))
    .sort((a, b) => b.longestStreak - a.longestStreak)[0];
  if (bestHabit && bestHabit.longestStreak > 0) {
    insights.push({
      icon: "🔥",
      text: `Your longest streak is ${bestHabit.longestStreak} days for ${bestHabit.name}. Use that momentum to stay consistent.`,
    });
  }

  // Goal closest to completion
  const closestGoal = goals
    .map((g) => ({
      name: g.name,
      pct:
        g.targetValue > 0
          ? Math.round((g.currentValue / g.targetValue) * 100)
          : 0,
    }))
    .sort((a, b) => b.pct - a.pct)[0];
  if (closestGoal && closestGoal.pct > 0) {
    insights.push({
      icon: "🚀",
      text: `${closestGoal.name} is ${closestGoal.pct}% complete. You are making real progress.`,
    });
  }

  return insights;
}

// ─── Master function: build the full AnalyticsData object ───────────────────

export function buildAnalyticsData(
  tasks: Task[],
  habits: Habit[],
  goals: Goal[],
): AnalyticsData {
  const hasTaskData = tasks.length > 0;
  const hasHabitData = habits.length > 0;
  const hasGoalData = goals.length > 0;

  return {
    statCards: computeStatCards(tasks, habits, goals),
    weekActivity: computeWeekActivity(tasks, habits),
    productivity: computeProductivity(tasks, habits),
    topHabits: computeHabitStats(habits),
    goalProgress: computeGoalStats(goals),
    aiInsights: computeAIInsights(tasks, habits, goals),
    hasTaskData,
    hasHabitData,
    hasGoalData,
  };
}
