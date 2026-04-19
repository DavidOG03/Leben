"use client";

import { useLebenStore } from "@/store/useStore";
import { useMemo } from "react";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function WeeklyProductivity() {
  const tasks = useLebenStore((s) => s.tasks);

  const weeklyData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, idx) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - idx));
      const dateStr = date.toISOString().split("T")[0];

      const scheduled = tasks.filter(
        (t) => t.date === dateStr || t.completedAt === dateStr,
      );
      const completed = scheduled.filter(
        (t) => t.completed && t.completedAt === dateStr,
      ).length;
      const total = scheduled.length;

      return {
        day: DAY_LABELS[date.getDay()],
        completed,
        total,
        date: dateStr,
        isToday: idx === 6,
        isFuture: date > today,
      };
    });
  }, [tasks]);

  const maxCompleted = Math.max(...weeklyData.map((d) => d.completed), 1);
  const totalWeek = weeklyData.reduce((s, d) => s + d.completed, 0);
  const bestDay = weeklyData.reduce(
    (best, d) => (d.completed > best.completed ? d : best),
    weeklyData[0],
  );

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "#131313", border: "1px solid #1e1e1e" }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-white font-semibold" style={{ fontSize: "13px" }}>
          Weekly Productivity
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 10L4.5 6l3 3L12 3"
            stroke="#7c6af0"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p style={{ fontSize: "10px", color: "#333", marginBottom: "16px" }}>
        Tasks completed per day — last 7 days
      </p>

      {/* ── Bar chart ───────────────────────────────────────── */}
      <div
        className="flex items-end justify-between gap-1.5"
        style={{ height: "100px" }}
      >
        {weeklyData.map((d) => {
          // Minimum 4px stub so the chart rail is visible even for 0-count days
          const heightPct =
            d.completed > 0 ? Math.max((d.completed / maxCompleted) * 100, 12) : 4;

          // Colour intensity: more tasks = brighter purple
          const ratio = maxCompleted > 0 ? d.completed / maxCompleted : 0;
          let barColor: string;
          if (d.isToday) {
            barColor = "linear-gradient(180deg, #9d8ff5, #7c6af0)";
          } else if (d.completed === 0) {
            barColor = "#1a1a1a";
          } else if (ratio <= 0.25) {
            barColor = "#1e2a4a";
          } else if (ratio <= 0.5) {
            barColor = "#2e4080";
          } else if (ratio <= 0.75) {
            barColor = "#5a4fd4";
          } else {
            barColor = "#7c6af0";
          }

          return (
            <div
              key={d.date}
              className="flex flex-col items-center gap-1 flex-1 group relative"
              style={{ height: "100%" }}
            >
              {/* Count label — floats above bar, shown on hover */}
              {d.completed > 0 && (
                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute"
                  style={{
                    fontSize: "9px",
                    color: "#7c6af0",
                    fontWeight: 700,
                    bottom: `calc(${heightPct}% + 4px)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {d.completed}
                </span>
              )}

              {/* Always-visible count above bar for bars with data */}
              {d.completed > 0 && (
                <div
                  className="absolute"
                  style={{
                    bottom: `calc(${heightPct}% + 4px)`,
                    fontSize: "9px",
                    color: d.isToday ? "#9d8ff5" : "#3a3a3a",
                    fontWeight: 700,
                    pointerEvents: "none",
                  }}
                >
                  {d.completed}
                </div>
              )}

              {/* Bar */}
              <div
                className="w-full transition-all duration-700 ease-out absolute bottom-0"
                style={{
                  height: `${heightPct}%`,
                  background: barColor,
                  borderRadius: "3px 3px 2px 2px",
                }}
              />

              {/* Hover tooltip */}
              <div
                className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none"
                style={{
                  background: "#1e1e1e",
                  border: "1px solid #333",
                  borderRadius: "6px",
                  padding: "5px 8px",
                  minWidth: "60px",
                }}
              >
                <span style={{ fontSize: "10px", color: "#7c6af0", fontWeight: 700 }}>
                  {d.completed}/{d.total}
                </span>
                <span style={{ fontSize: "9px", color: "#555" }}>tasks done</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Day labels ──────────────────────────────────────── */}
      <div className="flex justify-between mt-2.5 gap-1.5">
        {weeklyData.map((d) => (
          <div key={d.day + d.date} className="flex-1 flex justify-center">
            <span
              style={{
                fontSize: "9px",
                color: d.isToday ? "#7c6af0" : "#333",
                letterSpacing: "0.06em",
                fontWeight: d.isToday ? 700 : 400,
              }}
            >
              {d.day}
            </span>
          </div>
        ))}
      </div>

      {/* ── Summary stats ───────────────────────────────────── */}
      <div
        className="flex items-center justify-between mt-4 pt-3"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <div className="text-center">
          <p style={{ fontSize: "16px", color: "#f0f0f0", fontWeight: 700 }}>
            {totalWeek}
          </p>
          <p style={{ fontSize: "9px", color: "#444", letterSpacing: "0.05em" }}>
            TOTAL
          </p>
        </div>
        <div className="text-center">
          <p style={{ fontSize: "16px", color: "#7c6af0", fontWeight: 700 }}>
            {(totalWeek / 7).toFixed(1)}
          </p>
          <p style={{ fontSize: "9px", color: "#444", letterSpacing: "0.05em" }}>
            /DAY AVG
          </p>
        </div>
        <div className="text-center">
          <p style={{ fontSize: "16px", color: "#f0f0f0", fontWeight: 700 }}>
            {bestDay.completed}
          </p>
          <p style={{ fontSize: "9px", color: "#444", letterSpacing: "0.05em" }}>
            BEST DAY
          </p>
        </div>
        <div className="text-center">
          <p
            style={{
              fontSize: "11px",
              color: weeklyData.filter((d) => d.completed > 0).length >= 5 ? "#4caf7d" : "#e8a855",
              fontWeight: 700,
            }}
          >
            {weeklyData.filter((d) => d.completed > 0).length}/7
          </p>
          <p style={{ fontSize: "9px", color: "#444", letterSpacing: "0.05em" }}>
            ACTIVE DAYS
          </p>
        </div>
      </div>
    </div>
  );
}
