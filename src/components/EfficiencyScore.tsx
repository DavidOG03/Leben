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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Quick timeout to let store initialize
    setTimeout(() => setLoading(false), 500);
  }, []);

  const analytics = useMemo(() => {
    if (!userId) return null;

    const today = new Date();
    const todayIso = today.toISOString().split("T")[0];
    const weekDates = Array.from({ length: 7 }, (_, offset) => {
      const d = new Date(today);
      d.setDate(today.getDate() - offset);
      return d.toISOString().split("T")[0];
    });

    const allActivityDates = [
      ...tasks
        .map((t) => t.completedAt || t.date)
        .filter(Boolean)
        .map((value) => value.split("T")[0]),
      ...habits.flatMap((h) => h.completedDates ?? []),
      ...goals.flatMap((g) =>
        g.milestones
          .filter((m) => m.done && m.completedAt)
          .map((m) => m.completedAt!.split("T")[0]),
      ),
    ] as string[];

    const firstActivityDate = allActivityDates.sort()[0];
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysSinceFirstActivity = firstActivityDate
      ? Math.floor(
          (new Date(todayIso).getTime() -
            new Date(firstActivityDate).getTime()) /
            msPerDay,
        )
      : 0;

    let totalScheduledTasks = 0;
    let totalCompletedTasks = 0;
    let totalCompletedHabits = 0;
    let totalCompleteGoals = 0;
    let weeklyActiveDays = 0;

    for (const dateStr of weekDates) {
      const dayTasks = tasks.filter(
        (t) => t.date === dateStr || t.completedAt?.split("T")[0] === dateStr,
      );
      const dayCompletedTasks = dayTasks.filter(
        (t) => t.completed && t.completedAt?.split("T")[0] === dateStr,
      ).length;
      const dayHabits = habits.filter((h) =>
        h.completedDates?.includes(dateStr),
      ).length;
      const dayGoals = goals.reduce(
        (count: number, g: Goal) =>
          count +
          g.milestones.filter(
            (m: Milestone) =>
              m.done && m.completedAt?.split("T")[0] === dateStr,
          ).length,
        0,
      );

      totalScheduledTasks += dayTasks.length;
      totalCompletedTasks += dayCompletedTasks;
      totalCompletedHabits += dayHabits;
      totalCompleteGoals += dayGoals;

      if (dayTasks.length > 0 || dayHabits > 0 || dayGoals > 0) {
        weeklyActiveDays += 1;
      }
    }

    const totalPossibleHabits = habits.length * 7;
    const totalMilestones = goals.reduce(
      (acc: number, g: Goal) => acc + g.milestones.length,
      0,
    );
    const totalCompletedMilestones = goals.reduce(
      (acc: number, g: Goal) =>
        acc + g.milestones.filter((m: Milestone) => m.done).length,
      0,
    );

    const taskRate =
      totalScheduledTasks > 0 ? totalCompletedTasks / totalScheduledTasks : 0;
    const habitRate =
      totalPossibleHabits > 0 ? totalCompletedHabits / totalPossibleHabits : 0;
    const goalRate =
      totalMilestones > 0 ? totalCompletedMilestones / totalMilestones : 0;

    const weights = { task: 0.4, habit: 0.3, goal: 0.3 };
    let activeWeightsCount = 0;
    if (totalScheduledTasks > 0) activeWeightsCount += weights.task;
    if (totalPossibleHabits > 0) activeWeightsCount += weights.habit;
    if (totalMilestones > 0) activeWeightsCount += weights.goal;

    const finalScore =
      activeWeightsCount > 0
        ? (((totalScheduledTasks > 0 ? taskRate * weights.task : 0) +
            (totalPossibleHabits > 0 ? habitRate * weights.habit : 0) +
            (totalMilestones > 0 ? goalRate * weights.goal : 0)) /
            activeWeightsCount) *
          100
        : 0;

    const hasEnoughData =
      firstActivityDate !== undefined &&
      daysSinceFirstActivity >= 6 &&
      weeklyActiveDays > 0;

    return {
      score: Math.round(finalScore),
      hasEnoughData,
      rating:
        finalScore > 80
          ? "Elite"
          : finalScore > 60
            ? "Deep"
            : finalScore > 40
              ? "Steady"
              : "Growth",
    };
  }, [userId, tasks, habits, goals]);

  const dashOffset = analytics ? (1 - analytics.score / 100) * 339 : 339; // 2 * PI * 54

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
      ) : !analytics || !analytics.hasEnoughData ? (
        <>
          <div className="relative flex items-center justify-center mb-5">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="8"
              />
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#252525"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="12 8"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span
                style={{
                  fontSize: "28px",
                  color: "#2e2e2e",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                —
              </span>
              <span
                className="uppercase tracking-widest mt-1"
                style={{
                  fontSize: "9px",
                  color: "#2e2e2e",
                  letterSpacing: "0.12em",
                }}
              >
                No data
              </span>
            </div>
          </div>

          <p
            style={{
              fontSize: "11px",
              color: "#333",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Score appears after
            <br />
            your first active week
          </p>
        </>
      ) : (
        <>
          <div className="relative flex items-center justify-center mb-5">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="8"
              />
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#7c6af0"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="339.29"
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span
                style={{
                  fontSize: "32px",
                  color: "#f0f0f0",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  fontWeight: 800,
                }}
              >
                {analytics.score}%
              </span>
              <span
                className="uppercase tracking-widest mt-1"
                style={{
                  fontSize: "10px",
                  color: "#7c6af0",
                  letterSpacing: "0.14em",
                  fontWeight: 600,
                }}
              >
                {analytics.rating}
              </span>
            </div>
          </div>

          <p
            style={{
              fontSize: "12px",
              color: "#666",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Based on your activity
            <br />
            over the last 7 days.
          </p>
        </>
      )}
    </div>
  );
}
