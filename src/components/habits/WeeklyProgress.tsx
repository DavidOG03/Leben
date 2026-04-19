import React, { useMemo } from "react";
import { Habit } from "@/store/useStore";
import { WeeklyProgressProps } from "../../utils/habits.types";
import { calcStreak, calcLongestStreak } from "../../utils/habits";

const daysLabels = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Maps a completion ratio (0–1) to an intensity colour.
 * 0 = skipped (no colour), >0 = increasingly bright purple.
 */
function dayColor(ratio: number, isToday: boolean): string {
  if (ratio <= 0) return "#1a1a1a"; // skipped — no colour
  if (isToday) return "linear-gradient(180deg,#9d8ff5,#7c6af0)";
  if (ratio <= 0.33) return "#1e2a4a";
  if (ratio <= 0.66) return "#3a3580";
  return "#5a4fd4";
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ habits }) => {
  const weeklyAnalytics = useMemo(() => {
    const today = new Date();
    const data = [];
    let totalCompletedThisWeek = 0;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayLabel = daysLabels[date.getDay()];
      const isToday = i === 0;

      const completedOnDay = habits.filter((h) =>
        h.completedDates?.includes(dateStr),
      ).length;

      // A day is "active" if at least one habit was tracked, OR books were updated.
      // We infer book updates from the habit data available; treat completedOnDay > 0 as active.
      const isSkipped = completedOnDay === 0;
      const ratio = habits.length > 0 ? completedOnDay / habits.length : 0;

      data.push({
        day: dayLabel,
        pct: ratio * 100,
        count: completedOnDay,
        date: dateStr,
        isToday,
        isSkipped,
        ratio,
      });

      totalCompletedThisWeek += completedOnDay;
    }

    // Compute current streak and longest streak across all habits
    // using the existing calcStreak/calcLongestStreak helpers.
    const allDates = habits.flatMap((h) => h.completedDates ?? []);

    // Streak resets when a day is skipped — calcStreak already handles this
    // by walking backwards from today/yesterday and stopping at the first miss.
    const currentStreak = habits.length > 0
      ? Math.min(...habits.map((h) => calcStreak(h.completedDates ?? [])))
      : 0;

    const longestStreak =
      habits.length > 0
        ? Math.max(0, ...habits.map((h) => calcLongestStreak(h.completedDates ?? [])))
        : 0;

    return {
      days: data,
      dailyAverage: totalCompletedThisWeek / 7,
      currentStreak,
      longestStreak,
      hasData: totalCompletedThisWeek > 0,
    };
  }, [habits]);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#111", border: "1px solid #1e1e1e" }}
    >
      <p className="font-semibold text-white mb-1" style={{ fontSize: "14px" }}>
        Weekly Progress
      </p>
      <p style={{ fontSize: "10px", color: "#333", marginBottom: "14px" }}>
        Coloured days = habits tracked · Grey = skipped
      </p>

      {!weeklyAnalytics.hasData ? (
        <>
          {/* Ghost bars */}
          <div className="flex items-end gap-2 mb-2" style={{ height: "70px" }}>
            {[0.3, 0.45, 0.4, 0.55, 0.35, 0.25, 0.2].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h * 100}%`,
                  backgroundColor: "#1a1a1a",
                  borderRadius: "3px 3px 2px 2px",
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mb-3">
            {daysLabels.map((l, i) => (
              <span key={i} style={{ fontSize: "9px", color: "#2e2e2e" }}>
                {l}
              </span>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#333" }}>
            No data this week — start checking off habits
          </p>
        </>
      ) : (
        <>
          {/* ── Bar chart ─────────────────────────────────── */}
          <div className="flex items-end gap-2 mb-2" style={{ height: "70px" }}>
            {weeklyAnalytics.days.map((d, i) => {
              const color = dayColor(d.ratio, d.isToday);
              const heightPct = d.isSkipped ? 6 : Math.max(d.pct, 10);

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                  style={{ height: "100%" }}
                >
                  {/* Bar */}
                  <div
                    className="w-full transition-all duration-500 absolute bottom-0"
                    style={{
                      height: `${heightPct}%`,
                      background: color,
                      borderRadius: "3px 3px 2px 2px",
                      opacity: d.isSkipped ? 0.4 : 1,
                    }}
                  />

                  {/* Hover tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none"
                    style={{
                      background: "#1e1e1e",
                      border: "1px solid #333",
                      borderRadius: "6px",
                      padding: "5px 8px",
                    }}
                  >
                    <span style={{ fontSize: "10px", color: d.isSkipped ? "#555" : "#7c6af0", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {d.isSkipped ? "Skipped" : `${d.count} habits`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Day labels ───────────────────────────────── */}
          <div className="flex justify-between mb-4">
            {weeklyAnalytics.days.map((d, i) => (
              <span
                key={i}
                style={{
                  fontSize: "9px",
                  color: d.isToday ? "#7c6af0" : d.isSkipped ? "#2a2a2a" : "#444",
                  fontWeight: d.isToday ? 700 : 400,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {d.day}
              </span>
            ))}
          </div>

          {/* ── Stats ───────────────────────────────────── */}
          <div className="space-y-2 pt-3" style={{ borderTop: "1px solid #1a1a1a" }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "12px", color: "#555" }}>Daily Average</span>
              <span style={{ fontSize: "12px", color: "#aaa" }}>
                {weeklyAnalytics.dailyAverage.toFixed(1)} habits
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ fontSize: "12px", color: "#555" }}>Current Streak</span>
              <span style={{ fontSize: "12px", color: weeklyAnalytics.currentStreak > 0 ? "#4caf7d" : "#e85555", fontWeight: 600 }}>
                {weeklyAnalytics.currentStreak} days
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ fontSize: "12px", color: "#555" }}>Longest Streak</span>
              <span style={{ fontSize: "12px", color: "#7c6af0", fontWeight: 600 }}>
                {weeklyAnalytics.longestStreak} days
              </span>
            </div>

            {weeklyAnalytics.currentStreak === 0 && weeklyAnalytics.longestStreak > 0 && (
              <p style={{ fontSize: "10px", color: "#333", marginTop: "6px" }}>
                Streak reset — best was {weeklyAnalytics.longestStreak} days. Start fresh today!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WeeklyProgress;
