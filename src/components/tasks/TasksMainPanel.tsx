"use client";

import { useState } from "react";
import TaskList from "./TaskList";
import WeeklyProductivity from "./WeeklyProductivity";
import SmartSuggestion from "./SmartSuggestion";
import { useLebenStore } from "@/store/useStore";

export default function TasksMainPanel() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [task, setTask] = useState("");
  const addTask = useLebenStore((s) => s.addTask);

  const handleAddTask = () => {
    const trimmed = task.trim();
    if (!trimmed) return;
    addTask({
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      tag: "PERSONAL",
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    });
    setTask("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTask();
  };

  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: "#0f0f0f", padding: "28px 28px 28px 28px" }}
    >
      {/* Page title row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-white font-bold"
            style={{ fontSize: "32px", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Daily Tasks
          </h1>
          <p style={{ fontSize: "13px", color: "#555", marginTop: "5px" }}>
            Add your first task to get started.
          </p>
        </div>

        {/* List / Kanban toggle */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{ border: "1px solid #202020", backgroundColor: "#131313" }}
        >
          {(["list", "kanban"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="flex items-center gap-1.5 px-3 py-1.5 transition-colors capitalize"
              style={{
                fontSize: "12px",
                backgroundColor: view === v ? "#1e1e1e" : "transparent",
                color: view === v ? "#f0f0f0" : "#555",
                borderRight: v === "list" ? "1px solid #202020" : "none",
              }}
            >
              {v === "list" ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 3h10M1 6h10M1 9h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="1" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  <rect x="7" y="1" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              )}
              {v === "list" ? "List" : "Kanban"}
            </button>
          ))}
        </div>
      </div>

      {/* Add task input */}
      <div className="relative flex items-center gap-4 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 rounded-xl placeholder:text-gray-500 text-white outline-none"
          style={{
            backgroundColor: "#141414",
            border: "1px solid #1e1e1e",
            fontSize: "13px",
            paddingRight: "48px",
          }}
        />
        <button
          onClick={handleAddTask}
          className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 absolute right-2 top-1/2 -translate-y-1/2"
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: "#1e1e1e",
            border: "1px solid #2a2a2a",
            color: "#888",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Task list */}
      <TaskList />

      {/* Bottom row: chart + smart suggestion */}
      <div className="flex gap-4 mt-4">
        <div className="flex-1" style={{ minWidth: 0 }}>
          <WeeklyProductivity />
        </div>
        <SmartSuggestion />
      </div>
    </main>
  );
}