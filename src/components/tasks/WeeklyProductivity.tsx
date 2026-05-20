"use client";

import { useLebenStore } from "@/store/useStore";
import { useMemo } from "react";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function WeeklyProductivity() {
  const tasks = useLebenStore((s) => s.tasks);
  const historyStore = useLebenStore((s) => s.productivityHistory);

  const weeklyData = useMemo(() => {
    const today = new Date();
    const history = historyStore || {};
    return Array.from({ length: 7 }, (_, idx) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - idx));
      const dateStr = date.toISOString().split("T")[0];

      // Current tasks for this date
      const scheduled = tasks.filter(
        (t) => t.date === dateStr || t.completedAt === dateStr,
      );
      const currentCompleted = scheduled.filter(
        (t) => t.completed && t.completedAt === dateStr,
      ).length;
      const currentTotal = scheduled.length;

      // History data
      const hist = history[dateStr] || { completed: 0, total: 0 };

      // Use the maximum of current or history to handle migration and deletions
      const completed = Math.max(currentCompleted, hist.completed);
      const total = Math.max(currentTotal, hist.total);

      return {
        day: DAY_LABELS[date.getDay()],
        completed,
        total,
        date: dateStr,
        isToday: idx === 6,
        isFuture: date > today,
      };
    });
  }, [tasks, historyStore]);

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
          const isSkipped = d.completed === 0;
          const ratio = maxCompleted > 0 ? d.completed / maxCompleted : 0;
          
          // Height logic: small stub for empty days, otherwise proportional
          const heightPct = isSkipped ? 6 : Math.max((d.completed / maxCompleted) * 100, 12);

          // Colour intensity logic matched with WeeklyProgress
          let barColor: string;
          if (isSkipped) {
            barColor = "#1a1a1a";
          } else if (d.isToday) {
            barColor = "linear-gradient(180deg, #9d8ff5, #7c6af0)";
          } else if (ratio <= 0.33) {
            barColor = "#1e2a4a";
          } else if (ratio <= 0.66) {
            barColor = "#3a3580";
          } else {
            barColor = "#5a4fd4";
          }

          return (
            <div
              key={d.date}
              className="flex flex-col items-center gap-1 flex-1 group relative cursor-pointer"
              style={{ height: "100%" }}
            >
              {/* Bar */}
              <div
                className="w-full transition-all duration-500 ease-out absolute bottom-0 group-hover:scale-x-110"
                style={{
                  height: `${heightPct}%`,
                  background: barColor,
                  borderRadius: "3px 3px 2px 2px",
                  boxShadow: d.isToday && !isSkipped ? "0 0 10px rgba(124, 106, 240, 0.3)" : "none",
                  opacity: isSkipped ? 0.4 : 1,
                }}
              />

              {/* Hover tooltip - The "Pop up" */}
              <div
                className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 flex flex-col items-center z-20 pointer-events-none"
                style={{
                  background: "#1e1e1e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  minWidth: "70px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                {!isSkipped ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: "11px", color: "#fff", fontWeight: 700 }}>
                        {d.completed}
                      </span>
                      <span style={{ fontSize: "9px", color: "#7c6af0", fontWeight: 500 }}>
                        / {d.total}
                      </span>
                    </div>
                    <span style={{ fontSize: "8px", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "1px" }}>
                      tasks done
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: "9px", color: "#555", fontWeight: 700, whiteSpace: "nowrap" }}>
                    No tasks done
                  </span>
                )}
                {/* Arrow */}
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid #1e1e1e",
                  }}
                />
              </div>

              {/* Subtle count indicator (always visible but faint, unless today) */}
              {!isSkipped && !d.isToday && (
                <div
                  className="absolute transition-opacity duration-300 group-hover:opacity-0"
                  style={{
                    bottom: `calc(${heightPct}% + 4px)`,
                    fontSize: "9px",
                    color: "#333",
                    fontWeight: 600,
                    pointerEvents: "none",
                  }}
                >
                  {d.completed}
                </div>
              )}
              
              {/* Bright count for Today */}
              {!isSkipped && d.isToday && (
                <div
                  className="absolute transition-opacity duration-300 group-hover:opacity-0"
                  style={{
                    bottom: `calc(${heightPct}% + 4px)`,
                    fontSize: "9px",
                    color: "#9d8ff5",
                    fontWeight: 700,
                    pointerEvents: "none",
                  }}
                >
                  {d.completed}
                </div>
              )}
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
