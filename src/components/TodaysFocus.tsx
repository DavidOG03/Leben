"use client";

import { useLebenStore } from "@/store/useStore";
import Link from "next/link";
import { CheckIcon, PlusIcon, TrashIcon } from "../constants/Icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TodaysFocus() {
  const tasks = useLebenStore((s) => s.tasks);
  const toggleTask = useLebenStore((s) => s.toggleTask);
  const deleteTask = useLebenStore((s) => s.deleteTask);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div
      className="rounded-2xl p-6 flex flex-col"
      style={{
        background: "linear-gradient(145deg, #121212 0%, #0e0e0e 100%)",
        border: "1px solid #1e1e1e",
        minHeight: "200px",
      }}
      role="button"
      aria-roledescription="go to task"
      onClick={() => router.push("/tasks")}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-white" style={{ fontSize: "15px" }}>
          Today&apos;s Focus
        </h3>
      </div>

      {tasks.length === 0 ? (
        <>
          {/* Empty state */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 gap-3">
            <PlusIcon />
            <p
              style={{
                fontSize: "12px",
                color: "#333",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              No tasks yet
            </p>
            <Link
              href="/tasks"
              className="px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{
                fontSize: "11px",
                color: "#666",
                border: "1px solid #222",
                textDecoration: "none",
              }}
            >
              Add your first task
            </Link>
          </div>

          {/* Empty progress bar */}
          <div
            className="rounded-full overflow-hidden mt-4"
            style={{ height: "3px", backgroundColor: "#1a1a1a" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "0%",
                background: "linear-gradient(90deg, #5a4fd4, #9d8ff5)",
              }}
            />
          </div>
        </>
      ) : (
        tasks.map((task, i) => (
          <div
            key={task.id}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] overflow-y-auto"
            style={{
              borderBottom: i < tasks.length - 1 ? "1px solid #181818" : "none",
            }}
            onMouseEnter={() => setHoveredId(task.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0 flex items-center justify-center transition-all"
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "5px",
                border: task.completed
                  ? "1px solid #3a7a4a"
                  : "1px solid #2a2a2a",
                backgroundColor: task.completed ? "#1e3d26" : "#1a1a1a",
                color: task.completed ? "#4caf70" : "transparent",
              }}
            >
              {task.completed && <CheckIcon />}
            </button>

            {/* Title */}
            <span
              className="flex-1 transition-all"
              style={{
                fontSize: "13px",
                color: task.completed ? "#444" : "#ccc",
                textDecoration: task.completed ? "line-through" : "none",
                lineHeight: 1.4,
              }}
            >
              {task.title}
            </span>

            <div className="flex flex-col gap-2 items-end">
              {/* Tag badge */}
              <span
                className="rounded px-2 py-0.5"
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  backgroundColor: task.tag === "WORK" ? "#1a1f2e" : "#1e1a2a",
                  color: task.tag === "WORK" ? "#4a7abf" : "#8a5abf",
                  border: `1px solid ${task.tag === "WORK" ? "#1e2a42" : "#2a1e42"}`,
                }}
              >
                {task.tag}
              </span>

              {/* Date */}
              <span
                style={{
                  fontSize: "11px",
                  color: "#333",
                  whiteSpace: "nowrap",
                }}
              >
                {task.date}
              </span>
            </div>

            {/* Delete button */}
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "26px",
                height: "26px",
                borderRadius: "6px",
                border: "1px solid transparent",
                backgroundColor: "transparent",
                color: "#444",
                cursor: "pointer",
                flexShrink: 0,
                opacity: hoveredId === task.id ? 1 : 0,
                transition:
                  "opacity 0.15s, color 0.15s, background-color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                btn.style.color = "#e85555";
                btn.style.backgroundColor = "rgba(232,85,85,0.1)";
                btn.style.borderColor = "rgba(232,85,85,0.2)";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.color = "#444";
                btn.style.backgroundColor = "transparent";
                btn.style.borderColor = "transparent";
              }}
              aria-label="Delete task"
            >
              <TrashIcon />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
