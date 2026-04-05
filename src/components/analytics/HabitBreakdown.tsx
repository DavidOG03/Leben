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
        <div className="space-y-3">
          {habits.map((h) => (
            <div key={h.name}>
              <div className="flex justify-between mb-1.5">
                <span style={{ fontSize: "12px", color: "#ccc" }}>
                  {h.label}
                </span>
                <span style={{ fontSize: "11px", color: "#666" }}>
                  {h.pct}%
                </span>
              </div>
              <div
                className="rounded-full overflow-hidden"
                style={{ height: "3px", backgroundColor: "#1a1a1a" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${h.pct}%`, backgroundColor: h.color }}
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
