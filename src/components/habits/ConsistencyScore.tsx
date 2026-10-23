"use client";

import React, { useMemo, useState } from "react";
import { Book } from "@/store/bookSlice";
import { Habit } from "@/store/useStore";
import {
  calcOverallConsistency,
  HabitDisciplineStatus,
} from "@/utils/habits";

interface ConsistencyScoreProps {
  habits: Habit[];
  books: Book[];
}

const ConsistencyScore: React.FC<ConsistencyScoreProps> = ({
  habits,
  books,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [filter, setFilter] = useState<"all" | "disciplined" | "slacking">("all");

  const summary = useMemo(() => {
    return calcOverallConsistency(habits);
  }, [habits]);

  const bestStreak = useMemo(() => {
    if (!habits || habits.length === 0) return 0;
    return Math.max(0, ...habits.map((h) => h.longestStreak || 0));
  }, [habits]);

  const filteredHabitScores = useMemo(() => {
    if (filter === "disciplined") {
      return summary.habitScores.filter(
        (item) => item.consistency.status === "Disciplined"
      );
    }
    if (filter === "slacking") {
      return summary.habitScores.filter(
        (item) => item.consistency.status === "Slacking"
      );
    }
    return summary.habitScores;
  }, [summary.habitScores, filter]);

  // Determine progress bar gradient
  const progressGradient = useMemo(() => {
    if (summary.overallScore >= 80) {
      return "linear-gradient(90deg, #2e7d32, #4caf7d)";
    }
    if (summary.overallScore >= 60) {
      return "linear-gradient(90deg, #5a4fd4, #9d8ff5)";
    }
    if (summary.overallScore >= 40) {
      return "linear-gradient(90deg, #d97706, #f0a44f)";
    }
    return "linear-gradient(90deg, #dc2626, #f06a6a)";
  }, [summary.overallScore]);

  return (
    <>
      {/* Consistency Score Card */}
      <div
        className="rounded-2xl p-6 transition-all"
        style={{
          background: "linear-gradient(145deg, #121220 0%, #0e0e18 100%)",
          border: "1px solid #252535",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <p
            className="uppercase tracking-widest font-semibold"
            style={{
              fontSize: "9px",
              color: "#7c6af0",
              letterSpacing: "0.14em",
            }}
          >
            Consistency Score
          </p>

          {habits.length > 0 && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold"
              style={{
                fontSize: "10px",
                backgroundColor: summary.statusBg,
                color: summary.statusColor,
                border: `1px solid ${summary.statusBorder}`,
              }}
              title={`Overall discipline status: ${summary.status}`}
            >
              {summary.statusBadge}
            </span>
          )}
        </div>

        {habits.length === 0 ? (
          <>
            <div
              className="rounded mb-3"
              style={{
                width: "80px",
                height: "48px",
                backgroundColor: "#1a1a1a",
              }}
            />
            <p style={{ fontSize: "12px", color: "#444" }}>
              Add habits to start tracking consistency & discipline
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              <p
                className="font-black text-white"
                style={{
                  fontSize: "48px",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {summary.overallScore}%
              </p>
              <div className="text-[11px] text-[#777]">
                <span>
                  {summary.disciplinedCount} disciplined ·{" "}
                  <span
                    style={{
                      color:
                        summary.slackingCount > 0 ? "#f06a6a" : "#777",
                    }}
                  >
                    {summary.slackingCount} slacking
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 my-3">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 9l3-3 2.5 2.5L10 2.5"
                  stroke={summary.statusColor}
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 2.5H10V5"
                  stroke={summary.statusColor}
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <span style={{ fontSize: "12px", color: "#bbb" }}>
                <strong className="text-white">{summary.checkedToday}</strong>/
                {habits.length} habits done today ·{" "}
                <span className="text-[#888]">
                  Day {summary.maxDayCount} of tracking
                </span>
              </span>
            </div>

            {/* Overall Progress Track */}
            <div
              className="rounded-full overflow-hidden mb-4"
              style={{ height: "4px", background: "#1c1c28" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${summary.overallScore}%`,
                  background: progressGradient,
                }}
              />
            </div>

            {/* Metrics Grid */}
            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}
            >
              {[
                {
                  label: "BEST STREAK",
                  val: `${bestStreak}d`,
                },
                {
                  label: "TRACKING JOURNEY",
                  val: `Day ${summary.maxDayCount}`,
                },
                {
                  label: "DISCIPLINE RATE",
                  val: `${summary.disciplinedCount}/${habits.length}`,
                },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p
                    style={{
                      fontSize: "9px",
                      color: "#555",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    className="font-semibold text-white"
                    style={{ fontSize: "13px" }}
                  >
                    {val}
                  </p>
                </div>
              ))}
            </div>

            {/* Habit Breakdown Toggle Button */}
            <button
              onClick={() => setShowBreakdown((prev) => !prev)}
              className="mt-5 w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#1a1a2e]"
              style={{
                backgroundColor: "#12121f",
                border: "1px solid #232338",
                color: "#ccc",
                fontSize: "12px",
              }}
              title="Inspect consistency score and discipline status for each habit"
            >
              <span className="flex items-center gap-2">
                <span>📊 Habit Consistency Breakdown</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                  style={{
                    backgroundColor: "#1e1e32",
                    color: "#9d8ff5",
                  }}
                >
                  {habits.length}
                </span>
              </span>
              <span className="text-[#888] text-[11px] flex items-center gap-1.5">
                {showBreakdown ? "Hide" : "View"}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`transition-transform duration-200 ${
                    showBreakdown ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            {/* Expandable Breakdown Drawer */}
            {showBreakdown && (
              <div
                className="mt-3 pt-3 rounded-xl p-3 border animate-in fade-in slide-in-from-top-1 duration-200"
                style={{
                  backgroundColor: "#0d0d16",
                  borderColor: "#202030",
                }}
              >
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 mb-3">
                  <button
                    onClick={() => setFilter("all")}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
                    style={{
                      backgroundColor:
                        filter === "all" ? "#7c6af0" : "#161622",
                      color: filter === "all" ? "#fff" : "#777",
                    }}
                  >
                    All ({summary.totalHabits})
                  </button>
                  <button
                    onClick={() => setFilter("disciplined")}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1"
                    style={{
                      backgroundColor:
                        filter === "disciplined" ? "#4caf7d22" : "#161622",
                      color:
                        filter === "disciplined" ? "#4caf7d" : "#777",
                      border:
                        filter === "disciplined"
                          ? "1px solid #4caf7d55"
                          : "1px solid transparent",
                    }}
                  >
                    <span>🛡️ Disciplined</span>
                    <span>({summary.disciplinedCount})</span>
                  </button>
                  <button
                    onClick={() => setFilter("slacking")}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1"
                    style={{
                      backgroundColor:
                        filter === "slacking" ? "#f06a6a22" : "#161622",
                      color: filter === "slacking" ? "#f06a6a" : "#777",
                      border:
                        filter === "slacking"
                          ? "1px solid #f06a6a55"
                          : "1px solid transparent",
                    }}
                  >
                    <span>⚠️ Slacking</span>
                    <span>({summary.slackingCount})</span>
                  </button>
                </div>

                {/* Habits Breakdown List */}
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {filteredHabitScores.length === 0 ? (
                    <div className="py-4 text-center text-[#555] text-xs">
                      {filter === "slacking"
                        ? "🎉 Amazing! No habits are slacking right now."
                        : filter === "disciplined"
                        ? "No habits have reached 80%+ consistency yet. Keep going!"
                        : "No habits tracked."}
                    </div>
                  ) : (
                    filteredHabitScores.map(({ habit, consistency }) => (
                      <div
                        key={habit.id}
                        className="rounded-lg p-2.5 transition-colors"
                        style={{
                          backgroundColor: "#12121c",
                          border: "1px solid #1a1a28",
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span style={{ fontSize: "14px" }}>
                              {habit.icon || "🎯"}
                            </span>
                            <span
                              className="font-medium text-white text-xs truncate"
                              style={{ maxWidth: "140px" }}
                            >
                              {habit.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                              style={{
                                backgroundColor: consistency.statusBg,
                                color: consistency.statusColor,
                                border: `1px solid ${consistency.statusBorder}`,
                              }}
                            >
                              {consistency.statusBadge}
                            </span>
                            <span className="font-bold text-white text-xs">
                              {consistency.consistencyScore}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#666] mb-1.5">
                          <span>
                            {consistency.completedDays} of {consistency.dayCount}{" "}
                            {consistency.dayCount === 1 ? "day" : "days"} completed
                          </span>
                          <span>
                            Best: {habit.longestStreak}d
                          </span>
                        </div>

                        {/* Mini progress bar */}
                        <div
                          className="w-full rounded-full overflow-hidden"
                          style={{ height: "2.5px", backgroundColor: "#1e1e28" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${consistency.consistencyScore}%`,
                              backgroundColor: consistency.statusColor,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ConsistencyScore;