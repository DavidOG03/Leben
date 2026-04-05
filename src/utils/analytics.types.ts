// ─── Import real types from their source of truth ───────────────────────────
// No more duplicate Task, Habit, Goal definitions here.
// These come directly from the store so analytics always matches the real data.

import type { Habit, Task } from "@/store/useStore";
import type { Goal } from "@/utils/goals.types";

export type { Habit, Task, Goal };

// ─── Computed / derived types used only inside analytics ────────────────────

export interface StatCard {
  label: string;
  val: string;
  sub: string;
  up: boolean | null;
}

export interface DayActivity {
  day: string;
  tasks: number;
  habits: number;
  focusHours: number;
}

export interface ProductivityData {
  score: number;
  trend: number[];
  taskCount: number;
  habitCount: number;
  deepWorkSessions: number;
  avgDailyScore: number;
}

export interface AIInsight {
  icon: string;
  text: string;
}

export interface AnalyticsData {
  statCards: StatCard[];
  weekActivity: DayActivity[];
  productivity: ProductivityData;
  topHabits: Habit[]; // was HabitStat[]
  goalProgress: Goal[]; // was GoalStat[]
  aiInsights: AIInsight[];
  hasTaskData: boolean;
  hasHabitData: boolean;
  hasGoalData: boolean;
}
