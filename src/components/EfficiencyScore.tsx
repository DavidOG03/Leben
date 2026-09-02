"use client";

import { useEffect, useState, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useLebenStore, LebenState } from "@/store/useStore";
import { Goal, Milestone } from "@/utils/goals.types";
import Link from "next/link";

export default function EfficiencyScore() {
  const userId = useLebenStore((s: LebenState) => s.userId);
  const tasks = useLebenStore((s: LebenState) => s.tasks);
  const habits = useLebenStore((s: LebenState) => s.habits);
  const goals = useLebenStore((s: LebenState) => s.goals);
  const books = useLebenStore((s: LebenState) => s.books);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Quick timeout to let store initialize
    setTimeout(() => setLoading(false), 500);
  }, []);

  const analytics = useMemo(() => {
    if (!userId) return null;

    const today = new Date();
    const todayIso = today.toISOString().split("T")[0];

    // Build the 30-day date window
    const thirtyDayDates = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toISOString().split("T")[0];
    });
    const weekDates     = thirtyDayDates.slice(0, 7);
    const baselineDates = thirtyDayDates.slice(7);

    // ── Helper: per-day score (tasks + habits — the two daily metrics) ────────
    const getDayScore = (dateStr: string): number | null => {
      const dayScheduled   = tasks.filter((t) => t.date === dateStr).length;
      const dayCompleted   = tasks.filter((t) => t.completed && t.completedAt?.split("T")[0] === dateStr).length;
      const existingHabits  = habits.filter((h) => !h.createdAt || h.createdAt.split("T")[0] <= dateStr);
      const habitsCompleted = existingHabits.filter((h) => h.completedDates?.includes(dateStr)).length;

      if (dayScheduled === 0 && existingHabits.length === 0) return null;

      let wSum = 0, wTotal = 0;
      if (dayScheduled > 0)          { wSum += (dayCompleted / dayScheduled) * 0.4; wTotal += 0.4; }
      if (existingHabits.length > 0) { wSum += (habitsCompleted / existingHabits.length) * 0.6; wTotal += 0.6; }
      return wTotal > 0 ? (wSum / wTotal) * 100 : null;
    };

    // ── Current 7-day full score ────────────────────────────────────────────────
    let totalScheduledTasks    = 0, totalCompletedTasks    = 0;
    let totalPossibleHabitDays = 0, totalCompletedHabitDays = 0;
    let weeklyActiveDays = 0;

    for (const dateStr of weekDates) {
      const dayScheduled   = tasks.filter((t) => t.date === dateStr).length;
      const dayCompleted   = tasks.filter((t) => t.completed && t.completedAt?.split("T")[0] === dateStr).length;
      const existingHabits  = habits.filter((h) => !h.createdAt || h.createdAt.split("T")[0] <= dateStr);
      const dayHabitsCompleted = existingHabits.filter((h) => h.completedDates?.includes(dateStr)).length;
      const dayMilestones  = goals.reduce(
        (count: number, g: Goal) =>
          count + g.milestones.filter((m: Milestone) => m.done && m.completedAt?.split("T")[0] === dateStr).length,
        0,
      );

      totalScheduledTasks    += dayScheduled;
      totalCompletedTasks    += dayCompleted;
      totalPossibleHabitDays  += existingHabits.length;
      totalCompletedHabitDays += dayHabitsCompleted;
      if (dayScheduled > 0 || existingHabits.length > 0 || dayMilestones > 0) weeklyActiveDays++;
    }

    const totalMilestones = goals.reduce((acc: number, g: Goal) => acc + g.milestones.length, 0);
    const totalCompletedMilestones = goals.reduce(
      (acc: number, g: Goal) => acc + g.milestones.filter((m: Milestone) => m.done).length, 0,
    );
    const totalBooks   = books.length;
    const engagedBooks = books.filter(
      (b) => b.status === "completed" || (b.status === "reading" && b.currentPage > 0),
    ).length;

    const taskRate  = totalScheduledTasks    > 0 ? totalCompletedTasks    / totalScheduledTasks    : 0;
    const habitRate = totalPossibleHabitDays  > 0 ? totalCompletedHabitDays / totalPossibleHabitDays : 0;
    const goalRate  = totalMilestones         > 0 ? totalCompletedMilestones / totalMilestones       : 0;
    const bookRate  = totalBooks              > 0 ? engagedBooks             / totalBooks            : 0;

    const weights = { task: 0.4, habit: 0.3, goal: 0.2, book: 0.1 };
    let wSum = 0, wTotal = 0;
    if (totalScheduledTasks    > 0) { wSum += taskRate  * weights.task;  wTotal += weights.task;  }
    if (totalPossibleHabitDays  > 0) { wSum += habitRate * weights.habit; wTotal += weights.habit; }
    if (totalMilestones         > 0) { wSum += goalRate  * weights.goal;  wTotal += weights.goal;  }
    if (totalBooks              > 0) { wSum += bookRate  * weights.book;  wTotal += weights.book;  }

    const currentScore = wTotal > 0 ? (wSum / wTotal) * 100 : 0;

    // ── 30-day personal baseline ────────────────────────────────────────────────
    const baselineScores = baselineDates
      .map((d) => getDayScore(d))
      .filter((s): s is number => s !== null);

    const hasBaseline = baselineScores.length >= 5;
    const baselineAvg = hasBaseline
      ? baselineScores.reduce((a, b) => a + b, 0) / baselineScores.length
      : null;
    const delta = baselineAvg !== null ? currentScore - baselineAvg : null;

    const hasAnyActivity = totalScheduledTasks > 0 || totalPossibleHabitDays > 0 || weeklyActiveDays > 0;

    // ── Rating ────────────────────────────────────────────────────────────────
    let rating: string;
    if (delta !== null) {
      if      (delta > 15)   rating = "Surging";
      else if (delta > 5)    rating = "Improving";
      else if (delta >= -5)  rating = "Consistent";
      else if (delta >= -15) rating = "Slipping";
      else                   rating = "Falling";
    } else {
      if      (currentScore > 80) rating = "Elite";
      else if (currentScore > 60) rating = "Deep";
      else if (currentScore > 40) rating = "Steady";
      else                        rating = "Growth";
    }

    const ratingColor =
      delta !== null
        ? delta > 5  ? "#22c55e"
        : delta < -5 ? "#ef4444"
        : "#7c6af0"
        : "#7c6af0";

    return {
      score:       Math.round(currentScore),
      baselineAvg: baselineAvg !== null ? Math.round(baselineAvg) : null,
      delta:       delta       !== null ? Math.round(delta)       : null,
      hasBaseline,
      hasAnyActivity,
      rating,
      ratingColor,
    };
  }, [userId, tasks, habits, goals, books]);


  const dashOffset = analytics
    ? (1 - analytics.score / 100) * 339
    : 339; // 2 * PI * 54

  return (
    <div
      className="rounded-2xl p-7 flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(145deg, #121212 0%, #0e0e0e 100%)",
        border: "1px solid #1e1e1e",
        minHeight: "260px",
      }}
    >
      <p
        className="uppercase tracking-widest mb-6"
        style={{ fontSize: "10px", color: "#444", letterSpacing: "0.14em" }}
      >
        Efficiency Score
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-4 gap-4 w-full animate-pulse">
          <div className="relative flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="6"
              />
            </svg>
            <div className="absolute w-10 h-10 rounded-full bg-white/5" />
          </div>
          <div className="w-24 h-3 rounded bg-white/5" />
          <div className="w-20 h-8 rounded-lg bg-white/5" />
        </div>
      ) : !userId ? (
        <div className="flex flex-col items-center justify-center py-4 gap-4 w-full">
          <div className="relative flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="6"
              />
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#252525"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="8 6"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "#555",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Sign in to analyze
            <br />
            your daily performance.
          </p>
          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-lg transition-colors hover:bg-[#7c6af0]/10"
            style={{
              fontSize: "12px",
              color: "#7c6af0",
              border: "1px solid #7c6af040",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign In
          </Link>
        </div>
      ) : !analytics || !analytics.hasAnyActivity ? (
        <>
          <div className="relative flex items-center justify-center mb-5">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a1a" strokeWidth="8" />
              <circle cx="70" cy="70" r="54" fill="none" stroke="#252525" strokeWidth="8"
                strokeLinecap="round" strokeDasharray="12 8" transform="rotate(-90 70 70)" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span style={{ fontSize: "28px", color: "#2e2e2e", fontWeight: 700, lineHeight: 1 }}>—</span>
              <span className="uppercase tracking-widest mt-1" style={{ fontSize: "9px", color: "#2e2e2e" }}>No data</span>
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "#333", textAlign: "center", lineHeight: 1.6 }}>
            Start tracking to<br />see your score.
          </p>
        </>
      ) : (
        <>
          <div className="relative flex items-center justify-center mb-5">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a1a" strokeWidth="8" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke={analytics.ratingColor}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray="339.29"
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span style={{ fontSize: "32px", color: "#f0f0f0", letterSpacing: "-0.03em", lineHeight: 1, fontWeight: 800 }}>
                {analytics.score}%
              </span>
              <span className="uppercase tracking-widest mt-1"
                style={{ fontSize: "10px", color: analytics.ratingColor, letterSpacing: "0.14em", fontWeight: 600 }}>
                {analytics.rating}
              </span>
            </div>
          </div>

          {analytics.delta !== null ? (
            <p style={{ fontSize: "12px", color: "#666", textAlign: "center", lineHeight: 1.6 }}>
              {analytics.delta > 5
                ? "You're outperforming your usual pace."
                : analytics.delta < -5
                  ? "You're falling behind your usual pace."
                  : "You're right on track with your usual pace."}
              <br />
              <span style={{ fontSize: "11px", opacity: 0.7 }}>
                This week: {analytics.score}% • Your avg: {analytics.baselineAvg}%
              </span>
            </p>
          ) : (
            <p style={{ fontSize: "11px", color: "#444", textAlign: "center", lineHeight: 1.6 }}>
              Building your baseline…<br />keep tracking daily.
            </p>
          )}
        </>
      )}
    </div>
  );
}
