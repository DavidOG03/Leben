"use client";

import { useState } from "react";
import { Goal, deriveGoalStats, Milestone } from "@/utils/goals.types";
import { useLebenStore } from "@/store/useStore";

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const toggleMilestone = useLebenStore((s: any) => s.toggleMilestone);
  const removeGoal = useLebenStore((s: any) => s.removeGoal);
  const updateGoal = useLebenStore((s: any) => s.updateGoal);
  const { progress, status, statusColor } = deriveGoalStats(goal);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editDeadline, setEditDeadline] = useState(goal.deadline);

  const handleSave = () => {
    updateGoal(goal.id, { title: editTitle, deadline: editDeadline });
    setIsEditing(false);
  };

  return (
    <div
      className="rounded-2xl p-5 flex flex-col"
      style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}
    >
      {/* Icon + status + Actions */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: "48px",
            height: "48px",
            background: "linear-gradient(135deg,#1a1a2e,#141428)",
            border: "1px solid #252535",
          }}
        >
          <span style={{ fontSize: "22px" }}>{goal.icon}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="hover:opacity-80"
            style={{ color: "#888", fontSize: "12px", background: "transparent", border: "none" }}
            title="Edit Goal"
          >
            ✏️
          </button>
          <button
            onClick={() => removeGoal(goal.id)}
            className="hover:opacity-80"
            style={{ color: "#888", fontSize: "12px", background: "transparent", border: "none" }}
            title="Delete Goal"
          >
            🗑️
          </button>
          <span
            className="px-2 py-1 rounded text-xs font-semibold ml-1"
            style={{
              fontSize: "9px",
              letterSpacing: "0.12em",
              backgroundColor: "transparent",
              color: statusColor,
              border: `1px solid ${statusColor}44`,
            }}
          >
            {status}
          </span>
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2 mb-3">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-white outline-none"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", fontSize: "14px" }}
            placeholder="Goal Title"
            autoFocus
          />
          <input
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-white outline-none"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", fontSize: "11px" }}
            placeholder="Deadline"
          />
          <button
            onClick={handleSave}
            className="rounded-lg px-3 py-1.5 font-semibold text-white mt-1 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#7c6af0", fontSize: "12px" }}
          >
            Save Changes
          </button>
        </div>
      ) : (
        <>
          <h3
            className="font-bold text-white mb-1"
            style={{ fontSize: "20px", letterSpacing: "-0.02em" }}
          >
            {goal.title}
          </h3>
          <p style={{ fontSize: "11px", color: "#555", marginBottom: "14px" }}>
            Deadline: {goal.deadline}
          </p>
        </>
      )}

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span style={{ fontSize: "11px", color: "#555", fontWeight: 500 }}>
            Progress
          </span>
          <span style={{ fontSize: "11px", color: "#888", fontWeight: 500 }}>
            {progress}%
          </span>
        </div>
        <div
          className="rounded-full overflow-hidden"
          style={{ height: "3px", backgroundColor: "#1e1e1e" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg,#5a4fd4,#7c6af0)",
            }}
          />
        </div>
      </div>

      {/* Milestones -- interactive */}
      <p
        style={{
          fontSize: "9px",
          color: "#444",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        Milestones
      </p>
      <div className="space-y-2 flex-1">
        {goal.milestones.map((m: Milestone) => (
          <button
            key={m.id}
            onClick={() => toggleMilestone(goal.id, m.id)}
            className="flex items-center gap-2 w-full text-left"
          >
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200"
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: m.done
                  ? "rgba(124,106,240,0.2)"
                  : "transparent",
                border: m.done ? "1px solid #7c6af0" : "1px solid #333",
              }}
            >
              {m.done && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 4l1.8 1.8L6.5 2"
                    stroke="#7c6af0"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span style={{ fontSize: "12px", color: m.done ? "#888" : "#555" }}>
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-5 pt-4"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <span style={{ fontSize: "11px", color: "#555" }}>
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            style={{
              display: "inline",
              marginRight: "4px",
              verticalAlign: "middle",
            }}
          >
            <path
              d="M1 5.5h9M7 2l3 3.5-3 3.5"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {goal.tasksLinked} tasks linked
        </span>
        <button
          className="flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors"
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "#1a1a1a",
            color: "#888",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5h6M6 2l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
