"use client";

import type { Habit } from "@/store/useStore";
import EmptyState from "./EmptyState";

interface HabitBreakdownProps {
  habits: Habit[];
  hasData: boolean;
}

export default function HabitBreakdown({
  habits,
  hasData,
}: HabitBreakdownProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      <h3
        className="font-semibold text-white mb-4"
        style={{ fontSize: "14px" }}
      >
        Top Habits
      </h3>

      {hasData ? (
        <div className="space-y-4">
          {[...habits]
            .sort((a, b) => (b.streak || 0) - (a.streak || 0))
            .slice(0, 4)
            .map((h) => (
              <div key={h.id || h.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "12px", color: "#eee", fontWeight: 500 }}>
                      {h.label}
                    </span>
                    {h.streak > 0 && (
                      <span 
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter"
                        style={{ 
                          backgroundColor: "rgba(124, 106, 240, 0.15)", 
                          color: "#9d8ff5",
                          border: "1px solid rgba(124, 106, 240, 0.2)"
                        }}
                      >
                        {h.streak}d streak
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "11px", color: "#666" }}>
                    {h.pct}%
                  </span>
                </div>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ height: "4px", backgroundColor: "#1a1a1a" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${h.pct}%`, 
                      backgroundColor: h.color || "#7c6af0",
                      boxShadow: `0 0 8px ${h.color}44` 
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <EmptyState
          icon="🔁"
          message="No habits tracked"
          hint="Add habits and check them off daily to see your consistency here"
        />
      )}
    </div>
  );
}
