"use client";

import { deriveGoalStats, type Goal } from "@/utils/goals.types";
import EmptyState from "./EmptyState";

interface GoalBreakdownProps {
  goals: Goal[];
  hasData: boolean;
}

export default function GoalBreakdown({ goals, hasData }: GoalBreakdownProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      <h3
        className="font-semibold text-white mb-4"
        style={{ fontSize: "14px" }}
      >
        Goal Progress
      </h3>

      {hasData ? (
        <div className="space-y-3">
          {goals.map((g) => (
            <div key={g.name}>
              <div className="flex justify-between mb-1.5">
                <span style={{ fontSize: "12px", color: "#ccc" }}>
                  {g.name}
                </span>
                <span style={{ fontSize: "11px", color: "#666" }}>
                  {deriveGoalStats(g).progress}%
                </span>
              </div>
              <div
                className="rounded-full overflow-hidden"
                style={{ height: "3px", backgroundColor: "#1a1a1a" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${deriveGoalStats(g).progress}%`,
                    backgroundColor: deriveGoalStats(g).statusColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🎯"
          message="No goals set"
          hint="Create goals and update your progress to track them here"
        />
      )}
    </div>
  );
}
