"use client";

import { useLebenStore } from "@/store/useStore";
import { useMemo } from "react";

const daysLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function WeeklyProductivity() {
  const tasks = useLebenStore((s) => s.tasks);

  const weeklyData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    // Last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayLabel = daysLabels[date.getDay()];
      
      // Tasks scheduled or completed for this day
      const tasksOnDay = tasks.filter(t => t.date === dateStr || t.completedAt === dateStr);
      const completedOnDay = tasksOnDay.filter(t => t.completed && t.completedAt === dateStr).length;
      
      // Completion rate or simple count? 
      // Let's go with count of completed tasks for the bar height, 
      // but normalized to some max.
      data.push({
        day: dayLabel,
        count: completedOnDay,
        total: tasksOnDay.length,
        date: dateStr
      });
    }
    return data;
  }, [tasks]);

  const maxCompleted = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "#131313", border: "1px solid #1e1e1e" }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-white font-semibold" style={{ fontSize: "13px" }}>
          Weekly Productivity
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 10L4.5 6l3 3L12 3" stroke="#7c6af0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex items-end justify-between gap-1.5" style={{ height: "80px" }}>
        {weeklyData.map((d, i) => {
          const height = d.count > 0 ? (d.count / maxCompleted) * 100 : 5;
          const isToday = i === 6;
          
          return (
            <div key={d.date} className="flex flex-col items-center gap-2 flex-1 group relative">
              <div
                className="w-full rounded-sm transition-all duration-500"
                style={{ 
                  height: `${height}%`, 
                  backgroundColor: isToday ? "#7c6af0" : d.count > 0 ? "#252525" : "#1a1a1a", 
                  borderRadius: "3px 3px 2px 2px", 
                  minHeight: "4px" 
                }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#1e1e1e] border border-[#333] px-2 py-1 rounded text-[10px] text-white whitespace-nowrap z-10">
                {d.count} completed
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-2.5 gap-1.5">
        {weeklyData.map((d) => (
          <div key={d.day} className="flex-1 flex justify-center">
            <span style={{ fontSize: "9px", color: "#444", letterSpacing: "0.06em" }}>{d.day}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "11px", color: weeklyData.some(d => d.count > 0) ? "#555" : "#2e2e2e", textAlign: "center", marginTop: "12px" }}>
          {weeklyData.some(d => d.count > 0) 
            ? "Your productivity trend for the last 7 days" 
            : "Complete tasks to see your weekly trend"}
      </p>
    </div>
  );
}
