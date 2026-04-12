"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLebenStore } from "@/store/useStore";
import Link from "next/link";

export default function EfficiencyScore() {
  const [user, setUser] = useState<any>(null);
  const tasks = useLebenStore((s) => s.tasks);
  const habits = useLebenStore((s) => s.habits);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const analytics = useMemo(() => {
    if (!user) return null;

    const today = new Date();
    let totalScheduledTasks = 0;
    let totalCompletedTasks = 0;
    let totalPossibleHabits = habits.length * 7;
    let totalCompletedHabits = 0;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      // Tasks
      const tasksOnDay = tasks.filter(t => t.date === dateStr || t.completedAt === dateStr);
      totalScheduledTasks += tasksOnDay.length;
      totalCompletedTasks += tasksOnDay.filter(t => t.completed && t.completedAt === dateStr).length;

      // Habits
      totalCompletedHabits += habits.filter(h => h.completedDates?.includes(dateStr)).length;
    }

    const taskRate = totalScheduledTasks > 0 ? (totalCompletedTasks / totalScheduledTasks) : 0;
    const habitRate = totalPossibleHabits > 0 ? (totalCompletedHabits / totalPossibleHabits) : 0;

    // Weight: 60% Tasks, 40% Habits if both exist. Otherwise redistribute.
    let finalScore = 0;
    if (totalScheduledTasks > 0 && totalPossibleHabits > 0) {
      finalScore = (taskRate * 0.6 + habitRate * 0.4) * 100;
    } else if (totalScheduledTasks > 0) {
      finalScore = taskRate * 100;
    } else if (totalPossibleHabits > 0) {
      finalScore = habitRate * 100;
    }

    // "After a week" logic - only show if there's significant data or some activity
    const hasEnoughData = totalScheduledTasks > 3 || totalCompletedHabits > 3;

    return {
      score: Math.round(finalScore),
      hasEnoughData,
      rating: finalScore > 80 ? "Elite" : finalScore > 60 ? "Deep" : finalScore > 40 ? "Steady" : "Growth"
    };
  }, [user, tasks, habits]);

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

      {!user ? (
        <div className="flex flex-col items-center justify-center py-4 gap-4 w-full">
           <div className="relative flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a1a" strokeWidth="6" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke="#252525" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="8 6"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#555", textAlign: "center", lineHeight: 1.6 }}>
            Sign in to analyze<br/>your daily performance.
          </p>
          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-lg transition-colors hover:bg-[#7c6af0]/10"
            style={{
              fontSize: "12px",
              color: "#7c6af0",
              border: "1px solid #7c6af040",
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Sign In
          </Link>
        </div>
      ) : !analytics || !analytics.hasEnoughData ? (
        <>
          <div className="relative flex items-center justify-center mb-5">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a1a" strokeWidth="8" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke="#252525" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="12 8"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span style={{ fontSize: "28px", color: "#2e2e2e", letterSpacing: "-0.03em", lineHeight: 1, fontWeight: 700 }}>
                —
              </span>
              <span className="uppercase tracking-widest mt-1" style={{ fontSize: "9px", color: "#2e2e2e", letterSpacing: "0.12em" }}>
                No data
              </span>
            </div>
          </div>

          <p style={{ fontSize: "11px", color: "#333", textAlign: "center", lineHeight: 1.6 }}>
            Score appears after<br />your first active week
          </p>
        </>
      ) : (
        <>
          <div className="relative flex items-center justify-center mb-5">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a1a" strokeWidth="8" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke="#7c6af0" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="339.29"
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span style={{ fontSize: "32px", color: "#f0f0f0", letterSpacing: "-0.03em", lineHeight: 1, fontWeight: 800 }}>
                {analytics.score}
              </span>
              <span className="uppercase tracking-widest mt-1" style={{ fontSize: "10px", color: "#7c6af0", letterSpacing: "0.14em", fontWeight: 600 }}>
                {analytics.rating}
              </span>
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "#666", textAlign: "center", lineHeight: 1.6 }}>
            Based on your activity<br />over the last 7 days.
          </p>
        </>
      )}
    </div>
  );
}
