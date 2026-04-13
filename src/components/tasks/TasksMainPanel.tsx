"use client";

import { useState } from "react";
import TaskList from "./TaskList";
import KanbanView from "./KanbanView";
import WeeklyProductivity from "./WeeklyProductivity";
import SmartSuggestion from "./SmartSuggestion";
import { useLebenStore } from "@/store/useStore";

export default function TasksMainPanel() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [task, setTask] = useState("");
  const [tag, setTag] = useState<"WORK" | "PERSONAL">("WORK");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  const addTask = useLebenStore((s) => s.addTask);

  const handleAddTask = () => {
    const trimmed = task.trim();
    if (!trimmed) return;
    addTask({
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      tag: tag,
      priority: priority,
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
      className="flex-1 overflow-y-auto p-4 pb-24 md:p-7"
      style={{ backgroundColor: "#0f0f0f" }}
    >
      {/* Page title row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-white font-bold"
            style={{
              fontSize: "32px",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            Daily Tasks
          </h1>
          <p style={{ fontSize: "13px", color: "#555", marginTop: "5px" }}>
            Focused execution for today&apos;s intentions.
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
                  <path
                    d="M1 3h10M1 6h10M1 9h10"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect
                    x="1"
                    y="1"
                    width="4"
                    height="10"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <rect
                    x="7"
                    y="1"
                    width="4"
                    height="10"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              )}
              {v === "list" ? "List" : "Kanban"}
            </button>
          ))}
        </div>
      </div>

      {/* Add task area */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ backgroundColor: "#141414", border: "1px solid #1e1e1e" }}
      >
        <div className="relative flex items-center mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 rounded-xl placeholder:text-gray-600 text-white outline-none"
            style={{
              backgroundColor: "transparent",
              fontSize: "15px",
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#1e1e1e] pt-4 mt-2">
          <div className="flex items-center gap-4">
            {/* Tag selector */}
            <div
              className="flex items-center gap-1.5 p-1 rounded-lg"
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1e1e1e",
              }}
            >
              {(["WORK", "PERSONAL"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className="px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all"
                  style={{
                    backgroundColor:
                      tag === t
                        ? t === "WORK"
                          ? "#1a1f2e"
                          : "#1e1a2a"
                        : "transparent",
                    color:
                      tag === t
                        ? t === "WORK"
                          ? "#4a7abf"
                          : "#8a5abf"
                        : "#444",
                    boxShadow: tag === t ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Priority selector
            <div
              className="flex items-center gap-1.5 p-1 rounded-lg"
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1e1e1e",
              }}
            >
              {(["high", "medium", "low"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className="px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all"
                  style={{
                    backgroundColor:
                      priority === p
                        ? p === "high"
                          ? "#2a1a1a"
                          : p === "medium"
                            ? "#2a221a"
                            : "#1a2a1a"
                        : "transparent",
                    color:
                      priority === p
                        ? p === "high"
                          ? "#e85555"
                          : p === "medium"
                            ? "#e8a855"
                            : "#55e855"
                        : "#444",
                  }}
                >
                  {p}
                </button>
              ))}
            </div> */}
          </div>

          <button
            onClick={handleAddTask}
            disabled={!task.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold"
            style={{
              fontSize: "12px",
              backgroundColor: task.trim() ? "#25256e" : "#1a1a1a",
              color: task.trim() ? "#9d8ff5" : "#444",
              border: task.trim() ? "1px solid #3a3a9e" : "1px solid #222",
              boxShadow: task.trim()
                ? "0 4px 12px rgba(90, 79, 212, 0.2)"
                : "none",
            }}
          >
            <span>Add Task</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v10M1 6h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Task visualization */}
      {view === "list" ? <TaskList /> : <KanbanView />}

      {/* Bottom row: chart + smart suggestion */}
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1" style={{ minWidth: 0 }}>
          <WeeklyProductivity />
        </div>
        <SmartSuggestion />
      </div>
    </main>
  );
}
