"use client";

import { useState } from "react";
import type { Task } from "./types";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Finalize Q4 Strategy Presentation",
    tag: "WORK",
    priority: "high",
    date: "Oct 24",
    subtasks: { done: 4, total: 8 },
    completed: false,
  },
  {
    id: "2",
    title: "Weekly Team Sync & Roadmap Update",
    tag: "WORK",
    priority: "medium",
    date: "Today, 2:00 PM",
    completed: false,
  },
  {
    id: "3",
    title: "Grocery Shopping: Health Food Run",
    tag: "PERSONAL",
    priority: "low",
    date: "Oct 23",
    completed: true,
    completedDate: "Completed Oct 23",
  },
  {
    id: "4",
    title: "Review Portfolio Metrics with Design Lead",
    tag: "WORK",
    priority: "high",
    date: "Tomorrow",
    completed: false,
  },
];

const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <rect x="0.75" y="1.5" width="9.5" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
    <path d="M0.75 4.5h9.5" stroke="currentColor" strokeWidth="1.1" />
    <path d="M3.5 0.75v1.5M7.5 0.75v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const SubtaskIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M2 2h7M2 5.5h5M2 9h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const CheckmarkIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M1.5 4.5l2 2L8 1.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CompletedCheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M1.5 5.5l2.5 2.5L9.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function PriorityDot({ priority }: { priority: Task["priority"] }) {
  const color =
    priority === "high" ? "#e85555" : priority === "medium" ? "#e8a035" : "#4a9edd";
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{ width: "7px", height: "7px", backgroundColor: color }}
    />
  );
}

function TagBadge({ tag }: { tag: Task["tag"] }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-medium tracking-wide"
      style={{
        fontSize: "9px",
        letterSpacing: "0.08em",
        backgroundColor:
          tag === "WORK" ? "rgba(124,106,240,0.15)" : "rgba(100,180,100,0.12)",
        color: tag === "WORK" ? "#9d8ff5" : "#74b874",
        border: `1px solid ${tag === "WORK" ? "rgba(124,106,240,0.2)" : "rgba(100,180,100,0.2)"}`,
      }}
    >
      {tag}
    </span>
  );
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid #1e1e1e", backgroundColor: "#131313" }}
    >
      {tasks.map((task, i) => (
        <div
          key={task.id}
          className="flex items-start gap-3.5 px-5 py-4 transition-colors hover:bg-white/[0.02] cursor-pointer"
          style={{
            borderBottom: i < tasks.length - 1 ? "1px solid #1a1a1a" : "none",
            opacity: task.completed ? 0.55 : 1,
          }}
          onClick={() => toggleTask(task.id)}
        >
          {/* Checkbox */}
          <div
            className="flex items-center justify-center flex-shrink-0 rounded mt-0.5"
            style={{
              width: "18px",
              height: "18px",
              backgroundColor: task.completed ? "#4a42a8" : "transparent",
              border: task.completed ? "1.5px solid #7c6af0" : "1.5px solid #2e2e2e",
              borderRadius: "5px",
              transition: "all 0.15s",
            }}
          >
            {task.completed && <CheckmarkIcon />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-medium"
                style={{
                  fontSize: "13px",
                  color: task.completed ? "#555" : "#e0e0e0",
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.title}
              </span>
              <PriorityDot priority={task.priority} />
              <TagBadge tag={task.tag} />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-1.5">
              {task.completed && task.completedDate ? (
                <span
                  className="flex items-center gap-1"
                  style={{ fontSize: "11px", color: "#444" }}
                >
                  <CompletedCheckIcon />
                  {task.completedDate}
                </span>
              ) : (
                <>
                  <span
                    className="flex items-center gap-1"
                    style={{ fontSize: "11px", color: "#444" }}
                  >
                    <CalendarIcon />
                    {task.date}
                  </span>
                  {task.subtasks && (
                    <span
                      className="flex items-center gap-1"
                      style={{ fontSize: "11px", color: "#444" }}
                    >
                      <SubtaskIcon />
                      Sub-tasks ({task.subtasks.done}/{task.subtasks.total})
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
