import React, { useMemo } from "react";
import { Habit } from "@/store/useStore";
import { WeeklyProgressProps } from "../../utils/habits.types";

const daysLabels = ["S", "M", "T", "W", "T", "F", "S"];

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  habits,
}: WeeklyProgressProps) => {
  const weeklyAnalytics = useMemo(() => {
    const today = new Date();
    const data = [];
    let totalCompletedThisWeek = 0;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayLabel = daysLabels[date.getDay()];

      const completedOnDay = habits.filter((h) =>
        h.completedDates?.includes(dateStr),
      ).length;
      const rate =
        habits.length > 0 ? (completedOnDay / habits.length) * 100 : 0;

      data.push({
        day: dayLabel,
        pct: rate,
        count: completedOnDay,
        date: dateStr,
      });
      totalCompletedThisWeek += completedOnDay;
    }

    return {
      days: data,
      dailyAverage: totalCompletedThisWeek / 7,
      bestStreak:
        habits.length > 0
          ? Math.max(0, ...habits.map((h) => h.longestStreak ?? 0))
          : 0,
      hasData: totalCompletedThisWeek > 0,
    };
  }, [habits]);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#111", border: "1px solid #1e1e1e" }}
    >
      <p className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>
        Weekly Progress
      </p>

      {!weeklyAnalytics.hasData ? (
        <>
          <div className="flex items-end gap-2 mb-3" style={{ height: "70px" }}>
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
          <p style={{ fontSize: "12px", color: "#333" }}>
            No data this week — start checking off habits
          </p>
        </>
      ) : (
        <>
          <div className="flex items-end gap-2 mb-4" style={{ height: "70px" }}>
            {weeklyAnalytics.days.map((d, i) => {
              const isToday = i === 6;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div
                    className="w-full transition-all duration-500"
                    style={{
                      height: `${Math.max(d.pct, 5)}%`,
                      background: isToday
                        ? "linear-gradient(180deg,#9d8ff5,#7c6af0)"
                        : d.pct > 0
                          ? "#252525"
                          : "#1a1a1a",
                      borderRadius: "3px 3px 2px 2px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "9px",
                      color: isToday ? "#7c6af0" : "#444",
                    }}
                  >
                    {d.day}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#1e1e1e] border border-[#333] px-2 py-1 rounded text-[10px] text-white whitespace-nowrap z-10">
                    {d.count} habits
                  </div>
                </div>
              );
            })}
          </div>
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "12px", color: "#555" }}>
                Daily Average
              </span>
              <span style={{ fontSize: "12px", color: "#aaa" }}>
                {weeklyAnalytics.dailyAverage.toFixed(1)} habits
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "12px", color: "#555" }}>
                Best Streak
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#7c6af0",
                  fontWeight: 600,
                }}
              >
                {weeklyAnalytics.bestStreak} days
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeeklyProgress;
