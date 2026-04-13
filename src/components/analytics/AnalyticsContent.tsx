"use client";

import { useMemo } from "react";
import { useLebenStore } from "@/store/useStore";
import { buildAnalyticsData } from "@/utils/analytics.utils";
import { ProductivityScore } from "./ProductivityScore";

import StatCards from "./StatCard";
import WeeklyActivityChart from "./WeeklyActivities";

import HabitBreakdown from "./HabitBreakdown";
import GoalBreakdown from "./GoalBreakdown";
import AIInsights from "./AiInsights";

/**
 * AnalyticsContent is the only component that knows about the Zustand store.
 * It reads raw data, runs it through buildAnalyticsData(), and passes the
 * result down to pure presentational sub-components.
 *
 * This pattern -- "smart parent, dumb children" -- makes each sub-component
 * easy to test and easy to reuse because they only care about their props.
 *
 * useMemo here is important: buildAnalyticsData() loops over all tasks, habits,
 * and goals on every render. Wrapping it in useMemo means it only recomputes
 * when the actual store data changes, not on every keystroke or unrelated update.
 */
export default function AnalyticsContent() {
  // Pull raw data from your Zustand store.
  // Adjust these selectors to match the exact field names in your store.
  const tasks = useLebenStore((s) => s.tasks);
  const habits = useLebenStore((s) => s.habits);
  const goals = useLebenStore((s) => s.goals);

  const analytics = useMemo(
    () => buildAnalyticsData(tasks, habits, goals),
    [tasks, habits, goals]
  );

  return (
    <main
      className="flex-1 overflow-y-auto p-4 pb-24 md:px-8 md:py-7"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Row 1: stat summary cards */}
      <StatCards cards={analytics.statCards} />

      {/* Row 2: activity chart + productivity score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <WeeklyActivityChart
          data={analytics.weekActivity}
          hasData={analytics.hasTaskData}
        />
        <ProductivityScore
          data={analytics.productivity}
          hasData={analytics.hasTaskData || analytics.hasHabitData}
        />
      </div>

      {/* Row 3: habits + goals + AI insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <HabitBreakdown
          habits={analytics.topHabits}
          hasData={analytics.hasHabitData}
        />
        <GoalBreakdown
          goals={analytics.goalProgress}
          hasData={analytics.hasGoalData}
        />
        <AIInsights
          insights={analytics.aiInsights}
          hasData={analytics.hasTaskData || analytics.hasHabitData || analytics.hasGoalData}
        />
      </div>
    </main>
  );
}